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
import { bunnyUploadService } from '@/api/bunny-upload';

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

// Helper to get the next order_index for a new item in a module
const getNextOrderIndex = (module: Module): number => {
    const allItems = [
        ...(module.lessons || []).map(l => l.order_index || 0),
        ...(module.sessions || []).map(s => s.order_index || 0),
        ...(module.quizzes || []).map(q => q.order_index || 0),
    ];
    return allItems.length > 0 ? Math.max(...allItems) + 1 : 1;
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

                const moduleId = modules[source.index].id;
                await modulesService.updateModuleOrder(moduleId, destination.index + 1);
            }

            if (type === 'MODULE_ITEM') {
                const sourceModuleId = parseInt(source.droppableId.split('-')[2]);
                const destModuleId = parseInt(destination.droppableId.split('-')[2]);

                console.log('Drag operation:', { sourceModuleId, destModuleId, sourceIndex: source.index, destIndex: destination.index });

                const sourceModuleIndex = modules.findIndex(m => m.id === sourceModuleId);
                const destModuleIndex = modules.findIndex(m => m.id === destModuleId);

                if (sourceModuleIndex === -1 || destModuleIndex === -1) {
                    console.error('Module not found:', { sourceModuleIndex, destModuleIndex });
                    return;
                }

                const newModules = [...modules];
                const sourceModule = { ...newModules[sourceModuleIndex] };

                // Combine all items and assign initial order if missing
                const getCombinedItems = (mod: any) => {
                    const items = [
                        ...(mod.lessons || []).map((l: any, idx: number) => ({ ...l, itemType: 'lesson' as const, order_index: l.order_index || idx + 1 })),
                        ...(mod.sessions || []).map((s: any, idx: number) => ({ ...s, itemType: 'session' as const, order_index: s.order_index || idx + 1 })),
                        ...(mod.quizzes || []).map((q: any, idx: number) => ({ ...q, itemType: 'quiz' as const, order_index: q.order_index || idx + 1 })),
                    ];
                    return items.sort((a, b) => (a.order_index || 0) - (b.order_index || 0));
                };

                const sourceItems = getCombinedItems(sourceModule);
                console.log('Source items before reorder:', sourceItems.map(i => ({ id: i.id, type: i.itemType, order: i.order_index })));

                let itemsToUpdate: { id: number; itemType: string; order_index: number; module_id?: number }[] = [];

                if (sourceModuleId === destModuleId) {
                    const reordered = reorder(sourceItems, source.index, destination.index);
                    const updated = reordered.map((item, i) => ({ ...item, order_index: i + 1 }));

                    console.log('Items after reorder:', updated.map(i => ({ id: i.id, type: i.itemType, order: i.order_index })));

                    sourceModule.lessons = updated.filter(i => i.itemType === 'lesson').map(({ itemType, ...rest }) => rest as any);
                    sourceModule.sessions = updated.filter(i => i.itemType === 'session').map(({ itemType, ...rest }) => rest as any);
                    sourceModule.quizzes = updated.filter(i => i.itemType === 'quiz').map(({ itemType, ...rest }) => rest as any);

                    newModules[sourceModuleIndex] = sourceModule;

                    // Collect items to update in backend
                    itemsToUpdate = updated.map(item => ({
                        id: item.id,
                        itemType: item.itemType,
                        order_index: item.order_index,
                    }));
                } else {
                    const destModule = { ...newModules[destModuleIndex] };
                    const destItems = getCombinedItems(destModule);
                    const [removed] = sourceItems.splice(source.index, 1);
                    destItems.splice(destination.index, 0, removed);

                    const updatedSource = sourceItems.map((item, i) => ({ ...item, order_index: i + 1 }));
                    const updatedDest = destItems.map((item, i) => ({ ...item, order_index: i + 1 }));

                    console.log('Source items after move:', updatedSource.map(i => ({ id: i.id, type: i.itemType, order: i.order_index })));
                    console.log('Dest items after move:', updatedDest.map(i => ({ id: i.id, type: i.itemType, order: i.order_index })));

                    sourceModule.lessons = updatedSource.filter(i => i.itemType === 'lesson').map(({ itemType, ...rest }) => rest as any);
                    sourceModule.sessions = updatedSource.filter(i => i.itemType === 'session').map(({ itemType, ...rest }) => rest as any);
                    sourceModule.quizzes = updatedSource.filter(i => i.itemType === 'quiz').map(({ itemType, ...rest }) => rest as any);

                    destModule.lessons = updatedDest.filter(i => i.itemType === 'lesson').map(({ itemType, ...rest }) => rest as any);
                    destModule.sessions = updatedDest.filter(i => i.itemType === 'session').map(({ itemType, ...rest }) => rest as any);
                    destModule.quizzes = updatedDest.filter(i => i.itemType === 'quiz').map(({ itemType, ...rest }) => rest as any);

                    newModules[sourceModuleIndex] = sourceModule;
                    newModules[destModuleIndex] = destModule;

                    // Collect items to update in backend (source module items)
                    itemsToUpdate = [
                        ...updatedSource.map(item => ({
                            id: item.id,
                            itemType: item.itemType,
                            order_index: item.order_index,
                        })),
                        // Destination module items (including module_id change for the moved item)
                        ...updatedDest.map(item => ({
                            id: item.id,
                            itemType: item.itemType,
                            order_index: item.order_index,
                            module_id: destModuleId,
                        })),
                    ];
                }

                setModules(newModules);

                // Persist order changes to backend
                console.log('Items to update:', itemsToUpdate);
                const updatePromises: Promise<any>[] = [];

                for (const item of itemsToUpdate) {
                    console.log(`Updating ${item.itemType} id=${item.id} order_index=${item.order_index}`, item.module_id ? `module_id=${item.module_id}` : '');

                    if (item.itemType === 'lesson') {
                        updatePromises.push(
                            lessonsService.updateLesson(item.id, {
                                order_index: item.order_index,
                                ...(item.module_id && { module_id: item.module_id }),
                            })
                        );
                    } else if (item.itemType === 'session') {
                        updatePromises.push(
                            sessionsService.updateSession(item.id, {
                                order_index: item.order_index,
                                ...(item.module_id && { module_id: item.module_id }),
                            })
                        );
                    } else if (item.itemType === 'quiz') {
                        updatePromises.push(
                            quizzesService.updateQuiz(item.id, {
                                order_index: item.order_index,
                            })
                        );
                    }
                }

                const results = await Promise.all(updatePromises);
                console.log('Update results:', results);
                toast.success('Order updated successfully');
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
                            title: updatedModule?.title || moduleData.title || m.title,
                            description: updatedModule?.description !== undefined ? updatedModule.description : moduleData.description,
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

    const handleSaveLesson = async (lessonData: Partial<Lesson>, file?: File) => {
        if (!currentModuleId) return;
        try {
            const targetModule = modules.find(m => m.id === currentModuleId);
            if (!targetModule) return;

            if (selectedLesson) {
                let finalData = { ...lessonData };

                if (file && lessonData.content_type === 'pdf') {
                    toast.loading('Replacing PDF...', { id: 'pdf-upload' });
                    try {
                        // 1. Delete old file if exists
                        if (selectedLesson.pdf_url) {
                            try {
                                const url = new URL(selectedLesson.pdf_url);
                                const oldPath = url.pathname.startsWith('/') ? url.pathname.substring(1) : url.pathname;
                                await bunnyUploadService.deleteFile(oldPath);
                            } catch (e) {
                                console.warn('Could not delete old PDF:', e);
                            }
                        }

                        // 2. Upload new file
                        const uploadRes = await bunnyUploadService.uploadFile(file, 'course-lesson/');
                        finalData.pdf_url = uploadRes.url;
                        toast.success('PDF replaced successfully', { id: 'pdf-upload' });
                    } catch (error) {
                        toast.error('Failed to replace PDF', { id: 'pdf-upload' });
                        throw error;
                    }
                }

                let apiResult;
                if (file && lessonData.content_type === 'video') {
                    const formData = new FormData();
                    // Clean up finalData to remove nested objects before appending
                    const { course, module, ...cleanData } = finalData as any;
                    Object.entries(cleanData).forEach(([key, value]) => {
                        if (value !== undefined && value !== null) {
                            formData.append(key, String(value));
                        }
                    });
                    formData.append('video', file);
                    apiResult = await lessonsService.updateLesson(selectedLesson.id, formData as any);
                } else {
                    // Clean up finalData to remove nested objects
                    const { course, module, ...cleanData } = finalData as any;
                    apiResult = await lessonsService.updateLesson(selectedLesson.id, cleanData);
                }

                setModules(modules.map(module => {
                    if (module.id === currentModuleId) {
                        return {
                            ...module,
                            lessons: (module.lessons || []).map(l => l.id === selectedLesson.id ? { ...l, ...apiResult as any } : l)
                        };
                    }
                    return module;
                }));
                toast.success('Lesson updated successfully');
            } else {
                let finalPdfUrl = lessonData.pdf_url || '';

                if (file && lessonData.content_type === 'pdf') {
                    toast.loading('Uploading PDF...', { id: 'pdf-upload' });
                    try {
                        const uploadRes = await bunnyUploadService.uploadFile(file, 'course-lesson/');
                        finalPdfUrl = uploadRes.url;
                        toast.success('PDF uploaded successfully', { id: 'pdf-upload' });
                    } catch (error) {
                        toast.error('Failed to upload PDF', { id: 'pdf-upload' });
                        throw error;
                    }
                }

                const nextOrderIndex = getNextOrderIndex(targetModule);

                let apiResult;
                if (file && lessonData.content_type === 'video') {
                    const formData = new FormData();
                    formData.append('title', lessonData.title || '');
                    formData.append('content_type', lessonData.content_type || 'video');
                    formData.append('order_index', String(nextOrderIndex));
                    formData.append('module_id', String(currentModuleId));
                    formData.append('description', lessonData.description || '');
                    formData.append('duration_min', String(lessonData.duration_min || 0));
                    formData.append('enable_download', String(lessonData.enable_download || false));

                    if (lessonData.content_text) {
                        formData.append('content_text', lessonData.content_text);
                    }
                    formData.append('video', file);

                    apiResult = await lessonsService.createLesson(courseId, formData);
                } else {
                    const payload = {
                        title: lessonData.title || '',
                        content_type: lessonData.content_type || 'text',
                        order_index: nextOrderIndex,
                        module_id: currentModuleId,
                        description: lessonData.description || '',
                        duration_min: lessonData.duration_min || 0,
                        enable_download: lessonData.enable_download || false,
                        content_text: lessonData.content_text, // Send exactly what's in lessonData
                        pdf_url: finalPdfUrl,
                        content_url: lessonData.content_url || '',
                    };
                    apiResult = await lessonsService.createLesson(courseId, payload);
                }

                setModules(modules.map(module => {
                    if (module.id === currentModuleId) {
                        return { ...module, lessons: [...(module.lessons || []), apiResult as any] };
                    }
                    return module;
                }));
                toast.success('Lesson created successfully');
            }
            setIsLessonModalOpen(false);
            setSelectedLesson(undefined);
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
            const startTime = convertToISO8601(sessionData.start_time || '');
            const endTime = convertToISO8601(sessionData.end_time || '');

            if (!startTime || !endTime) {
                toast.error('Please provide valid start and end times');
                return;
            }

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
                if (!currentModuleId) return;

                const targetModule = modules.find(m => m.id === currentModuleId);
                const nextOrderIndex = targetModule ? getNextOrderIndex(targetModule) : 1;

                const apiResult = await sessionsService.createSessionForCourse(courseId, {
                    title: sessionData.title || '',
                    start_time: startTime,
                    end_time: endTime,
                    capacity: sessionData.capacity || 20,
                    session_type: sessionData.session_type || 'LIVE',
                    location: sessionData.location,
                    meeting_url: sessionData.meeting_url,
                    module_id: currentModuleId,
                    order_index: nextOrderIndex,
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

            const nextOrderIndex = getNextOrderIndex(targetModule);

            const newQuiz = await quizzesService.createQuizForCourse(courseId, {
                title: quizData.title || '',
                passing_score: quizData.passing_score || 70,
                is_final: quizData.is_final || false,
                module_id: currentModuleId,
                order_index: nextOrderIndex,
                time_limit_minutes: quizData.time_limit_minutes,
                randomize_questions: quizData.randomize_questions || false,
                attempts_allowed: quizData.attempts_allowed,
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
                <div className="flex flex-col items-center justify-center py-16 bg-muted/5 rounded-xl border border-dashed border-border">
                    <img
                        src="/course/no_course.svg"
                        alt="No modules"
                        className="w-48 h-48 mb-4 opacity-70 grayscale"
                    />
                    <h3 className="text-lg font-semibold mb-1">No Modules Yet</h3>
                    <p className="text-sm text-muted-foreground mb-6 max-w-xs text-center">
                        This course doesn't have any modules. Start building your curriculum by adding your first module.
                    </p>
                    <Button
                        onClick={handleAddModule}
                        className="gap-2 bg-primary hover:bg-primary/90 text-black font-medium"
                    >
                        <Plus className="w-4 h-4" /> Create First Module
                    </Button>
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
