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

export type UpdateQuestionInput = Partial<CreateQuestionInput>;
