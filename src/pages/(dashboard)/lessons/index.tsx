'use client';

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/shared/DataTable';
import { LessonsFilters } from '@/components/lessons/lessons-filters';
import { getLessonColumns } from '@/components/lessons/lesson-columns';
import { useCoursesStore } from '@/stores/courses-store';
import { Plus } from 'lucide-react';
import { DeleteConfirmationDialog } from '@/components/shared/delete-confirmation-dialog';

export default function AllLessonsPage() {
    const navigate = useNavigate();
    const { courses } = useCoursesStore();

    const [searchTerm, setSearchTerm] = useState('');
    const [contentTypeFilter, setContentTypeFilter] = useState<string>('all');
    const [courseFilter, setCourseFilter] = useState<string>('all');
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [lessonToDelete, setLessonToDelete] = useState<any>(null);

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

    const filteredLessons = useMemo(() => {
        return allLessons.filter((lesson) => {
            const matchesSearch = lesson.title.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCourse = courseFilter === 'all' || String(lesson.course_id) === courseFilter;
            const matchesContentType = contentTypeFilter === 'all' || lesson.content_type === contentTypeFilter;

            return matchesSearch && matchesCourse && matchesContentType;
        });
    }, [allLessons, searchTerm, courseFilter, contentTypeFilter]);

    const handleView = (lesson: any) => {
        navigate(`/lessons/${lesson.id}`);
    };

    const handleDeleteClick = (lesson: any) => {
        setLessonToDelete(lesson);
        setIsDeleteDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        if (lessonToDelete) {
            // Implement lesson deletion logic here
            console.log('Delete lesson:', lessonToDelete);
            setLessonToDelete(null);
        }
    };

    const handleCreateClick = () => {
        navigate('/lessons/create');
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
                    <Button
                        className="bg-primary hover:bg-primary/90 text-black font-medium gap-2"
                        onClick={handleCreateClick}
                    >
                        <Plus className="w-4 h-4" />
                        New Lesson
                    </Button>
                </div>

                {/* Filters */}
                <LessonsFilters
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    contentTypeFilter={contentTypeFilter}
                    onContentTypeChange={setContentTypeFilter}
                    courseFilter={courseFilter}
                    onCourseChange={setCourseFilter}
                    courses={courses.map(c => ({ id: c.id, title: c.title }))}
                />

                {/* Data Table */}
                <div className="overflow-x-auto">
                    <DataTable
                        columns={columns}
                        data={filteredLessons}
                        pageSize={10}
                        enableRowSelection={true}
                        searchColumn="title"
                        searchValue={searchTerm}
                    />
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
