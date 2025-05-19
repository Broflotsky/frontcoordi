import axios from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';

// Definir la URL base del API según el entorno
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Crear una instancia de axios con configuración base
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token de autenticación a cada solicitud
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Si el error es 401 (No autorizado) y no hemos intentado refrescar el token
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Intentar refrescar el token (esta parte se implementaría cuando tengas un endpoint de refresh token)
        // const refreshToken = localStorage.getItem('refreshToken');
        // const response = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
        // const { token } = response.data;
        
        // localStorage.setItem('token', token);
        
        // Reintentar la solicitud original con el nuevo token
        // if (originalRequest.headers) {
        //   originalRequest.headers.Authorization = `Bearer ${token}`;
        // }
        
        // return api(originalRequest);
        
        // Como no tenemos implementación de refresh token, simplemente redireccionamos al login
        localStorage.removeItem('token');
        window.location.href = '/login';
        return Promise.reject(error);
      } catch (refreshError) {
        // Si falla el refresh token, limpiar el almacenamiento y redirigir al login
        localStorage.removeItem('token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
