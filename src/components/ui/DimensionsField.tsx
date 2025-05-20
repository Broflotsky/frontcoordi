import React from 'react';
import type { FieldError, UseFormRegister, UseFormWatch } from 'react-hook-form';
import type { ShipmentFormValues } from '../../validations/shipmentSchema';

interface DimensionsFieldProps {
  register: UseFormRegister<ShipmentFormValues>;
  watch: UseFormWatch<ShipmentFormValues>;
  errors: {
    width_cm?: FieldError;
    height_cm?: FieldError;
    length_cm?: FieldError;
  };
}

const DimensionsField: React.FC<DimensionsFieldProps> = ({
  register,
  watch,
  errors,
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Dimensiones (cm)
      </label>
      
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label htmlFor="width_cm" className="text-xs text-gray-500 mb-1 block">
            Ancho (cm)
          </label>
          <input
            id="width_cm"
            type="number"
            min="1"
            aria-invalid={!!errors.width_cm}
            aria-describedby="width_cm-error"
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
              errors.width_cm ? "border-red-500" : "border-gray-300"
            }`}
            {...register("width_cm", {
              setValueAs: (value) => parseInt(value, 10) || 0,
            })}
          />
          {errors.width_cm && (
            <p
              id="width_cm-error"
              className="mt-1 text-xs text-red-600"
            >
              {errors.width_cm.message}
            </p>
          )}
        </div>
        
        <div>
          <label htmlFor="height_cm" className="text-xs text-gray-500 mb-1 block">
            Alto (cm)
          </label>
          <input
            id="height_cm"
            type="number"
            min="1"
            aria-invalid={!!errors.height_cm}
            aria-describedby="height_cm-error"
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
              errors.height_cm ? "border-red-500" : "border-gray-300"
            }`}
            {...register("height_cm", {
              setValueAs: (value) => parseInt(value, 10) || 0,
            })}
          />
          {errors.height_cm && (
            <p
              id="height_cm-error"
              className="mt-1 text-xs text-red-600"
            >
              {errors.height_cm.message}
            </p>
          )}
        </div>
        
        <div>
          <label htmlFor="length_cm" className="text-xs text-gray-500 mb-1 block">
            Largo (cm)
          </label>
          <input
            id="length_cm"
            type="number"
            min="1"
            aria-invalid={!!errors.length_cm}
            aria-describedby="length_cm-error"
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
              errors.length_cm ? "border-red-500" : "border-gray-300"
            }`}
            {...register("length_cm", {
              setValueAs: (value) => parseInt(value, 10) || 0,
            })}
          />
          {errors.length_cm && (
            <p
              id="length_cm-error"
              className="mt-1 text-xs text-red-600"
            >
              {errors.length_cm.message}
            </p>
          )}
        </div>
      </div>
      
      <p className="text-xs text-gray-500 mt-1">
        Se enviará como: {watch("width_cm") || "?"} x {watch("height_cm") || "?"} x {watch("length_cm") || "?"} cm
      </p>
    </div>
  );
};

export default DimensionsField;
