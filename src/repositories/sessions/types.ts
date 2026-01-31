export type SessionType = 'LIVE' | 'PHYSICAL';

export interface Session {
    id: number;
    title: string;
    start_time: string;
    end_time: string;
    capacity: number;
    order_index?: number;
    location?: string;
    session_type: SessionType;
    google_event_id?: string;
    meeting_url?: string;
    reminder_sent?: boolean;
    created_at?: string;
    course_id?: number;
    module_id?: number;
}

export interface CreateSessionInput {
    title: string;
    start_time: string;
    end_time: string;
    capacity: number;
    session_type: SessionType;
    location?: string;
    meeting_url?: string;
    module_id?: number;
    order_index?: number;
}

export type UpdateSessionInput = Partial<CreateSessionInput>;

export interface SessionFilters {
    course_id?: number;
    module_id?: number;
    session_type?: SessionType;
    search?: string;
}
