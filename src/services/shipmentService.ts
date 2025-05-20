import api from './api';
import type { Location, ProductType, ShipmentFormValues, ShipmentResponse } from '../validations/shipmentSchema';
import type { 
  ShipmentStatus, 
  ShipmentStatusResponse, 
  StatusHistoryItem
} from '../validations/trackingSchema';

interface ErrorResponse {
  success: false;
  error: string;
}

interface SuccessResponse {
  success: true;
  data: {
    id: number;
    tracking_code: string;
  };
}

class ShipmentService {
  async getLocations(): Promise<Location[]> {
    return [
      { id: 1, name: 'Bogotá', department: 'Cundinamarca' },
      { id: 2, name: 'Medellín', department: 'Antioquia' },
      { id: 3, name: 'Cali', department: 'Valle del Cauca' },
      { id: 4, name: 'Barranquilla', department: 'Atlántico' },
      { id: 5, name: 'Cartagena', department: 'Bolívar' },
      { id: 6, name: 'Cúcuta', department: 'Norte de Santander' },
      { id: 7, name: 'Bucaramanga', department: 'Santander' },
      { id: 8, name: 'Pereira', department: 'Risaralda' },
      { id: 9, name: 'Santa Marta', department: 'Magdalena' },
      { id: 10, name: 'Ibagué', department: 'Tolima' },
      { id: 11, name: 'Pasto', department: 'Nariño' },
      { id: 12, name: 'Manizales', department: 'Caldas' },
      { id: 13, name: 'Neiva', department: 'Huila' },
      { id: 14, name: 'Villavicencio', department: 'Meta' },
      { id: 15, name: 'Armenia', department: 'Quindío' },
      { id: 16, name: 'Valledupar', department: 'Cesar' },
      { id: 17, name: 'Montería', department: 'Córdoba' },
      { id: 18, name: 'Popayán', department: 'Cauca' },
      { id: 19, name: 'Sincelejo', department: 'Sucre' },
      { id: 20, name: 'Tunja', department: 'Boyacá' }
    ];
  }

  async getProductTypes(): Promise<ProductType[]> {
    // Datos mockeados para pruebas y desarrollo
    return [
      {
        id: 1,
        name: 'sobre',
        min_weight_grams: 0,
        max_weight_grams: 1000,
        description: 'Documentos y sobres pequeños de 0 a 1000 gramos'
      },
      {
        id: 2,
        name: 'paquete',
        min_weight_grams: 1001,
        max_weight_grams: 20000,
        description: 'Paquetes estándar de 1001 a 20000 gramos'
      },
      {
        id: 3,
        name: 'paquete pesado',
        min_weight_grams: 20001,
        max_weight_grams: null,
        description: 'Paquetes grandes o pesados de 20001 gramos en adelante'
      }
    ];
  }

  async createShipment(data: ShipmentFormValues): Promise<SuccessResponse | ErrorResponse> {
    try {
      const response = await api.post<ShipmentResponse>('/api/v1/shipments', data);
      
      return {
        success: true,
        data: {
          id: response.data.id,
          tracking_code: response.data.tracking_code
        }
      };
    } catch (error) {
      // Manejo detallado de errores
      if (error && typeof error === 'object' && 'response' in error) {
        const response = error.response as {
          data?: { message?: string, error?: string };
          status?: number;
        };
        
        const errorMessage = response.data?.message || 
                            response.data?.error || 
                            'Error al crear el envío';
        
        return {
          success: false,
          error: errorMessage
        };
      }
      
      return {
        success: false,
        error: 'Error de conexión. Intente nuevamente.'
      };
    }
  }

  async getShipmentStatusByTrackingCode(trackingCode: string): Promise<ShipmentStatusResponse> {
    try {
      // Realizamos una sola llamada para obtener el historial (que incluye toda la info necesaria)
      const response = await api.get(`/api/v1/shipments/tracking/${trackingCode}/history`);
      
      console.log('History Response:', response.data);
      
      // Verificamos si la respuesta fue exitosa
      if (response.data.status === 'success' && response.data.data) {
        console.log('Data:', response.data.data);
        // Procesamos la información del historial
        const { shipment, status_history } = response.data.data;
        
        // Ordenamos el historial por fecha (más reciente primero)
        const sortedHistory = [...status_history].sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        
        // El estado actual es el más reciente (primer elemento del historial ordenado)
        const currentStatus = sortedHistory.length > 0 ? {
          id: sortedHistory[0].id,
          status: sortedHistory[0].status,
          comment: sortedHistory[0].comment,
          timestamp: sortedHistory[0].timestamp,
          user_name: sortedHistory[0].user_name
        } : null;
        
        // Transformamos el historial al formato esperado
        const historyItems: StatusHistoryItem[] = sortedHistory.map(item => ({
          id: item.id,
          status: item.status,
          comment: item.comment,
          timestamp: item.timestamp,
          user_name: item.user_name
        }));
        
        // Creamos el objeto de respuesta
        const formattedShipment: ShipmentStatus = {
          id: shipment.id,
          tracking_code: shipment.tracking_code,
          origin_id: shipment.origin_id,
          destination_id: shipment.destination_id,
          created_at: shipment.created_at,
          current_status: currentStatus,
          history: historyItems
        };
        
        return {
          success: true,
          data: formattedShipment
        };
      } 
      
      return {
        success: false,
        error: response.data.error || 'Error al obtener los datos del envío'
      };
    } catch (error) {
      console.error('Error al consultar estado:', error);
      
      return {
        success: false,
        error: 'Error al consultar el estado del envío'
      };
    }
  }
}

export default new ShipmentService();
