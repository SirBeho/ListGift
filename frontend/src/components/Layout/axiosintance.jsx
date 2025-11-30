import axios from 'axios';

// Vite inyecta automáticamente la variable correcta según el ambiente (dev o prod)
const API_BASE_URL = import.meta.env.VITE_API_URL;
console.log(API_BASE_URL);

const instance = axios.create({

    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

export default instance;
