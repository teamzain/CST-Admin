import axios, { AxiosError } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_ADMIN_URL || 'http://localhost:3009/api/admin';

export enum TRAINING_TYPE {
    UNARMED = 'UNARMED',
    ARMED = 'ARMED',
    REFRESHER = 'REFRESHER',
}

export enum DELIVERY_MODE {
    ONLINE = 'ONLINE',
    IN_PERSON = 'IN_PERSON',
    HYBRID = 'HYBRID',
}

export interface CreateCourseInput {
    title: string;
    description: string;
    duration_hours: number;
    required_hours: number;
    training_type: TRAINING_TYPE;
    delivery_mode: DELIVERY_MODE;
    thumbnail?: string;
    price: number;
    state?: string;
    location?: string;
    requires_exam: boolean;
    requires_range: boolean;
    attendance_required: boolean;
    attendance_enabled: boolean;
    requires_id_verification: boolean;
    is_refresher: boolean;
    is_price_negotiable: boolean;
    pre_requirements: string[];
    certificate_template?: string;
}

export interface CourseFilters {
    search?: string;
    is_active?: boolean;
    training_type?: TRAINING_TYPE;
    delivery_mode?: DELIVERY_MODE;
    instructorId?: number;
    state_id?: number;
}

export interface Course extends CreateCourseInput {
    id: number;
    state_id?: number;
    instructor_id?: number;
    is_active: boolean;
    published_at?: Date;
    created_at: Date;
    updated_at: Date;
}

class CoursesService {
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

    private getData<T>(response: any): T {
        // Handle nested data structures from API
        const data = response?.data;
        if (!data) return [] as unknown as T;

        // If data is the array itself
        if (Array.isArray(data)) return data as unknown as T;

        // Check for common wrappers
        if (data.data !== undefined) {
            // If data.data is the array
            if (Array.isArray(data.data)) return data.data as unknown as T;
            // If data.data contains the array
            if (data.data.courses !== undefined) return data.data.courses as unknown as T;
            if (data.data.course !== undefined) return data.data.course as unknown as T;
            return data.data as T;
        }

        if (data.courses !== undefined) return data.courses as unknown as T;
        if (data.course !== undefined) return data.course as unknown as T;

        return data as T;
    }

    async getAllCourses(filters?: CourseFilters): Promise<Course[]> {
        try {
            const params = new URLSearchParams();

            if (filters?.search) params.append('search', filters.search);
            if (filters?.is_active !== undefined) params.append('is_active', String(filters.is_active));
            if (filters?.training_type) params.append('training_type', filters.training_type);
            if (filters?.delivery_mode) params.append('delivery_mode', filters.delivery_mode);
            if (filters?.instructorId) params.append('instructorId', String(filters.instructorId));
            if (filters?.state_id) params.append('state_id', String(filters.state_id));

            const response = await this.axiosInstance.get('/course', { params });
            return this.getData<Course[]>(response);
        } catch (error) {
            const axiosError = error as AxiosError;
            console.error('Error fetching courses:', axiosError.message);
            throw error;
        }
    }

    async getCourseById(id: number): Promise<Course> {
        try {
            const response = await this.axiosInstance.get(`/course/${id}`);
            return this.getData<Course>(response);
        } catch (error) {
            const axiosError = error as AxiosError;
            console.error('Error fetching course:', axiosError.message);
            throw error;
        }
    }

    async createCourse(data: CreateCourseInput): Promise<Course> {
        try {
            const response = await this.axiosInstance.post('/course', data);
            return this.getData<Course>(response);
        } catch (error) {
            const axiosError = error as AxiosError<unknown>;
            console.error('Error creating course:', {
                message: axiosError.message,
                status: axiosError.response?.status,
                statusText: axiosError.response?.statusText,
                data: axiosError.response?.data,
                sent: data,
            });
            throw error;
        }
    }

    async updateCourse(id: number, data: Partial<CreateCourseInput>): Promise<Course> {
        try {
            const response = await this.axiosInstance.patch(`/course/${id}`, data);
            return this.getData<Course>(response);
        } catch (error) {
            const axiosError = error as AxiosError;
            console.error('Error updating course:', axiosError.message);
            throw error;
        }
    }

    async deleteCourse(id: number): Promise<void> {
        try {
            await this.axiosInstance.delete(`/course/${id}`);
        } catch (error) {
            const axiosError = error as AxiosError;
            console.error('Error deleting course:', axiosError.message);
            throw error;
        }
    }

    async permanentDeleteCourse(id: number): Promise<void> {
        try {
            await this.axiosInstance.delete(`/course/${id}/permanent`);
        } catch (error) {
            const axiosError = error as AxiosError;
            console.error('Error permanently deleting course:', axiosError.message);
            throw error;
        }
    }

    async publishCourse(id: number): Promise<Course> {
        return this.updateCourse(id, { is_active: true } as any);
    }

    async unpublishCourse(id: number): Promise<Course> {
        return this.updateCourse(id, { is_active: false } as any);
    }
}

export const coursesService = new CoursesService();
