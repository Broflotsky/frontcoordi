import React, { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { AuthContext } from './AuthContext';
import type { User } from './AuthContext';
import authService from '../services/authService';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Comprobar si hay un token guardado
    const checkAuth = async () => {
      try {
        const token = authService.getToken();
        
        if (token) {
          // En un escenario real, aquí verificaríamos el token con el backend
          // o decodificaríamos un token JWT para obtener la información del usuario
          
          // Como es un ejemplo, asumimos que el token es válido
          // En una implementación real, aquí haríamos una petición al backend para obtener los datos del usuario
          
          // Mock de datos del usuario para la demostración
          // En un escenario real, estos datos vendrían del servidor
          setUser({
            id: '1',
            name: 'Usuario Ejemplo',
            email: 'usuario@ejemplo.com',
            role: 'user'
          });
        }
      } catch (error) {
        console.error('Error verificando autenticación:', error);
        authService.logout();
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await authService.login({ email, password });
      setUser(response.user);
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      const response = await authService.register({ name, email, password });
      setUser(response.user);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        loading,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
