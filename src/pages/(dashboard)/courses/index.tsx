'use client';

import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Filter } from 'lucide-react';
import { DataTableClickable } from '@/components/shared/data-table-clickable';
import { useCoursesStore, TRAINING_TYPE, DELIVERY_MODE, type Course } from '@/stores/courses-store';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useState, useMemo } from 'react';

export default function CoursesPage() {
    const navigate = useNavigate();
    const { courses } = useCoursesStore();
    const [showFilters, setShowFilters] = useState(false);

    // Filters
    const [filters, setFilters] = useState({
        is_active: 'all',
        training_type: 'all',
        delivery_mode: 'all',
        instructor_id: 'all',
        state_id: 'all',
    });

    const filteredCourses = courses.filter((course) => {
        if (filters.is_active !== 'all' && String(course.is_active) !== filters.is_active) return false;
        if (filters.training_type !== 'all' && course.training_type !== filters.training_type) return false;
        if (filters.delivery_mode !== 'all' && course.delivery_mode !== filters.delivery_mode) return false;
        if (filters.instructor_id !== 'all' && String(course.instructor_id) !== filters.instructor_id) return false;
        if (filters.state_id !== 'all' && String(course.state_id) !== filters.state_id) return false;
        return true;
    });

    const handleCreateClick = () => {
        navigate('/courses/create');
    };

    const handleRowClick = (course: Course) => {
        navigate(`/courses/${course.id}`);
    };

    const columns = [
        {
            key: 'title' as const,
            label: 'Course Title',
            sortable: true,
        },
        {
            key: 'state' as const,
            label: 'State',
            sortable: true,
            render: (_: unknown, row: Course) => (
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-mono">
                        {row.state?.code || 'N/A'}
                    </Badge>
                    <span className="text-sm">{row.state?.name}</span>
                </div>
            ),
        },
        {
            key: 'training_type' as const,
            label: 'Training Type',
            sortable: true,
            render: (value: string) => (
                <Badge variant="outline" className="capitalize">
                    {value.toLowerCase()}
                </Badge>
            ),
        },
        {
            key: 'duration_hours' as const,
            label: 'Duration',
            sortable: true,
            render: (value: number) => `${value}h`,
        },
        {
            key: 'delivery_mode' as const,
            label: 'Delivery Mode',
            sortable: true,
            render: (value: string) => (
                <Badge variant="secondary" className="capitalize">
                    {value.replace('_', ' ').toLowerCase()}
                </Badge>
            ),
        },
        {
            key: 'is_active' as const,
            label: 'Status',
            sortable: true,
            render: (value: boolean) => (
                <Badge variant={value ? 'default' : 'secondary'}>
                    {value ? 'Published' : 'Unpublished'}
                </Badge>
            ),
        },
        {
            key: 'instructor' as const,
            label: 'Instructor',
            sortable: true,
            render: (_: unknown, row: Course) => row.instructor?.name || 'N/A',
        },
        {
            key: 'enrolled_students' as const,
            label: 'Enrolled',
            sortable: true,
        },
        {
            key: 'price' as const,
            label: 'Price',
            sortable: true,
            render: (value: number) => `$${value.toFixed(2)}`,
        },
    ];

    // Get unique instructors for filter
    const instructors = useMemo(() => Array.from(
        new Map(
            courses
                .filter((c) => c.instructor_id)
                .map((c) => [c.instructor_id, c.instructor?.name || ''])
        ).entries()
    ), [courses]);

    // Get unique states for filter
    const states = useMemo(() => Array.from(
        new Map(
            courses
                .filter((c) => c.state_id)
                .map((c) => [c.state_id, c.state?.name || ''])
        ).entries()
    ), [courses]);

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
                <Select value={filters.state_id} onValueChange={(val) => setFilters({ ...filters, state_id: val })}>
                    <SelectTrigger className="w-full md:w-32 lg:w-40 bg-background border-input h-10">
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

                <Select value={filters.is_active} onValueChange={(val) => setFilters({ ...filters, is_active: val })}>
                    <SelectTrigger className="w-full md:w-28 lg:w-32 bg-background border-input h-10">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="true">Published</SelectItem>
                        <SelectItem value="false">Unpublished</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={filters.training_type} onValueChange={(val) => setFilters({ ...filters, training_type: val })}>
                    <SelectTrigger className="w-full md:w-32 lg:w-40 bg-background border-input h-10">
                        <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value={TRAINING_TYPE.UNARMED}>Unarmed</SelectItem>
                        <SelectItem value={TRAINING_TYPE.ARMED}>Armed</SelectItem>
                        <SelectItem value={TRAINING_TYPE.REFRESHER}>Refresher</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={filters.delivery_mode} onValueChange={(val) => setFilters({ ...filters, delivery_mode: val })}>
                    <SelectTrigger className="w-full md:w-32 lg:w-40 bg-background border-input h-10">
                        <SelectValue placeholder="Mode" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Modes</SelectItem>
                        <SelectItem value={DELIVERY_MODE.ONLINE}>Online</SelectItem>
                        <SelectItem value={DELIVERY_MODE.IN_PERSON}>In Person</SelectItem>
                        <SelectItem value={DELIVERY_MODE.HYBRID}>Hybrid</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={filters.instructor_id} onValueChange={(val) => setFilters({ ...filters, instructor_id: val })}>
                    <SelectTrigger className="w-full md:w-32 lg:w-44 bg-background border-input h-10">
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

                {activeFiltersCount > 0 && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setFilters({
                            is_active: 'all',
                            training_type: 'all',
                            delivery_mode: 'all',
                            instructor_id: 'all',
                            state_id: 'all',
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
                        <h1 className="text-3xl font-bold text-foreground">
                            Courses
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            Manage training courses
                        </p>
                    </div>
                    <Button
                        onClick={handleCreateClick}
                        className="bg-primary hover:bg-primary/90 gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Create Course
                    </Button>
                </div>

                {/* Courses Table */}
                <DataTableClickable
                    data={filteredCourses}
                    columns={columns}
                    onRowClick={handleRowClick}
                    searchPlaceholder="Search courses..."
                    pageSize={10}
                    extraFilters={extraFilters}
                />

                {/* Course Overview */}
                <Card className="mt-8 bg-card border-border">
                    <CardHeader>
                        <CardTitle>Course Overview</CardTitle>
                        <CardDescription>
                            Click on any course to edit or view details
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="border border-dashed border-border rounded-lg p-8 text-center">
                            <p className="text-muted-foreground">
                                Total Courses: {courses.length} | Active: {courses.filter(c => c.is_active).length}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
