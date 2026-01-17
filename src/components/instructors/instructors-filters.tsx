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

interface InstructorsFiltersProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    stateFilter: string;
    onStateChange: (value: string) => void;
    statusFilter: string;
    onStatusChange: (value: string) => void;
    onDateFilterClick: () => void;
    selectedCount: number;
    onBulkAction: (action: string) => void;
}

export function InstructorsFilters({
    searchTerm,
    onSearchChange,
    stateFilter,
    onStateChange,
    statusFilter,
    onStatusChange,
    onDateFilterClick,
    selectedCount,
    onBulkAction,
}: InstructorsFiltersProps) {
    const states = ['Illinois', 'Texas', 'California', 'New York', 'Florida'];
    const statuses = ['active', 'expired', 'pending'];

    return (
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
            <div className="flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center">
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
                            onClick={() => onBulkAction('Export Data')}
                        >
                            Export Data
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => onBulkAction('Renew Licenses')}
                        >
                            Renew Licenses
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => onBulkAction('Delete')}
                            className="text-red-600"
                        >
                            Delete Instructors
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <div className="flex flex-col sm:flex-row gap-2 lg:gap-4">
                    {/* Search */}
                    <div className="relative flex-1 lg:max-w-lg">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                            placeholder="Search by name, email or license"
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    {/* Filters Row */}
                    {/* State Filter */}
                    <Select value={stateFilter} onValueChange={onStateChange}>
                        <SelectTrigger className="w-full sm:w-40 gap-2">
                            <SelectValue placeholder="State" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All States</SelectItem>
                            {states.map((state) => (
                                <SelectItem key={state} value={state}>
                                    {state}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Status Filter */}
                    <Select value={statusFilter} onValueChange={onStatusChange}>
                        <SelectTrigger className="w-full sm:w-40 gap-2">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="All Status">
                                All Status
                            </SelectItem>
                            {statuses.map((status) => (
                                <SelectItem key={status} value={status}>
                                    {status.charAt(0).toUpperCase() +
                                        status.slice(1)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Expiry Date Filter */}
                    <Button
                        variant="outline"
                        className="gap-2 w-full sm:w-auto"
                        onClick={onDateFilterClick}
                    >
                        <Calendar className="w-4 h-4" />
                        <span className="hidden sm:inline">Expiry Date</span>
                        <span className="sm:hidden">Date</span>
                    </Button>
                </div>
            </div>
        </div>
    );
}
