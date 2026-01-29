import { APP_NAMES } from '@/utils/constants';
import type { TAppConfig } from '@/utils/interfaces/app';

export const IS_DEV: boolean =
    import.meta.env.MODE === 'development' || import.meta.env.MODE === 'dev';

const AppDevConfigs: Record<APP_NAMES, Omit<TAppConfig, 'CORS'>> = {
    [APP_NAMES.ADMIN]: {
        NAME: 'AdminService',
        PORT: 3009,
        DESC: 'Admin Service Admin API',
        VERSION: '1.0.0',
        PREFIX: '/api/admin',
        logger: true,
        swagger: true,
    },
    [APP_NAMES.USER]: {
        NAME: 'UserService',
        PORT: 3010,
        DESC: 'User Service User API',
        VERSION: '1.0.0',
        PREFIX: '/api/user',
        logger: true,
        swagger: true,
    },
    [APP_NAMES.AUTH]: {
        NAME: 'AuthService',
        PORT: 3011,
        DESC: 'AuthService Auth API',
        VERSION: '1.0.0',
        PREFIX: '/api/auth',
        logger: true,
        swagger: true,
    },
    [APP_NAMES.COURSE]: {
        NAME: 'CourseService',
        PORT: 3012,
        DESC: 'Course Service Course API',
        VERSION: '1.0.0',
        PREFIX: '/api/course',
        logger: true,
        swagger: true,
    },
    [APP_NAMES.PAYMENT]: {
        NAME: 'PaymentService',
        PORT: 3013,
        DESC: 'Payment Service Payment API',
        VERSION: '1.0.0',
        PREFIX: '/api/payment',
        logger: true,
        swagger: true,
    },
};

const AppProdConfigs: Record<APP_NAMES, Omit<TAppConfig, 'CORS'>> = {
    [APP_NAMES.ADMIN]: {
        NAME: 'AdminService',
        PORT: 3009,
        DESC: 'Admin Service Admin API',
        VERSION: '1.0.0',
        PREFIX: '/api/admin',
        logger: false,
        swagger: false,
    },
    [APP_NAMES.USER]: {
        NAME: 'UserService',
        PORT: 3010,
        DESC: 'User Service User API',
        VERSION: '1.0.0',
        PREFIX: '/api/user',
        logger: false,
        swagger: false,
    },
    [APP_NAMES.AUTH]: {
        NAME: 'AuthService',
        PORT: 3011,
        DESC: 'AuthService Auth API',
        VERSION: '1.0.0',
        PREFIX: '/api/auth',
        logger: false,
        swagger: false,
    },
    [APP_NAMES.COURSE]: {
        NAME: 'CourseService',
        PORT: 3012,
        DESC: 'Course Service Course API',
        VERSION: '1.0.0',
        PREFIX: '/api/course',
        logger: false,
        swagger: false,
    },
    [APP_NAMES.PAYMENT]: {
        NAME: 'PaymentService',
        PORT: 3013,
        DESC: 'Payment Service Payment API',
        VERSION: '1.0.0',
        PREFIX: '/api/payment',
        logger: false,
        swagger: false,
    },
};

export const getAppConfigs = (app: APP_NAMES): TAppConfig => {
    if (!IS_DEV) {
        return {
            ...AppProdConfigs[app],
            CORS: ['*'],
        };
    } else {
        return {
            ...AppDevConfigs[app],
            CORS: ['http://localhost:3000', 'http://localhost:5173'],
        };
    }
};

export const OAUTH_INFO = {
    ANDROID: {
        GOOGLE_OAUTH_CLIENT_ID: import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID,
        GOOGLE_OAUTH_CLIENT_SECRET: import.meta.env
            .VITE_GOOGLE_AUTH_CLIENT_SECRET,
    },
};

export const RUN_MICRIOSERVICES = !IS_DEV;

/**
 * Helper to get the base API URL for a specific app
 */
export const getBaseApiUrl = (app: APP_NAMES): string => {
    const config = getAppConfigs(app);
    const baseUrl = IS_DEV
        ? `http://localhost:${config.PORT}`
        : `http://72.61.143.234:${config.PORT}`;
    return `${baseUrl}${config.PREFIX}`;
};
