import axios, { AxiosError } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_COURSE_URL || 'http://localhost:3012/api/course';

export interface Quiz {
    id: number;
    title: string;
    passing_score: number;
    is_final: boolean;
    order_index: number;
}

class QuizzesService {
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

        this.axiosInstance.interceptors.response.use(
            (response) => response,
            (error: AxiosError<any>) => {
                console.error('Quizzes API Error:', {
                    url: error.config?.url,
                    status: error.response?.status,
                    message: error.message,
                    data: error.response?.data,
                });
                return Promise.reject(error);
            }
        );
    }

    private getData<T>(response: any): T {
        const data = response?.data;
        if (!data) return [] as unknown as T;

        if (Array.isArray(data)) return data as unknown as T;

        if (data.data !== undefined) {
            if (Array.isArray(data.data)) return data.data as unknown as T;
            if (data.data.quizzes !== undefined) return data.data.quizzes as unknown as T;
            if (data.data.quiz !== undefined) return data.data.quiz as unknown as T;
            return data.data as T;
        }

        if (data.quizzes !== undefined) return data.quizzes as unknown as T;
        if (data.quiz !== undefined) return data.quiz as unknown as T;

        return data as T;
    }

    public getErrorMessage(error: any, defaultMessage: string = 'An error occurred'): string {
        if (axios.isAxiosError(error) && error.response?.data) {
            const data = error.response.data;
            if (typeof data.message === 'string') return data.message;
            if (data.msg) return data.msg;
            if (data.error) return typeof data.error === 'string' ? data.error : JSON.stringify(data.error);
        }
        return error.message || defaultMessage;
    }

    async createQuiz(moduleId: number, data: Partial<Quiz>): Promise<Quiz> {
        try {
            const response = await this.axiosInstance.post<any>(`module/${moduleId}/quizzes`, data);
            return this.getData<Quiz>(response);
        } catch (error) {
            console.error('Error creating quiz:', error);
            throw error;
        }
    }

    async updateQuiz(quizId: number, data: Partial<Quiz>): Promise<Quiz> {
        try {
            const response = await this.axiosInstance.patch<any>(`quiz/${quizId}`, data);
            return this.getData<Quiz>(response);
        } catch (error) {
            console.error('Error updating quiz:', error);
            throw error;
        }
    }

    async deleteQuiz(quizId: number): Promise<void> {
        try {
            await this.axiosInstance.delete(`quiz/${quizId}`);
        } catch (error) {
            console.error('Error deleting quiz:', error);
            throw error;
        }
    }
}

export const quizzesService = new QuizzesService();
