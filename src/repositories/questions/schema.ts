import { z } from 'zod';

export const questionOptionSchema = z.object({
    id: z.number(),
    text: z.string().min(1, 'Option text is required'),
});

export const createQuestionSchema = z.object({
    text: z.string().min(1, 'Question text is required'),
    options: z.array(questionOptionSchema).min(2, 'At least 2 options required'),
    correct_answers: z.array(z.number()).min(1, 'At least 1 correct answer required'),
    points: z.number().min(1).optional(),
    order_index: z.number().optional(),
});

export const updateQuestionSchema = createQuestionSchema.partial();

export type CreateQuestionSchema = z.infer<typeof createQuestionSchema>;
export type UpdateQuestionSchema = z.infer<typeof updateQuestionSchema>;
