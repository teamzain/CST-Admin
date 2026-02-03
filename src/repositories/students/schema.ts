import { z } from 'zod';
import { StudentStatus } from './types';

// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================

export const createStudentSchema = z.object({
    first_name: z.string().min(1, 'First name is required').max(100),
    last_name: z.string().min(1, 'Last name is required').max(100),
    email: z.string().email('Invalid email address'),
    username: z.string().min(1, 'Username is required'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    phone: z.string().optional(),
    state_id: z.number().int().positive('State is required').optional(),
    enrollment_date: z.string().optional(),
    avatar: z.string().url().optional(),
    bio: z.string().max(500).optional(),
});

export const updateStudentSchema = z.object({
    first_name: z.string().min(1).max(100).optional(),
    last_name: z.string().min(1).max(100).optional(),
    email: z.string().email().optional(),
    username: z.string().min(1).optional(),
    password: z.string().min(6).optional().or(z.literal('')),
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
