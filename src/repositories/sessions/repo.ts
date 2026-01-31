import { courseApi } from '@/api';
import type { Session, CreateSessionInput, UpdateSessionInput } from './types';

interface ApiResponse<T> {
    data?: T;
    sessions?: Session[];
    session?: Session;
}

export class SessionsRepository {
    private static extractData<T>(response: ApiResponse<T> | T[] | T): T {
        if (!response) return [] as unknown as T;
        if (Array.isArray(response)) return response as unknown as T;

        const data = response as ApiResponse<T>;
        if (data.data !== undefined) {
            const nested = data.data as ApiResponse<T> | T[] | T;
            if (Array.isArray(nested)) return nested as unknown as T;
            const nestedObj = nested as ApiResponse<T>;
            if (nestedObj.sessions !== undefined) return nestedObj.sessions as unknown as T;
            if (nestedObj.session !== undefined) return nestedObj.session as unknown as T;
            return nested as T;
        }
        if (data.sessions !== undefined) return data.sessions as unknown as T;
        if (data.session !== undefined) return data.session as unknown as T;

        return response as T;
    }

    /**
     * Get all sessions across all courses
     */
    static async getAll(): Promise<Session[]> {
        const { data } = await courseApi.get('/live-sessions');
        const result = this.extractData<Session[]>(data);
        return Array.isArray(result) ? result : [];
    }

    /**
     * Get all sessions for a specific course
     */
    static async getByCourse(courseId: number): Promise<Session[]> {
        const { data } = await courseApi.get(`/${courseId}/live-sessions`);
        const result = this.extractData<Session[]>(data);
        return Array.isArray(result) ? result : [];
    }

    /**
     * Get a single session by ID
     */
    static async getById(sessionId: number): Promise<Session> {
        const { data } = await courseApi.get(`/live-sessions/${sessionId}`);
        return this.extractData<Session>(data);
    }

    /**
     * Create a new session for a course
     */
    static async create(courseId: number, input: CreateSessionInput): Promise<Session> {
        const payload = {
            title: input.title,
            start_time: input.start_time,
            end_time: input.end_time,
            capacity: input.capacity,
            session_type: input.session_type,
            ...(input.location && { location: input.location }),
            ...(input.meeting_url && { meeting_url: input.meeting_url }),
            ...(input.module_id && { module_id: input.module_id }),
            ...(input.order_index !== undefined && { order_index: input.order_index }),
        };

        const { data } = await courseApi.post(`/${courseId}/live-sessions`, payload);
        return this.extractData<Session>(data);
    }

    /**
     * Update a session
     */
    static async update(sessionId: number, input: UpdateSessionInput): Promise<Session> {
        const { data } = await courseApi.patch(`/live-sessions/${sessionId}`, input);
        return this.extractData<Session>(data);
    }

    /**
     * Delete a session
     */
    static async delete(sessionId: number): Promise<void> {
        await courseApi.delete(`/live-sessions/${sessionId}`);
    }
}

export const sessionsRepository = new SessionsRepository();
