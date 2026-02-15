import { adminApi } from '@/api';
import { toast } from 'sonner';
import { ADMIN_ROUTES, buildUrl } from '@/config/routes';
import type {
    PlatformSettings,
    CreatePlatformSettingsInput,
    UpdatePlatformSettingsInput,
} from './types';

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Extract error message from unknown error
 */
function getErrorMessage(error: unknown, defaultMessage: string): string {
    if (error instanceof Object && 'response' in error) {
        const response = error.response as Record<string, unknown>;
        if (response.data instanceof Object && 'message' in response.data) {
            return (response.data as Record<string, unknown>).message as string;
        }
    }
    return defaultMessage;
}

// ============================================================================
// PLATFORM SETTINGS REPOSITORY
// ============================================================================

/**
 * Platform Settings Repository
 * Handles all platform/company settings API calls
 * Note: Only one platform settings record exists in the system
 */
export class PlatformSettingsRepository {
    /**
     * Get the first/only platform settings
     * If it doesn't exist, creates one with default values
     */
    async getOrCreateSettings(): Promise<PlatformSettings> {
        try {
            // Try to get all settings
            const allSettings = await this.getAllSettings();

            // If settings exist, return the first one
            if (allSettings.length > 0) {
                return allSettings[0];
            }

            // If no settings exist, create a default one
            const defaultSettings: CreatePlatformSettingsInput = {
                company_name: 'Complete Security Training USA',
                support_email: 'support@example.com',
                company_logo: null,
                support_phone: null,
                address: null,
                stripe_connected: false,
            };

            return await this.createSettings(defaultSettings);
        } catch (error: unknown) {
            console.error('Error getting or creating platform settings:', error);
            toast.error('Failed to load platform settings');
            throw error;
        }
    }

    /**
     * Create or update platform settings
     * If only one settings exists, updates it
     * If none exist, creates new settings
     */
    async createOrUpdateSettings(
        data: UpdatePlatformSettingsInput
    ): Promise<PlatformSettings> {
        try {
            // First, try to get existing settings
            const allSettings = await this.getAllSettings();

            // If settings exist, update the first one
            if (allSettings.length > 0) {
                const existingSettings = allSettings[0];
                return await this.updateSettings(existingSettings.id, data);
            }

            // If no settings exist, create new one
            const createData: CreatePlatformSettingsInput = {
                company_name: data.company_name || 'Complete Security Training USA',
                support_email: data.support_email || 'support@example.com',
                company_logo: data.company_logo || null,
                support_phone: data.support_phone || null,
                address: data.address || null,
                stripe_connected: data.stripe_connected || false,
            };

            return await this.createSettings(createData);
        } catch (error: unknown) {
            console.error('Error creating or updating platform settings:', error);
            const errorMessage = getErrorMessage(
                error,
                'Failed to save platform settings'
            );
            toast.error(errorMessage);
            throw error;
        }
    }

    /**
     * Create new platform settings
     */
    async createSettings(
        data: CreatePlatformSettingsInput
    ): Promise<PlatformSettings> {
        try {
            const response = await adminApi.post(
                ADMIN_ROUTES.PLATFORM_SETTINGS.CREATE.url,
                data
            );
            const result = response.data?.data || response.data;
            toast.success('Platform settings created successfully');
            return result;
        } catch (error: unknown) {
            console.error('Error creating platform settings:', error);
            const errorMessage = getErrorMessage(
                error,
                'Failed to create platform settings'
            );
            toast.error(errorMessage);
            throw error;
        }
    }

    /**
     * Get all platform settings
     */
    async getAllSettings(): Promise<PlatformSettings[]> {
        try {
            const response = await adminApi.get(
                ADMIN_ROUTES.PLATFORM_SETTINGS.GET_ALL.url
            );
            
            // Handle different response formats from backend
            let settings: PlatformSettings[] = [];
            const payload = response.data;
            
            if (Array.isArray(payload)) {
                // Direct array: [{ id, company_name, ... }]
                settings = payload;
            } else if (payload?.data && Array.isArray(payload.data)) {
                // Wrapped array: { data: [{ id, company_name, ... }] }
                settings = payload.data;
            } else if (payload?.data && typeof payload.data === 'object' && payload.data.id) {
                // Wrapped single object: { data: { id, company_name, ... } }
                settings = [payload.data];
            } else if (payload && typeof payload === 'object' && payload.id) {
                // Direct single object: { id, company_name, ... }
                settings = [payload];
            }
            
            return settings;
        } catch (error: unknown) {
            console.error('Error fetching platform settings:', error);
            // Don't show toast here as it's called frequently
            return [];
        }
    }

    /**
     * Get current/active platform settings
     */
    async getCurrentSettings(): Promise<PlatformSettings> {
        try {
            const response = await adminApi.get(
                ADMIN_ROUTES.PLATFORM_SETTINGS.GET_CURRENT.url
            );
            const data = response.data?.data || response.data;
            return data;
        } catch (error: unknown) {
            console.error('Error fetching current platform settings:', error);
            throw error;
        }
    }

    /**
     * Get platform settings by ID
     */
    async getSettingsById(id: number): Promise<PlatformSettings> {
        try {
            const url = buildUrl(ADMIN_ROUTES.PLATFORM_SETTINGS.GET_BY_ID, {
                id,
            });
            const response = await adminApi.get(url);
            const data = response.data?.data || response.data;
            return data;
        } catch (error: unknown) {
            console.error('Error fetching platform settings:', error);
            throw error;
        }
    }

    /**
     * Update platform settings
     * Always updates the first/only settings record
     */
    async updateSettings(
        id: number,
        data: UpdatePlatformSettingsInput
    ): Promise<PlatformSettings> {
        try {
            const url = buildUrl(ADMIN_ROUTES.PLATFORM_SETTINGS.UPDATE, { id });
            const response = await adminApi.patch(url, data);
            const result = response.data?.data || response.data;
            toast.success('Platform settings updated successfully');
            return result;
        } catch (error: unknown) {
            console.error('Error updating platform settings:', error);
            const errorMessage = getErrorMessage(
                error,
                'Failed to update platform settings'
            );
            toast.error(errorMessage);
            throw error;
        }
    }
}

export const platformSettingsRepository = new PlatformSettingsRepository();
