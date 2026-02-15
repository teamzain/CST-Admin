import { courseApi } from '@/api';
import { COURSE_ROUTES, buildUrl } from '@/config/routes';
import type { Quiz, CreateQuizInput, UpdateQuizInput } from './types';
import { CoursesRepository } from '@/repositories/courses/repo';

interface ApiResponse<T> {
    data?: T;
    quizzes?: Quiz[];
    quiz?: Quiz;
}

export class QuizzesRepository {
    private static extractData<T>(response: ApiResponse<T> | T[] | T): T {
        if (!response) return [] as unknown as T;
        if (Array.isArray(response)) return response as unknown as T;

        const data = response as ApiResponse<T>;
        if (data.data !== undefined) {
            const nested = data.data as ApiResponse<T> | T[] | T;
            if (Array.isArray(nested)) return nested as unknown as T;
            const nestedObj = nested as ApiResponse<T>;
            if (nestedObj.quizzes !== undefined) return nestedObj.quizzes as unknown as T;
            if (nestedObj.quiz !== undefined) return nestedObj.quiz as unknown as T;
            return nested as T;
        }
        if (data.quizzes !== undefined) return data.quizzes as unknown as T;
        if (data.quiz !== undefined) return data.quiz as unknown as T;

        return response as T;
    }

    /**
     * Get all quizzes with questions count.
     *
     * NOTE: The backend's GET /course/quizzes endpoint has a route collision
     * with GET /course/:id (ParseIntPipe rejects "quizzes").
     * Workaround: fetch all courses, then aggregate per-course quizzes.
     */
    static async getAll(): Promise<Quiz[]> {
        try {
            // Try direct endpoint first (in case backend fixes the collision)
            const { data } = await courseApi.get(`${COURSE_ROUTES.QUIZZES.GET_ALL.url}?include=questions`);
            return this.extractData<Quiz[]>(data);
        } catch (err: any) {
            // If 400 (route collision), fall back to per-course aggregation
            if (err?.response?.status === 400) {
                const courses = await CoursesRepository.getAll();
                const perCourse = await Promise.all(
                    courses.map((c) => {
                        const url = buildUrl(COURSE_ROUTES.QUIZZES.CREATE, { courseId: c.id });
                        return courseApi.get(`${url}?include=questions`)
                            .then((res) => this.extractData<Quiz[]>(res.data))
                            .catch(() => [] as Quiz[]);
                    })
                );
                return perCourse.flat();
            }
            throw err;
        }
    }

    /**
     * Get a single quiz by ID
     */
    static async getById(quizId: number): Promise<Quiz> {
        const url = buildUrl(COURSE_ROUTES.QUIZZES.GET_BY_ID, { quizId });
        const { data } = await courseApi.get(url);
        return this.extractData<Quiz>(data);
    }

    /**
     * Create a new quiz for a course
     */
    static async create(courseId: number, input: CreateQuizInput): Promise<Quiz> {
        const url = buildUrl(COURSE_ROUTES.QUIZZES.CREATE, { courseId });
        const { data } = await courseApi.post(url, input);
        return this.extractData<Quiz>(data);
    }

    /**
     * Update a quiz
     */
    static async update(quizId: number, input: UpdateQuizInput): Promise<Quiz> {
        const url = buildUrl(COURSE_ROUTES.QUIZZES.UPDATE, { quizId });
        const { data } = await courseApi.patch(url, input);
        return this.extractData<Quiz>(data);
    }

    /**
     * Delete a quiz
     */
    static async delete(quizId: number): Promise<void> {
        const url = buildUrl(COURSE_ROUTES.QUIZZES.DELETE, { quizId });
        await courseApi.delete(url);
    }
}

export const quizzesRepository = new QuizzesRepository();
