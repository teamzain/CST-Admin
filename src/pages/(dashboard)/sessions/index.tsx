'use client';

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { DataTable } from '@/components/shared/DataTable';
import { SessionsFilters } from '@/components/sessions/sessions-filters';
import { getSessionColumns } from '@/components/sessions/session-columns';
import { CoursesRepository, type Course } from '@/repositories/courses';

import { DeleteConfirmationDialog } from '@/components/shared/delete-confirmation-dialog';
import { SessionsRepository, type Session } from '@/repositories/sessions';
import { toast } from 'sonner';

export default function AllSessionsPage() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [searchTerm, setSearchTerm] = useState('');
    const [sessionTypeFilter, setSessionTypeFilter] = useState<string>('all');
    const [courseFilter, setCourseFilter] = useState<string>('all');
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [sessionToDelete, setSessionToDelete] = useState<Session | null>(null);

    // Fetch sessions with TanStack Query
    const { data: sessions = [], isLoading } = useQuery({
        queryKey: ['sessions'],
        queryFn: () => SessionsRepository.getAll(),
    });

    // Fetch courses for filter dropdown
    const { data: courses = [] } = useQuery({
        queryKey: ['courses'],
        queryFn: () => CoursesRepository.getAll(),
    });

    // Delete mutation
    const deleteMutation = useMutation({
        mutationFn: (id: number) => SessionsRepository.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sessions'] });
            toast.success('Session deleted successfully');
        },
        onError: (error) => {
            console.error('Failed to delete session:', error);
            toast.error('Failed to delete session');
        },
    });

    const allSessions = useMemo(() => {
        return sessions.map((session: Session & { course_title?: string }) => {
            // Find course title if not provided by API
            const course = courses.find((c: Course) => c.id === session.course_id);

            return {
                ...session,
                course_title: session.course_title || course?.title || 'Unknown Course'
            };
        });
    }, [sessions, courses]);

    const filteredSessions = useMemo(() => {
        return allSessions.filter((session: any) => {
            const matchesSearch = (session.title || '').toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCourse = courseFilter === 'all' || String(session.course_id) === courseFilter;
            const matchesSessionType = sessionTypeFilter === 'all' || session.session_type === sessionTypeFilter;

            return matchesSearch && matchesCourse && matchesSessionType;
        });
    }, [allSessions, searchTerm, courseFilter, sessionTypeFilter]);

    const handleView = (session: Session) => {
        navigate(`/sessions/${session.id}`);
    };

    const handleDeleteClick = (session: Session) => {
        setSessionToDelete(session);
        setIsDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (sessionToDelete) {
            deleteMutation.mutate(sessionToDelete.id);
            setSessionToDelete(null);
            setIsDeleteDialogOpen(false);
        }
    };



    const columns = getSessionColumns(handleView, handleDeleteClick);

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
                    {isLoading ? (
                        <div className="flex items-center justify-center p-12">
                            <div className="text-center">
                                <p className="text-muted-foreground">Loading sessions...</p>
                            </div>
                        </div>
                    ) : (
                        <DataTable
                            columns={columns}
                            data={filteredSessions}
                            pageSize={10}
                            enableRowSelection={true}
                            searchColumn="title"
                            searchValue={searchTerm}
                        />
                    )}
                </div>
            </div>

            <DeleteConfirmationDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Delete Session"
                description="Are you sure you want to delete this session? This action cannot be undone."
                itemType="Session"
                itemName={sessionToDelete?.title || ''}
            />
        </div>
    );
}
