import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Search } from 'lucide-react';
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
    return (
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
            <div className="flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center">
                <div className="flex flex-wrap gap-2 lg:gap-4 flex-1">
                    {/* Search */}
                    <div className="relative flex-1 min-w-[200px] lg:max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                            placeholder="Search courses..."
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    {/* State Filter */}
                    <Select value={stateFilter} onValueChange={onStateChange}>
                        <SelectTrigger className="w-full sm:w-32 gap-2">
                            <SelectValue placeholder="State" />
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

                    {/* Type Filter */}
                    <Select value={typeFilter} onValueChange={onTypeChange}>
                        <SelectTrigger className="w-full sm:w-32 gap-2">
                            <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value={TRAINING_TYPE.UNARMED}>Unarmed</SelectItem>
                            <SelectItem value={TRAINING_TYPE.ARMED}>Armed</SelectItem>
                            <SelectItem value={TRAINING_TYPE.REFRESHER}>Refresher</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Mode Filter */}
                    <Select value={modeFilter} onValueChange={onModeChange}>
                        <SelectTrigger className="w-full sm:w-32 gap-2">
                            <SelectValue placeholder="Mode" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Modes</SelectItem>
                            <SelectItem value={DELIVERY_MODE.ONLINE}>Online</SelectItem>
                            <SelectItem value={DELIVERY_MODE.IN_PERSON}>In Person</SelectItem>
                            <SelectItem value={DELIVERY_MODE.HYBRID}>Hybrid</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Instructor Filter */}
                    <Select value={instructorFilter} onValueChange={onInstructorChange}>
                        <SelectTrigger className="w-full sm:w-40 gap-2">
                            <SelectValue placeholder="Instructor" />
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
        </div>
    );
}
