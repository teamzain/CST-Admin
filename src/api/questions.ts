import axios, { AxiosError } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_COURSE_URL || 'http://localhost:3012/api/course';

export interface QuestionOption {
    id: number;
    text: string;
}

export interface Question {
    id: number;
    quiz_id?: number;
    text: string;
    options: QuestionOption[];
    correct_answers: number[];
    order_index: number;
    points: number;
    created_at?: string;
    updated_at?: string;
}

export interface CreateQuestionInput {
    text: string;
    options: QuestionOption[];
    correct_answers: number[];
    points?: number;
    order_index?: number;
}

class QuestionsService {
    private axiosInstance = axios.create({
        baseURL: API_BASE_URL,
    });

    constructor() {
        this.setupInterceptors();
    }

    private setupInterceptors() {
        this.axiosInstance.interceptors.request.use((config) => {
            const token = localStorage.getItem('auth-token') || localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        });

        this.axiosInstance.interceptors.response.use(
            (response) => response,
            (error: AxiosError<Record<string, unknown>>) => {
                console.error('Questions API Error:', {
                    url: error.config?.url,
                    status: error.response?.status,
                    message: error.message,
                    data: error.response?.data,
                });
                return Promise.reject(error);
            }
        );
    }

    private getData<T>(response: unknown): T {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = (response as any)?.data;
        if (!data) return [] as unknown as T;

        if (Array.isArray(data)) return data as unknown as T;

        if (data.data !== undefined) {
            if (Array.isArray(data.data)) return data.data as unknown as T;
            if (data.data.questions !== undefined) return data.data.questions as unknown as T;
            if (data.data.question !== undefined) return data.data.question as unknown as T;
            return data.data as T;
        }

        if (data.questions !== undefined) return data.questions as unknown as T;
        if (data.question !== undefined) return data.question as unknown as T;

        return data as T;
    }

    public getErrorMessage(error: unknown, defaultMessage: string = 'An error occurred'): string {
        if (axios.isAxiosError(error) && error.response?.data) {
            const data = error.response.data as Record<string, unknown>;
            if (typeof data.message === 'string') return data.message;
            if (data.msg && typeof data.msg === 'string') return data.msg;
            if (data.error) return typeof data.error === 'string' ? data.error : JSON.stringify(data.error);
        }
        if (error instanceof Error) return error.message;
        return defaultMessage;
    }

    async createQuestion(quizId: number, data: CreateQuestionInput): Promise<Question> {
        try {
            const response = await this.axiosInstance.post(`quiz/${quizId}/questions`, data);
            return this.getData<Question>(response);
        } catch (error) {
            console.error('Error creating question:', error);
            throw error;
        }
    }

    async getQuestionsByQuiz(quizId: number): Promise<Question[]> {
        try {
            const response = await this.axiosInstance.get(`quiz/${quizId}/questions`);
            return this.getData<Question[]>(response);
        } catch (error) {
            console.error('Error fetching questions:', error);
            throw error;
        }
    }

    async updateQuestion(questionId: number, data: Partial<CreateQuestionInput>): Promise<Question> {
        try {
            const response = await this.axiosInstance.patch(`question/${questionId}`, data);
            return this.getData<Question>(response);
        } catch (error) {
            console.error('Error updating question:', error);
            throw error;
        }
    }

    async deleteQuestion(questionId: number): Promise<void> {
        try {
            await this.axiosInstance.delete(`question/${questionId}`);
        } catch (error) {
            console.error('Error deleting question:', error);
            throw error;
        }
    }

    async bulkImportQuestions(quizId: number, file: File): Promise<Question[]> {
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await this.axiosInstance.post(
                `quiz/${quizId}/questions/bulk-import`,
                formData
            );
            return this.getData<Question[]>(response);
        } catch (error) {
            console.error('Error bulk importing questions:', error);
            throw error;
        }
    }
}

export const questionsService = new QuestionsService();
