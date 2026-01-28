import type { RouteObject } from 'react-router-dom';
import LoginPage from '@/pages/(auth)/login';
import { GuestGuard } from '@/components/guard';
import AuthLayout from '@/components/layout/AuthLayout';

export const authRoutes: RouteObject[] = [
    {
        element: <GuestGuard />,
        children: [
            {
                element: <AuthLayout />,
                children: [
                    {
                        path: '/login',
                        element: <LoginPage />,
                    },
                ],
            },
        ],
    },
];
