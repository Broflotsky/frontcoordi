import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import authService from '../services/authService';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole 
}) => {
  // No usamos directamente el hook ya que verificamos con authService
  // para una verificación más robusta y directa
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Verificación directa usando el servicio de autenticación
    const token = authService.getToken();
    const userRole = authService.getUserRole();
    
    if (!token) {
      setHasAccess(false);
    } else if (requiredRole && userRole !== requiredRole) {
      setHasAccess(false);
    } else {
      setHasAccess(true);
    }
    
    setLoading(false);
  }, [requiredRole]);

  if (loading) {
    // Puedes mostrar un spinner de carga mientras se verifica
    return <div className="flex justify-center items-center h-screen">Cargando...</div>;
  }

  if (!hasAccess) {
    if (!authService.getToken()) {
      // Si no hay token, redirigir al login
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
    
    // Si hay token pero no tiene el rol requerido, redirigir según su rol
    const userRole = authService.getUserRole();
    const redirectPath = userRole === 'admin' ? '/admin' : '/shipments/new';
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
