import axios, { AxiosError } from 'axios';
import type { Lesson } from './lessons';
import type { Session } from './sessions';
import type { Quiz } from './quizzes';

const API_BASE_URL = import.meta.env.VITE_API_COURSE_URL || 'http://localhost:3012/api/course';

export interface CreateModuleInput {
    title: string;
    description?: string;
    order_index: number;
}

export interface Module extends CreateModuleInput {
    id: number;
    course_id?: number;
    lessons?: Lesson[];
    sessions?: Session[];
    quizzes?: Quiz[];
    created_at?: Date;
    updated_at?: Date;
}

class ModulesService {
    private axiosInstance = axios.create({
        baseURL: API_BASE_URL,
    });

    constructor() {
        this.setupInterceptors();
    }

    /**
     * Extract error message from API response
     */
    public getErrorMessage(error: any, defaultMessage: string = 'An error occurred'): string {
        if (axios.isAxiosError(error) && error.response?.data) {
            const data = error.response.data;
            if (typeof data.message === 'string') return data.message;
            if (Array.isArray(data.message)) return data.message.join(', ');
            if (data.msg) return data.msg;
            if (data.error) return typeof data.error === 'string' ? data.error : JSON.stringify(data.error);
            if (data.errors && Array.isArray(data.errors)) return data.errors.map((e: any) => e.message || e).join(', ');
            if (typeof data === 'string') return data;
        }
        return error.message || defaultMessage;
    }

    private setupInterceptors() {
        this.axiosInstance.interceptors.request.use((config) => {
            const token = localStorage.getItem('auth-token') || localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        });

        // Add response error logging
        this.axiosInstance.interceptors.response.use(
            (response) => response,
            (error: AxiosError<any>) => {
                console.error('Modules API Error:', {
                    url: error.config?.url,
                    status: error.response?.status,
                    message: error.message,
                    data: error.response?.data,
                });
                return Promise.reject(error);
            }
        );
    }

    /**
     * Helper to extract data from potential wrapper
     */
    private getData<T>(response: any): T {
        const data = response?.data;
        if (!data) return [] as unknown as T;

        if (Array.isArray(data)) return data as unknown as T;

        if (data.data !== undefined) {
            if (Array.isArray(data.data)) return data.data as unknown as T;
            if (data.data.modules !== undefined) return data.data.modules as unknown as T;
            if (data.data.module !== undefined) return data.data.module as unknown as T;
            return data.data as T;
        }

        if (data.modules !== undefined) return data.modules as unknown as T;
        if (data.module !== undefined) return data.module as unknown as T;

        return data as T;
    }

    /**
     * Get all modules for a course
     */
    async getModulesByCourse(courseId: number): Promise<Module[]> {
        try {
            const response = await this.axiosInstance.get<any>(`${courseId}/modules`);
            const data = this.getData<any[]>(response);

            const modulesArray = Array.isArray(data) ? data : [];

            // Ensure each module is normalized and has sub-arrays
            const normalized = modulesArray.map(item => {
                // Support both direct module object or { module: {...} } structure
                const module = item.module || item;
                return {
                    ...module,
                    lessons: module.lessons || [],
                    sessions: module.sessions || [],
                    quizzes: module.quizzes || [],
                };
            });

            console.log('Fetched modules with sessions:', normalized);
            return normalized;
        } catch (error) {
            const axiosError = error as AxiosError;
            console.error('Error fetching modules for course:', {
                courseId,
                message: axiosError.message,
                status: axiosError.response?.status,
            });
            throw error;
        }
    }

    /**
     * Get a single module by ID
     */
    async getModuleById(moduleId: number): Promise<Module> {
        try {
            const response = await this.axiosInstance.get<any>(`module/${moduleId}`);
            return this.getData<Module>(response);
        } catch (error) {
            const axiosError = error as AxiosError;
            console.error('Error fetching module:', {
                moduleId,
                message: axiosError.message,
                status: axiosError.response?.status,
            });
            throw error;
        }
    }

    /**
     * Create a new module for a course
     */
    async createModule(courseId: number, data: CreateModuleInput): Promise<Module> {
        try {
            const response = await this.axiosInstance.post<any>(`${courseId}/modules`, data);
            return this.getData<Module>(response);
        } catch (error) {
            const axiosError = error as AxiosError<any>;
            console.error('Error creating module:', {
                courseId,
                message: axiosError.message,
                status: axiosError.response?.status,
                data: axiosError.response?.data,
            });
            throw error;
        }
    }

    /**
     * Update a module
     */
    async updateModule(moduleId: number, data: Partial<CreateModuleInput>): Promise<Module> {
        try {
            const response = await this.axiosInstance.patch<any>(`module/${moduleId}`, data);
            return this.getData<Module>(response);
        } catch (error) {
            const axiosError = error as AxiosError<any>;
            console.error('Error updating module:', {
                moduleId,
                message: axiosError.message,
                status: axiosError.response?.status,
                data: axiosError.response?.data,
            });
            throw error;
        }
    }

    /**
     * Update module order (for drag and drop)
     */
    async updateModuleOrder(moduleId: number, newOrderIndex: number): Promise<Module> {
        try {
            const response = await this.axiosInstance.patch<any>(`module/${moduleId}`, {
                order_index: newOrderIndex,
            });
            return this.getData<Module>(response);
        } catch (error) {
            const axiosError = error as AxiosError<any>;
            console.error('Error updating module order:', {
                moduleId,
                newOrderIndex,
                message: axiosError.message,
                status: axiosError.response?.status,
            });
            throw error;
        }
    }

    /**
     * Delete a module
     */
    async deleteModule(moduleId: number): Promise<void> {
        try {
            await this.axiosInstance.delete(`module/${moduleId}`);
        } catch (error) {
            const axiosError = error as AxiosError;
            console.error('Error deleting module:', {
                moduleId,
                message: axiosError.message,
                status: axiosError.response?.status,
            });
            throw error;
        }
    }
}

export const modulesService = new ModulesService();
