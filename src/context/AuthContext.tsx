import { createContext } from 'react';

// Definición de tipos para el usuario
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

// Tipo para el contexto de autenticación
export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

// Valor por defecto para el contexto (undefined)
export const AuthContext = createContext<AuthContextType | undefined>(undefined);
