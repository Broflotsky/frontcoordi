import api from './api';
import type { Location, ProductType, ShipmentFormValues, ShipmentResponse } from '../validations/shipmentSchema';

// Interfaz para la respuesta con errores
interface ErrorResponse {
  success: false;
  error: string;
}

// Interfaz para respuesta exitosa
interface SuccessResponse {
  success: true;
  data: {
    id: number;
    tracking_code: string;
  };
}

class ShipmentService {
  async getLocations(): Promise<Location[]> {
    try {
      // Usamos la API general para obtener ciudades/ubicaciones
      const response = await api.get('/api/v1/locations');
      return response.data;
    } catch (error) {
      console.error('Error al obtener ubicaciones:', error);
      return [];
    }
  }

  async getProductTypes(): Promise<ProductType[]> {
    try {
      // Usamos la API general para obtener tipos de productos
      const response = await api.get('/api/v1/product-types');
      return response.data;
    } catch (error) {
      console.error('Error al obtener tipos de producto:', error);
      return [];
    }
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
