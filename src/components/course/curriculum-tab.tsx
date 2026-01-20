import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
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

        setModules(prevModules => {
            const newModules = [...prevModules];

            if (type === 'MODULE') {
                const reordered = reorder(newModules, source.index, destination.index);
                return reordered.map((m, i) => ({ ...m, order_index: i }));
            }

            if (type === 'MODULE_ITEM') {
                const sourceModuleId = parseInt(source.droppableId.split('-')[2]);
                const destModuleId = parseInt(destination.droppableId.split('-')[2]);

                const sourceModuleIndex = newModules.findIndex(m => m.id === sourceModuleId);
                const destModuleIndex = newModules.findIndex(m => m.id === destModuleId);

                if (sourceModuleIndex === -1 || destModuleIndex === -1) return prevModules;

                const sourceModule = { ...newModules[sourceModuleIndex] };

                const getCombinedItems = (mod: any) => [
                    ...mod.lessons.map((l: any) => ({ ...l, itemType: 'lesson' as const })),
                    ...mod.sessions.map((s: any) => ({ ...s, itemType: 'session' as const })),
                    ...mod.quizzes.map((q: any) => ({ ...q, itemType: 'quiz' as const })),
                ].sort((a, b) => a.order_index - b.order_index);

                const sourceItems = getCombinedItems(sourceModule);

                if (sourceModuleId === destModuleId) {
                    const reordered = reorder(sourceItems, source.index, destination.index);
                    const updated = reordered.map((item, i) => ({ ...item, order_index: i }));

                    sourceModule.lessons = updated.filter(i => i.itemType === 'lesson').map(({ itemType, ...rest }) => rest as any);
                    sourceModule.sessions = updated.filter(i => i.itemType === 'session').map(({ itemType, ...rest }) => rest as any);
                    sourceModule.quizzes = updated.filter(i => i.itemType === 'quiz').map(({ itemType, ...rest }) => rest as any);

                    newModules[sourceModuleIndex] = sourceModule;
                } else {
                    const destModule = { ...newModules[destModuleIndex] };
                    const destItems = getCombinedItems(destModule);
                    const [removed] = sourceItems.splice(source.index, 1);
                    destItems.splice(destination.index, 0, removed);

                    const updatedSource = sourceItems.map((item, i) => ({ ...item, order_index: i }));
                    const updatedDest = destItems.map((item, i) => ({ ...item, order_index: i }));

                    sourceModule.lessons = updatedSource.filter(i => i.itemType === 'lesson').map(({ itemType, ...rest }) => rest as any);
                    sourceModule.sessions = updatedSource.filter(i => i.itemType === 'session').map(({ itemType, ...rest }) => rest as any);
                    sourceModule.quizzes = updatedSource.filter(i => i.itemType === 'quiz').map(({ itemType, ...rest }) => rest as any);

                    destModule.lessons = updatedDest.filter(i => i.itemType === 'lesson').map(({ itemType, ...rest }) => rest as any);
                    destModule.sessions = updatedDest.filter(i => i.itemType === 'session').map(({ itemType, ...rest }) => rest as any);
                    destModule.quizzes = updatedDest.filter(i => i.itemType === 'quiz').map(({ itemType, ...rest }) => rest as any);

                    newModules[sourceModuleIndex] = sourceModule;
                    newModules[destModuleIndex] = destModule;
                }
            }

            return newModules;
        });
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
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-semibold">Course Curriculum</h2>
                    <p className="text-sm text-muted-foreground">
                        Organize your course content into modules. Drag and drop to reorder.
                    </p>
                </div>
                <Button onClick={handleAddModule} className="gap-2 bg-primary hover:bg-primary/90 text-black font-medium">
                    <Plus className="w-4 h-4" /> Add Module
                </Button>
            </div>

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
