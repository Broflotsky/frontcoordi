import { useContext } from 'react';
import { AuthContext } from '../context';
import type { AuthContextType } from '../context';

/**
 * Hook personalizado para acceder al contexto de autenticación
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  
  return context;
};

export default useAuth;
