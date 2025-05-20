import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../validations/authSchemas';
import type { LoginFormValues } from '../validations/authSchemas';

const Login: React.FC = () => {
  const { login } = useAuth();
  const [apiError, setApiError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (data: LoginFormValues) => {
    setApiError(null);
    setLoading(true);

    try {
      const result = await login(data.email, data.password);
      if (!result.success) {
        setApiError(result.error || 'Error al iniciar sesión');
      }
    } catch (err) {
      setApiError('Ocurrió un error inesperado. Intente nuevamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Iniciar Sesión</h1>
        
        {apiError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {apiError}
          </div>
        )}
        
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          <fieldset disabled={loading} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Correo Electrónico
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                aria-invalid={!!errors.email}
                aria-describedby="email-error"
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                {...register('email')}
              />
              {errors.email && (
                <p id="email-error" className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                aria-invalid={!!errors.password}
                aria-describedby="password-error"
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                {...register('password')}
              />
              {errors.password && (
                <p id="password-error" className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>
            <div>
              <button
                type="submit"
                className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              >
                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </button>
            </div>
            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                ¿No tienes cuenta? <Link to="/register" className="text-blue-600 hover:text-blue-800">Regístrate aquí</Link>
              </p>
            </div>
          </fieldset>
        </form>
      </div>
    </div>
  );
};

export default Login;
