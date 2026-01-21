'use client';

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/shared/DataTable';
import { QuizzesFilters } from '@/components/quizzes/quizzes-filters';
import { getQuizColumns } from '@/components/quizzes/quiz-columns';
import { useCoursesStore } from '@/stores/courses-store';
import { Plus } from 'lucide-react';
import { DeleteConfirmationDialog } from '@/components/shared/delete-confirmation-dialog';

export default function AllQuizzesPage() {
    const navigate = useNavigate();
    const { courses } = useCoursesStore();

    const [searchTerm, setSearchTerm] = useState('');
    const [quizTypeFilter, setQuizTypeFilter] = useState<string>('all');
    const [courseFilter, setCourseFilter] = useState<string>('all');
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [quizToDelete, setQuizToDelete] = useState<any>(null);

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

    const filteredQuizzes = useMemo(() => {
        return allQuizzes.filter((quiz) => {
            const matchesSearch = quiz.title.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCourse = courseFilter === 'all' || String(quiz.course_id) === courseFilter;
            const matchesQuizType = quizTypeFilter === 'all' || String(quiz.is_final) === quizTypeFilter;

            return matchesSearch && matchesCourse && matchesQuizType;
        });
    }, [allQuizzes, searchTerm, courseFilter, quizTypeFilter]);

    const handleView = (quiz: any) => {
        navigate(`/quizzes/${quiz.id}`);
    };

    const handleDeleteClick = (quiz: any) => {
        setQuizToDelete(quiz);
        setIsDeleteDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        if (quizToDelete) {
            // Implement quiz deletion logic here
            console.log('Delete quiz:', quizToDelete);
            setQuizToDelete(null);
        }
    };

    const handleCreateClick = () => {
        navigate('/quizzes/create');
    };

    const columns = getQuizColumns(handleView, handleDeleteClick);

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="mx-auto max-w-[1600px]">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
                            Quizzes
                        </h1>
                        <p className="text-sm text-gray-600 mt-1">
                            {filteredQuizzes.length} Quizzes Found
                        </p>
                    </div>
                    <Button
                        className="bg-primary hover:bg-primary/90 text-black font-medium gap-2"
                        onClick={handleCreateClick}
                    >
                        <Plus className="w-4 h-4" />
                        New Quiz
                    </Button>
                </div>

                {/* Filters */}
                <QuizzesFilters
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    quizTypeFilter={quizTypeFilter}
                    onQuizTypeChange={setQuizTypeFilter}
                    courseFilter={courseFilter}
                    onCourseChange={setCourseFilter}
                    courses={courses.map(c => ({ id: c.id, title: c.title }))}
                />

                {/* Data Table */}
                <div className="overflow-x-auto">
                    <DataTable
                        columns={columns}
                        data={filteredQuizzes}
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
                title="Delete Quiz"
                description="Are you sure you want to delete this quiz? This action cannot be undone."
                itemType="Quiz"
                itemName={quizToDelete?.title || ''}
            />
        </div>
    );
}
