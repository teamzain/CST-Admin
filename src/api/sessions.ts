import axios, { AxiosError } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_COURSE_URL || 'http://localhost:3012/api/course';

export interface Session {
    id: number;
    title: string;
    start_time: string;
    end_time: string;
    capacity: number;
    order_index?: number;
    location?: string;
    session_type: 'LIVE' | 'PHYSICAL';
    google_event_id?: string;
    meeting_url?: string;
    reminder_sent?: boolean;
    created_at?: string;
    course_id?: number;
    module_id?: number;
}

export interface CreateSessionInput {
    title: string;
    start_time: string;
    end_time: string;
    capacity: number;
    session_type: 'LIVE' | 'PHYSICAL';
    location?: string;
    meeting_url?: string;
    module_id?: number;
}

class SessionsService {
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
            return config;
        });

        this.axiosInstance.interceptors.response.use(
            (response) => response,
            (error: AxiosError<Record<string, unknown>>) => {
                console.error('Sessions API Error:', {
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
            if (data.data.sessions !== undefined) return data.data.sessions as unknown as T;
            if (data.data.session !== undefined) return data.data.session as unknown as T;
            return data.data as T;
        }

        if (data.sessions !== undefined) return data.sessions as unknown as T;
        if (data.session !== undefined) return data.session as unknown as T;

        return data as T;
    }

    /**
     * Get all sessions across all courses
     * Backend endpoint: GET /api/course/live-sessions
     */
    async getAllSessions(): Promise<Session[]> {
        try {
            const response = await this.axiosInstance.get<Record<string, unknown>>('/live-sessions');
            const data = this.getData<Session[]>(response);
            return Array.isArray(data) ? data : [];
        } catch (error) {
            const axiosError = error as AxiosError;
            console.error('Error fetching all sessions:', {
                message: axiosError.message,
                status: axiosError.response?.status,
            });
            throw error;
        }
    }

    /**
     * Get all sessions for a specific course
     * Backend endpoint: GET /api/course/{courseId}/live-sessions
     */
    async getSessionsByCourse(courseId: number): Promise<Session[]> {
        try {
            const response = await this.axiosInstance.get<Record<string, unknown>>(`/${courseId}/live-sessions`);
            const data = this.getData<Session[]>(response);
            return Array.isArray(data) ? data : [];
        } catch (error) {
            const axiosError = error as AxiosError;
            console.error('Error fetching sessions for course:', {
                courseId,
                message: axiosError.message,
                status: axiosError.response?.status,
            });
            throw error;
        }
    }

    /**
     * Get a single session by ID
     * Backend endpoint: GET /api/course/live-sessions/{sessionId}
     */
    async getSessionById(sessionId: number): Promise<Session> {
        try {
            const response = await this.axiosInstance.get<Record<string, unknown>>(`/live-sessions/${sessionId}`);
            return this.getData<Session>(response);
        } catch (error) {
            const axiosError = error as AxiosError;
            console.error('Error fetching session:', {
                sessionId,
                message: axiosError.message,
                status: axiosError.response?.status,
            });
            throw error;
        }
    }

    /**
     * Create a new session for a course
     * Backend endpoint: POST /api/course/{courseId}/live-sessions
     */
    async createSessionForCourse(courseId: number, data: CreateSessionInput): Promise<Session> {
        try {
            const payload = {
                title: data.title,
                start_time: data.start_time,
                end_time: data.end_time,
                capacity: data.capacity,
                session_type: data.session_type,
                ...(data.location && { location: data.location }),
                ...(data.meeting_url && { meeting_url: data.meeting_url }),
                ...(data.module_id && { module_id: data.module_id }),
            };

            console.log('Creating session with payload:', { courseId, ...payload });
            const response = await this.axiosInstance.post<Record<string, unknown>>(`/${courseId}/live-sessions`, payload);
            return this.getData<Session>(response);
        } catch (error) {
            const axiosError = error as AxiosError<Record<string, unknown>>;
            console.error('Error creating session:', {
                courseId,
                message: axiosError.message,
                status: axiosError.response?.status,
                data: axiosError.response?.data,
            });
            throw error;
        }
    }

    /**
     * Update a session
     * Backend endpoint: PATCH /api/course/live-sessions/{sessionId}
     */
    async updateSession(sessionId: number, data: Partial<CreateSessionInput>): Promise<Session> {
        try {
            const response = await this.axiosInstance.patch<Record<string, unknown>>(`/live-sessions/${sessionId}`, data);
            return this.getData<Session>(response);
        } catch (error) {
            const axiosError = error as AxiosError<Record<string, unknown>>;
            console.error('Error updating session:', {
                sessionId,
                message: axiosError.message,
                status: axiosError.response?.status,
                data: axiosError.response?.data,
            });
            throw error;
        }
    }

    /**
     * Delete a session
     * Backend endpoint: DELETE /api/course/live-sessions/{sessionId}
     */
    async deleteSession(sessionId: number): Promise<void> {
        try {
            await this.axiosInstance.delete(`/live-sessions/${sessionId}`);
        } catch (error) {
            const axiosError = error as AxiosError;
            console.error('Error deleting session:', {
                sessionId,
                message: axiosError.message,
                status: axiosError.response?.status,
            });
            throw error;
        }
    }

    /**
     * Extract error message from API response
     */
    public getErrorMessage(error: unknown, defaultMessage: string = 'An error occurred'): string {
        if (axios.isAxiosError(error) && error.response?.data) {
            const data = error.response.data as Record<string, unknown>;
            if (typeof data.message === 'string') return data.message;
            if (Array.isArray(data.message)) return data.message.join(', ');
            if (data.msg) return String(data.msg);
            if (data.error) return typeof data.error === 'string' ? data.error : JSON.stringify(data.error);
            if (data.errors && Array.isArray(data.errors)) {
                return data.errors
                    .map((e: unknown) => (typeof e === 'object' && e !== null ? (e as Record<string, unknown>).message || e : e))
                    .join(', ');
            }
            if (typeof data === 'string') return data;
        }
        if (axios.isAxiosError(error)) {
            return error.message || defaultMessage;
        }
        return defaultMessage;
    }
}

export const sessionsService = new SessionsService();
