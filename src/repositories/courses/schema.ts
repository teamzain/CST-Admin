import { z } from 'zod';
import { TRAINING_TYPE, DELIVERY_MODE } from './types';

export const createCourseSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    duration_hours: z.number().min(1, 'Duration must be at least 1 hour'),
    required_hours: z.number().min(0, 'Required hours must be 0 or more'),
    training_type: z.nativeEnum(TRAINING_TYPE),
    delivery_mode: z.nativeEnum(DELIVERY_MODE),
    thumbnail: z.string().optional(),
    price: z.number().min(0, 'Price must be 0 or more'),
    state: z.string().optional(),
    location: z.string().optional(),
    requires_exam: z.boolean(),
    requires_range: z.boolean(),
    attendance_required: z.boolean(),
    attendance_enabled: z.boolean(),
    requires_id_verification: z.boolean(),
    is_refresher: z.boolean(),
    is_price_negotiable: z.boolean(),
    pre_requirements: z.array(z.string()),
    certificate_template: z.string().optional(),
    instructor_id: z.number().optional(),
});

export const updateCourseSchema = createCourseSchema.partial().extend({
    is_active: z.boolean().optional(),
});

export const courseFiltersSchema = z.object({
    search: z.string().optional(),
    is_active: z.boolean().optional(),
    training_type: z.nativeEnum(TRAINING_TYPE).optional(),
    delivery_mode: z.nativeEnum(DELIVERY_MODE).optional(),
    instructorId: z.number().optional(),
    state_id: z.number().optional(),
});

export type CreateCourseSchema = z.infer<typeof createCourseSchema>;
export type UpdateCourseSchema = z.infer<typeof updateCourseSchema>;
export type CourseFiltersSchema = z.infer<typeof courseFiltersSchema>;
