import { z } from 'zod';
import { EmployerStatus } from './types';

// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================

export const createEmployerSchema = z.object({
    first_name: z.string().min(1, 'First name is required').max(100),
    last_name: z.string().min(1, 'Last name is required').max(100),
    email: z.string().email('Invalid email address'),
    username: z.string().min(1, 'Username is required'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    phone: z.string().optional(),
    company_name: z.string().min(1, 'company_name should not be empty').max(255, 'company_name must be a string'),
    contact_email: z.string().min(1, 'contact_email must be an email').email('contact_email must be an email'),
    contact_phone: z.string().optional(),
    address: z.string().max(500).optional(),
    website: z.string().url('Invalid website URL').optional(),
    state_id: z.number().int('state_id must be an integer number').positive('state_id should not be empty'),
    industry: z.string().min(1, 'Industry is required').optional(),
});

export const updateEmployerSchema = z.object({
    first_name: z.string().min(1).max(100).optional(),
    last_name: z.string().min(1).max(100).optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    company_name: z.string().min(1).max(255).optional(),
    contact_email: z.string().email().optional(),
    contact_phone: z.string().optional(),
    address: z.string().max(500).optional(),
    website: z.string().url().optional(),
    state_id: z.number().int().positive().optional(),
    industry: z.string().min(1).optional(),
    status: z.nativeEnum(EmployerStatus).optional(),
});

export const employerFiltersSchema = z.object({
    search: z.string().optional(),
    state_id: z.number().int().positive().optional(),
    status: z.nativeEnum(EmployerStatus).optional().or(z.string()),
    industry: z.string().optional(),
    join_date_from: z.string().optional(),
    join_date_to: z.string().optional(),
    min_seat_utilization: z.number().min(0).max(100).optional(),
    max_seat_utilization: z.number().min(0).max(100).optional(),
    is_verified: z.boolean().optional(),
    page: z.number().int().positive().optional(),
    limit: z.number().int().positive().optional(),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
});

export const purchaseSeatsSchema = z.object({
    employer_id: z.number().int().positive('Employer ID is required'),
    course_id: z.number().int().positive('Course ID is required'),
    total_seats: z.number().int().positive('Total seats must be greater than 0'),
});

// ============================================================================
// TYPE INFERENCE
// ============================================================================

export type CreateEmployerSchema = z.infer<typeof createEmployerSchema>;
export type UpdateEmployerSchema = z.infer<typeof updateEmployerSchema>;
export type EmployerFiltersSchema = z.infer<typeof employerFiltersSchema>;
export type PurchaseSeatsSchema = z.infer<typeof purchaseSeatsSchema>;
