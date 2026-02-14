import { courseApi } from '@/api';
import type {
    Enrollment,
    EnrollmentStats,
    PaginatedEnrollments,
    EnrollUserInput,
    UpdateEnrollmentInput,
    EnrollmentFilters,
} from './types';

interface ApiResponse<T> {
    data?: T;
    enrollment?: Enrollment;
    enrollments?: Enrollment[];
}

/**
 * Enrollment repository — admin-facing endpoints only.
 *
 * `courseApi` baseURL already includes `/api/course`, so every path here is
 * relative to that prefix (e.g. `/enrollments/all` → `<base>/enrollments/all`).
 */
export class EnrollmentsRepository {
    private static extractData<T>(response: ApiResponse<T> | T[] | T): T {
        if (!response) return [] as unknown as T;
        if (Array.isArray(response)) return response as unknown as T;

        const data = response as ApiResponse<T>;
        if (data.data !== undefined) {
            const nested = data.data as ApiResponse<T> | T[] | T;
            if (Array.isArray(nested)) return nested as unknown as T;
            const nestedObj = nested as ApiResponse<T>;
            if (nestedObj.enrollments !== undefined) return nestedObj.enrollments as unknown as T;
            if (nestedObj.enrollment !== undefined) return nestedObj.enrollment as unknown as T;
            return nested as T;
        }
        if (data.enrollments !== undefined) return data.enrollments as unknown as T;
        if (data.enrollment !== undefined) return data.enrollment as unknown as T;

        return response as T;
    }

    /**
     * Normalise a single enrollment object from the API.
     * The backend returns camelCase fields (startedAt, completedAt, seatTimeMin …)
     * but the frontend types / UI use snake_case (started_at, completed_at, seat_time_min …).
     */
    private static normaliseEnrollment(raw: any): Enrollment {
        if (!raw || typeof raw !== 'object') return raw;
        return {
            ...raw,
            // Map camelCase → snake_case (keep existing snake_case if already present)
            user_id:        raw.user_id        ?? raw.userId       ?? raw.user?.id,
            course_id:      raw.course_id      ?? raw.courseId     ?? raw.course?.id,
            started_at:     raw.started_at     ?? raw.startedAt    ?? '',
            completed_at:   raw.completed_at   ?? raw.completedAt  ?? null,
            seat_time_min:  raw.seat_time_min  ?? raw.seatTimeMin  ?? 0,
            last_activity:  raw.last_activity  ?? raw.lastActivity ?? null,
            created_at:     raw.created_at     ?? raw.createdAt,
            updated_at:     raw.updated_at     ?? raw.updatedAt,
            session_id:     raw.session_id     ?? raw.sessionId    ?? null,
        } as Enrollment;
    }

    /**
     * Helper: normalise any paginated response shape into PaginatedEnrollments.
     *
     * The backend may return the array under `data`, `enrollments`, or at the top level.
     */
    private static toPaginated(data: any): PaginatedEnrollments {
        const raw = data?.data ?? data;

        // Detect paginated wrapper — the backend uses { enrollments, total, … }
        let list: any[];
        let meta: { total: number; page: number; limit: number; totalPages: number };

        if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
            const items = raw.data ?? raw.enrollments;
            if (Array.isArray(items) && 'total' in raw) {
                list = items;
                meta = { total: raw.total, page: raw.page ?? 1, limit: raw.limit ?? list.length, totalPages: raw.totalPages ?? 1 };
            } else {
                list = Array.isArray(items) ? items : [];
                meta = { total: list.length, page: 1, limit: list.length, totalPages: 1 };
            }
        } else {
            list = Array.isArray(raw) ? raw : [];
            meta = { total: list.length, page: 1, limit: list.length, totalPages: 1 };
        }

        return { data: list.map((e) => this.normaliseEnrollment(e)), ...meta };
    }

    // ── Enroll ──────────────────────────────────────────────────────────────

    /**
     * Admin/Instructor enrolls a user into a course
     * POST /api/course/{courseId}/enroll  body: { userId }
     */
    static async enroll(courseId: number, input: EnrollUserInput): Promise<Enrollment> {
        const { data } = await courseApi.post(`/${courseId}/enroll`, input);
        return this.normaliseEnrollment(this.extractData<Enrollment>(data));
    }

    // ── Read ────────────────────────────────────────────────────────────────

    /**
     * Get all enrollments across all courses (Admin) — with optional filters
     * GET /api/course/enrollments/all?status=…&page=…&limit=…&sortBy=…&sortOrder=…
     */
    static async getAll(filters?: EnrollmentFilters): Promise<PaginatedEnrollments> {
        const params = new URLSearchParams();

        if (filters?.page) params.append('page', String(filters.page));
        if (filters?.limit) params.append('limit', String(filters.limit));
        if (filters?.status) params.append('status', filters.status);
        if (filters?.courseId) params.append('courseId', String(filters.courseId));
        if (filters?.userId) params.append('userId', String(filters.userId));
        if (filters?.training_type) params.append('training_type', filters.training_type);
        if (filters?.search) params.append('search', filters.search);
        if (filters?.sortBy) params.append('sortBy', filters.sortBy);
        if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);

        const { data } = await courseApi.get('/enrollments/all', { params });
        return this.toPaginated(data);
    }

    /**
     * Get enrollments for a specific course (Admin/Instructor)
     * GET /api/course/{courseId}/enrollments
     */
    static async getByCourse(
        courseId: number,
        filters?: Omit<EnrollmentFilters, 'courseId'>,
    ): Promise<PaginatedEnrollments> {
        const params = new URLSearchParams();

        if (filters?.page) params.append('page', String(filters.page));
        if (filters?.limit) params.append('limit', String(filters.limit));
        if (filters?.status) params.append('status', filters.status);
        if (filters?.search) params.append('search', filters.search);
        if (filters?.sortBy) params.append('sortBy', filters.sortBy);
        if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);

        const { data } = await courseApi.get(`/${courseId}/enrollments`, { params });
        return this.toPaginated(data);
    }

    /**
     * Get enrollment statistics for a course
     * GET /api/course/{courseId}/enrollments/stats
     */
    static async getStatsByCourse(courseId: number): Promise<EnrollmentStats> {
        const { data } = await courseApi.get(`/${courseId}/enrollments/stats`);
        return (data?.data ?? data) as EnrollmentStats;
    }

    /**
     * Get a single enrollment by ID
     * GET /api/course/enrollments/{enrollmentId}
     */
    static async getById(enrollmentId: number): Promise<Enrollment> {
        const { data } = await courseApi.get(`/enrollments/${enrollmentId}`);
        return this.normaliseEnrollment(this.extractData<Enrollment>(data));
    }

    /**
     * Get enrollments for a specific user (Admin/Instructor/Employer)
     * GET /api/course/users/{userId}/enrollments
     */
    static async getByUser(
        userId: number,
        filters?: Pick<EnrollmentFilters, 'page' | 'limit' | 'status'>,
    ): Promise<PaginatedEnrollments> {
        const params = new URLSearchParams();
        if (filters?.page) params.append('page', String(filters.page));
        if (filters?.limit) params.append('limit', String(filters.limit));
        if (filters?.status) params.append('status', filters.status);

        const { data } = await courseApi.get(`/users/${userId}/enrollments`, { params });
        return this.toPaginated(data);
    }

    // ── Update ──────────────────────────────────────────────────────────────

    /**
     * Update an enrollment (status, session_id, progress, etc.)
     * PATCH /api/course/enrollments/{enrollmentId}  body: { status?, session_id?, progress? }
     */
    static async update(enrollmentId: number, input: UpdateEnrollmentInput): Promise<Enrollment> {
        const { data } = await courseApi.patch(`/enrollments/${enrollmentId}`, input);
        return this.normaliseEnrollment(this.extractData<Enrollment>(data));
    }

    // ── Delete ──────────────────────────────────────────────────────────────

    /**
     * Delete an enrollment by ID (Admin only)
     * DELETE /api/course/enrollments/{enrollmentId}
     */
    static async delete(enrollmentId: number): Promise<void> {
        await courseApi.delete(`/enrollments/${enrollmentId}`);
    }

    /**
     * Delete an enrollment by course + user (Admin only)
     * DELETE /api/course/{courseId}/enrollments/{userId}
     */
    static async deleteByCourseAndUser(courseId: number, userId: number): Promise<void> {
        await courseApi.delete(`/${courseId}/enrollments/${userId}`);
    }
}
