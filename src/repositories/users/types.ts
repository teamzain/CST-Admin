export interface User {
    id: number;
    name: string;
    email: string;
    userId: number;
    role: 'Student' | 'Instructor' | 'Employer';
    status: 'Active' | 'Suspended' | 'Invited';
    registrationDate: string;
    lastActivity: string;
    avatar: string;
}

export type UserRole = 'Student' | 'Instructor' | 'Employer' | 'all';
export type UserStatus = 'All Users' | 'Active' | 'Suspended' | 'Invited';

export interface DateRange {
    startDate: string;
    endDate: string;
}
