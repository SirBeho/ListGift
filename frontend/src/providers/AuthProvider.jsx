// auth/AuthProvider.jsx
import { createContext, useState, useEffect, useContext } from 'react';
import instance from '../service/AxiosInstance';
import { useNavigate } from 'react-router-dom';
import { useList } from './ListProvider';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [redirecting, setRedirecting] = useState(false);
    const { clearUserData } = useList();



    useEffect(() => {
        const checkAuth = async () => {
            console.log('verificando autenticación...')
            try {
                // Endpoint que creamos para verificar la cookie JWT
                const res = await instance.get('/auth/verify');
                setUser(res.data.user);
            } catch (e) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);



    const login = async (credentials) => {
        console.log('usuario login:', user)
        try {
            // Usamos la instancia que ya tiene el interceptor
            const res = await instance.post('/auth/login', credentials);
            console.log('respuesta login:', res.data)
            if (res.data.status === 'success') {
                setRedirecting(true);
                setUser(res.data.user);
                console.log('usuario seteado:', res.data.user)
            }
        } catch (err) {
            console.log(err)
            throw err.normalized;
        }


    };

    const logout = async () => {

        setLoading(true);

        try {
            const res = await instance.post('/auth/logout');
            console.log(res)
            console.log("saliendo")
        } catch (error) {
            console.error('Logout error:', error);
        }

        localStorage.removeItem('token');
        if (clearUserData) clearUserData();
        setUser(null);
        setRedirecting(false);
        setLoading(false);

    };

    return (
        <AuthContext.Provider value={{ loading, user, login, logout, redirecting }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);