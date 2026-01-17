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
import StudentDetailsPage from '@/pages/(dashboard)/students/[id]';
import CreateInstructorPage from '@/pages/(dashboard)/instructors/create';
import InstructorDetailsPage from '@/pages/(dashboard)/instructors/[id]';
import AllQuizzesPage from '@/pages/(dashboard)/quizzes';
import QuizDetailsPage from '@/pages/(dashboard)/quizzes/quiz-details';
import AllLessonsPage from '@/pages/(dashboard)/lessons';
import LessonDetailsPage from '@/pages/(dashboard)/lessons/lesson-details';
import AllSessionsPage from '@/pages/(dashboard)/sessions';
import SessionDetailsPage from '@/pages/(dashboard)/sessions/session-details';

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
                        path: '/instructors/:id',
                        element: <InstructorDetailsPage />,
                    },
                    {
                        path: '/instructors/create',
                        element: <CreateInstructorPage />,
                    },
                    {
                        path: '/employers',
                        element: <EmployersPage />,
                    },
                    {
                        path: '/students',
                        element: <StudentsPage />,
                    },
                    {
                        path: '/students/:id',
                        element: <StudentDetailsPage />,
                    },
                    {
                        path: '/quizzes',
                        element: <AllQuizzesPage />,
                    },
                    {
                        path: '/quizzes/:id',
                        element: <QuizDetailsPage />,
                    },
                    {
                        path: '/lessons',
                        element: <AllLessonsPage />,
                    },
                    {
                        path: '/lessons/:id',
                        element: <LessonDetailsPage />,
                    },
                    {
                        path: '/sessions',
                        element: <AllSessionsPage />,
                    },
                    {
                        path: '/sessions/:id',
                        element: <SessionDetailsPage />,
                    },
                ],
            },
        ],
    },
];