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
    created_at: string;
    updated_at: string;
}

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
    id?: number;
}

export interface StateFilters {
    search?: string;
    is_active?: boolean;
}
