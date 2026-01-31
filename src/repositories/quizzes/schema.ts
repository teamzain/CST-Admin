import { z } from 'zod';

export const questionOptionSchema = z.object({
    id: z.number(),
    text: z.string().min(1, 'Option text is required'),
});

export const createQuizSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    passing_score: z.number().min(0).max(100, 'Passing score must be between 0 and 100'),
    is_final: z.boolean().optional(),
    module_id: z.number().optional(),
    order_index: z.number().optional(),
    time_limit_minutes: z.number().min(1).optional(),
    randomize_questions: z.boolean().optional(),
    attempts_allowed: z.number().min(1).nullable().optional(),
});

export const updateQuizSchema = createQuizSchema.partial();

export const quizFiltersSchema = z.object({
    course_id: z.number().optional(),
    module_id: z.number().optional(),
    is_final: z.boolean().optional(),
    search: z.string().optional(),
});

export type CreateQuizSchema = z.infer<typeof createQuizSchema>;
export type UpdateQuizSchema = z.infer<typeof updateQuizSchema>;
export type QuizFiltersSchema = z.infer<typeof quizFiltersSchema>;
