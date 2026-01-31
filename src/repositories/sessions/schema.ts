import { z } from 'zod';

export const sessionTypeSchema = z.enum(['LIVE', 'PHYSICAL']);

export const createSessionSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    start_time: z.string().min(1, 'Start time is required'),
    end_time: z.string().min(1, 'End time is required'),
    capacity: z.number().min(1, 'Capacity must be at least 1'),
    session_type: sessionTypeSchema,
    location: z.string().optional(),
    meeting_url: z.string().url().optional().or(z.literal('')),
    module_id: z.number().optional(),
    order_index: z.number().optional(),
});

export const updateSessionSchema = createSessionSchema.partial();

export const sessionFiltersSchema = z.object({
    course_id: z.number().optional(),
    module_id: z.number().optional(),
    session_type: sessionTypeSchema.optional(),
    search: z.string().optional(),
});

export type CreateSessionSchema = z.infer<typeof createSessionSchema>;
export type UpdateSessionSchema = z.infer<typeof updateSessionSchema>;
export type SessionFiltersSchema = z.infer<typeof sessionFiltersSchema>;
