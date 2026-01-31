import { courseApi } from '@/api';
import type { Course, CreateCourseInput, UpdateCourseInput, CourseFilters } from './types';

interface ApiResponse<T> {
    data?: T;
    courses?: Course[];
    course?: Course;
}

export class CoursesRepository {
    private static extractData<T>(response: ApiResponse<T> | T[] | T): T {
        if (!response) return [] as unknown as T;
        if (Array.isArray(response)) return response as unknown as T;

        const data = response as ApiResponse<T>;
        if (data.data !== undefined) {
            const nested = data.data as ApiResponse<T> | T[] | T;
            if (Array.isArray(nested)) return nested as unknown as T;
            const nestedObj = nested as ApiResponse<T>;
            if (nestedObj.courses !== undefined) return nestedObj.courses as unknown as T;
            if (nestedObj.course !== undefined) return nestedObj.course as unknown as T;
            return nested as T;
        }
        if (data.courses !== undefined) return data.courses as unknown as T;
        if (data.course !== undefined) return data.course as unknown as T;

        return response as T;
    }

    static async getAll(filters?: CourseFilters): Promise<Course[]> {
        const params = new URLSearchParams();
        if (filters?.search) params.append('search', filters.search);
        if (filters?.is_active !== undefined) params.append('is_active', String(filters.is_active));
        if (filters?.training_type) params.append('training_type', filters.training_type);
        if (filters?.delivery_mode) params.append('delivery_mode', filters.delivery_mode);
        if (filters?.instructorId) params.append('instructorId', String(filters.instructorId));
        if (filters?.state_id) params.append('state_id', String(filters.state_id));

        const { data } = await courseApi.get('/course', { params });
        return this.extractData<Course[]>(data);
    }

    static async getById(id: number): Promise<Course> {
        const { data } = await courseApi.get(`/course/${id}`);
        return this.extractData<Course>(data);
    }

    static async create(input: CreateCourseInput): Promise<Course> {
        const { data } = await courseApi.post('/course', input);
        return this.extractData<Course>(data);
    }

    static async update(id: number, input: UpdateCourseInput): Promise<Course> {
        const { data } = await courseApi.patch(`/course/${id}`, input);
        return this.extractData<Course>(data);
    }

    static async delete(id: number): Promise<void> {
        await courseApi.delete(`/course/${id}`);
    }

    static async permanentDelete(id: number): Promise<void> {
        await courseApi.delete(`/course/${id}/permanent`);
    }

    static async publish(id: number): Promise<Course> {
        return this.update(id, { is_active: true });
    }

    static async unpublish(id: number): Promise<Course> {
        return this.update(id, { is_active: false });
    }
}

export const coursesRepository = new CoursesRepository();
