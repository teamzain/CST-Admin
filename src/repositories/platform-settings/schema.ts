import { z } from 'zod';

// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================

export const createPlatformSettingsSchema = z.object({
    company_name: z.string().min(1, 'Company name is required').max(255),
    company_logo: z.string().url('Invalid logo URL').optional().or(z.null()),
    support_email: z.string().email('Invalid email address'),
    support_phone: z.string().optional().or(z.null()),
    address: z.string().max(500).optional().or(z.null()),
    stripe_connected: z.boolean().optional(),
});

export const updatePlatformSettingsSchema = z.object({
    company_name: z.string().min(1).max(255).optional(),
    company_logo: z.string().url().optional().or(z.null()),
    support_email: z.string().email().optional(),
    support_phone: z.string().optional().or(z.null()),
    address: z.string().max(500).optional().or(z.null()),
    stripe_connected: z.boolean().optional(),
    stripe_account_id: z.string().optional().or(z.null()),
});

// ============================================================================
// TYPE INFERENCE
// ============================================================================

export type CreatePlatformSettingsSchema = z.infer<typeof createPlatformSettingsSchema>;
export type UpdatePlatformSettingsSchema = z.infer<typeof updatePlatformSettingsSchema>;
