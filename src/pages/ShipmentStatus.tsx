import React from 'react';
import { useParams } from 'react-router-dom';

const ShipmentStatus: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Estado del Envío #{id}</h1>
      
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Información del Envío</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Número de Guía</p>
              <p className="font-medium">COD-{id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Fecha de Creación</p>
              <p className="font-medium">DD/MM/YYYY</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Estado Actual</p>
              <p className="font-medium">
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                  En Tránsito
                </span>
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Fecha Estimada de Entrega</p>
              <p className="font-medium">DD/MM/YYYY</p>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Seguimiento</h2>
          <div className="relative">
            <div className="absolute left-4 top-0 h-full w-0.5 bg-gray-200"></div>
            
            <div className="relative mb-6 pl-8">
              <div className="absolute left-0 top-1.5 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></div>
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm text-gray-500">DD/MM/YYYY - HH:MM</p>
                <p className="font-medium">Envío creado</p>
                <p className="text-sm">El envío ha sido registrado en nuestro sistema.</p>
              </div>
            </div>
            
            <div className="relative mb-6 pl-8">
              <div className="absolute left-0 top-1.5 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></div>
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm text-gray-500">DD/MM/YYYY - HH:MM</p>
                <p className="font-medium">Paquete recibido en centro de distribución</p>
                <p className="text-sm">El paquete ha sido recibido en nuestro centro de distribución principal.</p>
              </div>
            </div>
            
            <div className="relative mb-6 pl-8">
              <div className="absolute left-0 top-1.5 h-3 w-3 rounded-full bg-yellow-500 border-2 border-white"></div>
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm text-gray-500">DD/MM/YYYY - HH:MM</p>
                <p className="font-medium">En tránsito</p>
                <p className="text-sm">El paquete está en camino hacia su destino final.</p>
              </div>
            </div>
            
            <div className="relative pl-8">
              <div className="absolute left-0 top-1.5 h-3 w-3 rounded-full bg-gray-300 border-2 border-white"></div>
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm text-gray-500">Pendiente</p>
                <p className="font-medium">Entrega al destinatario</p>
                <p className="text-sm">El paquete será entregado en la dirección del destinatario.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h2 className="text-lg font-semibold mb-2">Detalles del Paquete</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Remitente</p>
              <p className="font-medium">Nombre del Remitente</p>
              <p className="text-sm">Dirección del Remitente</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Destinatario</p>
              <p className="font-medium">Nombre del Destinatario</p>
              <p className="text-sm">Dirección del Destinatario</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Peso</p>
              <p className="font-medium">0.00 kg</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Dimensiones</p>
              <p className="font-medium">00 x 00 x 00 cm</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipmentStatus;
