import api from "./api";
import { jwtDecode } from "jwt-decode";

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  address?: string;
}

interface AuthResponse {
  token: string;
}

interface DecodedToken {
  id: number;
  email: string;
  role_id: number;
  iat: number;
  exp: number;
}

const ROLE_MAPPING: Record<number, string> = {
  1: "admin",
  2: "user",
};

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>(
        "/api/v1/auth/login",
        credentials
      );
      const token = response.data.token;
      this.setToken(token);

      try {
        const decoded = jwtDecode<DecodedToken>(token);

        const roleId = decoded.role_id;
        const roleName = ROLE_MAPPING[roleId] || "user";
        const userId = decoded.id;

        this.setUserRole(roleName);
        this.setUserId(userId);

      } catch (decodeError) {
        console.error("Error decodificando token:", decodeError);
        this.setUserRole("user");
      }

      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>(
        "/api/v1/auth/register",
        userData
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  logout(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  }

  setToken(token: string): void {
    localStorage.setItem("token", token);
  }

  getToken(): string | null {
    return localStorage.getItem("token");
  }

  setUserRole(role: string): void {
    localStorage.setItem("role", role);
  }

  getUserRole(): string | null {
    return localStorage.getItem("role");
  }

  setUserId(id: number): void {
    localStorage.setItem("userId", id.toString());
  }

  getUserId(): number | null {
    const id = localStorage.getItem("userId");
    return id ? parseInt(id, 10) : null;
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token;
  }

  private handleError(error: unknown): Error {
    if (error && typeof error === "object" && "response" in error) {
      const response = error.response as {
        data?: { message?: string };
        status?: number;
      };
      const message = response.data?.message || "Error en el servidor";
      const status = response.status || "Error";
      return new Error(`${status}: ${message}`);
    } else if (error && typeof error === "object" && "request" in error) {
      return new Error("Error de conexión. Comprueba tu conexión a internet.");
    } else {
      const errorMessage =
        error && typeof error === "object" && "message" in error
          ? String(error.message)
          : "Error desconocido";
      return new Error(errorMessage);
    }
  }
}

export default new AuthService();
