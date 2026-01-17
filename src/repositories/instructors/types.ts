export interface Instructor {
    id: number;
    name: string;
    email: string;
    license: string;
    state: string;
    expiry: string;
    status: 'active' | 'expired' | 'pending';
    userId?: number;
    licenseNo?: string;
    licenseExpiry?: Date;
    stateId?: number;
    createdAt?: Date;
    updatedAt?: Date;
    user?: {
        id: number;
        firstName: string;
        lastName: string;
        email: string;
        phone?: string;
        avatar?: string;
    };
    assignedCourses?: number[];
}

// For the Instructor model from Prisma
export interface PrismaInstructor {
    id: number;
    user_id: number;
    state_id: number;
    license_no: string | null;
    license_expiry: Date | null;
    created_at: Date;
    updated_at: Date;
    user?: {
        id: number;
        first_name: string;
        last_name: string;
        email: string | null;
        phone: string | null;
        avatar: string | null;
    };
    state?: {
        id: number;
        name: string;
        code: string;
    };
    assigned_courses?: number[];
}
