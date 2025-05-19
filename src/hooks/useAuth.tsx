import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

interface AuthUser {
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
  role: string;
}

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [role, setRole] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = authService.getToken();
    const userRole = authService.getUserRole();
    const userId = authService.getUserId();
    
    if (token) {
      setIsAuthenticated(true);
      setRole(userRole);
      
      setUser({
        id: userId || 0,
        email: '',
        role: userRole || 'user'
      });
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      await authService.login({ email, password });
      setIsAuthenticated(true);

      const userRole = authService.getUserRole() || 'user';
      setRole(userRole);
      
      const userId = authService.getUserId();
      setUser({
        id: userId || 0,
        email: email,
        role: userRole
      });
      
      if (userRole === 'admin') {
        navigate('/admin');
      } else {
        navigate('/shipments/new');
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error de inicio de sesión:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error desconocido' 
      };
    }
  };

  const register = async (firstName: string, lastName: string, email: string, password: string, address?: string) => {
    try {
      await authService.register({ 
        first_name: firstName, 
        last_name: lastName, 
        email, 
        password,
        address
      });
      navigate('/login');
      return { success: true };
    } catch (error) {
      console.error('Error de registro:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error desconocido' 
      };
    }
  };

  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setRole(null);
    setUser(null);
    navigate('/login');
  };

  return {
    isAuthenticated,
    role,
    user,
    login,
    register,
    logout
  };
};

export default useAuth;
