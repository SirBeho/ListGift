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
    const { clearUserData } = useList();

    useEffect(() => {
        const checkAuth = async () => {
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

                setUser(res.data.user);
            }
        } catch (err) {
            throw err.normalized;
        }
    };

    const logout = async () => {
        setLoading(true);
        clearUserData();
        localStorage.removeItem('token');
        try {
            await instance.post('/auth/logout');
            console.log("saliendo")
        } catch (error) {
            console.error('Logout error:', error);
        }
        navigate('/', { replace: true });
        setTimeout(() => {
            setUser(null);
            setLoading(false);
        }, 50);
    };

    return (
        <AuthContext.Provider value={{ loading, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);