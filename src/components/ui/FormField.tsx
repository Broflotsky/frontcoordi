import React from 'react';
import type { FieldError } from 'react-hook-form';

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  error?: FieldError;
  required?: boolean;
}

const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  error,
  required = false,
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
      <input
        id={id}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
          error ? "border-red-500" : "border-gray-300"
        }`}
        {...props}
      />
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

export default FormField;
