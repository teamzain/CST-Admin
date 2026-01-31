import type { Lesson } from '../lessons/types';
import type { Session } from '../sessions/types';
import type { Quiz } from '../quizzes/types';

export interface Module {
    id: number;
    title: string;
    description?: string;
    order_index: number;
    course_id?: number;
    lessons?: Lesson[];
    sessions?: Session[];
    quizzes?: Quiz[];
    created_at?: Date;
    updated_at?: Date;
}

export interface CreateModuleInput {
    title: string;
    description?: string;
    order_index: number;
}

export type UpdateModuleInput = Partial<CreateModuleInput>;

export interface ModuleFilters {
    course_id?: number;
    search?: string;
}
