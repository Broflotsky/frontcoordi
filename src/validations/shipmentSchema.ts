import { z } from 'zod';

export const shipmentSchema = z.object({
  origin_id: z.number().int().positive('Seleccione una ciudad de origen'),
  destination_id: z.number().int().positive('Seleccione una ciudad de destino'),
  destination_detail: z.string().optional(),
  product_type_id: z.number().int().positive('Seleccione un tipo de producto'),
  weight_grams: z.number().int().positive('El peso debe ser mayor a 0'),
  // Campos individuales de dimensiones
  width_cm: z.number().int().min(1, 'El ancho debe ser mayor a 0'),
  height_cm: z.number().int().min(1, 'El alto debe ser mayor a 0'),
  length_cm: z.number().int().min(1, 'El largo debe ser mayor a 0'),
  // Campo calculado para almacenar las dimensiones combinadas
  dimensions: z.string().optional(),
  recipient_name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  recipient_address: z.string().min(3, 'Ingrese una dirección válida'),
  recipient_phone: z.union([
    z.string().min(7, 'El teléfono debe tener al menos 7 caracteres'),
    z.number().transform(val => val.toString())
  ]),
  recipient_document: z.union([
    z.string().min(1, 'El documento es requerido'),
    z.number().transform(val => val.toString())
  ])
}).refine(data => data.origin_id !== data.destination_id, {
  message: 'La ciudad de origen y destino deben ser diferentes',
  path: ['destination_id']
});

// Tipo inferido para el formulario
export type ShipmentFormValues = {
  origin_id: number;
  destination_id: number;
  destination_detail?: string;
  product_type_id: number;
  weight_grams: number;
  // Campos individuales de dimensiones
  width_cm: number;
  height_cm: number;
  length_cm: number;
  // Campo calculado que combinará los 3 valores
  dimensions?: string;
  recipient_name: string;
  recipient_address: string;
  recipient_phone: string | number;
  recipient_document: string | number;
};

// Tipos de entidades relacionadas
export interface Location {
  id: number;
  name: string;
  department: string;
}

export interface ProductType {
  id: number;
  name: string;
  description?: string;
  min_weight_grams: number;
  max_weight_grams: number | null;
}

// Tipos para respuesta del backend
export interface ShipmentResponse {
  id: number;
  tracking_code: string;
  user_id: number;
  origin_id: number;
  destination_id: number;
  destination_detail?: string;
  product_type_id: number;
  weight_grams: number;
  dimensions: string;
  recipient_name: string;
  recipient_address: string;
  recipient_phone: string;
  recipient_document: string;
  created_at: string;
}
