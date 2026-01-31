import { create } from 'zustand';
import { CoursesRepository } from '@/repositories/courses';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import type { State } from '@/repositories/states';
import type { Module } from '@/repositories/modules';

// Helper function to extract error messages from backend response
const getErrorMessage = (error: unknown): string => {
    if (error instanceof AxiosError) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = error.response?.data as any;
        if (data?.message) {
            // If message is an array of validation errors
            if (Array.isArray(data.message)) {
                return data.message.join(', ');
            }
            // If message is a string
            return data.message;
        }
    }
    return 'Something went wrong';
};

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
    thumbnail?: string;
    duration_hours: number;
    training_type: TRAINING_TYPE;
    delivery_mode: DELIVERY_MODE;
    required_hours: number;
    is_refresher: boolean;
    certificate_template?: string;
    location?: string;
    pre_requirements: string[];
    requires_exam: boolean;
    requires_range: boolean;
    attendance_required: boolean;
    attendance_enabled: boolean;
    requires_id_verification: boolean;
    price: number;
    is_price_negotiable: boolean;
    state_id?: number;
    instructor_id?: number;
    is_active: boolean;
    published_at?: Date;
    created_at: Date;
    updated_at: Date;
    instructor?: {
        id: number;
        name: string;
        avatar?: string;
    };
    state?: {
        id: number;
        name: string;
        code?: string;
    };
    enrolled_students?: number;
    modules?: Module[];
}

// Dummy data for states
export const dummyStates: any[] = [];

// Dummy data for instructors
export const dummyInstructors = [
    { id: 1, name: 'John Doe', avatar: 'https://github.com/shadcn.png' },
    { id: 2, name: 'Jane Smith', avatar: 'https://github.com/shadcn.png' },
    { id: 3, name: 'Mike Johnson', avatar: 'https://github.com/shadcn.png' },
    { id: 4, name: 'Sarah Williams', avatar: 'https://github.com/shadcn.png' },
    { id: 5, name: 'David Brown', avatar: 'https://github.com/shadcn.png' },
    { id: 6, name: 'Emily Davis', avatar: 'https://github.com/shadcn.png' },
];

export const initialCourses: Course[] = [];

interface CoursesStore {
    courses: Course[];
    isLoading: boolean;
    error: string | null;
    currentFilters: {
        search?: string;
        is_active?: boolean;
        training_type?: string;
        delivery_mode?: string;
        instructor_id?: number;
        state_id?: number;
    };
    fetchCourses: (filters?: Record<string, unknown>) => Promise<void>;
    fetchCourseById: (id: number) => Promise<Course | undefined>;
    addCourse: (course: Omit<Course, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
    updateCourse: (id: number, courseData: Partial<Course>) => Promise<void>;
    deleteCourse: (id: number) => Promise<void>;
    permanentDeleteCourse: (id: number) => Promise<void>;
    publishCourse: (id: number) => Promise<void>;
    unpublishCourse: (id: number) => Promise<void>;
    getCourseById: (id: number) => Course | undefined;
    setFilters: (filters: Record<string, unknown>) => void;
}

export const useCoursesStore = create<CoursesStore>((set, get) => ({
    courses: initialCourses,
    isLoading: false,
    error: null,
    currentFilters: {
        is_active: true,
    },

    fetchCourses: async (filters?: Record<string, unknown>) => {
        set({ isLoading: true, error: null });
        try {
            const queryFilters = {
                search: filters?.search as string | undefined,
                is_active: filters?.is_active !== undefined ? Boolean(filters.is_active) : undefined,
                training_type: filters?.training_type as TRAINING_TYPE | undefined,
                delivery_mode: filters?.delivery_mode as DELIVERY_MODE | undefined,
                instructorId: filters?.instructor_id as number | undefined,
                state_id: filters?.state_id as number | undefined,
            };

            const apiCourses = await CoursesRepository.getAll(queryFilters);

            // Fetch states to populate state objects in courses
            let allStates: State[] = dummyStates;
            try {
                allStates = await (await import('@/repositories/states')).StatesRepository.getAll();
            } catch (error) {
                console.warn('Failed to fetch states from API, using dummy states:', error);
            }

            // Convert API courses to store courses and populate state object
            const courses = apiCourses.map((c: { state_id?: number; created_at: string | Date; updated_at: string | Date }) => {
                const stateObj = allStates.find(s => s.id === c.state_id);
                return {
                    ...c,
                    state: stateObj,
                    created_at: new Date(c.created_at),
                    updated_at: new Date(c.updated_at),
                } as Course;
            });
            set((state) => ({ ...state, courses, currentFilters: queryFilters }));
        } catch (error) {
            console.error('Failed to fetch courses:', error);
            set({ isLoading: false });
        } finally {
            set({ isLoading: false });
        }
    },

    fetchCourseById: async (id: number) => {
        set({ isLoading: true, error: null });
        try {
            const apiCourse = await CoursesRepository.getById(id);

            // Fetch states to populate state object
            let allStates: State[] = dummyStates;
            try {
                allStates = await (await import('@/repositories/states')).StatesRepository.getAll();
            } catch (error) {
                console.warn('Failed to fetch states:', error);
            }

            const stateObj = allStates.find(s => s.id === apiCourse.state_id);
            const convertedCourse = {
                ...apiCourse,
                state: stateObj,
                created_at: new Date(apiCourse.created_at),
                updated_at: new Date(apiCourse.updated_at),
            } as Course;

            set((state) => {
                const courseExists = state.courses.some(c => c.id === id);
                return {
                    courses: courseExists
                        ? state.courses.map(c => c.id === id ? convertedCourse : c)
                        : [...state.courses, convertedCourse]
                };
            });
            return convertedCourse;
        } catch (error) {
            console.error('Failed to fetch course details:', error);
            return undefined;
        } finally {
            set({ isLoading: false });
        }
    },

    addCourse: async (courseData) => {
        set({ isLoading: true, error: null });
        try {
            const newCourse = await CoursesRepository.create(courseData as never);

            // Fetch states to populate state object
            let allStates: State[] = dummyStates;
            try {
                allStates = await (await import('@/repositories/states')).StatesRepository.getAll();
            } catch (error) {
                console.warn('Failed to fetch states:', error);
            }

            const stateObj = allStates.find(s => s.id === newCourse.state_id);
            const convertedCourse = {
                ...newCourse,
                state: stateObj,
                created_at: new Date(newCourse.created_at),
                updated_at: new Date(newCourse.updated_at),
            } as Course;
            set((state) => ({
                courses: [...state.courses, convertedCourse],
            }));
            toast.success('Course created successfully');
            set({ isLoading: false });
        } catch (error) {
            const errorMessage = getErrorMessage(error);
            console.error('Failed to create course:', error);
            toast.error(errorMessage);
            set({ error: errorMessage, isLoading: false });
        }
    },

    updateCourse: async (id, courseData) => {
        set({ isLoading: true, error: null });
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const dataToSend: any = { ...courseData };

            // Fetch states for state name lookup
            let allStates: State[] = dummyStates;
            try {
                allStates = await (await import('@/repositories/states')).StatesRepository.getAll();
            } catch (error) {
                console.warn('Failed to fetch states:', error);
            }

            if (dataToSend.state_id) {
                const newState = allStates.find(s => s.id === dataToSend.state_id);
                if (newState) {
                    dataToSend.state = newState.name;
                }
                delete dataToSend.state_id;
            } else {
                delete dataToSend.state_id;
            }

            const updated = await CoursesRepository.update(id, dataToSend as never);

            const stateObj = allStates.find(s => s.id === updated.state_id);
            const convertedCourse = {
                ...updated,
                state: stateObj,
                created_at: new Date(updated.created_at),
                updated_at: new Date(updated.updated_at),
            } as Course;
            set((state) => ({
                courses: state.courses.map((c) => (c.id === id ? convertedCourse : c)),
            }));
            toast.success('Course updated successfully');
            set({ isLoading: false });
        } catch (error) {
            const errorMessage = getErrorMessage(error);
            console.error('Failed to update course:', error);
            toast.error(errorMessage);
            set({ error: errorMessage, isLoading: false });
        }
    },

    deleteCourse: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await CoursesRepository.delete(id);
            set((state) => ({
                courses: state.courses.filter((c) => c.id !== id),
            }));
            toast.success('Course deleted successfully');
        } catch (error) {
            console.error('Failed to delete course:', error);
            toast.error('Failed to delete course');
            set({ error: 'Failed to delete course' });
        } finally {
            set({ isLoading: false });
        }
    },

    permanentDeleteCourse: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await CoursesRepository.permanentDelete(id);
            set((state) => ({
                courses: state.courses.filter((c) => c.id !== id),
            }));
            toast.success('Course permanently deleted');
        } catch (error) {
            console.error('Failed to permanently delete course:', error);
            toast.error('Failed to permanently delete course');
            set({ error: 'Failed to permanently delete course' });
        } finally {
            set({ isLoading: false });
        }
    },

    publishCourse: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const updated = await CoursesRepository.publish(id);
            const convertedCourse = {
                ...updated,
                created_at: new Date(updated.created_at),
                updated_at: new Date(updated.updated_at),
            } as Course;
            set((state) => ({
                courses: state.courses.map((c) => (c.id === id ? convertedCourse : c)),
            }));
            toast.success('Course published successfully');
        } catch (error) {
            console.error('Failed to publish course:', error);
            toast.error('Failed to publish course');
            set({ error: 'Failed to publish course' });
        } finally {
            set({ isLoading: false });
        }
    },

    unpublishCourse: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const updated = await CoursesRepository.unpublish(id);
            const convertedCourse = {
                ...updated,
                created_at: new Date(updated.created_at),
                updated_at: new Date(updated.updated_at),
            } as Course;
            set((state) => ({
                courses: state.courses.map((c) => (c.id === id ? convertedCourse : c)),
            }));
            toast.success('Course unpublished successfully');
        } catch (error) {
            console.error('Failed to unpublish course:', error);
            toast.error('Failed to unpublish course');
            set({ error: 'Failed to unpublish course' });
        } finally {
            set({ isLoading: false });
        }
    },

    getCourseById: (id) => {
        const state = get();
        return state.courses.find((course) => course.id === id);
    },

    setFilters: (filters) => {
        set({ currentFilters: filters as never });
    },
}));