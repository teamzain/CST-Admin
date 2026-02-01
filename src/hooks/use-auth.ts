import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authRepository } from '@/repositories/auth';
import { useAuthStore } from '@/stores';
import type { LoginCredentials } from '@/repositories/auth';

export const useLogin = () => {
    const navigate = useNavigate();
    const { setAuth } = useAuthStore();

    return useMutation({
        mutationFn: (credentials: LoginCredentials) =>
            authRepository.login(credentials),
        onSuccess: (data) => {
            setAuth(data.user, data.access_token, data.refresh_token);
            navigate('/dashboard');
        },
    });
};

export const useLogout = () => {
    const queryClient = useQueryClient();
    const { clearAuth } = useAuthStore();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: () => authRepository.logout(),
        onSettled: () => {
            clearAuth();
            queryClient.clear();
            navigate('/login');
        },
    });
};

export const useCurrentUser = () => {
    const { access_token } = useAuthStore();

    return useQuery({
        queryKey: ['currentUser'],
        queryFn: () => authRepository.getCurrentUser(),
        enabled: !!access_token,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

export const useRegister = () => {
    const navigate = useNavigate();
    const { setAuth } = useAuthStore();

    return useMutation({
        mutationFn: (userData: {
            name: string;
            email: string;
            password: string;
        }) => authRepository.register(userData),
        onSuccess: (data) => {
            setAuth(data.user, data.access_token, data.refresh_token);
            navigate('/dashboard');
        },
    });
};
