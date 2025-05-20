import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Correo inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  firstName: z.string().min(1, 'Campo obligatorio'),
  lastName: z.string().min(1, 'Campo obligatorio'),
  email: z.string().email('Correo inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  confirmPassword: z.string().min(1, 'Campo obligatorio'),
  address: z.string().optional()
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword']
});

export type RegisterFormValues = z.infer<typeof registerSchema>;
