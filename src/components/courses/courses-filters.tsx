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
import { TRAINING_TYPE, DELIVERY_MODE } from '@/stores/courses-store';

interface CoursesFiltersProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    stateFilter: string;
    onStateChange: (value: string) => void;
    statusFilter: string;
    onStatusChange: (value: string) => void;
    typeFilter: string;
    onTypeChange: (value: string) => void;
    modeFilter: string;
    onModeChange: (value: string) => void;
    instructorFilter: string;
    onInstructorChange: (value: string) => void;
    states: [number, string][];
    instructors: [number, string][];
}

export function CoursesFilters({
    searchTerm,
    onSearchChange,
    stateFilter,
    onStateChange,
    statusFilter,
    onStatusChange,
    typeFilter,
    onTypeChange,
    modeFilter,
    onModeChange,
    instructorFilter,
    onInstructorChange,
    states,
    instructors,
}: CoursesFiltersProps) {
    // Helper to get display name for filters
    const getStatusDisplay = (value: string) => {
        if (value === 'true') return 'Published';
        if (value === 'false') return 'Draft';
        return null;
    };

    const getTypeDisplay = (value: string) => {
        if (value === TRAINING_TYPE.UNARMED) return 'Unarmed';
        if (value === TRAINING_TYPE.ARMED) return 'Armed';
        if (value === TRAINING_TYPE.REFRESHER) return 'Refresher';
        return null;
    };

    const getModeDisplay = (value: string) => {
        if (value === DELIVERY_MODE.ONLINE) return 'Online';
        if (value === DELIVERY_MODE.IN_PERSON) return 'In Person';
        if (value === DELIVERY_MODE.HYBRID) return 'Hybrid';
        return null;
    };

    const getStateDisplay = (value: string) => {
        const state = states.find(([id]) => String(id) === value);
        return state ? state[1] : null;
    };

    const getInstructorDisplay = (value: string) => {
        const instructor = instructors.find(([id]) => String(id) === value);
        return instructor ? instructor[1] : null;
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

    if (typeFilter && typeFilter !== 'all') {
        const display = getTypeDisplay(typeFilter);
        if (display) {
            activeFilters.push({
                key: 'type',
                label: display,
                onRemove: () => onTypeChange('all'),
            });
        }
    }

    if (modeFilter && modeFilter !== 'all') {
        const display = getModeDisplay(modeFilter);
        if (display) {
            activeFilters.push({
                key: 'mode',
                label: display,
                onRemove: () => onModeChange('all'),
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

    if (instructorFilter && instructorFilter !== 'all') {
        const display = getInstructorDisplay(instructorFilter);
        if (display) {
            activeFilters.push({
                key: 'instructor',
                label: display,
                onRemove: () => onInstructorChange('all'),
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
                        placeholder="Search for courses"
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
                <PopoverContent className="w-80" align="end">
                    <div className="space-y-4">
                        <h4 className="font-medium text-sm">Filter Courses</h4>
                        
                        {/* Status Filter */}
                        <div className="space-y-2">
                            <label className="text-sm text-gray-600">Status</label>
                            <Select value={statusFilter} onValueChange={onStatusChange}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="true">Published</SelectItem>
                                    <SelectItem value="false">Draft</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Type Filter */}
                        <div className="space-y-2">
                            <label className="text-sm text-gray-600">Training Type</label>
                            <Select value={typeFilter} onValueChange={onTypeChange}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Types</SelectItem>
                                    <SelectItem value={TRAINING_TYPE.UNARMED}>Unarmed</SelectItem>
                                    <SelectItem value={TRAINING_TYPE.ARMED}>Armed</SelectItem>
                                    <SelectItem value={TRAINING_TYPE.REFRESHER}>Refresher</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Mode Filter */}
                        <div className="space-y-2">
                            <label className="text-sm text-gray-600">Delivery Mode</label>
                            <Select value={modeFilter} onValueChange={onModeChange}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select mode" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Modes</SelectItem>
                                    <SelectItem value={DELIVERY_MODE.ONLINE}>Online</SelectItem>
                                    <SelectItem value={DELIVERY_MODE.IN_PERSON}>In Person</SelectItem>
                                    <SelectItem value={DELIVERY_MODE.HYBRID}>Hybrid</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* State Filter */}
                        <div className="space-y-2">
                            <label className="text-sm text-gray-600">State</label>
                            <Select value={stateFilter} onValueChange={onStateChange}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select state" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All States</SelectItem>
                                    {states.map(([id, name]) => (
                                        <SelectItem key={id} value={String(id)}>
                                            {name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Instructor Filter */}
                        <div className="space-y-2">
                            <label className="text-sm text-gray-600">Instructor</label>
                            <Select value={instructorFilter} onValueChange={onInstructorChange}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select instructor" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Instructors</SelectItem>
                                    {instructors.map(([id, name]) => (
                                        <SelectItem key={id} value={String(id)}>
                                            {name}
                                        </SelectItem>
                                    ))}
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
