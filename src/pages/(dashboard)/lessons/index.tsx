'use client';

import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Filter, Video, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { DataTableClickable } from '@/components/shared/data-table-clickable';
import { useCoursesStore } from '@/stores/courses-store';
import { useState, useMemo } from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

export default function AllLessonsPage() {
    const navigate = useNavigate();
    const { courses } = useCoursesStore();
    const [showFilters, setShowFilters] = useState(false);

    const allLessons = useMemo(() => {
        return courses.flatMap(course =>
            (course.modules || []).flatMap(module =>
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (module.lessons || []).map((lesson: any) => ({
                    ...lesson,
                    course_title: course.title,
                    course_id: course.id,
                    module_title: module.title
                }))
            )
        );
    }, [courses]);

    const [filters, setFilters] = useState({
        course_id: 'all',
        content_type: 'all',
    });

    const filteredLessons = allLessons.filter((lesson) => {
        if (filters.course_id !== 'all' && String(lesson.course_id) !== filters.course_id) return false;
        if (filters.content_type !== 'all' && lesson.content_type !== filters.content_type) return false;
        return true;
    });

    const columns = [
        {
            key: 'title' as const,
            label: 'Lesson Title',
            sortable: true,
        },
        {
            key: 'course_title' as const,
            label: 'Course',
            sortable: true,
        },
        {
            key: 'module_title' as const,
            label: 'Module',
            sortable: true,
        },
        {
            key: 'content_type' as const,
            label: 'Type',
            sortable: true,
            render: (value: string) => (
                <div className="flex items-center gap-2">
                    {value === 'video' ? <Video className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                    <span className="capitalize">{value}</span>
                </div>
            ),
        },
        {
            key: 'duration_min' as const,
            label: 'Duration',
            sortable: true,
            render: (value: number) => value ? `${value} min` : '-',
        },
    ];

    const activeFiltersCount = Object.values(filters).filter(v => v !== 'all').length;

    const extraFilters = (
        <div className="flex flex-col md:flex-row items-start md:items-center gap-3 w-full md:w-auto">
            {/* Mobile Filter Toggle */}
            <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden flex items-center gap-2 w-full justify-between h-10 px-4"
            >
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    <span>Filters</span>
                </div>
                {activeFiltersCount > 0 && (
                    <Badge variant="secondary" className="ml-2 h-5 min-w-5 flex items-center justify-center p-0">
                        {activeFiltersCount}
                    </Badge>
                )}
            </Button>

            {/* Filters Container */}
            <div className={`${showFilters ? 'flex' : 'hidden'} md:flex flex-col sm:grid sm:grid-cols-2 md:flex-row gap-2 w-full md:w-auto transition-all duration-200`}>
                <Select value={filters.course_id} onValueChange={(val) => setFilters({ ...filters, course_id: val })}>
                    <SelectTrigger className="w-full md:w-[200px] bg-background border-input h-10">
                        <SelectValue placeholder="Filter by Course" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Courses</SelectItem>
                        {courses.map(course => (
                            <SelectItem key={course.id} value={String(course.id)}>
                                {course.title}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select value={filters.content_type} onValueChange={(val) => setFilters({ ...filters, content_type: val })}>
                    <SelectTrigger className="w-full md:w-[150px] bg-background border-input h-10">
                        <SelectValue placeholder="Content Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="video">Video</SelectItem>
                        <SelectItem value="pdf">PDF</SelectItem>
                    </SelectContent>
                </Select>

                {activeFiltersCount > 0 && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setFilters({
                            course_id: 'all',
                            content_type: 'all',
                        })}
                        className="text-muted-foreground hover:text-foreground h-10"
                    >
                        Clear
                    </Button>
                )}
            </div>
        </div>
    );

    return (
        <div className="flex-1 bg-background">
            <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">All Lessons</h1>
                        <p className="text-muted-foreground mt-2">
                            Manage lessons across all courses
                        </p>
                    </div>
                </div>

                <DataTableClickable
                    data={filteredLessons}
                    columns={columns}
                    onRowClick={(row) => navigate(`/lessons/${row.id}`)}
                    searchPlaceholder="Search lessons..."
                    pageSize={10}
                    extraFilters={extraFilters}
                />
            </div>
        </div>
    );
}
