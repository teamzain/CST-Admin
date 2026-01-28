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

interface SessionsFiltersProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    sessionTypeFilter: string;
    onSessionTypeChange: (value: string) => void;
    courseFilter: string;
    onCourseChange: (value: string) => void;
    courses: Array<{ id: number; title: string }>;
}

export function SessionsFilters({
    searchTerm,
    onSearchChange,
    sessionTypeFilter,
    onSessionTypeChange,
    courseFilter,
    onCourseChange,
    courses,
}: SessionsFiltersProps) {
    // Helper to get display name for filters
    const getSessionTypeDisplay = (value: string) => {
        if (value === 'LIVE') return 'Live';
        if (value === 'PHYSICAL') return 'Physical';
        return null;
    };

    const getCourseDisplay = (value: string) => {
        const course = courses.find((c) => String(c.id) === value);
        return course ? course.title : null;
    };

    // Active filters for chips
    const activeFilters: { key: string; label: string; onRemove: () => void }[] = [];

    if (sessionTypeFilter && sessionTypeFilter !== 'all') {
        const display = getSessionTypeDisplay(sessionTypeFilter);
        if (display) {
            activeFilters.push({
                key: 'sessionType',
                label: display,
                onRemove: () => onSessionTypeChange('all'),
            });
        }
    }

    if (courseFilter && courseFilter !== 'all') {
        const display = getCourseDisplay(courseFilter);
        if (display) {
            activeFilters.push({
                key: 'course',
                label: display,
                onRemove: () => onCourseChange('all'),
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
                        placeholder="Search for sessions"
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
                        <h4 className="font-medium text-sm">Filter Sessions</h4>
                        
                        {/* Course Filter */}
                        <div className="space-y-2">
                            <label className="text-sm text-gray-600">Course</label>
                            <Select value={courseFilter} onValueChange={onCourseChange}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select course" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Courses</SelectItem>
                                    {courses.map((course) => (
                                        <SelectItem key={course.id} value={String(course.id)}>
                                            {course.title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Session Type Filter */}
                        <div className="space-y-2">
                            <label className="text-sm text-gray-600">Session Type</label>
                            <Select value={sessionTypeFilter} onValueChange={onSessionTypeChange}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Types</SelectItem>
                                    <SelectItem value="LIVE">Live</SelectItem>
                                    <SelectItem value="PHYSICAL">Physical</SelectItem>
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
