import axios, { AxiosError } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_COURSE_URL || 'http://localhost:3012/api/course';

export interface Lesson {
    id: number;
    title: string;
    content_type: 'video' | 'pdf' | 'text';
    duration_min?: number;
    order_index: number;
    description?: string;
    content_url?: string;
    pdf_url?: string;
    content_text?: string;
    enable_download?: boolean;
    course_id?: number;
    module_id?: number;
    bunny_video_id?: string;
    bunny_library_id?: number;
    bunny_collection_id?: string;
    video_status?: string;
    thumbnail_url?: string;
    video_length?: number;
    course?: {
        id: number;
        title: string;
    };
    module?: {
        id: number;
        title: string;
    };
}

class LessonsService {
    private axiosInstance = axios.create({
        baseURL: API_BASE_URL,
    });

    constructor() {
        this.setupInterceptors();
    }

    private setupInterceptors() {
        this.axiosInstance.interceptors.request.use((config) => {
            const token = localStorage.getItem('token') || import.meta.env.VITE_ADMIN_TOKEN;
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            console.log(`Lessons API Request [${config.method?.toUpperCase()}]:`, config.url, config.data);
            return config;
        });

        this.axiosInstance.interceptors.response.use(
            (response) => response,
            (error: AxiosError<any>) => {
                console.error('Lessons API Error:', {
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
            if (data.data.lessons !== undefined) return data.data.lessons as unknown as T;
            if (data.data.lesson !== undefined) return data.data.lesson as unknown as T;
            return data.data as T;
        }

        if (data.lessons !== undefined) return data.lessons as unknown as T;
        if (data.lesson !== undefined) return data.lesson as unknown as T;

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

    async getAllLessons(): Promise<Lesson[]> {
        try {
            const response = await this.axiosInstance.get<any>('lessons/all');
            return this.getData<Lesson[]>(response);
        } catch (error) {
            console.error('Error fetching all lessons:', error);
            throw error;
        }
    }

    async getLessonById(lessonId: number): Promise<Lesson> {
        try {
            const response = await this.axiosInstance.get<any>(`lesson/${lessonId}`);
            return this.getData<Lesson>(response);
        } catch (error) {
            console.error('Error fetching lesson:', error);
            throw error;
        }
    }

    async createLesson(courseId: number, data: any): Promise<Lesson> {
        try {
            const response = await this.axiosInstance.post<any>(`${courseId}/lessons`, data);
            return this.getData<Lesson>(response);
        } catch (error) {
            console.error('Error creating lesson:', error);
            throw error;
        }
    }

    async updateLesson(lessonId: number, data: Partial<Lesson>): Promise<Lesson> {
        try {
            const response = await this.axiosInstance.patch<any>(`lesson/${lessonId}`, data);
            return this.getData<Lesson>(response);
        } catch (error) {
            console.error('Error updating lesson:', error);
            throw error;
        }
    }

    async deleteLesson(lessonId: number): Promise<void> {
        try {
            await this.axiosInstance.delete(`lesson/${lessonId}`);
        } catch (error) {
            console.error('Error deleting lesson:', error);
            throw error;
        }
    }

    async replaceVideo(lessonId: number, videoFile: File): Promise<Lesson> {
        try {
            const formData = new FormData();
            formData.append('video', videoFile);
            const response = await this.axiosInstance.patch<any>(`lesson/${lessonId}/video`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return this.getData<Lesson>(response);
        } catch (error) {
            console.error('Error replacing lesson video:', error);
            throw error;
        }
    }

    async deleteBunnyVideo(libraryId: number, videoId: string): Promise<void> {
        try {
            const apiKey = import.meta.env.VITE_BUNNY_API_KEY;
            if (!apiKey) throw new Error('Bunny API Key not found in environment');

            const streamUrl = import.meta.env.VITE_BUNNY_STREAM_URL;

            await axios.delete(`${streamUrl}${libraryId}/videos/${videoId}`, {
                headers: {
                    'AccessKey': apiKey,
                    'accept': 'application/json',
                },
            });
        } catch (error) {
            console.error('Error deleting video from Bunny Stream:', error);
            throw error;
        }
    }
}

export const lessonsService = new LessonsService();
