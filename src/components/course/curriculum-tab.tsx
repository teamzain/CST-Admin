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
import { convertToISO8601 } from '@/lib/utils';
import { SessionModal } from './session-modal';
import { QuizModal } from './quiz-modal';
import { DeleteConfirmationDialog } from '@/components/shared/delete-confirmation-dialog';
import { sessionsService } from '@/api/sessions';
import { lessonsService } from '@/api/lessons';
import { quizzesService } from '@/api/quizzes';

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
    const [modules, setModules] = useState<Module[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchModules = async () => {
            try {
                setIsLoading(true);
                const { modulesService } = await import('@/api/modules');
                const fetchedModules = await modulesService.getModulesByCourse(courseId);
                console.log('Modules loaded in curriculum-tab:', fetchedModules);
                setModules(fetchedModules as Module[]);
            } catch (error) {
                console.error('Failed to fetch modules:', error);
                toast.error('Failed to load curriculum');
                setModules([]);
            } finally {
                setIsLoading(false);
            }
        };

        if (courseId) {
            fetchModules();
        }
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

    const handleDragEnd = async (result: DropResult) => {
        const { source, destination, type } = result;
        if (!destination) return;
        if (source.droppableId === destination.droppableId && source.index === destination.index) return;

        try {
            const { modulesService } = await import('@/api/modules');

            if (type === 'MODULE') {
                const newModules = reorder(modules, source.index, destination.index);
                const updatedModules = newModules.map((m, i) => ({ ...m, order_index: i + 1 }));
                setModules(updatedModules);

                // Save new order to backend
                const moduleId = modules[source.index].id;
                await modulesService.updateModuleOrder(moduleId, destination.index + 1);
            }

            if (type === 'MODULE_ITEM') {
                // Keep the local reordering logic for immediate feedback
                setModules(prevModules => {
                    const newModules = [...prevModules];
                    const sourceModuleId = parseInt(source.droppableId.split('-')[2]);
                    const destModuleId = parseInt(destination.droppableId.split('-')[2]);

                    const sourceModuleIndex = newModules.findIndex(m => m.id === sourceModuleId);
                    const destModuleIndex = newModules.findIndex(m => m.id === destModuleId);

                    if (sourceModuleIndex === -1 || destModuleIndex === -1) return prevModules;

                    const sourceModule = { ...newModules[sourceModuleIndex] };

                    const getCombinedItems = (mod: any) => [
                        ...(mod.lessons || []).map((l: any) => ({ ...l, itemType: 'lesson' as const })),
                        ...(mod.sessions || []).map((s: any) => ({ ...s, itemType: 'session' as const })),
                        ...(mod.quizzes || []).map((q: any) => ({ ...q, itemType: 'quiz' as const })),
                    ].sort((a, b) => a.order_index - b.order_index);

                    const sourceItems = getCombinedItems(sourceModule);

                    if (sourceModuleId === destModuleId) {
                        const reordered = reorder(sourceItems, source.index, destination.index);
                        const updated = reordered.map((item, i) => ({ ...item, order_index: i + 1 }));

                        sourceModule.lessons = updated.filter(i => i.itemType === 'lesson').map(({ itemType, ...rest }) => rest as any);
                        sourceModule.sessions = updated.filter(i => i.itemType === 'session').map(({ itemType, ...rest }) => rest as any);
                        sourceModule.quizzes = updated.filter(i => i.itemType === 'quiz').map(({ itemType, ...rest }) => rest as any);

                        newModules[sourceModuleIndex] = sourceModule;
                    } else {
                        const destModule = { ...newModules[destModuleIndex] };
                        const destItems = getCombinedItems(destModule);
                        const [removed] = sourceItems.splice(source.index, 1);
                        destItems.splice(destination.index, 0, removed);

                        const updatedSource = sourceItems.map((item, i) => ({ ...item, order_index: i + 1 }));
                        const updatedDest = destItems.map((item, i) => ({ ...item, order_index: i + 1 }));

                        sourceModule.lessons = updatedSource.filter(i => i.itemType === 'lesson').map(({ itemType, ...rest }) => rest as any);
                        sourceModule.sessions = updatedSource.filter(i => i.itemType === 'session').map(({ itemType, ...rest }) => rest as any);
                        sourceModule.quizzes = updatedSource.filter(i => i.itemType === 'quiz').map(({ itemType, ...rest }) => rest as any);

                        destModule.lessons = updatedDest.filter(i => i.itemType === 'lesson').map(({ itemType, ...rest }) => rest as any);
                        destModule.sessions = updatedDest.filter(i => i.itemType === 'session').map(({ itemType, ...rest }) => rest as any);
                        destModule.quizzes = updatedDest.filter(i => i.itemType === 'quiz').map(({ itemType, ...rest }) => rest as any);

                        newModules[sourceModuleIndex] = sourceModule;
                        newModules[destModuleIndex] = destModule;
                    }
                    return newModules;
                });

                // Note: Full item reordering persistence would require batch update API or individual item updates
                toast.info('Item reordered locally');
            }
        } catch (error) {
            console.error('Failed to update order:', error);
            toast.error('Failed to save new order');
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

    const handleSaveModule = async (moduleData: Partial<Module>) => {
        try {
            const { modulesService } = await import('@/api/modules');
            if (selectedModule) {
                const updatedModule = await modulesService.updateModule(selectedModule.id, {
                    title: moduleData.title || '',
                    description: moduleData.description,
                    order_index: selectedModule.order_index,
                });

                setModules(prev => prev.map(m =>
                    m.id === selectedModule.id
                        ? {
                            ...m,
                            ...updatedModule,
                            // Ensure title and description are updated even if API response is partial
                            title: updatedModule?.title || moduleData.title || m.title,
                            description: updatedModule?.description !== undefined ? updatedModule.description : moduleData.description,
                            // Preserve curriculum sub-items as they are usually not in the PATCH response
                            lessons: m.lessons,
                            sessions: m.sessions,
                            quizzes: m.quizzes
                        }
                        : m
                ));
                toast.success('Module updated successfully');
            } else {
                const response = await modulesService.createModule(courseId, {
                    title: moduleData.title || '',
                    description: moduleData.description,
                    order_index: modules.length + 1,
                });

                // Handle potential nesting from common API patterns
                const newModule = (response as any).module || response;

                setModules([...modules, {
                    ...newModule,
                    lessons: (newModule as any).lessons || [],
                    sessions: (newModule as any).sessions || [],
                    quizzes: (newModule as any).quizzes || [],
                }]);
                toast.success('Module created successfully');
            }
            setIsModuleModalOpen(false);
        } catch (error) {
            console.error('Failed to save module:', error);
            const { modulesService } = await import('@/api/modules');
            toast.error(modulesService.getErrorMessage(error, 'Failed to save module'));
        }
    };

    const handleDeleteModule = async (moduleId: number) => {
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

    const handleSaveLesson = async (lessonData: Partial<Lesson>) => {
        if (!currentModuleId) return;
        try {
            const targetModule = modules.find(m => m.id === currentModuleId);
            if (!targetModule) return;

            const apiResult = await lessonsService.createLesson(currentModuleId, {
                title: lessonData.title || '',
                content_type: lessonData.content_type || 'video',
                duration_min: lessonData.duration_min,
                description: lessonData.description,
                content_url: lessonData.content_url,
                pdf_url: lessonData.pdf_url,
                order_index: (targetModule.lessons || []).length + 1,
            });

            // Cast API result to UI Lesson type
            const newLesson: Lesson = {
                id: apiResult.id,
                title: apiResult.title,
                content_type: (apiResult.content_type as 'video' | 'pdf' | 'text') || 'video',
                order_index: apiResult.order_index,
                duration_min: apiResult.duration_min,
                description: apiResult.description,
                content_url: apiResult.content_url,
                pdf_url: apiResult.pdf_url,
                bunny_video_id: (apiResult as any).bunny_video_id,
                video_status: (apiResult as any).video_status,
            };

            setModules(modules.map(module => {
                if (module.id === currentModuleId) {
                    return { ...module, lessons: [...(module.lessons || []), newLesson] };
                }
                return module;
            }));
            toast.success('Lesson created successfully');
            setIsLessonModalOpen(false);
        } catch (error) {
            console.error('Failed to save lesson:', error);
            toast.error(lessonsService.getErrorMessage(error, 'Failed to save lesson'));
        }
    };

    const handleAddSession = (moduleId: number) => {
        setCurrentModuleId(moduleId);
        setSelectedSession(undefined);
        setIsSessionModalOpen(true);
    };

    const handleEditSession = async (session: Session) => {
        try {
            const fullSessionData = await sessionsService.getSessionById(session.id);
            setSelectedSession(fullSessionData);
            setIsSessionModalOpen(true);
        } catch (error) {
            console.error('Failed to load session:', error);
            toast.error('Failed to load session details');
        }
    };

    const handleSaveSession = async (sessionData: Partial<Session>) => {
        if (!courseId) return;
        try {
            // Convert datetime-local format to ISO 8601 UTC
            const startTime = convertToISO8601(sessionData.start_time || '');
            const endTime = convertToISO8601(sessionData.end_time || '');

            if (!startTime || !endTime) {
                toast.error('Please provide valid start and end times');
                return;
            }

            // If editing existing session
            if (selectedSession) {
                const apiResult = await sessionsService.updateSession(selectedSession.id, {
                    title: sessionData.title || '',
                    start_time: startTime,
                    end_time: endTime,
                    capacity: sessionData.capacity || 20,
                    session_type: sessionData.session_type || 'LIVE',
                    location: sessionData.location,
                    meeting_url: sessionData.meeting_url,
                    module_id: selectedSession.module_id,
                });

                console.log('Session updated, new data:', apiResult);

                // Update the session in the modules - find the correct module and update the session
                setModules(modules.map(module => {
                    if (module.sessions?.some(s => s.id === selectedSession.id)) {
                        return {
                            ...module,
                            sessions: module.sessions.map(s => s.id === selectedSession.id ? { ...s, ...apiResult } : s),
                        };
                    }
                    return module;
                }));

                toast.success('Session updated successfully');
            } else {
                // Creating new session
                if (!currentModuleId) return;

                const apiResult = await sessionsService.createSessionForCourse(courseId, {
                    title: sessionData.title || '',
                    start_time: startTime,
                    end_time: endTime,
                    capacity: sessionData.capacity || 20,
                    session_type: sessionData.session_type || 'LIVE',
                    location: sessionData.location,
                    meeting_url: sessionData.meeting_url,
                    module_id: currentModuleId,
                });

                setModules(modules.map(module => {
                    if (module.id === currentModuleId) {
                        return { ...module, sessions: [...(module.sessions || []), apiResult] };
                    }
                    return module;
                }));

                toast.success('Session scheduled successfully');
            }

            setIsSessionModalOpen(false);
            setSelectedSession(undefined);
            setCurrentModuleId(undefined);
        } catch (error) {
            console.error('Failed to save session:', error);
            const { modulesService } = await import('@/api/modules');
            toast.error(modulesService.getErrorMessage(error, 'Failed to save session'));
        }
    };

    const handleAddQuiz = (moduleId: number) => {
        setCurrentModuleId(moduleId);
        setSelectedQuiz(undefined);
        setIsQuizModalOpen(true);
    };

    const handleEditQuiz = (quiz: Quiz) => {
        navigate(`/quizzes/${quiz.id}`);
    };

    const handleSaveQuiz = async (quizData: Partial<Quiz>) => {
        if (!currentModuleId) return;
        try {
            const targetModule = modules.find(m => m.id === currentModuleId);
            if (!targetModule) return;

            const newQuiz = await quizzesService.createQuiz(currentModuleId, {
                title: quizData.title || '',
                passing_score: quizData.passing_score || 70,
                is_final: quizData.is_final || false,
                order_index: (targetModule.quizzes || []).length + 1,
            });

            setModules(modules.map(module => {
                if (module.id === currentModuleId) {
                    return { ...module, quizzes: [...(module.quizzes || []), newQuiz] };
                }
                return module;
            }));
            toast.success('Quiz created successfully');
            setIsQuizModalOpen(false);
        } catch (error) {
            console.error('Failed to save quiz:', error);
            toast.error(quizzesService.getErrorMessage(error, 'Failed to save quiz'));
        }
    };

    const handleConfirmDelete = async () => {
        const { type, id } = deleteState;
        try {
            const { modulesService } = await import('@/api/modules');
            if (type === 'module') {
                await modulesService.deleteModule(id);
                setModules(modules.filter(m => m.id !== id));
            } else if (type === 'lesson') {
                await lessonsService.deleteLesson(id);
                setModules(modules.map(m => ({ ...m, lessons: m.lessons.filter(l => l.id !== id) })));
            } else if (type === 'session') {
                await sessionsService.deleteSession(id);
                setModules(modules.map(m => ({ ...m, sessions: m.sessions?.filter(s => s.id !== id) || [] })));
            } else if (type === 'quiz') {
                await quizzesService.deleteQuiz(id);
                setModules(modules.map(m => ({ ...m, quizzes: m.quizzes.filter(q => q.id !== id) })));
            }
            setDeleteState(prev => ({ ...prev, isOpen: false }));
            toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully`);
        } catch (error) {
            console.error(`Failed to delete ${type}:`, error);
            const { modulesService } = await import('@/api/modules');
            toast.error(modulesService.getErrorMessage(error, `Failed to delete ${type}`));
        }
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
                <Button onClick={handleAddModule} className="gap-2 bg-primary hover:bg-primary/90 text-black font-medium" disabled={isLoading}>
                    <Plus className="w-4 h-4" /> Add Module
                </Button>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center p-8">
                    <div className="text-center">
                        <p className="text-muted-foreground">Loading curriculum...</p>
                    </div>
                </div>
            ) : modules.length === 0 ? (
                <div className="flex items-center justify-center p-8 border-2 border-dashed rounded-lg">
                    <div className="text-center">
                        <p className="text-muted-foreground mb-4">No modules yet</p>
                        <Button onClick={handleAddModule} variant="outline" className="gap-2">
                            <Plus className="w-4 h-4" /> Create First Module
                        </Button>
                    </div>
                </div>
            ) : (
                <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="modules" type="MODULE">
                        {(provided) => (
                            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                                {modules.map((module, index) => (
                                    <Draggable key={module.id || `module-temp-${index}`} draggableId={String(module.id || `module-${index}`)} index={index}>
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
            )}

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
