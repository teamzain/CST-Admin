import { z } from 'zod';

export const lessonContentTypeSchema = z.enum(['video', 'pdf', 'text']);

export const createLessonSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    content_type: lessonContentTypeSchema,
    duration_min: z.number().optional(),
    order_index: z.number().optional(),
    description: z.string().optional(),
    content_url: z.string().url().optional().or(z.literal('')),
    pdf_url: z.string().url().optional().or(z.literal('')),
    content_text: z.string().optional(),
    enable_download: z.boolean().optional(),
    module_id: z.number().optional(),
});

export const updateLessonSchema = createLessonSchema.partial();

export const lessonFiltersSchema = z.object({
    course_id: z.number().optional(),
    module_id: z.number().optional(),
    content_type: lessonContentTypeSchema.optional(),
    search: z.string().optional(),
});

export type CreateLessonSchema = z.infer<typeof createLessonSchema>;
export type UpdateLessonSchema = z.infer<typeof updateLessonSchema>;
export type LessonFiltersSchema = z.infer<typeof lessonFiltersSchema>;
