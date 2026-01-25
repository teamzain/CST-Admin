'use client';

import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/shared/DataTable';
import { SessionsFilters } from '@/components/sessions/sessions-filters';
import { getSessionColumns } from '@/components/sessions/session-columns';
import { useCoursesStore } from '@/stores/courses-store';
import { Plus } from 'lucide-react';
import { DeleteConfirmationDialog } from '@/components/shared/delete-confirmation-dialog';
import { sessionsService, type Session } from '@/api/sessions';
import { toast } from 'sonner';

export default function AllSessionsPage() {
    const navigate = useNavigate();
    const { courses } = useCoursesStore();

    const [sessions, setSessions] = useState<Session[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sessionTypeFilter, setSessionTypeFilter] = useState<string>('all');
    const [courseFilter, setCourseFilter] = useState<string>('all');
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [sessionToDelete, setSessionToDelete] = useState<any>(null);

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                setIsLoading(true);
                const data = await sessionsService.getAllSessions();
                setSessions(data);
            } catch (error) {
                console.error('Failed to fetch sessions:', error);
                toast.error('Failed to load sessions');
            } finally {
                setIsLoading(false);
            }
        };
        fetchSessions();
    }, []);

    const allSessions = useMemo(() => {
        return sessions.map((session: any) => {
            // Find course title if not provided by API
            const course = (courses as any[]).find((c: any) => c.id === session.course_id);

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

    const handleView = (session: any) => {
        navigate(`/sessions/${session.id}`);
    };

    const handleDeleteClick = (session: any) => {
        setSessionToDelete(session);
        setIsDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (sessionToDelete) {
            try {
                await sessionsService.deleteSession(sessionToDelete.id);
                setSessions(prev => prev.filter(s => s.id !== sessionToDelete.id));
                toast.success('Session deleted successfully');
            } catch (error) {
                console.error('Failed to delete session:', error);
                toast.error('Failed to delete session');
            } finally {
                setSessionToDelete(null);
                setIsDeleteDialogOpen(false);
            }
        }
    };

    const handleCreateClick = () => {
        navigate('/sessions/create');
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
