import axios, { AxiosError } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_COURSE_URL;

export interface State {
    id: number;
    name: string;
    code: string;
    unarmed_hours: number;
    armed_hours: number;
    unarmed_passing_score: number;
    armed_passing_score: number;
    requires_range_training: boolean;
    certificate_validity_years?: number;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
}

class StatesApiService {
    private axiosInstance = axios.create({
        baseURL: API_BASE_URL,
    });

    constructor() {
        this.setupInterceptors();
    }

    private setupInterceptors() {
        this.axiosInstance.interceptors.request.use((config) => {
            const token = localStorage.getItem('auth-token') || localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        });
    }

    async getAllStates(isActive?: boolean): Promise<State[]> {
        try {
            const params = new URLSearchParams();
            if (isActive !== undefined) {
                params.append('is_active', String(isActive));
            }

            const response = await this.axiosInstance.get<State[]>('/state', { params });
            return response.data;
        } catch (error) {
            const axiosError = error as AxiosError;
            console.error('Error fetching states:', axiosError.message);
            throw error;
        }
    }

    async getStateById(id: number): Promise<State> {
        try {
            const response = await this.axiosInstance.get<State>(`/state/${id}`);
            return response.data;
        } catch (error) {
            const axiosError = error as AxiosError;
            console.error('Error fetching state:', axiosError.message);
            throw error;
        }
    }
}

export const statesApiService = new StatesApiService();
