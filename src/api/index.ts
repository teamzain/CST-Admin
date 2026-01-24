import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://api.example.com',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});


api.interceptors.request.use(
    (config) => {
        // First try to get token from localStorage (logged in user)
        let token = localStorage.getItem('auth-token');
        
        // Fallback to env token for development/admin access
        if (!token) {
            token = import.meta.env.VITE_ADMIN_TOKEN;
        }
        
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);


api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {

            localStorage.removeItem('auth-token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
