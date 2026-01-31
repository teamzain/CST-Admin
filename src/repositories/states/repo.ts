import { courseApi } from '@/api';
import type {
    State,
    CreateStateInput,
    UpdateStateInput,
    StateFilters,
} from './types';

interface ApiResponse<T> {
    data?: T;
    states?: State[];
    state?: State;
}

export class StatesRepository {
    private static extractData<T>(response: ApiResponse<T> | T[] | T): T {
        if (!response) return [] as unknown as T;
        if (Array.isArray(response)) return response as unknown as T;

        const data = response as ApiResponse<T>;
        if (data.data !== undefined) {
            const nested = data.data as ApiResponse<T> | T[] | T;
            if (Array.isArray(nested)) return nested as unknown as T;
            const nestedObj = nested as ApiResponse<T>;
            if (nestedObj.states !== undefined)
                return nestedObj.states as unknown as T;
            if (nestedObj.state !== undefined)
                return nestedObj.state as unknown as T;
            return nested as T;
        }
        if (data.states !== undefined) return data.states as unknown as T;
        if (data.state !== undefined) return data.state as unknown as T;

        return response as T;
    }

    /**
     * Get all states with optional filters
     */
    static async getAll(filters?: StateFilters): Promise<State[]> {
        const params = new URLSearchParams();
        if (filters?.search) params.append('search', filters.search);
        if (filters?.is_active !== undefined)
            params.append('is_active', String(filters.is_active));

        const queryString = params.toString();
        const url = queryString ? `/state?${queryString}` : '/state';

        const { data } = await courseApi.get(url);
        return this.extractData<State[]>(data);
    }

    /**
     * Get a single state by ID
     */
    static async getById(id: number): Promise<State> {
        const { data } = await courseApi.get(`/state/${id}`);
        return this.extractData<State>(data);
    }

    /**
     * Create a new state
     */
    static async create(input: CreateStateInput): Promise<State> {
        const { data } = await courseApi.post('/state', input);
        return this.extractData<State>(data);
    }

    /**
     * Update a state
     */
    static async update(id: number, input: UpdateStateInput): Promise<State> {
        const { data } = await courseApi.patch(`/state/${id}`, input);
        return this.extractData<State>(data);
    }

    /**
     * Delete a state
     */
    static async delete(id: number): Promise<void> {
        await courseApi.delete(`/state/${id}`);
    }

    /**
     * Unpublish/deactivate a state
     */
    static async unpublish(id: number): Promise<State> {
        return this.update(id, { is_active: false });
    }

    /**
     * Publish/activate a state
     */
    static async publish(id: number): Promise<State> {
        return this.update(id, { is_active: true });
    }

    /**
     * Get active states only
     */
    static async getActive(): Promise<State[]> {
        return this.getAll({ is_active: true });
    }
}

export const statesRepository = new StatesRepository();
