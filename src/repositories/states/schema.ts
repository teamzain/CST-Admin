import { z } from 'zod';

export const createStateSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    code: z.string().min(2, 'Code must be at least 2 characters'),
    unarmed_hours: z.number().min(0, 'Unarmed hours must be 0 or more'),
    armed_hours: z.number().min(0, 'Armed hours must be 0 or more'),
    unarmed_passing_score: z.number().min(0).max(100, 'Passing score must be between 0 and 100'),
    armed_passing_score: z.number().min(0).max(100, 'Passing score must be between 0 and 100'),
    requires_range_training: z.boolean(),
    requires_range_pass: z.boolean(),
    certificate_template: z.string().optional(),
    certificate_validity_years: z.number().min(1).optional(),
    is_active: z.boolean(),
    is_seat_time_enabled: z.boolean(),
    id_check_frequency: z.number().min(0),
});

export const updateStateSchema = createStateSchema.partial();

export const stateFiltersSchema = z.object({
    search: z.string().optional(),
    is_active: z.boolean().optional(),
});

export type CreateStateSchema = z.infer<typeof createStateSchema>;
export type UpdateStateSchema = z.infer<typeof updateStateSchema>;
export type StateFiltersSchema = z.infer<typeof stateFiltersSchema>;
