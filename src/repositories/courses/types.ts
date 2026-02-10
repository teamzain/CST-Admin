export enum TRAINING_TYPE {
    UNARMED = 'UNARMED',
    ARMED = 'ARMED',
    REFRESHER = 'REFRESHER',
}

export enum DELIVERY_MODE {
    ONLINE = 'ONLINE',
    IN_PERSON = 'IN_PERSON',
    HYBRID = 'HYBRID',
}

export interface Course {
    id: number;
    title: string;
    description: string;
    duration_hours: number;
    required_hours: number;
    training_type: TRAINING_TYPE;
    delivery_mode: DELIVERY_MODE;
    thumbnail?: string;
    price: number;
    state?: {
        id: number;
        name: string;
        code?: string;
    };
    state_id?: number;
    instructor_id?: number;
    instructor?: {
        id: number;
        user_id?: number;
        state_id?: number;
        license_no?: string;
        license_expiry?: Date;
        created_at?: Date;
        updated_at?: Date;
        user?: {
            id: number;
            username?: string;
            first_name?: string;
            last_name?: string;
            avatar?: string | null;
            email?: string;
            phone?: string | null;
            bio?: string | null;
            link?: string | null;
            role?: string;
            state_id?: number;
            created_at?: Date;
            updated_at?: Date;
        };
    };
    location?: string;
    requires_exam: boolean;
    requires_range: boolean;
    attendance_required: boolean;
    attendance_enabled: boolean;
    requires_id_verification: boolean;
    is_refresher: boolean;
    is_price_negotiable: boolean;
    pre_requirements: string[];
    certificate_template?: string;
    is_active: boolean;
    published_at?: Date;
    created_at: Date;
    updated_at: Date;
    enrolled_students?: number;
    lessons?: Array<{
        id: number;
        title: string;
        duration_min?: number;
    }>;
    enrollments?: unknown[];
    modules?: unknown[];
}

export interface CreateCourseInput {
    title: string;
    description: string;
    duration_hours: number;
    required_hours: number;
    training_type: TRAINING_TYPE;
    delivery_mode: DELIVERY_MODE;
    thumbnail?: string;
    price: number;
    state?: string; // Backend expects state name as string
    location?: string;
    requires_exam: boolean;
    requires_range: boolean;
    attendance_required: boolean;
    attendance_enabled: boolean;
    requires_id_verification: boolean;
    is_refresher: boolean;
    is_price_negotiable: boolean;
    pre_requirements: string[];
    certificate_template?: string;
    instructor_id?: number;
}

export interface UpdateCourseInput extends Partial<CreateCourseInput> {
    is_active?: boolean;
    state_id?: number;
}

export interface CourseFilters {
    search?: string;
    is_active?: boolean;
    training_type?: TRAINING_TYPE;
    delivery_mode?: DELIVERY_MODE;
    instructorId?: number;
    state_id?: number;
}

// Dummy instructors for development - should be replaced with API call
export const dummyInstructors = [
    { id: 1, name: 'John Doe', avatar: 'https://github.com/shadcn.png' },
    { id: 2, name: 'Jane Smith', avatar: 'https://github.com/shadcn.png' },
    { id: 3, name: 'Mike Johnson', avatar: 'https://github.com/shadcn.png' },
    { id: 4, name: 'Sarah Williams', avatar: 'https://github.com/shadcn.png' },
    { id: 5, name: 'David Brown', avatar: 'https://github.com/shadcn.png' },
    { id: 6, name: 'Emily Davis', avatar: 'https://github.com/shadcn.png' },
];
