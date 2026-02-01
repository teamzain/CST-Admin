import axios, {
    type AxiosInstance,
    type InternalAxiosRequestConfig,
} from 'axios';
import { getBaseApiUrl } from '@/config';
import { APP_NAMES } from '@/utils/constants';

// Shared state for all API clients to manage concurrent refresh attempts
let isRefreshing = false;
let failedQueue: {
    resolve: (token: string | null) => void;
    reject: (error: any) => void;
}[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

const createApiClient = (appName: APP_NAMES): AxiosInstance => {
    const api = axios.create({
        baseURL: getBaseApiUrl(appName),
        timeout: 10000,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    // Request Interceptor: Attach the token to every request
    api.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    // Response Interceptor: Handle errors and token refresh
    api.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest =
                error.config as InternalAxiosRequestConfig & {
                    _retry?: boolean;
                };

            // Handle 401 Unauthorized errors (token expired)
            if (error.response?.status === 401 && !originalRequest._retry) {
                // If already refreshing, queue the request
                if (isRefreshing) {
                    return new Promise((resolve, reject) => {
                        failedQueue.push({ resolve, reject });
                    })
                        .then((token) => {
                            originalRequest.headers.Authorization = `Bearer ${token}`;
                            return api(originalRequest);
                        })
                        .catch((err) => Promise.reject(err));
                }

                originalRequest._retry = true;
                isRefreshing = true;

                const refreshToken = localStorage.getItem('refresh_token');

                if (!refreshToken) {
                    // No refresh token available, logout and redirect
                    localStorage.removeItem('token');
                    localStorage.removeItem('refresh_token');
                    localStorage.removeItem('user');
                    window.location.href = '/login';
                    return Promise.reject(error);
                }

                try {
                    const authBaseUrl = getBaseApiUrl(APP_NAMES.AUTH);
                    // Call the refresh endpoint directly using a clean axios instance
                    const { data } = await axios.post(
                        `${authBaseUrl}/refresh`,
                        {
                            refreshToken: refreshToken,
                        }
                    );

                    const { access_token, refresh_token: newRefreshToken } =
                        data;

                    // Update storage
                    localStorage.setItem('token', access_token);
                    localStorage.setItem('refresh_token', newRefreshToken);

                    // Process the queue with the new token
                    processQueue(null, access_token);

                    // Retry the original request
                    originalRequest.headers.Authorization = `Bearer ${access_token}`;
                    return api(originalRequest);
                } catch (refreshError) {
                    // Refresh failed, logout and reject all queued requests
                    processQueue(refreshError, null);
                    localStorage.removeItem('token');
                    localStorage.removeItem('refresh_token');
                    localStorage.removeItem('user');
                    window.location.href = '/login';
                    return Promise.reject(refreshError);
                } finally {
                    isRefreshing = false;
                }
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
