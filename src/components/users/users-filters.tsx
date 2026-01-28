import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Search, ChevronDown, Calendar, SlidersHorizontal, X } from 'lucide-react';
// import type { User } from '@/repositories/auth';

interface UsersFiltersProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    roleFilter: string;
    onRoleChange: (value: string) => void;
    statusFilter: string;
    onStatusChange: (value: string) => void;
    onDateFilterClick: () => void;
    selectedCount: number;
    onBulkAction: (action: string) => void;
}

export function UsersFilters({
    searchTerm,
    onSearchChange,
    roleFilter,
    onRoleChange,
    statusFilter,
    onStatusChange,
    onDateFilterClick,
    selectedCount,
    onBulkAction,
}: UsersFiltersProps) {
    // Helper to get display name for filters
    const getRoleDisplay = (value: string) => {
        if (value === 'Student') return 'Student';
        if (value === 'Instructor') return 'Instructor';
        return null;
    };

    const getStatusDisplay = (value: string) => {
        if (value === 'Active') return 'Active';
        if (value === 'Suspended') return 'Suspended';
        return null;
    };

    // Active filters for chips
    const activeFilters: { key: string; label: string; onRemove: () => void }[] = [];

    if (roleFilter && roleFilter !== 'all') {
        const display = getRoleDisplay(roleFilter);
        if (display) {
            activeFilters.push({
                key: 'role',
                label: display,
                onRemove: () => onRoleChange('all'),
            });
        }
    }

    if (statusFilter && statusFilter !== 'All Users') {
        const display = getStatusDisplay(statusFilter);
        if (display) {
            activeFilters.push({
                key: 'status',
                label: display,
                onRemove: () => onStatusChange('All Users'),
            });
        }
    }

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-3">
                {/* Bulk Actions Dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            className="gap-2 border-gray-200"
                            disabled={selectedCount === 0}
                        >
                            Bulk Actions
                            <ChevronDown className="w-4 h-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-48">
                        <DropdownMenuItem onClick={() => onBulkAction('Send Email')}>
                            Send Email
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onBulkAction('Delete')}>
                            Delete
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onBulkAction('Activate Users')}>
                            Activate Users
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onBulkAction('Suspend Users')}>
                            Suspend Users
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onBulkAction('Export Data')}>
                            Export Data
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Search */}
                <div className="relative flex-1 max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                        placeholder="Search for users"
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-10 bg-white border-gray-200"
                    />
                </div>

                {/* Spacer */}
                <div className="flex-1" />

                {/* Active Filter Chips */}
                <div className="flex items-center gap-2">
                    {activeFilters.map((filter) => (
                        <Button
                            key={filter.key}
                            variant="outline"
                            size="sm"
                            className="h-9 px-3 gap-2 border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                            onClick={filter.onRemove}
                        >
                            {filter.label}
                            <X className="w-3 h-3" />
                        </Button>
                    ))}
                </div>

                {/* Filters Button with Popover */}
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="gap-2 border-gray-200">
                            <SlidersHorizontal className="w-4 h-4" />
                            Filters
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-72" align="end">
                        <div className="space-y-4">
                            <h4 className="font-medium text-sm">Filter Users</h4>
                            
                            {/* Role Filter */}
                            <div className="space-y-2">
                                <label className="text-sm text-gray-600">Role</label>
                                <Select value={roleFilter} onValueChange={onRoleChange}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Roles</SelectItem>
                                        <SelectItem value="Student">Student</SelectItem>
                                        <SelectItem value="Instructor">Instructor</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Status Filter */}
                            <div className="space-y-2">
                                <label className="text-sm text-gray-600">Status</label>
                                <Select value={statusFilter} onValueChange={onStatusChange}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="All Users">All Users</SelectItem>
                                        <SelectItem value="Active">Active</SelectItem>
                                        <SelectItem value="Suspended">Suspended</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Joined Date Filter */}
                            <div className="space-y-2">
                                <label className="text-sm text-gray-600">Joined Date</label>
                                <Button
                                    variant="outline"
                                    className="w-full gap-2 justify-start"
                                    onClick={onDateFilterClick}
                                >
                                    <Calendar className="w-4 h-4" />
                                    Select Date Range
                                </Button>
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    );
}
