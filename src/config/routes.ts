import { APP_NAMES } from '@/utils/constants';

export enum HTTP_METHOD {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    PATCH = 'PATCH',
    DELETE = 'DELETE',
}

export interface RouteConfig {
    url: string;
    method: HTTP_METHOD;
    requiresAuth?: boolean;
    description?: string;
}

export interface ServiceRoutes {
    [key: string]: RouteConfig | ServiceRoutes;
}

/**
 * Authentication Service Routes
 */
export const AUTH_ROUTES = {
    LOGIN: {
        url: '/login',
        method: HTTP_METHOD.POST,
        requiresAuth: false,
        description: 'User login endpoint',
    },
    LOGOUT: {
        url: '/logout',
        method: HTTP_METHOD.POST,
        requiresAuth: true,
        description: 'User logout endpoint',
    },
    REGISTER: {
        url: '/signup',
        method: HTTP_METHOD.POST,
        requiresAuth: false,
        description: 'User registration endpoint',
    },
    REFRESH_TOKEN: {
        url: '/refresh-token',
        method: HTTP_METHOD.POST,
        requiresAuth: false,
        description: 'Refresh access token',
    },
    GET_CURRENT_USER: {
        url: '/me', // Note: This endpoint is in UserService
        method: HTTP_METHOD.GET,
        requiresAuth: true,
        description: 'Get current authenticated user',
    },
    FORGOT_PASSWORD: {
        url: '/forgot-password',
        method: HTTP_METHOD.POST,
        requiresAuth: false,
        description: 'Request password reset',
    },
    RESET_PASSWORD: {
        url: '/reset-password',
        method: HTTP_METHOD.POST,
        requiresAuth: false,
        description: 'Reset password with token',
    },
    VERIFY_EMAIL: {
        url: '/verify-cred',
        method: HTTP_METHOD.PUT,
        requiresAuth: false,
        description: 'Verify email address',
    },
    CHANGE_PASSWORD: {
        url: '/change-password',
        method: HTTP_METHOD.PUT,
        requiresAuth: true,
        description: 'Change user password',
    },
    RESEND_OTP: {
        url: '/resend-otp',
        method: HTTP_METHOD.POST,
        requiresAuth: false,
        description: 'Resend OTP to user',
    },
    GOOGLE_LOGIN: {
        url: '/o-auth/google',
        method: HTTP_METHOD.POST,
        requiresAuth: false,
        description: 'Google OAuth login',
    },
} as const satisfies ServiceRoutes;

/**
 * User Service Routes
 */
export const USER_ROUTES = {
    GET_ALL: {
        url: '/',
        method: HTTP_METHOD.GET,
        requiresAuth: true,
        description: 'Get all users',
    },
    GET_BY_ID: {
        url: '/:id',
        method: HTTP_METHOD.GET,
        requiresAuth: true,
        description: 'Get user by ID',
    },
    GET_PROFILE: {
        url: '/me',
        method: HTTP_METHOD.GET,
        requiresAuth: true,
        description: 'Get current user profile',
    },
    CREATE: {
        url: '/',
        method: HTTP_METHOD.POST,
        requiresAuth: true,
        description: 'Create new user',
    },
    UPDATE: {
        url: '/:id',
        method: HTTP_METHOD.PATCH,
        requiresAuth: true,
        description: 'Update user',
    },
    DELETE: {
        url: '/:id',
        method: HTTP_METHOD.DELETE,
        requiresAuth: true,
        description: 'Delete user',
    },
    UPDATE_PROFILE: {
        url: '/me',
        method: HTTP_METHOD.PATCH,
        requiresAuth: true,
        description: 'Update user profile',
    },
    STUDENTS: {
        GET_ALL: {
            url: '/student',
            method: HTTP_METHOD.GET,
            requiresAuth: true,
            description: 'Get all students',
        },
        GET_BY_ID: {
            url: '/student/:id',
            method: HTTP_METHOD.GET,
            requiresAuth: true,
            description: 'Get student by ID',
        },
        GET_ENROLLMENTS: {
            url: '/users/:id/enrollments',
            method: HTTP_METHOD.GET,
            requiresAuth: true,
            description: 'Get student enrollments',
        },
        CREATE: {
            url: '/student/create',
            method: HTTP_METHOD.POST,
            requiresAuth: true,
            description: 'Create new student',
        },
        UPDATE: {
            url: '/student/:id',
            method: HTTP_METHOD.PATCH,
            requiresAuth: true,
            description: 'Update student',
        },
        DELETE: {
            url: '/student/:id',
            method: HTTP_METHOD.DELETE,
            requiresAuth: true,
            description: 'Delete student',
        },
        SUSPEND: {
            url: '/student/:id/suspend',
            method: HTTP_METHOD.PATCH,
            requiresAuth: true,
            description: 'Suspend student',
        },
        ACTIVATE: {
            url: '/student/:id/activate',
            method: HTTP_METHOD.PATCH,
            requiresAuth: true,
            description: 'Activate student',
        },
    },
    INSTRUCTOR: {
        GET_BY_ID: {
            url: '/instructor/:id',
            method: HTTP_METHOD.GET,
            requiresAuth: true,
            description: 'Get instructor by ID',
        },
        CREATE: {
            url: '/instructor/create',
            method: HTTP_METHOD.POST,
            requiresAuth: true,
            description: 'Create new instructor',
        },
        UPDATE: {
            url: '/instructor/:id',
            method: HTTP_METHOD.PATCH,
            requiresAuth: true,
            description: 'Update instructor',
        },
        DELETE: {
            url: '/:id', // Use general User delete
            method: HTTP_METHOD.DELETE,
            requiresAuth: true,
            description: 'Delete instructor (User)',
        },
    },
    EMPLOYER: {
        GET_ALL: {
            url: '/',
            method: HTTP_METHOD.GET,
            requiresAuth: true,
            description: 'Get all employers',
        },
        GET_BY_ID: {
            url: '/employer/:id',
            method: HTTP_METHOD.GET,
            requiresAuth: true,
            description: 'Get employer by ID',
        },
        CREATE: {
            url: '/employer/create',
            method: HTTP_METHOD.POST,
            requiresAuth: true,
            description: 'Create new employer with profile',
        },
        UPDATE: {
            url: '/employer/:id',
            method: HTTP_METHOD.PATCH,
            requiresAuth: true,
            description: 'Update employer',
        },
        DELETE: {
            url: '/employer/:id',
            method: HTTP_METHOD.DELETE,
            requiresAuth: true,
            description: 'Delete employer',
        },
        PURCHASE_SEATS: {
            url: '/employer/purchase-seats',
            method: HTTP_METHOD.POST,
            requiresAuth: true,
            description: 'Purchase seats for a course',
        },
    },
} as const satisfies ServiceRoutes;

/**
 * Course Service Routes
 */
export const COURSE_ROUTES = {
    GET_ALL: {
        url: '/course',
        method: HTTP_METHOD.GET,
        requiresAuth: true,
        description: 'Get all courses',
    },
    GET_BY_ID: {
        url: '/course/:id',
        method: HTTP_METHOD.GET,
        requiresAuth: true,
        description: 'Get course by ID',
    },
    CREATE: {
        url: '/course',
        method: HTTP_METHOD.POST,
        requiresAuth: true,
        description: 'Create new course',
    },
    UPDATE: {
        url: '/course/:id',
        method: HTTP_METHOD.PATCH,
        requiresAuth: true,
        description: 'Update course',
    },
    DELETE: {
        url: '/course/:id',
        method: HTTP_METHOD.DELETE,
        requiresAuth: true,
        description: 'Delete course',
    },
    ENROLL: {
        url: '/course/:id/enroll',
        method: HTTP_METHOD.POST,
        requiresAuth: true,
        description: 'Enroll in course (Admin/Instructor)',
    },
    SELF_ENROLL: {
        url: '/course/:id/self-enroll',
        method: HTTP_METHOD.POST,
        requiresAuth: true,
        description: 'Self-enroll in course',
    },
    GET_ENROLLED: {
        url: '/course/my/enrollments',
        method: HTTP_METHOD.GET,
        requiresAuth: true,
        description: 'Get enrolled courses',
    },
    MODULES: {
        GET_ALL: {
            url: '/course/:courseId/modules',
            method: HTTP_METHOD.GET,
            requiresAuth: true,
            description: 'Get all modules for a course',
        },
        GET_BY_ID: {
            url: '/course/module/:moduleId',
            method: HTTP_METHOD.GET,
            requiresAuth: true,
            description: 'Get module by ID',
        },
        CREATE: {
            url: '/course/:courseId/modules',
            method: HTTP_METHOD.POST,
            requiresAuth: true,
            description: 'Create new module',
        },
        UPDATE: {
            url: '/course/module/:moduleId',
            method: HTTP_METHOD.PATCH,
            requiresAuth: true,
            description: 'Update module',
        },
        DELETE: {
            url: '/course/module/:moduleId',
            method: HTTP_METHOD.DELETE,
            requiresAuth: true,
            description: 'Delete module',
        },
    },
    SESSIONS: {
        GET_ALL: {
            url: '/course/live-sessions',
            method: HTTP_METHOD.GET,
            requiresAuth: true,
            description: 'Get all sessions across courses',
        },
        GET_BY_COURSE: {
            url: '/course/:courseId/live-sessions',
            method: HTTP_METHOD.GET,
            requiresAuth: true,
            description: 'Get sessions for a specific course',
        },
        GET_BY_ID: {
            url: '/course/live-sessions/:sessionId',
            method: HTTP_METHOD.GET,
            requiresAuth: true,
            description: 'Get session by ID',
        },
        CREATE: {
            url: '/course/:courseId/live-sessions',
            method: HTTP_METHOD.POST,
            requiresAuth: true,
            description: 'Create a new session',
        },
        UPDATE: {
            url: '/course/live-sessions/:sessionId',
            method: HTTP_METHOD.PATCH,
            requiresAuth: true,
            description: 'Update a session',
        },
        DELETE: {
            url: '/course/live-sessions/:sessionId',
            method: HTTP_METHOD.DELETE,
            requiresAuth: true,
            description: 'Delete a session',
        },
    },
    LESSONS: {
        GET_ALL: {
            url: '/course/lessons/all',
            method: HTTP_METHOD.GET,
            requiresAuth: true,
            description: 'Get all lessons across courses',
        },
        GET_BY_ID: {
            url: '/course/lesson/:lessonId',
            method: HTTP_METHOD.GET,
            requiresAuth: true,
            description: 'Get lesson by ID',
        },
        CREATE: {
            url: '/course/:courseId/lessons',
            method: HTTP_METHOD.POST,
            requiresAuth: true,
            description: 'Create a new lesson',
        },
        UPDATE: {
            url: '/course/lesson/:lessonId',
            method: HTTP_METHOD.PATCH,
            requiresAuth: true,
            description: 'Update a lesson',
        },
        DELETE: {
            url: '/course/lesson/:lessonId',
            method: HTTP_METHOD.DELETE,
            requiresAuth: true,
            description: 'Delete a lesson',
        },
        REPLACE_VIDEO: {
            url: '/course/lesson/:lessonId/video',
            method: HTTP_METHOD.PATCH,
            requiresAuth: true,
            description: 'Replace lesson video',
        },
    },
    QUIZZES: {
        GET_ALL: {
            url: '/course/quizzes',
            method: HTTP_METHOD.GET,
            requiresAuth: true,
            description: 'Get all quizzes',
        },
        GET_BY_ID: {
            url: '/course/quiz/:quizId',
            method: HTTP_METHOD.GET,
            requiresAuth: true,
            description: 'Get quiz by ID',
        },
        CREATE: {
            url: '/course/:courseId/quizzes',
            method: HTTP_METHOD.POST,
            requiresAuth: true,
            description: 'Create a new quiz',
        },
        UPDATE: {
            url: '/course/quiz/:quizId',
            method: HTTP_METHOD.PATCH,
            requiresAuth: true,
            description: 'Update a quiz',
        },
        DELETE: {
            url: '/course/quiz/:quizId',
            method: HTTP_METHOD.DELETE,
            requiresAuth: true,
            description: 'Delete a quiz',
        },
    },
    QUESTIONS: {
        GET_BY_QUIZ: {
            url: '/course/quiz/:quizId/questions',
            method: HTTP_METHOD.GET,
            requiresAuth: true,
            description: 'Get all questions for a quiz',
        },
        CREATE: {
            url: '/course/quiz/:quizId/questions',
            method: HTTP_METHOD.POST,
            requiresAuth: true,
            description: 'Create a new question',
        },
        UPDATE: {
            url: '/course/question/:questionId',
            method: HTTP_METHOD.PATCH,
            requiresAuth: true,
            description: 'Update a question',
        },
        DELETE: {
            url: '/course/question/:questionId',
            method: HTTP_METHOD.DELETE,
            requiresAuth: true,
            description: 'Delete a question',
        },
        BULK_IMPORT: {
            url: '/course/quiz/:quizId/questions/bulk-import',
            method: HTTP_METHOD.POST,
            requiresAuth: true,
            description: 'Bulk import questions from file',
        },
    },
} as const satisfies ServiceRoutes;

/**
 * Admin Service Routes
 */
export const ADMIN_ROUTES = {
    DASHBOARD: {
        STATS: {
            url: '/statistics',
            method: HTTP_METHOD.GET,
            requiresAuth: true,
            description: 'Get dashboard statistics',
        },
        ANALYTICS: {
            url: '/analytics',
            method: HTTP_METHOD.GET,
            requiresAuth: true,
            description: 'Get analytics data',
        },
    },
    COUPONS: {
        GET_ALL: {
            url: '/coupons',
            method: HTTP_METHOD.GET,
            requiresAuth: true,
            description: 'Get all coupons',
        },
        GET_BY_ID: {
            url: '/coupons/:id',
            method: HTTP_METHOD.GET,
            requiresAuth: true,
            description: 'Get coupon by ID',
        },
        CREATE: {
            url: '/coupons',
            method: HTTP_METHOD.POST,
            requiresAuth: true,
            description: 'Create a coupon',
        },
        UPDATE: {
            url: '/coupons/:id',
            method: HTTP_METHOD.PATCH,
            requiresAuth: true,
            description: 'Update coupon',
        },
        DELETE: {
            url: '/coupons/:id',
            method: HTTP_METHOD.DELETE,
            requiresAuth: true,
            description: 'Delete coupon',
        },
        APPLY: {
            url: '/coupons/apply',
            method: HTTP_METHOD.POST,
            requiresAuth: true,
            description: 'Apply coupon',
        },
    },
    USERS: {
        GET_ALL: {
            url: '/',
            method: HTTP_METHOD.GET,
            requiresAuth: true,
            description: 'Get all users (admin)',
        },
        UPDATE_ROLE: {
            url: '/admin/users/:id/role',
            method: HTTP_METHOD.PATCH,
            requiresAuth: true,
            description: 'Update user role',
        },
        SUSPEND: {
            url: '/admin/users/:id/suspend',
            method: HTTP_METHOD.POST,
            requiresAuth: true,
            description: 'Suspend user',
        },
        ACTIVATE: {
            url: '/admin/users/:id/activate',
            method: HTTP_METHOD.POST,
            requiresAuth: true,
            description: 'Activate user',
        },
    },
    COURSES: {
        APPROVE: {
            url: '/course/publish/:id',
            method: HTTP_METHOD.PATCH,
            requiresAuth: true,
            description: 'Approve course (Publish)',
        },
        // REJECT: {
        //     url: '/admin/courses/:id/reject',
        //     method: HTTP_METHOD.POST,
        //     requiresAuth: true,
        //     description: 'Reject course',
        // },
    },
    PLATFORM_SETTINGS: {
        CREATE: {
            url: '/platform-settings',
            method: HTTP_METHOD.POST,
            requiresAuth: true,
            description: 'Create platform settings',
        },
        GET_ALL: {
            url: '/platform-settings',
            method: HTTP_METHOD.GET,
            requiresAuth: true,
            description: 'Get all platform settings',
        },
        GET_CURRENT: {
            url: '/platform-settings/current',
            method: HTTP_METHOD.GET,
            requiresAuth: true,
            description: 'Get current/active platform settings',
        },
        GET_BY_ID: {
            url: '/platform-settings/:id',
            method: HTTP_METHOD.GET,
            requiresAuth: true,
            description: 'Get platform settings by ID',
        },
        UPDATE: {
            url: '/platform-settings/:id',
            method: HTTP_METHOD.PATCH,
            requiresAuth: true,
            description: 'Update platform settings',
        },
    },
} as const satisfies ServiceRoutes;

/**
 * Payment Service Routes
 */
export const PAYMENT_ROUTES = {
    CREATE_INTENT: {
        url: '/create-intent',
        method: HTTP_METHOD.POST,
        requiresAuth: true,
        description: 'Create payment intent',
    },
    CREATE_CHECKOUT: {
        url: '/checkout',
        method: HTTP_METHOD.POST,
        requiresAuth: true,
        description: 'Create checkout session',
    },
    VALIDATE_COUPON: {
        url: '/validate-coupon',
        method: HTTP_METHOD.POST,
        requiresAuth: true,
        description: 'Validate a coupon code',
    },
    GET_ORDERS: {
        url: '/orders',
        method: HTTP_METHOD.GET,
        requiresAuth: true,
        description: 'Get user order history',
    },
    GET_ORDER_BY_ID: {
        url: '/orders/:id',
        method: HTTP_METHOD.GET,
        requiresAuth: true,
        description: 'Get specific order details',
    },
    GET_INTENT: {
        url: '/intent/:id',
        method: HTTP_METHOD.GET,
        requiresAuth: true,
        description: 'Get payment intent details',
    },
    CONFIRM: {
        url: '/confirm',
        method: HTTP_METHOD.POST,
        requiresAuth: true,
        description: 'Confirm payment success',
    },
    CANCEL: {
        url: '/cancel/:paymentIntentId',
        method: HTTP_METHOD.POST,
        requiresAuth: true,
        description: 'Cancel payment intent',
    },
    REFUND: {
        url: '/refund/:orderId',
        method: HTTP_METHOD.POST,
        requiresAuth: true,
        description: 'Refund payment (Admin)',
    },
    STATISTICS: {
        url: '/statistics',
        method: HTTP_METHOD.GET,
        requiresAuth: true,
        description: 'Get payment statistics (Admin)',
    },
    WEBHOOK: {
        url: '/webhook',
        method: HTTP_METHOD.POST,
        requiresAuth: false,
        description: 'Payment webhook endpoint',
    },
} as const satisfies ServiceRoutes;

export const API_ROUTES = {
    AUTH: AUTH_ROUTES,
    USER: USER_ROUTES,
    COURSE: COURSE_ROUTES,
    ADMIN: ADMIN_ROUTES,
    PAYMENT: PAYMENT_ROUTES,
} as const;

export const buildUrl = (
    route: RouteConfig,
    params?: Record<string, string | number>
): string => {
    if (!params) return route.url;

    let url = route.url;
    Object.entries(params).forEach(([key, value]) => {
        url = url.replace(`:${key}`, String(value));
    });

    return url;
};

export const buildFullUrl = (
    appName: APP_NAMES,
    route: RouteConfig,
    params?: Record<string, string | number>
): string => {
    const baseUrl =
        import.meta.env.MODE === 'development' || import.meta.env.MODE === 'dev'
            ? `http://localhost:${getPortForApp(appName)}`
            : 'http://72.61.143.234';

    const prefix = getPrefixForApp(appName);
    const path = buildUrl(route, params);
    return `${baseUrl}${prefix}${path}`;
};

const getPortForApp = (app: APP_NAMES): number => {
    const ports: Record<APP_NAMES, number> = {
        [APP_NAMES.ADMIN]: 3009,
        [APP_NAMES.USER]: 3010,
        [APP_NAMES.AUTH]: 3011,
        [APP_NAMES.COURSE]: 3012,
        [APP_NAMES.PAYMENT]: 3013,
    };
    return ports[app];
};

const getPrefixForApp = (app: APP_NAMES): string => {
    const prefixes: Record<APP_NAMES, string> = {
        [APP_NAMES.ADMIN]: '/api/admin',
        [APP_NAMES.USER]: '/api/user',
        [APP_NAMES.AUTH]: '/api/auth',
        [APP_NAMES.COURSE]: '/api/course',
        [APP_NAMES.PAYMENT]: '/api/payment',
    };
    return prefixes[app];
};

export type RouteKeys<T> = {
    [K in keyof T]: T[K] extends RouteConfig
        ? K
        : T[K] extends ServiceRoutes
          ? K
          : never;
}[keyof T];

export type AuthRouteKeys = RouteKeys<typeof AUTH_ROUTES>;
export type UserRouteKeys = RouteKeys<typeof USER_ROUTES>;
export type CourseRouteKeys = RouteKeys<typeof COURSE_ROUTES>;
export type AdminRouteKeys = RouteKeys<typeof ADMIN_ROUTES>;
export type PaymentRouteKeys = RouteKeys<typeof PAYMENT_ROUTES>;
