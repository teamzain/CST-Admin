import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import { Menu, Bell, User, LogOut } from 'lucide-react';
import { useLogout } from '@/hooks/use-auth';
import { Sidebar } from './sidebar';

export const DashboardLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const { mutate: logout } = useLogout();

    return (
        <div className="min-h-screen bg-background">
            <Sidebar open={sidebarOpen} />

            {/* Main Content */}
            <div
                className={`transition-all duration-300 ${
                    sidebarOpen ? 'ml-64' : 'ml-20'
                }`}
            >
                {/* Top Navigation */}
                <nav className="bg-background shadow-sm p-4 flex justify-between items-center">
                    <button onClick={() => setSidebarOpen((prev) => !prev)}>
                        <Menu className="w-6 h-6" />
                    </button>

                    <div className="flex items-center gap-4">
                        <Bell className="w-5 h-5 cursor-pointer" />
                        <User className="w-5 h-5 cursor-pointer" />
                        <button onClick={() => logout()}>
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </nav>

                <main className="p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};
