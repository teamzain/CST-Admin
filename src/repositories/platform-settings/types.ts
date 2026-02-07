/**
 * Platform Settings Types
 * Defines all interfaces for platform/company settings management
 */

export interface PlatformSettings {
    id: number;
    company_name: string;
    company_logo: string | null;
    support_email: string;
    support_phone: string | null;
    address: string | null;
    stripe_connected: boolean;
    stripe_account_id?: string | null;
    is_active?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string;
}

export interface CreatePlatformSettingsInput {
    company_name: string;
    company_logo?: string | null;
    support_email: string;
    support_phone?: string | null;
    address?: string | null;
    stripe_connected?: boolean;
}

export interface UpdatePlatformSettingsInput {
    company_name?: string;
    company_logo?: string | null;
    support_email?: string;
    support_phone?: string | null;
    address?: string | null;
    stripe_connected?: boolean;
    stripe_account_id?: string | null;
}

export interface PlatformSettingsResponse {
    data: PlatformSettings;
    message?: string;
}

export interface PlatformSettingsListResponse {
    data: PlatformSettings[];
    message?: string;
}
