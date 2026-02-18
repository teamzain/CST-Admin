import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    LogOut,
    // User,
    Settings as SettingsIcon,
    CreditCard,
} from 'lucide-react';
import { useLogout } from '@/hooks/use-auth';

export const ProfileDropdown = () => {
    const [profileOpen, setProfileOpen] = useState(false);
    const { mutate: logout } = useLogout();
    const navigate = useNavigate();

    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setProfileOpen(false);
            }
        };

        if (profileOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [profileOpen]);

    return (
        <div className="relative" ref={dropdownRef}>
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
                <div className="absolute right-0 mt-2 w-56 bg-card border rounded-lg shadow-lg py-1 z-50 text-card-foreground animate-in fade-in zoom-in-95 duration-200">
                    <div className="px-4 py-3 border-b border-border">
                        <p className="text-sm font-medium">Admin</p>
                        <p className="text-xs text-muted-foreground truncate">
                            Administration
                        </p>
                    </div>
                    <div className="py-1">
                        <button
                            onClick={() => { setProfileOpen(false); navigate('/settings'); }}
                            className="w-full px-4 py-2 text-sm text-left hover:bg-accent hover:text-accent-foreground flex items-center gap-2"
                        >
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
            )}
        </div>
    );
};
