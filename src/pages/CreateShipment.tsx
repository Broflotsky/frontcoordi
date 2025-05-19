import React from 'react';

const CreateShipment: React.FC = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Crear Nuevo Envío</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="senderName" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Remitente
              </label>
              <input
                id="senderName"
                name="senderName"
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="senderAddress" className="block text-sm font-medium text-gray-700 mb-1">
                Dirección del Remitente
              </label>
              <input
                id="senderAddress"
                name="senderAddress"
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="recipientName" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Destinatario
              </label>
              <input
                id="recipientName"
                name="recipientName"
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="recipientAddress" className="block text-sm font-medium text-gray-700 mb-1">
                Dirección del Destinatario
              </label>
              <input
                id="recipientAddress"
                name="recipientAddress"
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="packageWeight" className="block text-sm font-medium text-gray-700 mb-1">
                Peso del Paquete (kg)
              </label>
              <input
                id="packageWeight"
                name="packageWeight"
                type="number"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="packageDimensions" className="block text-sm font-medium text-gray-700 mb-1">
                Dimensiones (cm) - Ancho x Alto x Largo
              </label>
              <input
                id="packageDimensions"
                name="packageDimensions"
                type="text"
                placeholder="30 x 20 x 15"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Descripción del Contenido
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Crear Envío
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateShipment;
