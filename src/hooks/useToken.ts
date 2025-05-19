import { useState, useEffect, useCallback } from 'react';

export const useToken = () => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Cargar el token del localStorage cuando el componente se monta
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const saveToken = useCallback((newToken: string) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  }, []);

  const removeToken = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
  }, []);

  return {
    token,
    saveToken,
    removeToken
  };
};

export default useToken;
