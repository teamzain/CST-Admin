import type { RouteObject } from 'react-router-dom';
import { AuthGuard } from '@/components/guard';
import { DashboardLayout } from '@/components/layout';
import DashboardPage from '@/pages/(dashboard)/dashboard';
import StatesPage from '@/pages/(dashboard)/states';
import CreateStatePage from '@/pages/(dashboard)/states/create';
import StateDetailsPage from '@/pages/(dashboard)/states/[id]';
import CoursesPage from '@/pages/(dashboard)/courses';
import CreateCoursePage from '@/pages/(dashboard)/courses/create';
import CourseDetailsPage from '@/pages/(dashboard)/courses/[id]';
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
                        path: '/states',
                        element: <StatesPage />,
                    },
                    {
                        path: '/states/create',
                        element: <CreateStatePage />,
                    },
                    {
                        path: '/states/:id',
                        element: <StateDetailsPage />,
                    },
                    {
                        path: '/courses',
                        element: <CoursesPage />,
                    },
                    {
                        path: '/courses/create',
                        element: <CreateCoursePage />,
                    },
                    {
                        path: '/courses/:id',
                        element: <CourseDetailsPage />,
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