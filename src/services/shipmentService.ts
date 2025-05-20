import api from './api';
import type { Location, ProductType, ShipmentFormValues, ShipmentResponse } from '../validations/shipmentSchema';

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

  async getShipmentStatus(trackingCode: string): Promise<{success: boolean, data?: Record<string, unknown>, error?: string}> {
    try {
      const response = await api.get(`/api/v1/shipments/tracking/${trackingCode}/status`);
      return {
        success: true,
        data: response.data
      };
    } catch {
      return {
        success: false,
        error: 'Error al obtener el estado del envío'
      };
    }
  }
}

export default new ShipmentService();
