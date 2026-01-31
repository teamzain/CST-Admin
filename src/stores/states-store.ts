import { create } from 'zustand';
import { StatesRepository } from '@/repositories/states';
import type { StateFilters } from '@/repositories/states';

export interface State {
    id: number;
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
    created_at: Date | string;
    updated_at: Date | string;
}

interface StatesStore {
    states: State[];
    isLoading: boolean;
    error: string | null;
    currentFilters: StateFilters;

    // Actions
    fetchStates: (filters?: StateFilters) => Promise<void>;
    addState: (state: State) => void;
    updateState: (id: number, state: Partial<State>) => void;
    deleteState: (id: number) => void;
    unpublishState: (id: number) => void;
    getStateById: (id: number) => State | undefined;
    setFilters: (filters: StateFilters) => void;
}

export const useStatesStore = create<StatesStore>((set, get) => ({
    states: [],
    isLoading: false,
    error: null,
    currentFilters: {},

    fetchStates: async (filters?: StateFilters) => {
        set({ isLoading: true, error: null });
        try {
            const filtersToUse = filters || get().currentFilters;
            const states = await StatesRepository.fetchAll(filtersToUse);
            set({ states, isLoading: false, currentFilters: filtersToUse });
        } catch (error) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'Failed to fetch states';
            set({ error: errorMessage, isLoading: false });
        }
    },

    addState: (state) =>
        set((store) => ({
            states: [...store.states, state],
        })),

    updateState: (id, stateData) =>
        set((store) => ({
            states: store.states.map((s) =>
                s.id === id ? { ...s, ...stateData } : s
            ),
        })),

    deleteState: (id) =>
        set((store) => ({
            states: store.states.filter((s) => s.id !== id),
        })),

    unpublishState: (id) =>
        set((store) => ({
            states: store.states.map((s) =>
                s.id === id ? { ...s, is_active: false } : s
            ),
        })),

    getStateById: (id) => {
        const store = get();
        return store.states.find((s) => s.id === id);
    },

    setFilters: (filters) => {
        set({ currentFilters: filters });
    },
}));
