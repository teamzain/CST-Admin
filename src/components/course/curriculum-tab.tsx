import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import { ModuleItem, type Module, type Lesson, type Session, type Quiz } from './module-item';
import { ModuleModal } from './module-modal';
import { LessonModal } from './lesson-modal';
import { SessionModal } from './session-modal';
import { QuizModal } from './quiz-modal';
import { DeleteConfirmationDialog } from '@/components/shared/delete-confirmation-dialog';

interface CurriculumTabProps {
    courseId: number;
}

interface DeleteState {
    isOpen: boolean;
    type: 'module' | 'lesson' | 'session' | 'quiz';
    id: number;
    title: string;
}

// Helper function to reorder items in an array
const reorder = <T,>(list: T[], startIndex: number, endIndex: number): T[] => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
};

export function CurriculumTab({ courseId }: CurriculumTabProps) {
    // Mock data - in real app, this would come from API/store
    const [modules, setModules] = useState<Module[]>([
        {
            id: 1,
            title: 'Module 1: Introduction to Security',
            description: 'Fundamental concepts and principles',
            order_index: 0,
            lessons: [
                {
                    id: 1,
                    title: 'Welcome to Security Training',
                    content_type: 'video',
                    duration_min: 15,
                    order_index: 0,
                },
                {
                    id: 2,
                    title: 'Security Fundamentals PDF',
                    content_type: 'pdf',
                    duration_min: 30,
                    order_index: 1,
                },
            ],
            sessions: [],
            quizzes: [
                {
                    id: 1,
                    title: 'Module 1 Quiz',
                    passing_score: 70,
                    is_final: false,
                    order_index: 2,
                },
            ],
        },
    ]);

    // TODO: Replace with actual API call
    useEffect(() => {
        console.log('Fetching curriculum for course:', courseId);
        // fetchCurriculum(courseId);
    }, [courseId]);

    // Modal states
    const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
    const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
    const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
    const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);

    // Selected items for editing
    const [selectedModule, setSelectedModule] = useState<Module | undefined>();
    const [selectedLesson, setSelectedLesson] = useState<Lesson | undefined>();
    const [selectedSession, setSelectedSession] = useState<Session | undefined>();
    const [selectedQuiz, setSelectedQuiz] = useState<Quiz | undefined>();
    const [currentModuleId, setCurrentModuleId] = useState<number | undefined>();

    // Delete confirmation state
    const [deleteState, setDeleteState] = useState<DeleteState>({
        isOpen: false,
        type: 'module',
        id: 0,
        title: '',
    });

    // Drag and drop handler
    const handleDragEnd = (result: DropResult) => {
        const { source, destination, type } = result;

        // Dropped outside the list
        if (!destination) {
            return;
        }

        // No movement
        if (source.droppableId === destination.droppableId && source.index === destination.index) {
            return;
        }

        // Reordering modules
        if (type === 'MODULE') {
            const reorderedModules = reorder(modules, source.index, destination.index);
            // Update order_index for all modules
            const updatedModules = reorderedModules.map((module, index) => ({
                ...module,
                order_index: index,
            }));
            setModules(updatedModules);
            return;
        }

        // Reordering items within a module (lessons, sessions, quizzes)
        const sourceModuleId = parseInt(source.droppableId.split('-')[1]);
        const destModuleId = parseInt(destination.droppableId.split('-')[1]);

        // Moving within the same module
        if (sourceModuleId === destModuleId) {
            setModules(modules.map(module => {
                if (module.id === sourceModuleId) {
                    let updatedModule = { ...module };

                    if (type === 'LESSON') {
                        const reorderedLessons = reorder(module.lessons, source.index, destination.index);
                        updatedModule.lessons = reorderedLessons.map((lesson, index) => ({
                            ...lesson,
                            order_index: index,
                        }));
                    } else if (type === 'SESSION') {
                        const reorderedSessions = reorder(module.sessions, source.index, destination.index);
                        updatedModule.sessions = reorderedSessions.map((session, index) => ({
                            ...session,
                            order_index: index,
                        }));
                    } else if (type === 'QUIZ') {
                        const reorderedQuizzes = reorder(module.quizzes, source.index, destination.index);
                        updatedModule.quizzes = reorderedQuizzes.map((quiz, index) => ({
                            ...quiz,
                            order_index: index,
                        }));
                    }

                    return updatedModule;
                }
                return module;
            }));
        } else {
            // Moving between different modules
            setModules(modules.map(module => {
                // Remove from source module
                if (module.id === sourceModuleId) {
                    let updatedModule = { ...module };

                    if (type === 'LESSON') {
                        const [movedLesson] = updatedModule.lessons.splice(source.index, 1);
                        // Store the moved item temporarily
                        (window as any).__movedItem = movedLesson;
                        updatedModule.lessons = updatedModule.lessons.map((lesson, index) => ({
                            ...lesson,
                            order_index: index,
                        }));
                    } else if (type === 'SESSION') {
                        const [movedSession] = updatedModule.sessions.splice(source.index, 1);
                        (window as any).__movedItem = movedSession;
                        updatedModule.sessions = updatedModule.sessions.map((session, index) => ({
                            ...session,
                            order_index: index,
                        }));
                    } else if (type === 'QUIZ') {
                        const [movedQuiz] = updatedModule.quizzes.splice(source.index, 1);
                        (window as any).__movedItem = movedQuiz;
                        updatedModule.quizzes = updatedModule.quizzes.map((quiz, index) => ({
                            ...quiz,
                            order_index: index,
                        }));
                    }

                    return updatedModule;
                }
                // Add to destination module
                else if (module.id === destModuleId) {
                    let updatedModule = { ...module };
                    const movedItem = (window as any).__movedItem;

                    if (type === 'LESSON' && movedItem) {
                        updatedModule.lessons.splice(destination.index, 0, movedItem);
                        updatedModule.lessons = updatedModule.lessons.map((lesson, index) => ({
                            ...lesson,
                            order_index: index,
                        }));
                    } else if (type === 'SESSION' && movedItem) {
                        updatedModule.sessions.splice(destination.index, 0, movedItem);
                        updatedModule.sessions = updatedModule.sessions.map((session, index) => ({
                            ...session,
                            order_index: index,
                        }));
                    } else if (type === 'QUIZ' && movedItem) {
                        updatedModule.quizzes.splice(destination.index, 0, movedItem);
                        updatedModule.quizzes = updatedModule.quizzes.map((quiz, index) => ({
                            ...quiz,
                            order_index: index,
                        }));
                    }

                    delete (window as any).__movedItem;
                    return updatedModule;
                }
                return module;
            }));
        }
    };

    // Module handlers
    const handleAddModule = () => {
        setSelectedModule(undefined);
        setIsModuleModalOpen(true);
    };

    const handleEditModule = (module: Module) => {
        setSelectedModule(module);
        setIsModuleModalOpen(true);
    };

    const handleSaveModule = (moduleData: Partial<Module>) => {
        if (selectedModule) {
            // Update existing module
            setModules(modules.map(m =>
                m.id === selectedModule.id
                    ? { ...m, ...moduleData }
                    : m
            ));
            toast.success('Module updated successfully');
        } else {
            // Add new module
            const newModule: Module = {
                id: Date.now(),
                title: moduleData.title || '',
                description: moduleData.description,
                order_index: modules.length,
                lessons: [],
                sessions: [],
                quizzes: [],
            };
            setModules([...modules, newModule]);
            toast.success('Module created successfully');
        }
    };

    const handleDeleteModule = (moduleId: number) => {
        const moduleToDelete = modules.find(m => m.id === moduleId);
        if (moduleToDelete) {
            setDeleteState({
                isOpen: true,
                type: 'module',
                id: moduleId,
                title: moduleToDelete.title,
            });
        }
    };

    // Lesson handlers
    const handleAddLesson = (moduleId: number) => {
        setCurrentModuleId(moduleId);
        setSelectedLesson(undefined);
        setIsLessonModalOpen(true);
    };

    const handleEditLesson = (lesson: Lesson) => {
        setSelectedLesson(lesson);
        setIsLessonModalOpen(true);
    };

    const handleSaveLesson = (lessonData: Partial<Lesson>, file?: File) => {
        if (!currentModuleId) return;

        // In a real app, here we would:
        // 1. Create the lesson via API
        // 2. If file exists:
        //    - For Video: Get upload URL -> Upload to Bunny -> Update lesson status
        //    - For PDF: Upload to server/Bunny -> Update lesson with URL

        if (file) {
            console.log('File to upload:', file.name, file.size);
            // Mock upload process
        }

        setModules(modules.map(module => {
            if (module.id === currentModuleId) {
                if (selectedLesson) {
                    // Update existing lesson
                    toast.success('Lesson updated successfully');
                    return {
                        ...module,
                        lessons: module.lessons.map(l =>
                            l.id === selectedLesson.id ? { ...l, ...lessonData } : l
                        ),
                    };
                } else {
                    // Add new lesson
                    const newLesson: Lesson = {
                        id: Date.now(),
                        title: lessonData.title || '',
                        content_type: lessonData.content_type || 'video',
                        duration_min: lessonData.duration_min,
                        description: lessonData.description,
                        content_url: lessonData.content_url,
                        pdf_url: lessonData.pdf_url,
                        order_index: module.lessons.length,
                    };
                    toast.success('Lesson created successfully');
                    return {
                        ...module,
                        lessons: [...module.lessons, newLesson],
                    };
                }
            }
            return module;
        }));
    };

    const handleDeleteLesson = (lessonId: number) => {
        let lessonToDelete: Lesson | undefined;
        modules.forEach(m => {
            const found = m.lessons.find(l => l.id === lessonId);
            if (found) lessonToDelete = found;
        });

        if (lessonToDelete) {
            setDeleteState({
                isOpen: true,
                type: 'lesson',
                id: lessonId,
                title: lessonToDelete.title,
            });
        }
    };

    // Session handlers
    const handleAddSession = (moduleId: number) => {
        setCurrentModuleId(moduleId);
        setSelectedSession(undefined);
        setIsSessionModalOpen(true);
    };

    const handleEditSession = (session: Session) => {
        setSelectedSession(session);
        setIsSessionModalOpen(true);
    };

    const handleSaveSession = (sessionData: Partial<Session>) => {
        if (!currentModuleId) return;

        setModules(modules.map(module => {
            if (module.id === currentModuleId) {
                if (selectedSession) {
                    // Update existing session
                    toast.success('Session updated successfully');
                    return {
                        ...module,
                        sessions: module.sessions.map(s =>
                            s.id === selectedSession.id ? { ...s, ...sessionData } : s
                        ),
                    };
                } else {
                    // Add new session
                    const newSession: Session = {
                        id: Date.now(),
                        title: sessionData.title || '',
                        start_time: sessionData.start_time || '',
                        end_time: sessionData.end_time || '',
                        session_type: sessionData.session_type || 'LIVE',
                        order_index: module.sessions.length,
                    };
                    toast.success('Session scheduled successfully');
                    return {
                        ...module,
                        sessions: [...module.sessions, newSession],
                    };
                }
            }
            return module;
        }));
    };

    const handleDeleteSession = (sessionId: number) => {
        let sessionToDelete: Session | undefined;
        modules.forEach(m => {
            const found = m.sessions.find(s => s.id === sessionId);
            if (found) sessionToDelete = found;
        });

        if (sessionToDelete) {
            setDeleteState({
                isOpen: true,
                type: 'session',
                id: sessionId,
                title: sessionToDelete.title,
            });
        }
    };

    // Quiz handlers
    const handleAddQuiz = (moduleId: number) => {
        setCurrentModuleId(moduleId);
        setSelectedQuiz(undefined);
        setIsQuizModalOpen(true);
    };

    const handleEditQuiz = (quiz: Quiz) => {
        setSelectedQuiz(quiz);
        setIsQuizModalOpen(true);
    };

    const handleSaveQuiz = (quizData: Partial<Quiz>) => {
        if (!currentModuleId) return;

        setModules(modules.map(module => {
            if (module.id === currentModuleId) {
                if (selectedQuiz) {
                    // Update existing quiz
                    toast.success('Quiz updated successfully');
                    return {
                        ...module,
                        quizzes: module.quizzes.map(q =>
                            q.id === selectedQuiz.id ? { ...q, ...quizData } : q
                        ),
                    };
                } else {
                    // Add new quiz
                    const newQuiz: Quiz = {
                        id: Date.now(),
                        title: quizData.title || '',
                        passing_score: quizData.passing_score || 70,
                        is_final: quizData.is_final || false,
                        order_index: module.quizzes.length,
                    };
                    toast.success('Quiz created successfully');
                    return {
                        ...module,
                        quizzes: [...module.quizzes, newQuiz],
                    };
                }
            }
            return module;
        }));
    };

    const handleDeleteQuiz = (quizId: number) => {
        let quizToDelete: Quiz | undefined;
        modules.forEach(m => {
            const found = m.quizzes.find(q => q.id === quizId);
            if (found) quizToDelete = found;
        });

        if (quizToDelete) {
            setDeleteState({
                isOpen: true,
                type: 'quiz',
                id: quizId,
                title: quizToDelete.title,
            });
        }
    };

    const handleConfirmDelete = () => {
        const { type, id } = deleteState;

        if (type === 'module') {
            setModules(modules.filter(m => m.id !== id));
            toast.success('Module deleted successfully');
        } else if (type === 'lesson') {
            setModules(modules.map(module => ({
                ...module,
                lessons: module.lessons.filter(l => l.id !== id),
            })));
            toast.success('Lesson deleted successfully');
        } else if (type === 'session') {
            setModules(modules.map(module => ({
                ...module,
                sessions: module.sessions.filter(s => s.id !== id),
            })));
            toast.success('Session deleted successfully');
        } else if (type === 'quiz') {
            setModules(modules.map(module => ({
                ...module,
                quizzes: module.quizzes.filter(q => q.id !== id),
            })));
            toast.success('Quiz deleted successfully');
        }

        setDeleteState(prev => ({ ...prev, isOpen: false }));
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <Card className="bg-card border-border">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Course Curriculum</CardTitle>
                            <CardDescription>
                                Organize your course content into modules with lessons, sessions, and quizzes. Drag and drop to reorder.
                            </CardDescription>
                        </div>
                        <Button
                            onClick={handleAddModule}
                            className="gap-2 bg-primary hover:bg-primary/90"
                        >
                            <Plus className="w-4 h-4" />
                            Add Module
                        </Button>
                    </div>
                </CardHeader>
            </Card>

            {/* Modules List with Drag and Drop */}
            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="modules" type="MODULE">
                    {(provided) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="space-y-4"
                        >
                            {modules.length > 0 ? (
                                modules.map((module, index) => (
                                    <Draggable
                                        key={module.id}
                                        draggableId={`module-${module.id}`}
                                        index={index}
                                    >
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                            >
                                                <ModuleItem
                                                    module={module}
                                                    dragHandleProps={provided.dragHandleProps}
                                                    isDragging={snapshot.isDragging}
                                                    onEdit={handleEditModule}
                                                    onDelete={handleDeleteModule}
                                                    onAddLesson={handleAddLesson}
                                                    onAddSession={handleAddSession}
                                                    onAddQuiz={handleAddQuiz}
                                                    onEditLesson={handleEditLesson}
                                                    onEditSession={handleEditSession}
                                                    onEditQuiz={handleEditQuiz}
                                                    onDeleteLesson={handleDeleteLesson}
                                                    onDeleteSession={handleDeleteSession}
                                                    onDeleteQuiz={handleDeleteQuiz}
                                                />
                                            </div>
                                        )}
                                    </Draggable>
                                ))
                            ) : (
                                <Card className="bg-card border-border border-dashed">
                                    <CardContent className="pt-12 pb-12">
                                        <div className="text-center">
                                            <p className="text-muted-foreground mb-4">
                                                No modules yet. Create your first module to start building your course.
                                            </p>
                                            <Button
                                                onClick={handleAddModule}
                                                variant="outline"
                                                className="gap-2"
                                            >
                                                <Plus className="w-4 h-4" />
                                                Create First Module
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>

            {/* Modals */}
            <ModuleModal
                isOpen={isModuleModalOpen}
                onClose={() => setIsModuleModalOpen(false)}
                onSave={handleSaveModule}
                module={selectedModule}
            />

            <LessonModal
                isOpen={isLessonModalOpen}
                onClose={() => setIsLessonModalOpen(false)}
                onSave={handleSaveLesson}
                lesson={selectedLesson}
                courseId={courseId}
                moduleId={currentModuleId}
            />

            <SessionModal
                isOpen={isSessionModalOpen}
                onClose={() => setIsSessionModalOpen(false)}
                onSave={handleSaveSession}
                session={selectedSession}
            />

            <QuizModal
                isOpen={isQuizModalOpen}
                onClose={() => setIsQuizModalOpen(false)}
                onSave={handleSaveQuiz}
                quiz={selectedQuiz}
            />

            <DeleteConfirmationDialog
                isOpen={deleteState.isOpen}
                onClose={() => setDeleteState(prev => ({ ...prev, isOpen: false }))}
                onConfirm={handleConfirmDelete}
                title={`Delete ${deleteState.type.charAt(0).toUpperCase() + deleteState.type.slice(1)}`}
                description={`Are you sure you want to delete this ${deleteState.type}? This action cannot be undone.`}
                itemType={deleteState.type}
                itemName={deleteState.title}
            />
        </div>
    );
}
