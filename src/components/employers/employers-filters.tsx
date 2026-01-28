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

interface EmployersFiltersProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    industryFilter: string;
    onIndustryChange: (value: string) => void;
    statusFilter: string;
    onStatusChange: (value: string) => void;
    seatUtilizationFilter: string;
    onSeatUtilizationChange: (value: string) => void;
}

export function EmployersFilters({
    searchTerm,
    onSearchChange,
    industryFilter,
    onIndustryChange,
    statusFilter,
    onStatusChange,
    seatUtilizationFilter,
    onSeatUtilizationChange,
}: EmployersFiltersProps) {
    const industries = ['Security Services', 'Corporate', 'Healthcare', 'Education', 'Government'];
    
    // Helper to get display name for filters
    const getIndustryDisplay = (value: string) => {
        if (value && value !== 'all') return value;
        return null;
    };

    const getStatusDisplay = (value: string) => {
        if (value === 'active') return 'Active';
        if (value === 'inactive') return 'Inactive';
        if (value === 'pending') return 'Pending';
        return null;
    };

    const getSeatUtilizationDisplay = (value: string) => {
        if (value === 'high') return 'High Utilization (80%+)';
        if (value === 'medium') return 'Medium Utilization (50-79%)';
        if (value === 'low') return 'Low Utilization (<50%)';
        return null;
    };

    // Active filters for chips
    const activeFilters: { key: string; label: string; onRemove: () => void }[] = [];

    if (industryFilter && industryFilter !== 'all') {
        const display = getIndustryDisplay(industryFilter);
        if (display) {
            activeFilters.push({
                key: 'industry',
                label: display,
                onRemove: () => onIndustryChange('all'),
            });
        }
    }

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

    if (seatUtilizationFilter && seatUtilizationFilter !== 'all') {
        const display = getSeatUtilizationDisplay(seatUtilizationFilter);
        if (display) {
            activeFilters.push({
                key: 'seatUtilization',
                label: display,
                onRemove: () => onSeatUtilizationChange('all'),
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
                        placeholder="Search for employers"
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
                            <h4 className="font-medium text-sm">Filter Employers</h4>
                            
                            {/* Industry Filter */}
                            <div className="space-y-2">
                                <label className="text-sm text-gray-600">Industry</label>
                                <Select value={industryFilter} onValueChange={onIndustryChange}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select industry" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Industries</SelectItem>
                                        {industries.map((industry) => (
                                            <SelectItem key={industry} value={industry}>
                                                {industry}
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
                                        <SelectItem value="all">All Status</SelectItem>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="inactive">Inactive</SelectItem>
                                        <SelectItem value="pending">Pending</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Seat Utilization Filter */}
                            <div className="space-y-2">
                                <label className="text-sm text-gray-600">Seat Utilization</label>
                                <Select value={seatUtilizationFilter} onValueChange={onSeatUtilizationChange}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select utilization" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Utilization</SelectItem>
                                        <SelectItem value="high">High (80%+)</SelectItem>
                                        <SelectItem value="medium">Medium (50-79%)</SelectItem>
                                        <SelectItem value="low">Low (&lt;50%)</SelectItem>
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