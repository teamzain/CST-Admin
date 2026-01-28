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

    // Helper to get display name for filters
    const getStatusDisplay = (value: string) => {
        if (value && value !== 'All Status' && value !== 'all') {
            return value.charAt(0).toUpperCase() + value.slice(1);
        }
        return null;
    };

    const getStateDisplay = (value: string) => {
        if (value && value !== 'all') return value;
        return null;
    };

    // Active filters for chips
    const activeFilters: { key: string; label: string; onRemove: () => void }[] = [];

    if (statusFilter && statusFilter !== 'All Status' && statusFilter !== 'all') {
        const display = getStatusDisplay(statusFilter);
        if (display) {
            activeFilters.push({
                key: 'status',
                label: display,
                onRemove: () => onStatusChange('All Status'),
            });
        }
    }

    if (stateFilter && stateFilter !== 'all') {
        const display = getStateDisplay(stateFilter);
        if (display) {
            activeFilters.push({
                key: 'state',
                label: display,
                onRemove: () => onStateChange('all'),
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
                    <DropdownMenuItem onClick={() => onBulkAction('Export Data')}>
                        Export Data
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onBulkAction('Renew Licenses')}>
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

            {/* Search */}
            <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                    placeholder="Search for instructors"
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
                        <h4 className="font-medium text-sm">Filter Instructors</h4>
                        
                        {/* State Filter */}
                        <div className="space-y-2">
                            <label className="text-sm text-gray-600">State</label>
                            <Select value={stateFilter} onValueChange={onStateChange}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select state" />
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
                        </div>

                        {/* Status Filter */}
                        <div className="space-y-2">
                            <label className="text-sm text-gray-600">Status</label>
                            <Select value={statusFilter} onValueChange={onStatusChange}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="All Status">All Status</SelectItem>
                                    {statuses.map((status) => (
                                        <SelectItem key={status} value={status}>
                                            {status.charAt(0).toUpperCase() + status.slice(1)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Expiry Date Filter */}
                        <div className="space-y-2">
                            <label className="text-sm text-gray-600">Expiry Date</label>
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
