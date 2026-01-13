import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import { Bell, Search, LogOut, User, Settings as SettingsIcon, CreditCard } from 'lucide-react'; // Added icons for menu
import { useLogout } from '@/hooks/use-auth';
import { Sidebar } from './sidebar';
import { Input } from '@/components/ui/input';

export const DashboardLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [profileOpen, setProfileOpen] = useState(false);
    const { mutate: logout } = useLogout();

    const handleToggleSidebar = () => {
        setSidebarOpen(prev => !prev);
    };

    return (
        <div className="min-h-screen bg-background">
            <Sidebar open={sidebarOpen} toggleSidebar={handleToggleSidebar} />

            {/* Main Content */}
            <div
                className={`transition-all duration-300 ${
                    sidebarOpen ? 'ml-64' : 'ml-20'
                }`}
            >
                {/* Top Navigation */}
                <nav className="bg-background h-[69px] shadow-sm p-6 flex justify-between items-center sticky top-0 z-40">
                    {/* Search Bar */}
                    <div className="relative w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                            type="search" 
                            placeholder="Search anything" 
                            className="pl-10 bg-background border border-input focus-visible:ring-0 focus-visible:border-[#2C2C2C]"
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <Bell className="w-5 h-5 text-muted-foreground cursor-pointer hover:text-foreground transition-colors" />
                        
                        {/* Profile Dropdown */}
                        <div className="relative">
                            <button 
                                onClick={() => setProfileOpen(!profileOpen)}
                                className="w-10 h-10 rounded-full overflow-hidden border-2 border-transparent hover:border-primary transition-all focus:outline-none focus:ring-2 focus:ring-ring"
                            >
                                <img 
                                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
                                    alt="Profile" 
                                    className="w-full h-full object-cover"
                                />
                            </button>

                            {profileOpen && (
                                <>
                                    <div 
                                        className="fixed inset-0 z-40" 
                                        onClick={() => setProfileOpen(false)} 
                                    />
                                    <div className="absolute right-0 mt-2 w-56 bg-card border rounded-lg shadow-lg py-1 z-50 text-card-foreground animate-in fade-in zoom-in-95 duration-200">
                                        <div className="px-4 py-3 border-b border-border">
                                            <p className="text-sm font-medium">John Doe</p>
                                            <p className="text-xs text-muted-foreground truncate">john@example.com</p>
                                        </div>
                                        <div className="py-1">
                                            <button className="w-full px-4 py-2 text-sm text-left hover:bg-accent hover:text-accent-foreground flex items-center gap-2">
                                                <User className="w-4 h-4" />
                                                Profile
                                            </button>
                                            <button className="w-full px-4 py-2 text-sm text-left hover:bg-accent hover:text-accent-foreground flex items-center gap-2">
                                                <SettingsIcon className="w-4 h-4" />
                                                Settings
                                            </button>
                                            <button className="w-full px-4 py-2 text-sm text-left hover:bg-accent hover:text-accent-foreground flex items-center gap-2">
                                                <CreditCard className="w-4 h-4" />
                                                Billing
                                            </button>
                                        </div>
                                        <div className="py-1 border-t border-border">
                                            <button 
                                                onClick={() => logout()}
                                                className="w-full px-4 py-2 text-sm text-left text-destructive hover:bg-destructive/10 hover:text-destructive flex items-center gap-2"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                Log out
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </nav>

                <main className="p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};
