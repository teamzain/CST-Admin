import { z } from 'zod';

export const createModuleSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    order_index: z.number().min(0, 'Order index must be 0 or more'),
});

export const updateModuleSchema = createModuleSchema.partial();

export const moduleFiltersSchema = z.object({
    course_id: z.number().optional(),
    search: z.string().optional(),
});

export type CreateModuleSchema = z.infer<typeof createModuleSchema>;
export type UpdateModuleSchema = z.infer<typeof updateModuleSchema>;
export type ModuleFiltersSchema = z.infer<typeof moduleFiltersSchema>;
