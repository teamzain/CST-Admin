// ============================================================================
// ENUMS
// ============================================================================

export enum EmployerStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    PENDING = 'PENDING',
}

// ============================================================================
// SEAT & INVOICE & EMPLOYEE TYPES
// ============================================================================

export interface EmployerSeat {
    id: number;
    employer_id: number;
    course_id: number;
    total_seats: number;
    used_seats: number;
    created_at?: string;
    updated_at?: string;
    course?: {
        id: number;
        title: string;
        description?: string;
        duration_hours?: number;
        training_type?: string;
        price?: number;
        [key: string]: any;
    };
}

export interface EmployerInvoice {
    id: number;
    employer_id: number;
    total_amount: number;
    status: 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE';
    due_date?: string | Date;
    paid_at?: string | Date;
    created_at?: string;
    updated_at?: string;
}

export interface EmployerEmployee {
    id: number;
    employer_id: number;
    employee_id: number;
    assigned_at?: string;
}

// ============================================================================
// MAIN ENTITY TYPES
// ============================================================================

export interface Employer {
    id: number;
    user_id?: number;
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    username?: string;
    avatar?: string;
    company_name: string;
    contact_email?: string;
    contact_phone?: string;
    address?: string;
    website?: string;
    industry?: string;
    state_id?: number;
    state?: {
        id: number;
        name: string;
        code: string;
    };
    status: EmployerStatus | string;
    is_verified?: boolean;
    created_at?: string;
    updated_at?: string;
    join_date?: string;
    total_seats?: number;
    used_seats?: number;
    seat_utilization?: number;
    seat_records?: EmployerSeat[];
    invoice_records?: EmployerInvoice[];
    invoices?: EmployerInvoice[]; // Direct invoices array
    employees?: EmployerEmployee[];
    
    // Backward compatibility fields for components
    name?: string;
    contact?: string;
    seats?: number;
    usedSeats?: number;
}

// ============================================================================
// API INPUT TYPES
// ============================================================================

export interface CreateEmployerInput {
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    password: string;
    phone?: string;
    company_name: string;
    contact_email: string;
    contact_phone?: string;
    address?: string;
    website?: string;
    state_id: number;
    industry?: string;
}

export interface UpdateEmployerInput {
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
    company_name?: string;
    contact_email?: string;
    contact_phone?: string;
    address?: string;
    website?: string;
    state_id?: number;
    industry?: string;
    status?: EmployerStatus | string;
}

export interface PurchaseSeatsInput {
    employer_id: number;
    course_id: number;
    total_seats: number;
}

// ============================================================================
// FILTER TYPES
// ============================================================================

export interface EmployerFilters {
    search?: string;
    state_id?: number;
    status?: EmployerStatus | string;
    industry?: string;
    join_date_from?: string;
    join_date_to?: string;
    min_seat_utilization?: number;
    max_seat_utilization?: number;
    is_verified?: boolean;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface EmployerResponse {
    data: Employer;
}

export interface EmployersListResponse {
    data: Employer[];
    pagination?: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}
