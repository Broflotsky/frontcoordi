import api from './api';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/login', credentials);
      this.setToken(response.data.token);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/register', userData);
      this.setToken(response.data.token);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  logout(): void {
    localStorage.removeItem('token');
    // También podríamos hacer una llamada al backend para invalidar el token si fuera necesario
    // api.post('/auth/logout');
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token; // Convertir a booleano
  }

  // Método auxiliar para manejar errores de manera consistente
  private handleError(error: unknown): Error {
    if (error && typeof error === 'object' && 'response' in error) {
      // Error de respuesta del servidor
      const response = error.response as { data?: { message?: string }, status?: number };
      const message = response.data?.message || 'Error en el servidor';
      const status = response.status || 'Error';
      return new Error(`${status}: ${message}`);
    } else if (error && typeof error === 'object' && 'request' in error) {
      // Error sin respuesta (problemas de red)
      return new Error('Error de conexión. Comprueba tu conexión a internet.');
    } else {
      // Error en la configuración
      const errorMessage = error && typeof error === 'object' && 'message' in error 
        ? String(error.message) 
        : 'Error desconocido';
      return new Error(errorMessage);
    }
  }
}

export default new AuthService();
