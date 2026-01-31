import { courseApi } from '@/api';
import type { Question, CreateQuestionInput, UpdateQuestionInput } from './types';

interface ApiResponse<T> {
    data?: T;
    questions?: Question[];
    question?: Question;
}

export class QuestionsRepository {
    private static extractData<T>(response: ApiResponse<T> | T[] | T): T {
        if (!response) return [] as unknown as T;
        if (Array.isArray(response)) return response as unknown as T;

        const data = response as ApiResponse<T>;
        if (data.data !== undefined) {
            const nested = data.data as ApiResponse<T> | T[] | T;
            if (Array.isArray(nested)) return nested as unknown as T;
            const nestedObj = nested as ApiResponse<T>;
            if (nestedObj.questions !== undefined) return nestedObj.questions as unknown as T;
            if (nestedObj.question !== undefined) return nestedObj.question as unknown as T;
            return nested as T;
        }
        if (data.questions !== undefined) return data.questions as unknown as T;
        if (data.question !== undefined) return data.question as unknown as T;

        return response as T;
    }

    /**
     * Get all questions for a quiz
     */
    static async getByQuiz(quizId: number): Promise<Question[]> {
        const { data } = await courseApi.get(`/quiz/${quizId}/questions`);
        return this.extractData<Question[]>(data);
    }

    /**
     * Create a new question for a quiz
     */
    static async create(quizId: number, input: CreateQuestionInput): Promise<Question> {
        const { data } = await courseApi.post(`/quiz/${quizId}/questions`, input);
        return this.extractData<Question>(data);
    }

    /**
     * Update a question
     */
    static async update(questionId: number, input: UpdateQuestionInput): Promise<Question> {
        const { data } = await courseApi.patch(`/question/${questionId}`, input);
        return this.extractData<Question>(data);
    }

    /**
     * Delete a question
     */
    static async delete(questionId: number): Promise<void> {
        await courseApi.delete(`/question/${questionId}`);
    }

    /**
     * Bulk import questions from file
     */
    static async bulkImport(quizId: number, file: File): Promise<Question[]> {
        const formData = new FormData();
        formData.append('file', file);
        const { data } = await courseApi.post(`/quiz/${quizId}/questions/bulk-import`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return this.extractData<Question[]>(data);
    }
}

export const questionsRepository = new QuestionsRepository();
