import type { RouteObject } from 'react-router-dom';
import { AuthGuard } from '@/components/guard';
import { DashboardLayout } from '@/components/layout';
import DashboardPage from '@/pages/(dashboard)/dashboard';
import CoursesPage from '@/pages/(dashboard)/courses';
import InstructorsPage from '@/pages/(dashboard)/instructors';
import EmployersPage from '@/pages/(dashboard)/employers';
import StudentsPage from '@/pages/(dashboard)/students';

export const dashboardRoutes: RouteObject[] = [
    {
        element: <AuthGuard />,
        children: [
            {
                element: <DashboardLayout />,
                children: [
                    {
                        path: '/',
                        element: <DashboardPage />,
                    },
                    {
                        path: '/courses',
        
                        element: <CoursesPage />,
                    },
                    {
                        path: '/instructors',
                        element: <InstructorsPage />,
                    },
                    {
                        path: '/employers',
                        element: <EmployersPage />,
                    },
                    {
                        path: '/students',
                        element: <StudentsPage />,
                    },
                ],
            },
            
        ],
    },
];
