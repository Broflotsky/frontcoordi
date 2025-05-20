import React from 'react';
import type { FieldError } from 'react-hook-form';

interface Option {
  id: number;
  name: string;
  description?: string;
}

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  id: string;
  label: string;
  options: Option[];
  error?: FieldError;
  required?: boolean;
  placeholder?: string;
}

const SelectField: React.FC<SelectFieldProps> = ({
  id,
  label,
  options,
  error,
  required = false,
  placeholder = 'Seleccione una opción',
  ...props
}) => {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        id={id}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
          error ? "border-red-500" : "border-gray-300"
        } ${
          props.disabled ? "appearance-none bg-gray-100 text-gray-500" : ""
        }`}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
      {error && (
        <p
          id={`${id}-error`}
          className="mt-1 text-sm text-red-600"
        >
          {error.message}
        </p>
      )}
    </div>
  );
};

export default SelectField;
