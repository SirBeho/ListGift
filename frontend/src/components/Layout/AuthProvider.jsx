import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const instance = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});




const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const checkAuthStatus = async () => {
    console.log("pidiendop datoos")
    try {
      const response = await instance.get('/auth/profile');
      console.log(response);
      if (response.status === 200 && response.data.user) {
        setUser(response.data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setUser(null);
    }
  };

  const login = async (credentials) => {
    try {
      const response = await instance.post('/auth/login', credentials);
      
      if (response.data.status === 'success') {
        await checkAuthStatus(); 
        navigate('/profile'); // Redirigir desde el componente Login
        return { success: true }; // Retorna éxito solo si el backend lo indica
      } else {
        // Manejar errores de login basados en la respuesta del backend
        return { success: false, message: response.data.message || 'Error de autenticación' };
      }
    } catch (error) {
      console.log(error);
      if (error.response && error.response.data) {
        return { success: false, message: error.response.data.message };
      }
      return { success: false, message: 'Error de conexión' };
    }
  };

  const logout = async () => {
    try {
      await axios.post('http://localhost:8000/api/auth/logout');
      
      
    } catch (error) {
      console.error('Logout error:', error);
    }
    setUser(null);
    navigate('/');
  };

  useEffect(() => {
    //checkAuthStatus();

    const intervalId = setInterval(checkAuthStatus, 5 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);