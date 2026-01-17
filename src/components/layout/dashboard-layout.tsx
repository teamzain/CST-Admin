import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import { Sidebar } from './sidebar';
import { TopNavigation } from './topbar';

export const DashboardLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const handleToggleSidebar = () => {
        setSidebarOpen((prev) => !prev);
    };

    return (
        <div className="min-h-screen bg-background">
            <Sidebar open={sidebarOpen} toggleSidebar={handleToggleSidebar} />

            <div
                className={`transition-all duration-300 ${
                    sidebarOpen ? 'ml-64' : 'ml-20'
                }`}
            >
                <TopNavigation />

                <main className="p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};
