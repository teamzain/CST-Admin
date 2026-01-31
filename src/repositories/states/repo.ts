import { courseApi } from '@/api';
import type { State, CreateStateInput, StateFilters } from './types';

/**
 * States Repository
 * Handles all state-related API calls and data management
 */
export class StatesRepository {
    /**
     * Get all states with optional filters
     */
    static async fetchAll(filters?: StateFilters): Promise<State[]> {
        const params = new URLSearchParams();
        if (filters?.search) {
            params.append('search', filters.search);
        }
        if (filters?.is_active !== undefined) {
            params.append('is_active', String(filters.is_active));
        }

        const response = await courseApi.get('/state', { params });
        return response.data.data || response.data;
    }

    /**
     * Get state by ID
     */
    static async fetchById(id: number): Promise<State> {
        const response = await courseApi.get(`/state/${id}`);
        return response.data.data || response.data;
    }

    /**
     * Create new state
     */
    static async create(data: CreateStateInput): Promise<State> {
        const response = await courseApi.post('/state', data);
        return response.data.data || response.data;
    }

    /**
     * Update state (partial)
     */
    static async update(
        id: number,
        data: Partial<CreateStateInput>
    ): Promise<State> {
        const response = await courseApi.patch(`/state/${id}`, data);
        return response.data.data || response.data;
    }

    /**
     * Delete state
     */
    static async delete(id: number): Promise<void> {
        await courseApi.delete(`/state/${id}`);
    }

    /**
     * Unpublish state
     */
    static async unpublish(id: number): Promise<State> {
        const response = await courseApi.patch(`/state/unpublish/${id}`);
        return response.data.data || response.data;
    }

    /**
     * Get all active states
     */
    static async fetchActive(): Promise<State[]> {
        return this.fetchAll({ is_active: true });
    }

    /**
     * Search states by name
     */
    static async search(searchTerm: string): Promise<State[]> {
        return this.fetchAll({ search: searchTerm });
    }
}
