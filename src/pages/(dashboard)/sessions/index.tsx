'use client';

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/shared/DataTable';
import { SessionsFilters } from '@/components/sessions/sessions-filters';
import { getSessionColumns } from '@/components/sessions/session-columns';
import { useCoursesStore } from '@/stores/courses-store';
import { Plus } from 'lucide-react';

export default function AllSessionsPage() {
    const navigate = useNavigate();
    const { courses } = useCoursesStore();

    const [searchTerm, setSearchTerm] = useState('');
    const [sessionTypeFilter, setSessionTypeFilter] = useState<string>('all');
    const [courseFilter, setCourseFilter] = useState<string>('all');

    const allSessions = useMemo(() => {
        return courses.flatMap(course =>
            (course.modules || []).flatMap(module =>
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (module.sessions || []).map((session: any) => ({
                    ...session,
                    course_title: course.title,
                    course_id: course.id,
                    module_title: module.title
                }))
            )
        );
    }, [courses]);

    const filteredSessions = useMemo(() => {
        return allSessions.filter((session) => {
            const matchesSearch = session.title.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCourse = courseFilter === 'all' || String(session.course_id) === courseFilter;
            const matchesSessionType = sessionTypeFilter === 'all' || session.session_type === sessionTypeFilter;

            return matchesSearch && matchesCourse && matchesSessionType;
        });
    }, [allSessions, searchTerm, courseFilter, sessionTypeFilter]);

    const columns = getSessionColumns();

    const handleCreateClick = () => {
        navigate('/sessions/create');
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="mx-auto max-w-[1600px]">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
                            Sessions
                        </h1>
                        <p className="text-sm text-gray-600 mt-1">
                            {filteredSessions.length} Sessions Found
                        </p>
                    </div>
                    <Button
                        className="bg-primary hover:bg-primary/90 text-black font-medium gap-2"
                        onClick={handleCreateClick}
                    >
                        <Plus className="w-4 h-4" />
                        New Session
                    </Button>
                </div>

                {/* Filters */}
                <SessionsFilters
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    sessionTypeFilter={sessionTypeFilter}
                    onSessionTypeChange={setSessionTypeFilter}
                    courseFilter={courseFilter}
                    onCourseChange={setCourseFilter}
                    courses={courses.map(c => ({ id: c.id, title: c.title }))}
                />

                {/* Data Table */}
                <div className="overflow-x-auto">
                    <DataTable
                        columns={columns}
                        data={filteredSessions}
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
