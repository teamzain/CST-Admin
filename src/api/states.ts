import api from '@/api';
import { toast } from 'sonner';

export interface CreateStateInput {
    name: string;
    code: string;
    unarmed_hours: number;
    armed_hours: number;
    unarmed_passing_score: number;
    armed_passing_score: number;
    requires_range_training: boolean;
    requires_range_pass: boolean;
    certificate_template?: string;
    certificate_validity_years?: number;
    is_active: boolean;
    is_seat_time_enabled: boolean;
    id_check_frequency: number;
}

export interface UpdateStateInput extends Partial<CreateStateInput> {
    id: number;
}

export interface State extends CreateStateInput {
    id: number;
    created_at: string;
    updated_at: string;
}

export interface StateFilters {
    search?: string;
    is_active?: boolean;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3009/api/admin';

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

class StatesService {
    /**
     * Fetch all states with optional filters
     */
    async getAllStates(filters?: StateFilters): Promise<State[]> {
        try {
            const params = new URLSearchParams();
            if (filters?.search) {
                params.append('search', filters.search);
            }
            if (filters?.is_active !== undefined) {
                params.append('is_active', String(filters.is_active));
            }

            const queryString = params.toString();
            const url = queryString ? `${API_BASE_URL}/state?${queryString}` : `${API_BASE_URL}/state`;
            
            const response = await api.get(url);
            return response.data.data || response.data;
        } catch (error: unknown) {
            console.error('Error fetching states:', error);
            toast.error('Failed to fetch states');
            throw error;
        }
    }

    /**
     * Fetch single state by ID
     */
    async getStateById(id: number): Promise<State> {
        try {
            const response = await api.get(`${API_BASE_URL}/state/${id}`);
            return response.data.data || response.data;
        } catch (error: unknown) {
            console.error('Error fetching state:', error);
            toast.error('Failed to fetch state');
            throw error;
        }
    }

    /**
     * Create a new state
     */
    async createState(data: CreateStateInput): Promise<State> {
        try {
            const response = await api.post(`${API_BASE_URL}/state`, data);
            toast.success('State created successfully');
            return response.data.data || response.data;
        } catch (error: unknown) {
            console.error('Error creating state:', error);
            const errorMessage = getErrorMessage(error, 'Failed to create state');
            toast.error(errorMessage);
            throw error;
        }
    }

    /**
     * Update an existing state (partial update)
     */
    async updateState(id: number, data: Partial<CreateStateInput>): Promise<State> {
        try {
            const response = await api.patch(`${API_BASE_URL}/state/${id}`, data);
            toast.success('State updated successfully');
            return response.data.data || response.data;
        } catch (error: unknown) {
            console.error('Error updating state:', error);
            const errorMessage = getErrorMessage(error, 'Failed to update state');
            toast.error(errorMessage);
            throw error;
        }
    }

    /**
     * Delete a state
     */
    async deleteState(id: number): Promise<void> {
        try {
            await api.delete(`${API_BASE_URL}/state/${id}`);
            toast.success('State deleted successfully');
        } catch (error: unknown) {
            console.error('Error deleting state:', error);
            const errorMessage = getErrorMessage(error, 'Failed to delete state');
            toast.error(errorMessage);
            throw error;
        }
    }

    /**
     * Unpublish a state
     */
    async unpublishState(id: number): Promise<State> {
        try {
            const response = await api.patch(`${API_BASE_URL}/state/unpublish/${id}`);
            toast.success('State unpublished successfully');
            return response.data.data || response.data;
        } catch (error: unknown) {
            console.error('Error unpublishing state:', error);
            const errorMessage = getErrorMessage(error, 'Failed to unpublish state');
            toast.error(errorMessage);
            throw error;
        }
    }
}

export const statesService = new StatesService();
