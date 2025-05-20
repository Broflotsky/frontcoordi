import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import authService from '../services/authService';

interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const token = authService.getToken();
    
    if (token) {
      setIsAuthenticated(true);
      setUserRole(authService.getUserRole());
    } else {
      setIsAuthenticated(false);
    }
    
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Cargando...</div>;
  }

  if (isAuthenticated) {
    const redirectPath = userRole === 'admin' ? '/admin' : '/shipments/new';
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;
