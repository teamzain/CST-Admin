import { statesService, type State, type CreateStateInput, type StateFilters } from '@/api/states';

/**
 * States Repository
 * Handles all state-related API calls and data management
 */
export class StatesRepository {
    /**
     * Get all states with optional filters
     */
    static async fetchAll(filters?: StateFilters): Promise<State[]> {
        return statesService.getAllStates(filters);
    }

    /**
     * Get state by ID
     */
    static async fetchById(id: number): Promise<State> {
        return statesService.getStateById(id);
    }

    /**
     * Create new state
     */
    static async create(data: CreateStateInput): Promise<State> {
        return statesService.createState(data);
    }

    /**
     * Update state (partial)
     */
    static async update(id: number, data: Partial<CreateStateInput>): Promise<State> {
        return statesService.updateState(id, data);
    }

    /**
     * Delete state
     */
    static async delete(id: number): Promise<void> {
        return statesService.deleteState(id);
    }

    /**
     * Unpublish state
     */
    static async unpublish(id: number): Promise<State> {
        return statesService.unpublishState(id);
    }

    /**
     * Get all active states
     */
    static async fetchActive(): Promise<State[]> {
        return statesService.getAllStates({ is_active: true });
    }

    /**
     * Search states by name
     */
    static async search(searchTerm: string): Promise<State[]> {
        return statesService.getAllStates({ search: searchTerm });
    }
}
