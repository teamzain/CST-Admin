import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { DataTable } from '@/components/shared/DataTable';
import { LessonsFilters } from '@/components/lessons/lessons-filters';
import { getLessonColumns } from '@/components/lessons/lesson-columns';
import { CoursesRepository, type Course } from '@/repositories/courses';
import { Loader2 } from 'lucide-react';
import { DeleteConfirmationDialog } from '@/components/shared/delete-confirmation-dialog';
import { LessonsRepository, type Lesson } from '@/repositories/lessons';
import { toast } from 'sonner';

export default function AllLessonsPage() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [searchTerm, setSearchTerm] = useState('');
    const [contentTypeFilter, setContentTypeFilter] = useState<string>('all');
    const [courseFilter, setCourseFilter] = useState<string>('all');
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [lessonToDelete, setLessonToDelete] = useState<Lesson | null>(null);

    // Fetch lessons with TanStack Query
    const { data: lessons = [], isLoading } = useQuery({
        queryKey: ['lessons'],
        queryFn: () => LessonsRepository.getAll(),
    });

    // Fetch courses for filter dropdown
    const { data: courses = [] } = useQuery({
        queryKey: ['courses'],
        queryFn: () => CoursesRepository.getAll(),
    });

    // Delete mutation
    const deleteMutation = useMutation({
        mutationFn: (id: number) => LessonsRepository.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['lessons'] });
            toast.success('Lesson deleted successfully');
        },
        onError: (error) => {
            console.error('Failed to delete lesson:', error);
            toast.error('Failed to delete lesson');
        },
    });

    const filteredLessons = useMemo(() => {
        return lessons.filter((lesson) => {
            const matchesSearch = lesson.title.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCourse = courseFilter === 'all' || String(lesson.course_id) === courseFilter;
            const matchesContentType = contentTypeFilter === 'all' || lesson.content_type === contentTypeFilter;

            return matchesSearch && matchesCourse && matchesContentType;
        });
    }, [lessons, searchTerm, courseFilter, contentTypeFilter]);

    const handleView = (lesson: Lesson) => {
        navigate(`/lessons/${lesson.id}`);
    };

    const handleDeleteClick = (lesson: Lesson) => {
        setLessonToDelete(lesson);
        setIsDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (lessonToDelete) {
            deleteMutation.mutate(lessonToDelete.id);
            setLessonToDelete(null);
            setIsDeleteDialogOpen(false);
        }
    };



    const columns = getLessonColumns(handleView, handleDeleteClick);

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="mx-auto max-w-[1600px]">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
                            Lessons
                        </h1>
                        <p className="text-sm text-gray-600 mt-1">
                            {filteredLessons.length} Lessons Found
                        </p>
                    </div>

                </div>

                {/* Filters */}
                <LessonsFilters
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    contentTypeFilter={contentTypeFilter}
                    onContentTypeChange={setContentTypeFilter}
                    courseFilter={courseFilter}
                    onCourseChange={setCourseFilter}
                    courses={courses.map((c: Course) => ({ id: c.id, title: c.title }))}
                />

                {/* Data Table */}
                <div className="overflow-x-auto">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        </div>
                    ) : (
                        <DataTable
                            columns={columns}
                            data={filteredLessons}
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
                title="Delete Lesson"
                description="Are you sure you want to delete this lesson? This action cannot be undone."
                itemType="Lesson"
                itemName={lessonToDelete?.title || ''}
            />
        </div>
    );
}
