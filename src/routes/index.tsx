import type { RouteObject } from 'react-router-dom';
import { authRoutes } from './auth.routes';
import { dashboardRoutes } from './dashboard.routes';
import { publicRoutes } from './public-routes';

export const routes: RouteObject[] = [
    ...publicRoutes,
    ...authRoutes,
    ...dashboardRoutes,
];
