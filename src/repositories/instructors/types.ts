// ============================================================================
// ENUMS
// ============================================================================

export enum InstructorStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    EXPIRED = 'EXPIRED',
}

// ============================================================================
// MAIN ENTITY TYPES
// ============================================================================

export interface InstructorLicense {
    id: number;
    user_id: number;
    state_id: number;
    license_no: string;
    license_expiry: string | Date;
    created_at?: string;
    updated_at?: string;
    state?: {
        id: number;
        name: string;
        code: string;
        [key: string]: any;
    };
    assigned_courses?: number[];
}

export interface Instructor {
    id: number;
    user_id?: number;
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
    username?: string;
    avatar?: string;
    bio?: string | null;
    link?: string | null;
    auth_id?: number;
    role?: string;
    state_id?: number;
    state?: {
        id: number;
        name: string;
        code: string;
        [key: string]: any;
    } | string; // Support both object and string for backward compatibility
    license_no?: string | null;
    license_expiry?: Date | string | null;
    status?: InstructorStatus | string | 'active' | 'expired' | 'pending';
    is_verified?: boolean;
    created_at?: string;
    updated_at?: string;
    join_date?: string;
    assigned_courses?: any[]; // Array of course ids or course objects
    instructorLicenses?: InstructorLicense[];
    
    // Backward compatibility fields for dummy data and components
    name?: string;
    expiry?: string;
    license?: string;
    stateName?: string;
    stateCode?: string;
}

// ============================================================================
// API INPUT TYPES
// ============================================================================

export interface CreateInstructorInput {
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    phone?: string;
    state_id: number;
    license_no: string;
    license_expiry: string; // YYYY-MM-DD format
}

export interface UpdateInstructorInput {
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
    state_id?: number;
    license_no?: string;
    license_expiry?: string;
    status?: InstructorStatus;
}

// ============================================================================
// FILTER TYPES
// ============================================================================

export interface InstructorFilters {
    search?: string;
    state_id?: number;
    status?: InstructorStatus | string;
    join_date_from?: string;
    join_date_to?: string;
    is_verified?: boolean;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface InstructorResponse {
    data: Instructor;
}

export interface InstructorsListResponse {
    data: Instructor[];
    pagination?: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}
