import { courseApi } from '@/api';
import { COURSE_ROUTES, buildUrl } from '@/config/routes';
import type { Session, CreateSessionInput, UpdateSessionInput } from './types';
import { CoursesRepository } from '@/repositories/courses/repo';

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
     * Get all sessions across all courses.
     *
     * NOTE: The backend's GET /course/live-sessions endpoint has a route
     * collision with GET /course/:id (ParseIntPipe rejects "live-sessions").
     * Workaround: fetch all courses, then aggregate per-course sessions.
     */
    static async getAll(): Promise<Session[]> {
        try {
            // Try the direct endpoint first (in case backend fixes the collision)
            const { data } = await courseApi.get(COURSE_ROUTES.SESSIONS.GET_ALL.url);
            const result = this.extractData<Session[]>(data);
            return Array.isArray(result) ? result : [];
        } catch (err: any) {
            // If 400 (route collision), fall back to per-course aggregation
            if (err?.response?.status === 400) {
                const courses = await CoursesRepository.getAll();
                const perCourse = await Promise.all(
                    courses.map((c) => this.getByCourse(c.id).catch(() => [] as Session[]))
                );
                return perCourse.flat();
            }
            throw err;
        }
    }

    /**
     * Get all sessions for a specific course
     */
    static async getByCourse(courseId: number): Promise<Session[]> {
        const url = buildUrl(COURSE_ROUTES.SESSIONS.GET_BY_COURSE, { courseId });
        const { data } = await courseApi.get(url);
        const result = this.extractData<Session[]>(data);
        return Array.isArray(result) ? result : [];
    }

    /**
     * Get a single session by ID
     */
    static async getById(sessionId: number): Promise<Session> {
        const url = buildUrl(COURSE_ROUTES.SESSIONS.GET_BY_ID, { sessionId });
        const { data } = await courseApi.get(url);
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

        const url = buildUrl(COURSE_ROUTES.SESSIONS.CREATE, { courseId });
        const { data } = await courseApi.post(url, payload);
        return this.extractData<Session>(data);
    }

    /**
     * Update a session
     */
    static async update(sessionId: number, input: UpdateSessionInput): Promise<Session> {
        const url = buildUrl(COURSE_ROUTES.SESSIONS.UPDATE, { sessionId });
        const { data } = await courseApi.patch(url, input);
        return this.extractData<Session>(data);
    }

    /**
     * Delete a session
     */
    static async delete(sessionId: number): Promise<void> {
        const url = buildUrl(COURSE_ROUTES.SESSIONS.DELETE, { sessionId });
        await courseApi.delete(url);
    }
}

export const sessionsRepository = new SessionsRepository();
