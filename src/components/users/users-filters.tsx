import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Search, ChevronDown, Calendar } from 'lucide-react';
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
    return (
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
            <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
                {/* Bulk Actions Dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            className="gap-2 w-full lg:w-auto"
                            disabled={selectedCount === 0}
                        >
                            Bulk Actions
                            <ChevronDown className="w-4 h-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-48">
                        <DropdownMenuItem
                            onClick={() => onBulkAction('Send Email')}
                        >
                            Send Email
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => onBulkAction('Delete')}
                        >
                            Delete
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => onBulkAction('Activate Users')}
                        >
                            Activate Users
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => onBulkAction('Suspend Users')}
                        >
                            Suspend Users
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => onBulkAction('Export Data')}
                        >
                            Export Data
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Search */}
                <div className="relative flex-1 lg:max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                        placeholder="Search by name, email or username"
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-10"
                    />
                </div>

                {/* Filters Row */}
                <div className="flex flex-col sm:flex-row gap-2 lg:gap-4">
                    {/* Role Filter */}
                    <Select value={roleFilter} onValueChange={onRoleChange}>
                        <SelectTrigger className="w-full sm:w-40 gap-2">
                            <SelectValue placeholder="Role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Roles</SelectItem>
                            <SelectItem value="Student">Student</SelectItem>
                            <SelectItem value="Instructor">
                                Instructor
                            </SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Status Filter */}
                    <Select value={statusFilter} onValueChange={onStatusChange}>
                        <SelectTrigger className="w-full sm:w-40 gap-2">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="All Users">All Users</SelectItem>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Suspended">Suspended</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Joined Date Filter */}
                    <Button
                        variant="outline"
                        className="gap-2 w-full sm:w-auto"
                        onClick={onDateFilterClick}
                    >
                        <Calendar className="w-4 h-4" />
                        <span className="hidden sm:inline">Joined Date</span>
                        <span className="sm:hidden">Date</span>
                    </Button>
                </div>
            </div>
        </div>
    );
}
