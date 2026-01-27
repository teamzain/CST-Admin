'use client';

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { DataTable } from '@/components/shared/DataTable';
import { QuizzesFilters } from '@/components/quizzes/quizzes-filters';
import { getQuizColumns } from '@/components/quizzes/quiz-columns';
import { useCoursesStore } from '@/stores/courses-store';
import { quizzesService } from '@/api/quizzes';
import { toast } from 'sonner';
import { useEffect } from 'react';

import { DeleteConfirmationDialog } from '@/components/shared/delete-confirmation-dialog';

export default function AllQuizzesPage() {
    const navigate = useNavigate();
    const { courses } = useCoursesStore();

    const [quizzes, setQuizzes] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [quizTypeFilter, setQuizTypeFilter] = useState<string>('all');
    const [courseFilter, setCourseFilter] = useState<string>('all');
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [quizToDelete, setQuizToDelete] = useState<any>(null);

    useEffect(() => {
        const fetchQuizzes = async () => {
            setIsLoading(true);
            try {
                const data = await quizzesService.getAllQuizzes();
                setQuizzes(data || []);
            } catch (error) {
                console.error('Error fetching quizzes:', error);
                toast.error('Failed to load quizzes');
            } finally {
                setIsLoading(false);
            }
        };

        fetchQuizzes();
    }, []);

    // Flatten quizzes from all courses
    const allQuizzes = useMemo(() => {
        return quizzes.map(quiz => {
            // Find course title if missing
            let course_title = quiz.course_title;
            if (!course_title && quiz.course_id) {
                const course = courses.find(c => c.id === quiz.course_id);
                if (course) course_title = course.title;
            }

            return {
                ...quiz,
                course_title: course_title || 'N/A',
                module_title: quiz.module?.title || 'N/A'
            };
        });
    }, [quizzes, courses]);

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
                    {isLoading ? (
                        <div className="flex items-center justify-center p-12 bg-white rounded-lg border">
                            <div className="flex flex-col items-center gap-2">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                <p className="text-sm text-muted-foreground">Loading quizzes...</p>
                            </div>
                        </div>
                    ) : (
                        <DataTable
                            columns={columns}
                            data={filteredQuizzes}
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
                title="Delete Quiz"
                description="Are you sure you want to delete this quiz? This action cannot be undone."
                itemType="Quiz"
                itemName={quizToDelete?.title || ''}
            />
        </div>
    );
}
