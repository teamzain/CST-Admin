import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Search } from 'lucide-react';

interface StatesFiltersProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    statusFilter: string;
    onStatusChange: (value: string) => void;
}

export function StatesFilters({
    searchTerm,
    onSearchChange,
    statusFilter,
    onStatusChange,
}: StatesFiltersProps) {
    return (
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
            <div className="flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center">
                <div className="flex flex-wrap gap-2 lg:gap-4 flex-1">
                    {/* Search */}
                    <div className="relative flex-1 min-w-[200px] lg:max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                            placeholder="Search states..."
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    {/* Status Filter */}
                    <Select value={statusFilter} onValueChange={onStatusChange}>
                        <SelectTrigger className="w-full sm:w-32 gap-2">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="true">Published</SelectItem>
                            <SelectItem value="false">Unpublished</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    );
}
