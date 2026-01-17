'use client';

import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
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

export default function AllQuizzesPage() {
    const navigate = useNavigate();
    const { courses } = useCoursesStore();
    const [showFilters, setShowFilters] = useState(false);

    // Flatten quizzes from all courses
    const allQuizzes = useMemo(() => {
        return courses.flatMap(course =>
            (course.modules || []).flatMap(module =>
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (module.quizzes || []).map((quiz: any) => ({
                    ...quiz,
                    course_title: course.title,
                    course_id: course.id,
                    module_title: module.title
                }))
            )
        );
    }, [courses]);

    // Filters
    const [filters, setFilters] = useState({
        course_id: 'all',
        is_final: 'all',
    });

    const filteredQuizzes = allQuizzes.filter((quiz) => {
        if (filters.course_id !== 'all' && String(quiz.course_id) !== filters.course_id) return false;
        if (filters.is_final !== 'all' && String(quiz.is_final) !== filters.is_final) return false;
        return true;
    });

    const columns = [
        {
            key: 'title' as const,
            label: 'Quiz Title',
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
            key: 'passing_score' as const,
            label: 'Passing Score',
            sortable: true,
            render: (value: number) => `${value}%`,
        },
        {
            key: 'is_final' as const,
            label: 'Type',
            sortable: true,
            render: (value: boolean) => (
                <Badge variant={value ? 'default' : 'secondary'}>
                    {value ? 'Final Exam' : 'Quiz'}
                </Badge>
            ),
        },
        {
            key: 'questions' as const,
            label: 'Questions',
            render: (value: unknown[]) => value?.length || 0,
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

                <Select value={filters.is_final} onValueChange={(val) => setFilters({ ...filters, is_final: val })}>
                    <SelectTrigger className="w-full md:w-[150px] bg-background border-input h-10">
                        <SelectValue placeholder="Quiz Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="true">Final Exam</SelectItem>
                        <SelectItem value="false">Regular Quiz</SelectItem>
                    </SelectContent>
                </Select>

                {activeFiltersCount > 0 && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setFilters({
                            course_id: 'all',
                            is_final: 'all',
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
                        <h1 className="text-3xl font-bold text-foreground">All Quizzes</h1>
                        <p className="text-muted-foreground mt-2">
                            Manage quizzes across all courses
                        </p>
                    </div>
                </div>

                <DataTableClickable
                    data={filteredQuizzes}
                    columns={columns}
                    onRowClick={(row) => navigate(`/quizzes/${row.id}`)}
                    searchPlaceholder="Search quizzes..."
                    pageSize={10}
                    extraFilters={extraFilters}
                    emptyStateImage="/illustrations/no-quiz.png"
                />
            </div>
        </div>
    );
}
