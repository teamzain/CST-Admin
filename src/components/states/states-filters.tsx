import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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
import { Search, SlidersHorizontal, X } from 'lucide-react';

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
    // Helper to get display name for filters
    const getStatusDisplay = (value: string) => {
        if (value === 'true') return 'Active';
        if (value === 'false') return 'Inactive';
        return null;
    };

    // Active filters for chips
    const activeFilters: { key: string; label: string; onRemove: () => void }[] = [];

    if (statusFilter && statusFilter !== 'all') {
        const display = getStatusDisplay(statusFilter);
        if (display) {
            activeFilters.push({
                key: 'status',
                label: display,
                onRemove: () => onStatusChange('all'),
            });
        }
    }

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-3">
                {/* Search */}
                <div className="relative flex-1 max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                        placeholder="Search for states"
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
                        <h4 className="font-medium text-sm">Filter States</h4>
                        
                        {/* Status Filter */}
                        <div className="space-y-2">
                            <label className="text-sm text-gray-600">Status</label>
                            <Select value={statusFilter} onValueChange={onStatusChange}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="true">Active</SelectItem>
                                    <SelectItem value="false">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
        </div>
    );
}
