import { create } from 'zustand';

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
    state_id: number;
    instructor_id?: number;
    is_active: boolean;
    published_at?: Date;
    created_at: Date;
    updated_at: Date;
    instructor?: {
        id: number;
        name: string;
    };
    state?: {
        id: number;
        name: string;
    };
    enrolled_students?: number;
}

// Dummy data for states
export const dummyStates = [
    {
        id: 1,
        name: 'Illinois',
        code: 'IL',
        unarmed_hours: 20,
        armed_hours: 40,
        unarmed_passing_score: 70,
        armed_passing_score: 80,
        requires_range_training: true,
        certificate_validity_years: 1
    },
    {
        id: 2,
        name: 'Texas',
        code: 'TX',
        unarmed_hours: 6,
        armed_hours: 30,
        unarmed_passing_score: 70,
        armed_passing_score: 75,
        requires_range_training: true,
        certificate_validity_years: 2
    },
    {
        id: 3,
        name: 'California',
        code: 'CA',
        unarmed_hours: 8,
        armed_hours: 32,
        unarmed_passing_score: 75,
        armed_passing_score: 85,
        requires_range_training: true,
        certificate_validity_years: 1
    },
    {
        id: 4,
        name: 'Florida',
        code: 'FL',
        unarmed_hours: 40,
        armed_hours: 28,
        unarmed_passing_score: 70,
        armed_passing_score: 70,
        requires_range_training: true,
        certificate_validity_years: 2
    },
    {
        id: 5,
        name: 'New York',
        code: 'NY',
        unarmed_hours: 16,
        armed_hours: 47,
        unarmed_passing_score: 70,
        armed_passing_score: 80,
        requires_range_training: false,
        certificate_validity_years: 1
    },
];

// Dummy data for instructors
export const dummyInstructors = [
    { id: 1, name: 'John Doe', avatar: 'https://github.com/shadcn.png' },
    { id: 2, name: 'Jane Smith', avatar: 'https://github.com/shadcn.png' },
    { id: 3, name: 'Mike Johnson', avatar: 'https://github.com/shadcn.png' },
    { id: 4, name: 'Sarah Williams', avatar: 'https://github.com/shadcn.png' },
    { id: 5, name: 'David Brown', avatar: 'https://github.com/shadcn.png' },
    { id: 6, name: 'Emily Davis', avatar: 'https://github.com/shadcn.png' },
];

export const initialCourses: Course[] = [
    {
        id: 1,
        title: 'Illinois Unarmed 20-Hour',
        description: 'Comprehensive unarmed security training course covering basic techniques and procedures.',
        thumbnail: 'https://via.placeholder.com/150',
        duration_hours: 20,
        training_type: TRAINING_TYPE.UNARMED,
        delivery_mode: DELIVERY_MODE.IN_PERSON,
        required_hours: 20,
        is_refresher: false,
        location: 'Chicago, IL',
        pre_requirements: ['High School Diploma', 'Valid ID'],
        requires_exam: true,
        requires_range: false,
        attendance_required: true,
        attendance_enabled: true,
        requires_id_verification: true,
        price: 199,
        is_price_negotiable: false,
        state_id: 1,
        instructor_id: 1,
        is_active: true,
        published_at: new Date('2024-01-15'),
        created_at: new Date('2024-01-01'),
        updated_at: new Date('2024-01-15'),
        instructor: dummyInstructors[0],
        state: dummyStates[0],
        enrolled_students: 45,
    },
    {
        id: 2,
        title: 'Illinois Armed 40-Hour',
        description: 'Advanced armed security training with firearms certification.',
        thumbnail: 'https://via.placeholder.com/150',
        duration_hours: 40,
        training_type: TRAINING_TYPE.ARMED,
        delivery_mode: DELIVERY_MODE.IN_PERSON,
        required_hours: 40,
        is_refresher: false,
        location: 'Chicago, IL',
        pre_requirements: ['Valid License', 'Background Check'],
        requires_exam: true,
        requires_range: true,
        attendance_required: true,
        attendance_enabled: true,
        requires_id_verification: true,
        price: 499,
        is_price_negotiable: false,
        state_id: 1,
        instructor_id: 2,
        is_active: true,
        published_at: new Date('2024-01-10'),
        created_at: new Date('2024-01-01'),
        updated_at: new Date('2024-01-10'),
        instructor: dummyInstructors[1],
        state: dummyStates[0],
        enrolled_students: 28,
    },
    {
        id: 3,
        title: 'Texas Unarmed 6-Hour',
        description: 'Quick refresher course on basic security procedures.',
        thumbnail: 'https://via.placeholder.com/150',
        duration_hours: 6,
        training_type: TRAINING_TYPE.UNARMED,
        delivery_mode: DELIVERY_MODE.ONLINE,
        required_hours: 6,
        is_refresher: true,
        pre_requirements: ['Registered Account'],
        requires_exam: false,
        requires_range: false,
        attendance_required: false,
        attendance_enabled: false,
        requires_id_verification: false,
        price: 79,
        is_price_negotiable: false,
        state_id: 2,
        instructor_id: 3,
        is_active: true,
        published_at: new Date('2024-02-01'),
        created_at: new Date('2024-01-20'),
        updated_at: new Date('2024-02-01'),
        instructor: dummyInstructors[2],
        state: dummyStates[1],
        enrolled_students: 120,
    },
    {
        id: 4,
        title: 'California Armed 32-Hour',
        description: 'State-specific armed security certification program.',
        thumbnail: 'https://via.placeholder.com/150',
        duration_hours: 32,
        training_type: TRAINING_TYPE.ARMED,
        delivery_mode: DELIVERY_MODE.HYBRID,
        required_hours: 32,
        is_refresher: false,
        location: 'Los Angeles, CA',
        pre_requirements: ['Valid License', 'Medical Clearance'],
        requires_exam: true,
        requires_range: true,
        attendance_required: true,
        attendance_enabled: true,
        requires_id_verification: true,
        price: 449,
        is_price_negotiable: true,
        state_id: 3,
        instructor_id: 4,
        is_active: false,
        created_at: new Date('2024-01-05'),
        updated_at: new Date('2024-01-05'),
        instructor: dummyInstructors[3],
        state: dummyStates[2],
        enrolled_students: 0,
    },
    {
        id: 5,
        title: 'Florida Refresher Course',
        description: 'Annual refresher training for active security professionals.',
        thumbnail: 'https://via.placeholder.com/150',
        duration_hours: 8,
        training_type: TRAINING_TYPE.REFRESHER,
        delivery_mode: DELIVERY_MODE.ONLINE,
        required_hours: 8,
        is_refresher: true,
        pre_requirements: ['Valid License'],
        requires_exam: false,
        requires_range: false,
        attendance_required: false,
        attendance_enabled: true,
        requires_id_verification: false,
        price: 99,
        is_price_negotiable: false,
        state_id: 4,
        instructor_id: 5,
        is_active: true,
        published_at: new Date('2024-03-01'),
        created_at: new Date('2024-02-15'),
        updated_at: new Date('2024-03-01'),
        instructor: dummyInstructors[4],
        state: dummyStates[3],
        enrolled_students: 34,
    },
    {
        id: 6,
        title: 'New York Basic Training',
        description: 'Basic security training meeting NY state requirements.',
        thumbnail: 'https://via.placeholder.com/150',
        duration_hours: 16,
        training_type: TRAINING_TYPE.UNARMED,
        delivery_mode: DELIVERY_MODE.IN_PERSON,
        required_hours: 16,
        is_refresher: false,
        location: 'New York, NY',
        pre_requirements: ['High School Diploma', 'Background Check'],
        requires_exam: true,
        requires_range: false,
        attendance_required: true,
        attendance_enabled: true,
        requires_id_verification: true,
        price: 149,
        is_price_negotiable: false,
        state_id: 5,
        instructor_id: 6,
        is_active: true,
        published_at: new Date('2024-02-20'),
        created_at: new Date('2024-02-10'),
        updated_at: new Date('2024-02-20'),
        instructor: dummyInstructors[5],
        state: dummyStates[4],
        enrolled_students: 22,
    },
    {
        id: 7,
        title: 'Advanced Pistol Marksmanship',
        description: 'Advanced firearms training with emphasis on accuracy and safety.',
        thumbnail: 'https://via.placeholder.com/150',
        duration_hours: 10,
        training_type: TRAINING_TYPE.ARMED,
        delivery_mode: DELIVERY_MODE.IN_PERSON,
        required_hours: 10,
        is_refresher: false,
        location: 'Chicago, IL',
        pre_requirements: ['Armed License', 'Range Experience'],
        requires_exam: true,
        requires_range: true,
        attendance_required: true,
        attendance_enabled: true,
        requires_id_verification: true,
        price: 299,
        is_price_negotiable: false,
        state_id: 1,
        instructor_id: 1,
        is_active: true,
        published_at: new Date('2024-03-05'),
        created_at: new Date('2024-02-25'),
        updated_at: new Date('2024-03-05'),
        instructor: dummyInstructors[0],
        state: dummyStates[0],
        enrolled_students: 15,
    },
    {
        id: 8,
        title: 'Security Law & Ethics',
        description: 'Comprehensive course on security laws and professional ethics.',
        thumbnail: 'https://via.placeholder.com/150',
        duration_hours: 4,
        training_type: TRAINING_TYPE.UNARMED,
        delivery_mode: DELIVERY_MODE.ONLINE,
        required_hours: 4,
        is_refresher: false,
        pre_requirements: ['None'],
        requires_exam: true,
        requires_range: false,
        attendance_required: false,
        attendance_enabled: false,
        requires_id_verification: false,
        price: 49,
        is_price_negotiable: false,
        state_id: 2,
        instructor_id: 3,
        is_active: true,
        published_at: new Date('2024-01-25'),
        created_at: new Date('2024-01-15'),
        updated_at: new Date('2024-01-25'),
        instructor: dummyInstructors[2],
        state: dummyStates[1],
        enrolled_students: 56,
    },
    {
        id: 9,
        title: 'Crisis Management Workshop',
        description: 'Workshop on handling crisis situations and emergency response.',
        thumbnail: 'https://via.placeholder.com/150',
        duration_hours: 3,
        training_type: TRAINING_TYPE.REFRESHER,
        delivery_mode: DELIVERY_MODE.HYBRID,
        required_hours: 3,
        is_refresher: false,
        pre_requirements: ['Basic Training'],
        requires_exam: false,
        requires_range: false,
        attendance_required: false,
        attendance_enabled: true,
        requires_id_verification: false,
        price: 89,
        is_price_negotiable: false,
        state_id: 4,
        instructor_id: 2,
        is_active: false,
        created_at: new Date('2024-01-10'),
        updated_at: new Date('2024-01-10'),
        instructor: dummyInstructors[1],
        state: dummyStates[3],
        enrolled_students: 0,
    },
    {
        id: 10,
        title: 'Active Shooter Response',
        description: 'Specialized training for response to active threat situations.',
        thumbnail: 'https://via.placeholder.com/150',
        duration_hours: 8,
        training_type: TRAINING_TYPE.ARMED,
        delivery_mode: DELIVERY_MODE.IN_PERSON,
        required_hours: 8,
        is_refresher: false,
        location: 'Los Angeles, CA',
        pre_requirements: ['Armed License', 'Tactical Training'],
        requires_exam: true,
        requires_range: true,
        attendance_required: true,
        attendance_enabled: true,
        requires_id_verification: true,
        price: 199,
        is_price_negotiable: false,
        state_id: 3,
        instructor_id: 4,
        is_active: true,
        published_at: new Date('2024-02-28'),
        created_at: new Date('2024-02-15'),
        updated_at: new Date('2024-02-28'),
        instructor: dummyInstructors[3],
        state: dummyStates[2],
        enrolled_students: 40,
    },
];

interface CoursesStore {
    courses: Course[];
    addCourse: (course: Course) => void;
    updateCourse: (id: number, course: Partial<Course>) => void;
    deleteCourse: (id: number) => void;
    getCourseById: (id: number) => Course | undefined;
}

export const useCoursesStore = create<CoursesStore>((set, get) => ({
    courses: initialCourses,
    addCourse: (course) =>
        set((state) => ({
            courses: [...state.courses, course],
        })),
    updateCourse: (id, courseData) =>
        set((state) => ({
            courses: state.courses.map((course) =>
                course.id === id ? { ...course, ...courseData } : course
            ),
        })),
    deleteCourse: (id) =>
        set((state) => ({
            courses: state.courses.filter((course) => course.id !== id),
        })),
    getCourseById: (id) => {
        const state = get();
        return state.courses.find((course) => course.id === id);
    },
}));