import React from 'react';

interface ShipmentCreatedSuccessProps {
  trackingCode: string;
  onCreateNew: () => void;
}

const ShipmentCreatedSuccess: React.FC<ShipmentCreatedSuccessProps> = ({ 
  trackingCode, 
  onCreateNew 
}) => {
  return (
    <div className="container mx-auto p-6">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-2xl mx-auto">
        <div className="text-center">
          <svg
            className="mx-auto h-12 w-12 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          <h2 className="mt-4 text-2xl font-bold text-gray-800">
            ¡Envío creado con éxito!
          </h2>
          <p className="mt-2 text-gray-600">
            El código de seguimiento de su envío es:
          </p>
          <p className="mt-2 text-xl font-bold text-blue-600 bg-gray-100 py-2 px-4 mx-auto inline-block rounded">
            {trackingCode}
          </p>
          <p className="mt-4 text-sm text-gray-500">
            Guarde este código para realizar el seguimiento de su envío.
          </p>
          <div className="mt-6">
            <button
              onClick={onCreateNew}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Crear nuevo envío
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipmentCreatedSuccess;
