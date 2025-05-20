import { z } from "zod";

export const trackingSchema = z.object({
  trackingCode: z
    .string()
    .min(4, "El código debe tener al menos 4 caracteres")
    .trim()
    .nonempty("El código de seguimiento es requerido"),
});

export type TrackingFormValues = z.infer<typeof trackingSchema>;

export interface ApiShipmentData {
  id: number;
  tracking_code: string;
  origin_id: number;
  destination_id: number;
  created_at: string;
}

export interface ApiStatusHistoryItem {
  id: number;
  shipment_id: number;
  status: string;
  comment: string | null;
  timestamp: string;
  created_by: number;
  user_name: string;
}

export interface ApiResponse {
  status: string;
  data: {
    shipment: ApiShipmentData;
    status_history: ApiStatusHistoryItem[];
  };
}

export interface ShipmentStatus {
  id: number;
  tracking_code: string;
  origin_id: number;
  destination_id: number;
  created_at: string;
  current_status: StatusHistoryItem | null;
  history: StatusHistoryItem[];
}

export interface StatusHistoryItem {
  id: number;
  status: string;
  comment?: string | null;
  timestamp: string;
  user_name: string;
}

export interface ShipmentStatusResponse {
  success: boolean;
  data?: ShipmentStatus;
  error?: string;
}
