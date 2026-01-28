import axios, { type AxiosInstance } from 'axios';
import { getBaseApiUrl } from '@/config';
import { APP_NAMES } from '@/utils/constants';

const createApiClient = (appName: APP_NAMES): AxiosInstance => {
    const api = axios.create({
        baseURL: getBaseApiUrl(appName),
        timeout: 10000,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    api.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem('auth-token');
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

    return api;
};

export const authApi = createApiClient(APP_NAMES.AUTH);
export const userApi = createApiClient(APP_NAMES.USER);
export const adminApi = createApiClient(APP_NAMES.ADMIN);
export const courseApi = createApiClient(APP_NAMES.COURSE);
export const paymentApi = createApiClient(APP_NAMES.PAYMENT);

export default createApiClient;
