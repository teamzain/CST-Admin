import type { RouteObject } from 'react-router-dom';
import NotFoundPage from '@/pages/errors/404';

export const publicRoutes: RouteObject[] = [
    {
        path: '*',
        element: <NotFoundPage />,
    },
];
