import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from './lib/query-client.ts';
import { BrowserRouter } from 'react-router-dom';

// Initialize token from environment on app startup
const initializeAuth = () => {
    const envToken = import.meta.env.VITE_ADMIN_TOKEN;
    if (envToken && !localStorage.getItem('token')) {
        localStorage.setItem('token', envToken);
    }
};

initializeAuth();

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <QueryClientProvider client={queryClient}>
                <App />
                <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
        </BrowserRouter>
    </StrictMode>
);
