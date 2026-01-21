import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Search } from 'lucide-react';

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
    return (
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
            <div className="flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center">
                <div className="flex flex-wrap gap-2 lg:gap-4 flex-1">
                    {/* Search */}
                    <div className="relative flex-1 min-w-[200px] lg:max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                            placeholder="Search sessions..."
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    {/* Course Filter */}
                    <Select value={courseFilter} onValueChange={onCourseChange}>
                        <SelectTrigger className="w-full sm:w-40 gap-2">
                            <SelectValue placeholder="Course" />
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

                    {/* Session Type Filter */}
                    <Select value={sessionTypeFilter} onValueChange={onSessionTypeChange}>
                        <SelectTrigger className="w-full sm:w-32 gap-2">
                            <SelectValue placeholder="Session Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="LIVE">Live</SelectItem>
                            <SelectItem value="PHYSICAL">Physical</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    );
}
