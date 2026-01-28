import { SearchBar } from './search-bar';
import { NotificationBell } from './notification-bell';
import { ProfileDropdown } from './profile-dropdown';

export const TopNavigation = () => {
    return (
        <nav className="bg-white h-17.25 shadow-sm p-6 flex justify-between items-center sticky top-0 z-40">
            <SearchBar />

            <div className="flex items-center gap-2">
                <NotificationBell />
                <ProfileDropdown />
            </div>
        </nav>
    );
};
