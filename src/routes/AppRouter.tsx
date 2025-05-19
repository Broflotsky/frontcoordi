import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PublicRoute from '../components/PublicRoute';
import Login from '../pages/Login';
import Register from '../pages/Register';
import CreateShipment from '../pages/CreateShipment';
import ShipmentStatus from '../pages/ShipmentStatus';
import AdminPanel from '../pages/AdminPanel';
import ProtectedRoute from '../components/ProtectedRoute';
import Navbar from '../components/Navbar';

const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="pt-4">
        <Routes>
          {/* Ruta principal - Redirige a la página de login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Rutas públicas - solo accesibles sin autenticación */}
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
          
          {/* Rutas protegidas */}
          <Route 
            path="/shipments/new" 
            element={
              <ProtectedRoute>
                <CreateShipment />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/shipments/:id/status" 
            element={
              <ProtectedRoute>
                <ShipmentStatus />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminPanel />
              </ProtectedRoute>
            } 
          />
          
          {/* Ruta para capturar rutas no definidas */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
};

export default AppRouter;
