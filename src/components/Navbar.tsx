import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import authService from "../services/authService";

const Navbar: React.FC = () => {
  const { logout } = useAuth();
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  interface NavbarUser {
    role: string;
    first_name: string;
    last_name: string;
    email: string;
  }
  const [currentUser, setCurrentUser] = useState<NavbarUser | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const checkAuthStatus = () => {
    const token = authService.getToken();
    if (token) {
      setIsUserAuthenticated(true);
      setCurrentUser({
        role: authService.getUserRole() || "user",
        first_name: authService.getUserFirstName() || "",
        last_name: authService.getUserLastName() || "",
        email: authService.getUserEmail() || "",
      });
    } else {
      setIsUserAuthenticated(false);
      setCurrentUser(null);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, [location.pathname]);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const handleLogout = () => {
    logout();
    setIsUserAuthenticated(false);
    setCurrentUser(null);
    navigate("/login");
  };

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-xl font-bold">
              Coordinadora
            </Link>

            {isUserAuthenticated && (
              <div className="hidden md:flex space-x-4">
                <Link to="/shipments/new" className="hover:text-blue-200">
                  Crear Envío
                </Link>
                {currentUser && currentUser.role === "admin" && (
                  <Link to="/admin" className="hover:text-blue-200">
                    Panel Admin
                  </Link>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {isUserAuthenticated ? (
              <>
                <span className="hidden md:inline">
                  Bienvenido {currentUser?.first_name || ""}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-blue-100 transition-colors hover:cursor-pointer"
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-blue-200">
                  Iniciar Sesión
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-blue-100 transition-colors"
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
