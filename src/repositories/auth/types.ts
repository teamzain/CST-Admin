export interface User {
    id: string;
    email: string;
    name: string;
    role: 'admin';
    createdAt: string;
}

export interface LoginCredentials {
    identifier: string;
    password: string;
}

export interface LoginResponse {
    user: User;
    access_token: string;
    refresh_token: string;
}

export interface AuthError {
    message: string;
    field?: string;
}

export interface ForgotPasswordRequest {
    email: string;
}

export interface ResetPasswordRequest {
    token: string;
    password: string;
}

export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
}
