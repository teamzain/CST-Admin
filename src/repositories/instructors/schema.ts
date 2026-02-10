import { z } from 'zod';
import { InstructorStatus } from './types';

// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================

export const createInstructorSchema = z.object({
    first_name: z.string().min(1, 'First name is required').max(100),
    last_name: z.string().min(1, 'Last name is required').max(100),
    email: z.string().email('Invalid email address'),
    username: z.string().min(1, 'Username is required'),
    phone: z.string().optional(),
    state_id: z.number().int().positive('State is required'),
    license_no: z.string().min(1, 'License number is required'),
    license_expiry: z.string().min(1, 'License expiry date is required'),
});

export const updateInstructorSchema = z.object({
    first_name: z.string().min(1).max(100).optional(),
    last_name: z.string().min(1).max(100).optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    state_id: z.number().int().positive().optional(),
    license_no: z.string().optional(),
    license_expiry: z.string().optional(),
    status: z.nativeEnum(InstructorStatus).optional(),
});

export const instructorFiltersSchema = z.object({
    search: z.string().optional(),
    state_id: z.number().int().positive().optional(),
    status: z.nativeEnum(InstructorStatus).optional().or(z.string()),
    join_date_from: z.string().optional(),
    join_date_to: z.string().optional(),
    is_verified: z.boolean().optional(),
    page: z.number().int().positive().optional(),
    limit: z.number().int().positive().optional(),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
});

// ============================================================================
// TYPE INFERENCE
// ============================================================================

export type CreateInstructorSchema = z.infer<typeof createInstructorSchema>;
export type UpdateInstructorSchema = z.infer<typeof updateInstructorSchema>;
export type InstructorFiltersSchema = z.infer<typeof instructorFiltersSchema>;
