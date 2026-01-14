import { create } from 'zustand';

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
    created_at: Date;
    updated_at: Date;
}

const dummyStates: State[] = [
    {
        id: 1,
        name: 'Illinois',
        code: 'IL',
        unarmed_hours: 20,
        armed_hours: 40,
        unarmed_passing_score: 70,
        armed_passing_score: 80,
        requires_range_training: true,
        requires_range_pass: false,
        certificate_template: 'il_template_v1',
        certificate_validity_years: 1,
        is_active: true,
        created_at: new Date('2024-01-01'),
        updated_at: new Date('2024-01-01'),
    },
    {
        id: 2,
        name: 'Texas',
        code: 'TX',
        unarmed_hours: 6,
        armed_hours: 30,
        unarmed_passing_score: 70,
        armed_passing_score: 75,
        requires_range_training: true,
        requires_range_pass: true,
        certificate_template: 'tx_template_v1',
        certificate_validity_years: 2,
        is_active: true,
        created_at: new Date('2024-01-05'),
        updated_at: new Date('2024-01-15'),
    },
    {
        id: 3,
        name: 'California',
        code: 'CA',
        unarmed_hours: 8,
        armed_hours: 32,
        unarmed_passing_score: 75,
        armed_passing_score: 85,
        requires_range_training: true,
        requires_range_pass: true,
        certificate_template: 'ca_template_2024',
        certificate_validity_years: 1,
        is_active: false,
        created_at: new Date('2024-02-01'),
        updated_at: new Date('2024-02-01'),
    },
    {
        id: 4,
        name: 'Florida',
        code: 'FL',
        unarmed_hours: 40,
        armed_hours: 28,
        unarmed_passing_score: 70,
        armed_passing_score: 70,
        requires_range_training: true,
        requires_range_pass: false,
        certificate_template: 'fl_cert_v2',
        certificate_validity_years: 2,
        is_active: true,
        created_at: new Date('2024-02-10'),
        updated_at: new Date('2024-02-20'),
    },
    {
        id: 5,
        name: 'New York',
        code: 'NY',
        unarmed_hours: 16,
        armed_hours: 47,
        unarmed_passing_score: 70,
        armed_passing_score: 80,
        requires_range_training: false,
        requires_range_pass: false,
        certificate_template: 'ny_standard',
        certificate_validity_years: 1,
        is_active: true,
        created_at: new Date('2024-03-01'),
        updated_at: new Date('2024-03-01'),
    },
];

interface StatesStore {
    states: State[];
    addState: (state: State) => void;
    updateState: (id: number, state: Partial<State>) => void;
    deleteState: (id: number) => void;
    getStateById: (id: number) => State | undefined;
}

export const useStatesStore = create<StatesStore>((set, get) => ({
    states: dummyStates,
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
    getStateById: (id) => {
        const store = get();
        return store.states.find((s) => s.id === id);
    },
}));