import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { trackingSchema } from '../validations/trackingSchema';
import type { TrackingFormValues, ShipmentStatus } from '../validations/trackingSchema';
import shipmentService from '../services/shipmentService';

const ShipmentStatus: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shipment, setShipment] = useState<ShipmentStatus | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TrackingFormValues>({
    resolver: zodResolver(trackingSchema),
    mode: 'onChange'
  });

  const onSubmit = async (data: TrackingFormValues) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await shipmentService.getShipmentStatusByTrackingCode(data.trackingCode);
      
      if (result.success && result.data) {
        console.log('result.data', result.data)
        setShipment(result.data);
      } else {
        setError(result.error || 'Error al consultar el estado del envío');
        setShipment(null);
      }
    } catch (error) {
      console.error('Error en la consulta:', error);
      setError('Error de conexión. Intente nuevamente.');
      setShipment(null);
    } finally {
      setLoading(false);
    }
  };
  
  // Función auxiliar para formatear fechas con manejo de valores inválidos
  const formatDate = (dateString: string | undefined | null) => {
    if (!dateString) return 'Fecha no disponible';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Fecha inválida';
      
      return new Intl.DateTimeFormat('es-CO', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    } catch (error) {
      console.error('Error al formatear fecha:', error);
      return 'Fecha no disponible';
    }
  };
  
  // Función para determinar el color del estado
  const getStatusColor = (status: string | undefined | null) => {
    if (!status) return 'bg-gray-100 text-gray-800';
    
    switch (status.toLowerCase()) {
      case 'entregado':
        return 'bg-green-100 text-green-800';
      case 'en transito':
      case 'en tránsito':
        return 'bg-blue-100 text-blue-800';
      case 'en espera':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Función para determinar el color de la bolita en la línea de tiempo
  const getStatusBulletColor = (status: string | undefined | null) => {
    if (!status) return 'bg-gray-300';
    
    switch (status.toLowerCase()) {
      case 'entregado':
        return 'bg-green-500';
      case 'en transito':
      case 'en tránsito':
        return 'bg-blue-500';
      case 'en espera':
        return 'bg-yellow-500';
      case 'cancelado':
        return 'bg-red-500';
      default:
        return 'bg-gray-300';
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Seguimiento de Envío</h1>
      
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Consultar estado del envío</h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="trackingCode" className="block text-sm font-medium text-gray-700 mb-1">
              Código de seguimiento
            </label>
            <div className="flex">
              <input
                id="trackingCode"
                type="text"
                placeholder="Ingrese el código de seguimiento"
                aria-invalid={!!errors.trackingCode}
                aria-describedby={errors.trackingCode ? "trackingCode-error" : undefined}
                className={`flex-1 px-3 py-2 border rounded-l-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${errors.trackingCode ? "border-red-500" : "border-gray-300"}`}
                {...register("trackingCode")}
              />
              <button
                type="submit"
                disabled={loading}
                className={`px-4 py-2 border border-transparent rounded-r-md shadow-sm text-sm font-medium text-white ${loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Consultando...
                  </>
                ) : (
                  'Consultar'
                )}
              </button>
            </div>
            {errors.trackingCode && (
              <p id="trackingCode-error" className="mt-1 text-xs text-red-600">
                {errors.trackingCode.message}
              </p>
            )}
          </div>
        </form>
        
        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded" role="alert">
            {error}
          </div>
        )}
      </div>
      
      {shipment && (
        <div className="bg-white shadow-md rounded-lg p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Información del Envío</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Número de Guía</p>
              <p className="font-medium">{shipment?.tracking_code || 'No disponible'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Fecha de Creación</p>
              <p className="font-medium">{formatDate(shipment?.created_at)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Estado Actual</p>
              <p className="font-medium">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  getStatusColor(shipment?.current_status?.status)
                }`}>
                  {shipment?.current_status?.status || 'Estado no disponible'}
                </span>
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">ID de Origen</p>
              <p className="font-medium">{shipment?.origin_id || 'No disponible'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">ID de Destino</p>
              <p className="font-medium">{shipment?.destination_id || 'No disponible'}</p>
            </div>
          </div>
        </div>
        
        {Array.isArray(shipment?.history) && shipment.history.length > 0 ? (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4">Historial de Estados</h2>
            <div className="relative">
              <div className="absolute left-4 top-0 h-full w-0.5 bg-gray-200"></div>
              
              {shipment.history.map((historyItem, index) => (
                <div key={index} className="relative mb-6 pl-8">
                  <div 
                    className={`absolute left-0 top-1.5 h-3 w-3 rounded-full border-2 border-white ${
                      getStatusBulletColor(historyItem.status)
                    }`}
                  ></div>
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-sm text-gray-500">{formatDate(historyItem?.timestamp)}</p>
                    <p className="font-medium">{historyItem?.status || 'Estado sin nombre'}</p>
                    <p className="text-xs text-gray-500 mt-1">Por: {historyItem?.user_name || 'Sistema'}</p>
                    {historyItem?.comment && <p className="text-sm mt-1">{historyItem.comment}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4">Historial de Estados</h2>
            <p className="text-gray-500 italic">No hay historial de estados disponible</p>
          </div>
        )}
        

      </div>
      )}
    </div>
  );
};

export default ShipmentStatus;
