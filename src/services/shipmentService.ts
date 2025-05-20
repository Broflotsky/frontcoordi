import api from "./api";
import type {
  Location,
  ProductType,
  ShipmentFormValues,
  ShipmentResponse,
} from "../validations/shipmentSchema";
import type {
  ShipmentStatus,
  ShipmentStatusResponse,
  StatusHistoryItem,
} from "../validations/trackingSchema";

interface ErrorResponseData {
  status?: number;
  statusText?: string;
  data?: {
    message?: string;
    error?: string;
  };
}

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
      { id: 1, name: "Bogotá", department: "Cundinamarca" },
      { id: 2, name: "Medellín", department: "Antioquia" },
      { id: 3, name: "Cali", department: "Valle del Cauca" },
      { id: 4, name: "Barranquilla", department: "Atlántico" },
      { id: 5, name: "Cartagena", department: "Bolívar" },
      { id: 6, name: "Cúcuta", department: "Norte de Santander" },
      { id: 7, name: "Bucaramanga", department: "Santander" },
      { id: 8, name: "Pereira", department: "Risaralda" },
      { id: 9, name: "Santa Marta", department: "Magdalena" },
      { id: 10, name: "Ibagué", department: "Tolima" },
      { id: 11, name: "Pasto", department: "Nariño" },
      { id: 12, name: "Manizales", department: "Caldas" },
      { id: 13, name: "Neiva", department: "Huila" },
      { id: 14, name: "Villavicencio", department: "Meta" },
      { id: 15, name: "Armenia", department: "Quindío" },
      { id: 16, name: "Valledupar", department: "Cesar" },
      { id: 17, name: "Montería", department: "Córdoba" },
      { id: 18, name: "Popayán", department: "Cauca" },
      { id: 19, name: "Sincelejo", department: "Sucre" },
      { id: 20, name: "Tunja", department: "Boyacá" },
    ];
  }

  async getProductTypes(): Promise<ProductType[]> {
    return [
      {
        id: 1,
        name: "sobre",
        min_weight_grams: 0,
        max_weight_grams: 1000,
        description: "Documentos y sobres pequeños de 0 a 1000 gramos",
      },
      {
        id: 2,
        name: "paquete",
        min_weight_grams: 1001,
        max_weight_grams: 20000,
        description: "Paquetes estándar de 1001 a 20000 gramos",
      },
      {
        id: 3,
        name: "paquete pesado",
        min_weight_grams: 20001,
        max_weight_grams: null,
        description: "Paquetes grandes o pesados de 20001 gramos en adelante",
      },
    ];
  }

  async createShipment(
    data: ShipmentFormValues
  ): Promise<SuccessResponse | ErrorResponse> {
    try {
      const response = await api.post<ShipmentResponse>(
        "/api/v1/shipments",
        data
      );

      return {
        success: true,
        data: {
          id: response.data.id,
          tracking_code: response.data.tracking_code,
        },
      };
    } catch (error) {
      if (error && typeof error === "object" && "response" in error) {
        const response = error.response as {
          data?: { message?: string; error?: string };
          status?: number;
        };

        const errorMessage =
          response.data?.message ||
          response.data?.error ||
          "Error al crear el envío";

        return {
          success: false,
          error: errorMessage,
        };
      }

      return {
        success: false,
        error: "Error de conexión. Intente nuevamente.",
      };
    }
  }

  async getShipmentStatusByTrackingCode(
    trackingCode: string
  ): Promise<ShipmentStatusResponse> {
    try {
      const response = await api.get(
        `/api/v1/shipments/tracking/${trackingCode}/history`
      );

      if (response.data.status === "success" && response.data.data) {
        const { shipment, status_history } = response.data.data;

        if (!shipment || !status_history || !Array.isArray(status_history)) {
          console.error("Estructura de datos inválida:", {
            hasShipment: !!shipment,
            hasHistory: !!status_history,
            isHistoryArray: Array.isArray(status_history),
          });
          return {
            success: false,
            error: "La estructura de datos recibida no es válida",
          };
        }

        if (!shipment.id || !shipment.tracking_code) {
          console.error("Datos de envío incompletos:", shipment);
          return {
            success: false,
            error: "Los datos del envío están incompletos",
          };
        }

        try {
          const sortedHistory = [...status_history].sort((a, b) => {
            const dateA = new Date(b.timestamp);
            const dateB = new Date(a.timestamp);

            if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
              console.warn("Fechas inválidas en el historial", {
                a: b.timestamp,
                b: a.timestamp,
              });
            }

            return dateA.getTime() - dateB.getTime();
          });

          const currentStatus =
            sortedHistory.length > 0
              ? {
                  id: sortedHistory[0].id,
                  status: sortedHistory[0].status,
                  comment: sortedHistory[0].comment,
                  timestamp: sortedHistory[0].timestamp,
                  user_name: sortedHistory[0].user_name,
                }
              : null;

          const historyItems: StatusHistoryItem[] = sortedHistory.map(
            (item) => ({
              id: item.id,
              status: item.status,
              comment: item.comment,
              timestamp: item.timestamp,
              user_name: item.user_name,
            })
          );

          const formattedShipment: ShipmentStatus = {
            id: shipment.id,
            tracking_code: shipment.tracking_code,
            origin_id: shipment.origin_id || 0, // Valores por defecto para campos opcionales
            destination_id: shipment.destination_id || 0,
            created_at: shipment.created_at || new Date().toISOString(),
            current_status: currentStatus,
            history: historyItems,
          };

          return {
            success: true,
            data: formattedShipment,
          };
        } catch (processingError) {
          console.error("Error al procesar datos:", processingError);
          return {
            success: false,
            error: "Error al procesar los datos del envío",
          };
        }
      }

      const errorMsg =
        response.data.error ||
        (response.data.message
          ? `Error: ${response.data.message}`
          : "Error al obtener los datos del envío");

      console.warn("Respuesta sin éxito:", {
        status: response.data.status,
        hasData: !!response.data.data,
        error: errorMsg,
      });

      return {
        success: false,
        error: errorMsg,
      };
    } catch (error) {
      console.error("Error al consultar estado:", error);

      let errorMsg = "Error al consultar el estado del envío";
      if (error && typeof error === "object") {
        if ("message" in error) {
          errorMsg += `: ${(error as Error).message}`;
        }
        if (
          "response" in error &&
          error.response &&
          typeof error.response === "object"
        ) {
          const resp = error.response as ErrorResponseData;
          if (resp.status) errorMsg += ` (${resp.status})`;
        }
      }

      return {
        success: false,
        error: errorMsg,
      };
    }
  }
}

export default new ShipmentService();
