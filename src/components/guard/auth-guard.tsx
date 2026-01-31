import { Outlet, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores';

export const AuthGuard = () => {
    const { isAuthenticated } = useAuthStore();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};
