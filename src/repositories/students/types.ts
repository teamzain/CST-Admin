export enum StudentStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    SUSPENDED = 'SUSPENDED',
}

export interface Student {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    avatar?: string;
    bio?: string;
    status: StudentStatus;
    created_at: Date;
    updated_at: Date;
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
    status: 'IN_PROGRESS' | 'COMPLETED' | 'DROPPED' | 'PENDING';
    progress: number;
    seat_time_min: number;
    last_activity?: Date;
    started_at: Date;
    completed_at?: Date;
    course: Course;
}

export interface StudentWithEnrollments extends Student {
    enrollments: CourseEnrollment[];
    totalCourses: number;
    completedCourses: number;
    averageProgress: number;
}
