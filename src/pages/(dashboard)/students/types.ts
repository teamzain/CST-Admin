export type CourseStatus = 'in-progress' | 'completed';

export interface CourseUnit {
    id: string;
    title: string;
    status: 'done' | 'pending';
    meta?: string;
}

export interface Course {
    id: string;
    title: string;
    thumbnail: string;
    status: CourseStatus;
    enrollmentDate: string;
    progress: number;
    hoursText: string;
    expanded?: boolean;
    units?: CourseUnit[];
}
