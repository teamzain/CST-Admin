import { authApi } from '@/api';
import { AUTH_ROUTES } from '@/config/routes';

import type {
    LoginCredentials,
    LoginResponse,
    User,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    ChangePasswordRequest,
} from './types';

export class AuthRepository {
    async login(credentials: LoginCredentials): Promise<LoginResponse> {
        const { data } = await authApi.post<LoginResponse>(
            AUTH_ROUTES.LOGIN.url,
            credentials
        );
        return data;
    }

    async logout(): Promise<void> {
        await authApi.post(AUTH_ROUTES.LOGOUT.url);
    }

    async getCurrentUser(): Promise<User> {
        const { data } = await authApi.get<User>(
            AUTH_ROUTES.GET_CURRENT_USER.url
        );
        return data;
    }

    async refreshToken(refreshToken: string): Promise<LoginResponse> {
        const { data } = await authApi.post<LoginResponse>(
            AUTH_ROUTES.REFRESH_TOKEN.url,
            { refreshToken }
        );
        return data;
    }

    async register(userData: {
        name: string;
        email: string;
        password: string;
    }): Promise<LoginResponse> {
        const { data } = await authApi.post<LoginResponse>(
            AUTH_ROUTES.REGISTER.url,
            userData
        );
        return data;
    }

    async forgotPassword(request: ForgotPasswordRequest): Promise<void> {
        await authApi.post(AUTH_ROUTES.FORGOT_PASSWORD.url, request);
    }

    async resetPassword(request: ResetPasswordRequest): Promise<void> {
        await authApi.post(AUTH_ROUTES.RESET_PASSWORD.url, request);
    }

    async verifyEmail(token: string): Promise<void> {
        await authApi.put(AUTH_ROUTES.VERIFY_EMAIL.url, { token });
    }

    async changePassword(request: ChangePasswordRequest): Promise<void> {
        await authApi.put(AUTH_ROUTES.CHANGE_PASSWORD.url, request);
    }
}

export const authRepository = new AuthRepository();
