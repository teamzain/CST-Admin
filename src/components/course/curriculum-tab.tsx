import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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

const reorder = <T,>(list: T[], startIndex: number, endIndex: number): T[] => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
};

export function CurriculumTab({ courseId }: CurriculumTabProps) {
    const navigate = useNavigate();
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

    useEffect(() => {
        console.log('Fetching curriculum for course:', courseId);
    }, [courseId]);

    const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
    const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
    const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
    const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);

    const [selectedModule, setSelectedModule] = useState<Module | undefined>();
    const [selectedLesson, setSelectedLesson] = useState<Lesson | undefined>();
    const [selectedSession, setSelectedSession] = useState<Session | undefined>();
    const [selectedQuiz, setSelectedQuiz] = useState<Quiz | undefined>();
    const [currentModuleId, setCurrentModuleId] = useState<number | undefined>();

    const [deleteState, setDeleteState] = useState<DeleteState>({
        isOpen: false,
        type: 'module',
        id: 0,
        title: '',
    });

    const handleDragEnd = (result: DropResult) => {
        const { source, destination, type } = result;
        if (!destination) return;
        if (source.droppableId === destination.droppableId && source.index === destination.index) return;

        if (type === 'MODULE') {
            const reorderedModules = reorder(modules, source.index, destination.index);
            setModules(reorderedModules.map((m, i) => ({ ...m, order_index: i })));
            return;
        }

        const sourceModuleId = parseInt(source.droppableId.split('-')[1]);
        const destModuleId = parseInt(destination.droppableId.split('-')[1]);

        if (sourceModuleId === destModuleId) {
            setModules(modules.map(module => {
                if (module.id === sourceModuleId) {
                    let updatedModule = { ...module };
                    if (type === 'LESSON') {
                        updatedModule.lessons = reorder(module.lessons, source.index, destination.index).map((l, i) => ({ ...l, order_index: i }));
                    } else if (type === 'SESSION') {
                        updatedModule.sessions = reorder(module.sessions, source.index, destination.index).map((s, i) => ({ ...s, order_index: i }));
                    } else if (type === 'QUIZ') {
                        updatedModule.quizzes = reorder(module.quizzes, source.index, destination.index).map((q, i) => ({ ...q, order_index: i }));
                    }
                    return updatedModule;
                }
                return module;
            }));
        }
    };

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
            setModules(modules.map(m => m.id === selectedModule.id ? { ...m, ...moduleData } : m));
            toast.success('Module updated successfully');
        } else {
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
            setDeleteState({ isOpen: true, type: 'module', id: moduleId, title: moduleToDelete.title });
        }
    };

    const handleAddLesson = (moduleId: number) => {
        setCurrentModuleId(moduleId);
        setSelectedLesson(undefined);
        setIsLessonModalOpen(true);
    };

    const handleEditLesson = (lesson: Lesson) => {
        navigate(`/lessons/${lesson.id}`);
    };

    const handleSaveLesson = (lessonData: Partial<Lesson>) => {
        if (!currentModuleId) return;
        setModules(modules.map(module => {
            if (module.id === currentModuleId) {
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
                return { ...module, lessons: [...module.lessons, newLesson] };
            }
            return module;
        }));
        toast.success('Lesson created successfully');
    };

    const handleAddSession = (moduleId: number) => {
        setCurrentModuleId(moduleId);
        setSelectedSession(undefined);
        setIsSessionModalOpen(true);
    };

    const handleEditSession = (session: Session) => {
        navigate(`/sessions/${session.id}`);
    };

    const handleSaveSession = (sessionData: Partial<Session>) => {
        if (!currentModuleId) return;
        setModules(modules.map(module => {
            if (module.id === currentModuleId) {
                const newSession: Session = {
                    id: Date.now(),
                    title: sessionData.title || '',
                    start_time: sessionData.start_time || '',
                    end_time: sessionData.end_time || '',
                    session_type: sessionData.session_type || 'LIVE',
                    order_index: module.sessions.length,
                };
                return { ...module, sessions: [...module.sessions, newSession] };
            }
            return module;
        }));
        toast.success('Session scheduled successfully');
    };

    const handleAddQuiz = (moduleId: number) => {
        setCurrentModuleId(moduleId);
        setSelectedQuiz(undefined);
        setIsQuizModalOpen(true);
    };

    const handleEditQuiz = (quiz: Quiz) => {
        navigate(`/quizzes/${quiz.id}`);
    };

    const handleSaveQuiz = (quizData: Partial<Quiz>) => {
        if (!currentModuleId) return;
        setModules(modules.map(module => {
            if (module.id === currentModuleId) {
                const newQuiz: Quiz = {
                    id: Date.now(),
                    title: quizData.title || '',
                    passing_score: quizData.passing_score || 70,
                    is_final: quizData.is_final || false,
                    order_index: module.quizzes.length,
                };
                return { ...module, quizzes: [...module.quizzes, newQuiz] };
            }
            return module;
        }));
        toast.success('Quiz created successfully');
    };

    const handleConfirmDelete = () => {
        const { type, id } = deleteState;
        if (type === 'module') {
            setModules(modules.filter(m => m.id !== id));
        } else if (type === 'lesson') {
            setModules(modules.map(m => ({ ...m, lessons: m.lessons.filter(l => l.id !== id) })));
        } else if (type === 'session') {
            setModules(modules.map(m => ({ ...m, sessions: m.sessions.filter(s => s.id !== id) })));
        } else if (type === 'quiz') {
            setModules(modules.map(m => ({ ...m, quizzes: m.quizzes.filter(q => q.id !== id) })));
        }
        setDeleteState(prev => ({ ...prev, isOpen: false }));
        toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully`);
    };

    return (
        <div className="space-y-6">
            <Card className="bg-card border-border">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Course Curriculum</CardTitle>
                            <CardDescription>
                                Organize your course content into modules. Drag and drop to reorder.
                            </CardDescription>
                        </div>
                        <Button onClick={handleAddModule} className="gap-2 bg-primary hover:bg-primary/90">
                            <Plus className="w-4 h-4" /> Add Module
                        </Button>
                    </div>
                </CardHeader>
            </Card>

            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="modules" type="MODULE">
                    {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                            {modules.map((module, index) => (
                                <Draggable key={module.id} draggableId={`module-${module.id}`} index={index}>
                                    {(provided, snapshot) => (
                                        <div ref={provided.innerRef} {...provided.draggableProps}>
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
                                                onDeleteLesson={(id) => setDeleteState({ isOpen: true, type: 'lesson', id, title: 'Lesson' })}
                                                onDeleteSession={(id) => setDeleteState({ isOpen: true, type: 'session', id, title: 'Session' })}
                                                onDeleteQuiz={(id) => setDeleteState({ isOpen: true, type: 'quiz', id, title: 'Quiz' })}
                                            />
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>

            <ModuleModal isOpen={isModuleModalOpen} onClose={() => setIsModuleModalOpen(false)} onSave={handleSaveModule} module={selectedModule} />
            <LessonModal isOpen={isLessonModalOpen} onClose={() => setIsLessonModalOpen(false)} onSave={handleSaveLesson} lesson={selectedLesson} courseId={courseId} moduleId={currentModuleId} />
            <SessionModal isOpen={isSessionModalOpen} onClose={() => setIsSessionModalOpen(false)} onSave={handleSaveSession} session={selectedSession} />
            <QuizModal isOpen={isQuizModalOpen} onClose={() => setIsQuizModalOpen(false)} onSave={handleSaveQuiz} quiz={selectedQuiz} moduleId={currentModuleId || 0} />
            <DeleteConfirmationDialog
                isOpen={deleteState.isOpen}
                onClose={() => setDeleteState(prev => ({ ...prev, isOpen: false }))}
                onConfirm={handleConfirmDelete}
                title={`Delete ${deleteState.type}`}
                description={`Are you sure you want to delete this ${deleteState.type}?`}
                itemType={deleteState.type}
                itemName={deleteState.title}
            />
        </div>
    );
}
