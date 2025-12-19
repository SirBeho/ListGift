// auth/AuthProvider.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import instance from './axiosintance';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    const checkAuthStatus = async () => {
        setLoading(true); // Inicia la carga
        try {
           // console.log('Checking auth status...');
            const response = await instance.get('/auth/profile');

            if (response.status === 200 && response.data.user) {
                setUser(response.data.user);
                return true; // Retorna el usuario autenticado
            } else {
                setUser(null);
                navigate('/');
                return false; // Retorna null si no hay usuario autenticado
            }
        } catch (error) {
            console.log(error.status);
            console.error('Error checking auth status:', error);
            setUser(null);
            navigate('/');
            return false;

        } finally {

            setLoading(false);
        }
    };


    const login = async (credentials) => {
        try {
            const response = await instance.post('/auth/login', credentials);

            if (response.data.status === 'success' && await checkAuthStatus()) {

                console.log("checkAuthStatus");
                // REMOVE THIS LINE: navigate('/profile');
                return { success: true };
            } else {

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
            await instance.post('/auth/logout');


        } catch (error) {
            console.error('Logout error:', error);
        }
        setUser(null);
        navigate('/');
    };

    useEffect(() => {
        checkAuthStatus();

        const intervalId = setInterval(checkAuthStatus, 5 * 60 * 1000);

        return () => clearInterval(intervalId);
    }, []);


    if (loading) {
        // Puedes mostrar un indicador de carga aquí
        return <div>Cargando...</div>;
    }

    return (
        <AuthContext.Provider value={{ instance, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);