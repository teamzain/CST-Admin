import { Bell } from 'lucide-react';

export const NotificationBell = () => {
    return (
        <button
            className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-accent transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
            aria-label="Notifications"
        >
            <Bell className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
        </button>
    );
};
