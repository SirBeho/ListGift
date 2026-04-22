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
        setLoading(true);
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

        try {
            // Usamos la instancia que ya tiene el interceptor
            const res = await instance.post('/auth/login', credentials);
            if (res.data.status === 'success') {
                setRedirecting(true);
                setUser(res.data.user);

            }
        } catch (err) {
            console.log(err)
            throw err.normalized;
        }


    };

    const logout = async () => {
        // 1. Detenemos cualquier redirección automática con el loading
        setLoading(true);

        try {
            navigate('/', { replace: true });
            await instance.post('/auth/logout');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {

            localStorage.removeItem('token');
            if (clearUserData) clearUserData();
            setUser(null);
            setRedirecting(false);
            setLoading(false);
        }
    };
    return (
        <AuthContext.Provider value={{ loading, user, login, logout, redirecting }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);