import axios from 'axios';


//const currentHost = window.location.hostname;
//export const API_BASE_URL = `https://${currentHost}`;
export const API_BASE_URL = import.meta.env.VITE_API_URL;
//export const API_BASE_URL = 'https://listgift.free.nf/backend';


const instance = axios.create({

    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
        'Accept': 'application/json',
    },
    withCredentials: true,
});


instance.interceptors.response.use(
    (response) => response, // Si todo sale bien, pasa de largo
    (error) => {

        const isVerifyRoute = error.config?.url?.includes('/auth/verify');
        const isUnauthorized = error.response?.status === 401;

        if (isUnauthorized && isVerifyRoute) {
            return Promise.reject(error);
        }

        console.error('ERROR AXIOS INTERCEPTOR:', error);
        // Si el servidor respondió con nuestro formato normalizado
        if (error.response && error.response.data) {
            error.normalized = {
                status: error.response.data.status || 'error',
                message: error.response.data.message || 'Ocurrió un error inesperado',
                errors: error.response.data.errors || {}
            };
        } else {
            error.normalized = {
                status: 'error',
                message: 'Error de conexión con el servidor',
                errors: {}
            };
        }

        return Promise.reject(error);
    }
);

export default instance;
