import { z } from 'zod';
import { StudentStatus } from './types';

// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================

export const createStudentSchema = z.object({
    first_name: z.string().min(1, 'First name is required').max(100),
    last_name: z.string().min(1, 'Last name is required').max(100),
    email: z.string().email('Invalid email address'),
    phone: z.string().optional(),
    state_id: z.number().int().positive('State is required'),
    enrollment_date: z.string().min(1, 'Enrollment date is required'),
    avatar: z.string().url().optional(),
    bio: z.string().max(500).optional(),
});

export const updateStudentSchema = z.object({
    first_name: z.string().min(1).max(100).optional(),
    last_name: z.string().min(1).max(100).optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    state_id: z.number().int().positive().optional(),
    enrollment_date: z.string().optional(),
    avatar: z.string().url().optional(),
    bio: z.string().max(500).optional(),
    status: z.nativeEnum(StudentStatus).optional(),
});

export const studentFiltersSchema = z.object({
    search: z.string().optional(),
    state_id: z.number().int().positive().optional(),
    status: z.nativeEnum(StudentStatus).optional(),
    enrollment_date_from: z.string().optional(),
    enrollment_date_to: z.string().optional(),
});

// ============================================================================
// TYPE INFERENCE
// ============================================================================

export type CreateStudentSchema = z.infer<typeof createStudentSchema>;
export type UpdateStudentSchema = z.infer<typeof updateStudentSchema>;
export type StudentFiltersSchema = z.infer<typeof studentFiltersSchema>;
