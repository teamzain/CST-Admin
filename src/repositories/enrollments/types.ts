// ============================================================================
// ENUMS
// ============================================================================

export enum EnrollmentStatus {
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETE = 'COMPLETE',
    DROPPED = 'DROPPED',
    PENDING = 'PENDING',
}

// ============================================================================
// MAIN ENTITY TYPES
// ============================================================================

export interface Enrollment {
    id: number;
    user_id: number;
    course_id: number;
    status: EnrollmentStatus;
    progress: number;
    seat_time_min: number;
    session_id?: number | null;
    last_activity?: string | null;
    started_at: string;
    completed_at?: string | null;
    created_at?: string;
    updated_at?: string;
    user?: {
        id: number;
        first_name?: string;
        last_name?: string;
        email?: string;
        username?: string;
        avatar?: string | null;
        phone?: string | null;
    };
    course?: {
        id: number;
        title: string;
        description?: string;
        training_type?: string;
        delivery_mode?: string;
        duration_hours?: number;
        price?: number;
        thumbnail?: string | null;
    };
}

export interface EnrollmentStats {
    totalEnrollments: number;
    inProgress: number;
    completed: number;
    dropped: number;
    pending: number;
    averageProgress: number;
    completionRate: number;
}

export interface PaginatedEnrollments {
    data: Enrollment[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

// ============================================================================
// INPUT TYPES
// ============================================================================

export interface EnrollUserInput {
    userId: number;
}

export interface UpdateEnrollmentInput {
    status?: EnrollmentStatus;
    session_id?: number;
    progress?: number;
}

// ============================================================================
// FILTER TYPES
// ============================================================================

export interface EnrollmentFilters {
    page?: number;
    limit?: number;
    status?: EnrollmentStatus;
    courseId?: number;
    userId?: number;
    training_type?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}
