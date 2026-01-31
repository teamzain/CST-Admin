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

export interface Quiz {
    id: number;
    course_id?: number;
    module_id?: number;
    title: string;
    passing_score: number;
    order_index: number;
    is_final: boolean;
    time_limit_minutes?: number;
    randomize_questions?: boolean;
    attempts_allowed?: number | null;
    created_at?: string;
    updated_at?: string;
    questions?: Question[];
    _count?: {
        questions?: number;
        attempts?: number;
    };
}

export interface CreateQuizInput {
    title: string;
    passing_score: number;
    is_final?: boolean;
    module_id?: number;
    order_index?: number;
    time_limit_minutes?: number;
    randomize_questions?: boolean;
    attempts_allowed?: number | null;
}

export type UpdateQuizInput = Partial<CreateQuizInput>;

export interface QuizFilters {
    course_id?: number;
    module_id?: number;
    is_final?: boolean;
    search?: string;
}
