'use client';

import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/shared/DataTable';
import { CoursesFilters } from '@/components/courses/courses-filters';
import { getCourseColumns } from '@/components/courses/course-columns';
import { useCoursesStore, type Course } from '@/stores/courses-store';
import { statesApiService } from '@/api/states-api';
import type { State } from '@/api/states-api';
import { Plus, Upload } from 'lucide-react';
import { toast } from 'sonner';

export default function CoursesPage() {
    const navigate = useNavigate();
    const { courses, fetchCourses } = useCoursesStore();
    const [allStates, setAllStates] = useState<State[]>([]);

    const [searchTerm, setSearchTerm] = useState('');
    const [stateFilter, setStateFilter] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [typeFilter, setTypeFilter] = useState<string>('all');
    const [modeFilter, setModeFilter] = useState<string>('all');
    const [instructorFilter, setInstructorFilter] = useState<string>('all');

    // Fetch courses and states on mount
    useEffect(() => {
        const loadData = async () => {
            try {
                // Fetch courses from API
                await fetchCourses();
            } catch (error) {
                console.error('Error loading courses:', error);
            }

            try {
                // Fetch states from API
                const states = await statesApiService.getAllStates();
                setAllStates(states);
            } catch (error) {
                console.error('Error loading states:', error);
                toast.error('Failed to load states');
            }
        };

        loadData();
    }, [fetchCourses]);

    // Filter courses
    const filteredCourses = useMemo(() => {
        return courses.filter((course) => {
            const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesState = stateFilter === 'all' || String(course.state_id) === stateFilter;
            const matchesStatus = statusFilter === 'all' || String(course.is_active) === statusFilter;
            const matchesType = typeFilter === 'all' || course.training_type === typeFilter;
            const matchesMode = modeFilter === 'all' || course.delivery_mode === modeFilter;
            const matchesInstructor = instructorFilter === 'all' || String(course.instructor_id) === instructorFilter;

            return matchesSearch && matchesState && matchesStatus && matchesType && matchesMode && matchesInstructor;
        });
    }, [courses, searchTerm, stateFilter, statusFilter, typeFilter, modeFilter, instructorFilter]);

    const handleEdit = (course: Course) => {
        navigate(`/courses/${course.id}`);
    };

    const handleDelete = (course: Course) => {
        toast.error(`Delete course ${course.title} - Not implemented yet`);
    };

    const handleImportCSV = () => {
        toast.info('Import CSV - Not implemented yet');
    };

    const columns = getCourseColumns(handleEdit, handleDelete);

    // Get unique instructors for filter
    const instructors = useMemo(() => Array.from(
        new Map(
            courses
                .filter((c) => c.instructor_id)
                .map((c) => [c.instructor_id as number, c.instructor?.name || ''])
        ).entries()
    ), [courses]);

    // Use API states for filter (already have all states)
    const states = useMemo(() => 
        allStates.map((state) => [state.id, state.name] as [number, string]),
        [allStates]
    );

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="mx-auto max-w-[1600px]">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
                            Courses
                        </h1>
                        <p className="text-sm text-gray-600 mt-1">
                            {filteredCourses.length} Courses Found
                        </p>
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <Button
                            variant="outline"
                            className="gap-2 bg-white"
                            onClick={handleImportCSV}
                        >
                            <Upload className="w-4 h-4" />
                            Import CSV
                        </Button>
                        <Button
                            className="bg-primary hover:bg-primary/90 text-black font-medium gap-2"
                            onClick={() => navigate('/courses/create')}
                        >
                            <Plus className="w-4 h-4" />
                            New Course
                        </Button>
                    </div>
                </div>

                {/* Filters */}
                <CoursesFilters
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    stateFilter={stateFilter}
                    onStateChange={setStateFilter}
                    statusFilter={statusFilter}
                    onStatusChange={setStatusFilter}
                    typeFilter={typeFilter}
                    onTypeChange={setTypeFilter}
                    modeFilter={modeFilter}
                    onModeChange={setModeFilter}
                    instructorFilter={instructorFilter}
                    onInstructorChange={setInstructorFilter}
                    states={states}
                    instructors={instructors}
                />

                {/* Data Table */}
                <div className="overflow-x-auto">
                    <DataTable
                        columns={columns}
                        data={filteredCourses}
                        pageSize={10}
                        enableRowSelection={true}
                        searchColumn="title"
                        searchValue={searchTerm}
                    />
                </div>
            </div>
        </div>
    );
}
