import { courseApi } from '@/api';
import type { Quiz, CreateQuizInput, UpdateQuizInput } from './types';

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
     * Get all quizzes with questions count
     */
    static async getAll(): Promise<Quiz[]> {
        // Request questions to be included so we can show the count
        const { data } = await courseApi.get('/quizzes?include=questions');
        return this.extractData<Quiz[]>(data);
    }

    /**
     * Get a single quiz by ID
     */
    static async getById(quizId: number): Promise<Quiz> {
        const { data } = await courseApi.get(`/quiz/${quizId}`);
        return this.extractData<Quiz>(data);
    }

    /**
     * Create a new quiz for a course
     */
    static async create(courseId: number, input: CreateQuizInput): Promise<Quiz> {
        const { data } = await courseApi.post(`/${courseId}/quizzes`, input);
        return this.extractData<Quiz>(data);
    }

    /**
     * Update a quiz
     */
    static async update(quizId: number, input: UpdateQuizInput): Promise<Quiz> {
        const { data } = await courseApi.patch(`/quiz/${quizId}`, input);
        return this.extractData<Quiz>(data);
    }

    /**
     * Delete a quiz
     */
    static async delete(quizId: number): Promise<void> {
        await courseApi.delete(`/quiz/${quizId}`);
    }
}

export const quizzesRepository = new QuizzesRepository();
