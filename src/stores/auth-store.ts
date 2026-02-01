import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/repositories/auth/types';

interface AuthState {
    user: User | null;
    access_token: string | null;
    refresh_token: string | null;
    isAuthenticated: boolean;
    setAuth: (user: User, access_token: string, refresh_token: string) => void;
    clearAuth: () => void;
    updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            access_token: null,
            refresh_token: null,
            isAuthenticated: false,

            setAuth: (user, access_token, refresh_token) => {
                localStorage.setItem('token', access_token);
                localStorage.setItem('refresh_token', refresh_token);
                set({
                    user,
                    access_token,
                    refresh_token,
                    isAuthenticated: true,
                });
            },

            clearAuth: () => {
                localStorage.removeItem('token');
                localStorage.removeItem('refresh_token');
                localStorage.removeItem('auth-token');
                set({
                    user: null,
                    access_token: null,
                    refresh_token: null,
                    isAuthenticated: false,
                });
            },

            updateUser: (userData) =>
                set((state) => ({
                    user: state.user ? { ...state.user, ...userData } : null,
                })),
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                access_token: state.access_token,
                refresh_token: state.refresh_token,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);
