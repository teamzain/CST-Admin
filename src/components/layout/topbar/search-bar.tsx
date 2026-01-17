import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export const SearchBar = () => {
    return (
        <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
                type="search"
                placeholder="Search anything"
                className="pl-10 bg-background border border-input focus-visible:ring-0 focus-visible:border-[#2C2C2C] dark:focus-visible:border-[#E0E0E0]"
            />
        </div>
    );
};
