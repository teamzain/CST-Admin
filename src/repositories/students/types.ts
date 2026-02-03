// ============================================================================
// ENUMS
// ============================================================================

export enum StudentStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    SUSPENDED = 'SUSPENDED',
}

export enum EnrollmentStatus {
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    DROPPED = 'DROPPED',
    PENDING = 'PENDING',
}

// ============================================================================
// MAIN ENTITY TYPES
// ============================================================================

export interface UserAuth {
    status: StudentStatus;
    is_verified: boolean;
    created_at: string;
    updated_at: string;
}

export interface AuditLog {
    id: number;
    user_id: number | null;
    action: string;
    meta: any;
    created_at: string;
}

export interface LessonProgress {
    id: number;
    user_id: number;
    lesson_id: number;
    enrollment_id: number;
    watched_seconds: number;
    total_seconds: number | null;
    progress_percent: number;
    is_completed: boolean;
    last_position: number;
    updated_at: string;
}

export interface ComplianceCheck {
    id: number;
    user_id: number;
    id_verified: boolean;
    selfie_verified: boolean;
    last_check: string | null;
    provider: string | null;
    compliance_type: string | null;
}

export interface ESignature {
    id: number;
    user_id: number;
    document_type: string;
    signed_at: string;
    ip_address: string | null;
    signature_url: string | null;
}

export interface State {
    id: number;
    name: string;
    code: string;
}

export interface Student {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    avatar?: string;
    bio?: string;
    state_id: number;
    auth_id: number;
    role: string;
    enrolledCoursesCount: number;
    lastActivity: string | null;
    latestInstructor: string | null;
    link: string | null;
    created_at: string;
    updated_at: string;
    state?: State;
    user_auth: UserAuth;
    AuditLog?: AuditLog[];
    CourseEnrollment?: CourseEnrollment[];
    ComplianceCheck?: ComplianceCheck[];
    ESignature?: ESignature[];
}

export interface Course {
    id: number;
    title: string;
    description: string;
    thumbnail?: string;
    duration_hours: number;
    training_type: 'UNARMED' | 'ARMED' | 'REFRESHER';
    delivery_mode: 'ONLINE' | 'IN_PERSON' | 'HYBRID';
    price: number;
    state_id: number;
    is_active: boolean;
}

export interface CourseEnrollment {
    id: number;
    user_id: number;
    course_id: number;
    status: EnrollmentStatus;
    progress: number;
    seat_time_min: number;
    last_activity?: string | null;
    started_at: string;
    completed_at?: string | null;
    course: Course;
    lessonProgress?: LessonProgress[];
}

// ============================================================================
// INPUT TYPES (for create/update operations)
// ============================================================================

export interface CreateStudentInput {
    first_name: string;
    last_name: string;
    email: string;
    username: string;
    password?: string;
    phone?: string;
    state_id?: number;
    enrollment_date?: string;
    avatar?: string;
    bio?: string;
}

export interface UpdateStudentInput extends Partial<CreateStudentInput> {
    status?: StudentStatus;
}

// ============================================================================
// FILTER TYPES (for queries)
// ============================================================================

export interface StudentFilters {
    search?: string;
    state_id?: number;
    status?: StudentStatus;
    enrollment_date_from?: string;
    enrollment_date_to?: string;
}

// ============================================================================
// EXTENDED TYPES (with relations)
// ============================================================================

export interface StudentWithEnrollments extends Student {
    enrollments: CourseEnrollment[];
    totalCourses: number;
    completedCourses: number;
    averageProgress: number;
}
