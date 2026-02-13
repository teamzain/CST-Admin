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

    // ── Enroll ──────────────────────────────────────────────────────────────

    /**
     * Admin/Instructor enrolls a user into a course
     */
    static async enroll(courseId: number, input: EnrollUserInput): Promise<Enrollment> {
        const { data } = await courseApi.post(`/course/${courseId}/enroll`, input);
        return this.extractData<Enrollment>(data);
    }

    /**
     * Student self-enrolls into a course
     */
    static async selfEnroll(courseId: number): Promise<Enrollment> {
        const { data } = await courseApi.post(`/course/${courseId}/self-enroll`);
        return this.extractData<Enrollment>(data);
    }

    // ── Read ────────────────────────────────────────────────────────────────

    /**
     * Get all enrollments across all courses (Admin) — with optional filters
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

        const { data } = await courseApi.get('/course/enrollments/all', { params });

        // If response is paginated wrapper keep it, otherwise wrap
        const raw = data?.data ?? data;
        if (raw && typeof raw === 'object' && 'data' in raw && 'total' in raw) {
            return raw as PaginatedEnrollments;
        }
        // Fallback: plain array
        const list = Array.isArray(raw) ? raw : [];
        return { data: list, total: list.length, page: 1, limit: list.length, totalPages: 1 };
    }

    /**
     * Get enrollments for a specific course (Admin/Instructor)
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

        const { data } = await courseApi.get(`/course/${courseId}/enrollments`, { params });

        const raw = data?.data ?? data;
        if (raw && typeof raw === 'object' && 'data' in raw && 'total' in raw) {
            return raw as PaginatedEnrollments;
        }
        const list = Array.isArray(raw) ? raw : [];
        return { data: list, total: list.length, page: 1, limit: list.length, totalPages: 1 };
    }

    /**
     * Get enrollment statistics for a course
     */
    static async getStatsByCourse(courseId: number): Promise<EnrollmentStats> {
        const { data } = await courseApi.get(`/course/${courseId}/enrollments/stats`);
        return (data?.data ?? data) as EnrollmentStats;
    }

    /**
     * Get a single enrollment by ID
     */
    static async getById(enrollmentId: number): Promise<Enrollment> {
        const { data } = await courseApi.get(`/course/enrollments/${enrollmentId}`);
        return this.extractData<Enrollment>(data);
    }

    /**
     * Get the logged-in student's own enrollments
     */
    static async getMine(filters?: Pick<EnrollmentFilters, 'page' | 'limit' | 'status'>): Promise<PaginatedEnrollments> {
        const params = new URLSearchParams();
        if (filters?.page) params.append('page', String(filters.page));
        if (filters?.limit) params.append('limit', String(filters.limit));
        if (filters?.status) params.append('status', filters.status);

        const { data } = await courseApi.get('/course/my/enrollments', { params });

        const raw = data?.data ?? data;
        if (raw && typeof raw === 'object' && 'data' in raw && 'total' in raw) {
            return raw as PaginatedEnrollments;
        }
        const list = Array.isArray(raw) ? raw : [];
        return { data: list, total: list.length, page: 1, limit: list.length, totalPages: 1 };
    }

    /**
     * Get enrollments for a specific user (Admin/Instructor/Employer)
     */
    static async getByUser(
        userId: number,
        filters?: Pick<EnrollmentFilters, 'page' | 'limit' | 'status'>,
    ): Promise<PaginatedEnrollments> {
        const params = new URLSearchParams();
        if (filters?.page) params.append('page', String(filters.page));
        if (filters?.limit) params.append('limit', String(filters.limit));
        if (filters?.status) params.append('status', filters.status);

        const { data } = await courseApi.get(`/course/users/${userId}/enrollments`, { params });

        const raw = data?.data ?? data;
        if (raw && typeof raw === 'object' && 'data' in raw && 'total' in raw) {
            return raw as PaginatedEnrollments;
        }
        const list = Array.isArray(raw) ? raw : [];
        return { data: list, total: list.length, page: 1, limit: list.length, totalPages: 1 };
    }

    // ── Update ──────────────────────────────────────────────────────────────

    /**
     * Update an enrollment (status, session_id, etc.)
     */
    static async update(enrollmentId: number, input: UpdateEnrollmentInput): Promise<Enrollment> {
        const { data } = await courseApi.patch(`/course/enrollments/${enrollmentId}`, input);
        return this.extractData<Enrollment>(data);
    }

    // ── Delete ──────────────────────────────────────────────────────────────

    /**
     * Delete an enrollment by ID (Admin only)
     */
    static async delete(enrollmentId: number): Promise<void> {
        await courseApi.delete(`/course/enrollments/${enrollmentId}`);
    }

    /**
     * Delete an enrollment by course + user (Admin only)
     */
    static async deleteByCourseAndUser(courseId: number, userId: number): Promise<void> {
        await courseApi.delete(`/course/${courseId}/enrollments/${userId}`);
    }
}
