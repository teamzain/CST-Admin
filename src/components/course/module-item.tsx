'use client';

import { useState } from 'react';
import { GripVertical, ChevronDown, ChevronRight, Edit, Trash2, Plus, Video, FileText, Calendar, HelpCircle, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import type { DraggableProvidedDragHandleProps } from '@hello-pangea/dnd';

export interface Lesson {
    id: number;
    course_id?: number;
    module_id?: number;
    title: string;
    content_type: 'video' | 'pdf' | 'text';
    content_url?: string;
    pdf_url?: string;
    duration_min?: number;
    order_index: number;
    description?: string; // From curl payload

    // Bunny Stream specific fields
    bunny_video_id?: string;
    bunny_library_id?: number;
    bunny_collection_id?: string;
    video_status?: string; // "processing", "ready", "failed"
    thumbnail_url?: string;
    video_length?: number;
}

export interface Session {
    id: number;
    title: string;
    start_time: string;
    end_time: string;
    session_type: 'LIVE' | 'PHYSICAL';
    capacity?: number;
    location?: string;
    meeting_url?: string;
    order_index: number;
}

export interface Question {
    id: number;
    text: string;
    options: { id: number; text: string }[];
    correct_answers: number[];
    points: number;
    order_index: number;
}

export interface Quiz {
    id: number;
    title: string;
    passing_score: number;
    is_final: boolean;
    time_limit_minutes?: number;
    order_index: number;
    questions?: Question[];
}

export interface Module {
    id: number;
    title: string;
    description?: string;
    order_index: number;
    lessons: Lesson[];
    sessions: Session[];
    quizzes: Quiz[];
}

interface ModuleItemProps {
    module: Module;
    dragHandleProps?: DraggableProvidedDragHandleProps | null;
    isDragging?: boolean;
    onEdit: (module: Module) => void;
    onDelete: (moduleId: number) => void;
    onAddLesson: (moduleId: number) => void;
    onAddSession: (moduleId: number) => void;
    onAddQuiz: (moduleId: number) => void;
    onEditLesson: (lesson: Lesson) => void;
    onEditSession: (session: Session) => void;
    onEditQuiz: (quiz: Quiz) => void;
    onDeleteLesson: (lessonId: number) => void;
    onDeleteSession: (sessionId: number) => void;
    onDeleteQuiz: (quizId: number) => void;
}

export function ModuleItem({
    module,
    dragHandleProps,
    isDragging = false,
    onEdit,
    onDelete,
    onAddLesson,
    onAddSession,
    onAddQuiz,
    onEditLesson,
    onEditSession,
    onEditQuiz,
    onDeleteLesson,
    onDeleteSession,
    onDeleteQuiz,
}: ModuleItemProps) {
    const [isExpanded, setIsExpanded] = useState(true);

    const totalItems = module.lessons.length + module.sessions.length + module.quizzes.length;

    const getContentIcon = (type: string) => {
        switch (type) {
            case 'video':
                return <Video className="w-4 h-4" />;
            case 'pdf':
                return <FileText className="w-4 h-4" />;
            default:
                return <FileText className="w-4 h-4" />;
        }
    };

    return (
        <Card className={`bg-card border-border overflow-hidden transition-shadow ${isDragging ? 'shadow-lg' : ''}`}>
            {/* Module Header */}
            <div className="flex items-center gap-3 p-4 bg-muted/30 border-b border-border">
                <div {...dragHandleProps} className="cursor-grab active:cursor-grabbing hover:bg-accent/50 p-1 rounded">
                    <GripVertical className="w-5 h-5 text-muted-foreground" />
                </div>

                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="p-1 hover:bg-accent/50 rounded transition-colors"
                >
                    {isExpanded ? (
                        <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    ) : (
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    )}
                </button>

                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">{module.title}</h3>
                        <Badge variant="secondary" className="text-xs">
                            {totalItems} {totalItems === 1 ? 'item' : 'items'}
                        </Badge>
                    </div>
                    {module.description && (
                        <p className="text-sm text-muted-foreground mt-1">{module.description}</p>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(module)}
                        className="h-8 w-8 p-0"
                    >
                        <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(module.id)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Module Content */}
            {isExpanded && (
                <div className="p-4 space-y-3">
                    {/* Lessons Droppable */}
                    <Droppable droppableId={`lessons-${module.id}`} type="LESSON">
                        {(provided, snapshot) => (
                            <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                className={`space-y-2 ${snapshot.isDraggingOver ? 'bg-accent/10 rounded-lg p-2' : ''}`}
                            >
                                {module.lessons.map((lesson, index) => (
                                    <Draggable
                                        key={lesson.id}
                                        draggableId={`lesson-${lesson.id}`}
                                        index={index}
                                    >
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                className={`flex items-center gap-3 p-3 bg-background border border-border rounded-lg hover:border-primary/50 transition-all group ${snapshot.isDragging ? 'shadow-md' : ''}`}
                                            >
                                                <div {...provided.dragHandleProps} className="cursor-grab active:cursor-grabbing hover:bg-accent/50 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <GripVertical className="w-4 h-4 text-muted-foreground" />
                                                </div>

                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                    {getContentIcon(lesson.content_type)}
                                                </div>

                                                <div className="flex-1">
                                                    <p className="font-medium text-sm">{lesson.title}</p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <Badge variant="outline" className="text-xs capitalize">
                                                            {lesson.content_type}
                                                        </Badge>
                                                        {lesson.duration_min && (
                                                            <span className="text-xs text-muted-foreground">
                                                                {lesson.duration_min} min
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => onEditLesson(lesson)}
                                                        className="h-7 w-7 p-0"
                                                    >
                                                        <Edit className="w-3.5 h-3.5" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => onDeleteLesson(lesson.id)}
                                                        className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>

                    {/* Sessions Droppable */}
                    <Droppable droppableId={`sessions-${module.id}`} type="SESSION">
                        {(provided, snapshot) => (
                            <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                className={`space-y-2 ${snapshot.isDraggingOver ? 'bg-accent/10 rounded-lg p-2' : ''}`}
                            >
                                {module.sessions.map((session, index) => (
                                    <Draggable
                                        key={session.id}
                                        draggableId={`session-${session.id}`}
                                        index={index}
                                    >
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                className={`flex items-center gap-3 p-3 bg-background border border-border rounded-lg hover:border-primary/50 transition-all group ${snapshot.isDragging ? 'shadow-md' : ''}`}
                                            >
                                                <div {...provided.dragHandleProps} className="cursor-grab active:cursor-grabbing hover:bg-accent/50 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <GripVertical className="w-4 h-4 text-muted-foreground" />
                                                </div>

                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                    {session.session_type === 'PHYSICAL' ? <MapPin className="w-4 h-4" /> : <Calendar className="w-4 h-4" />}
                                                </div>

                                                <div className="flex-1">
                                                    <p className="font-medium text-sm">{session.title}</p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <Badge variant="outline" className="text-xs capitalize">
                                                            {session.session_type}
                                                        </Badge>
                                                        <span className="text-xs text-muted-foreground">
                                                            {new Date(session.start_time).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => onEditSession(session)}
                                                        className="h-7 w-7 p-0"
                                                    >
                                                        <Edit className="w-3.5 h-3.5" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => onDeleteSession(session.id)}
                                                        className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>

                    {/* Quizzes Droppable */}
                    <Droppable droppableId={`quizzes-${module.id}`} type="QUIZ">
                        {(provided, snapshot) => (
                            <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                className={`space-y-2 ${snapshot.isDraggingOver ? 'bg-accent/10 rounded-lg p-2' : ''}`}
                            >
                                {module.quizzes.map((quiz, index) => (
                                    <Draggable
                                        key={quiz.id}
                                        draggableId={`quiz-${quiz.id}`}
                                        index={index}
                                    >
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                className={`flex items-center gap-3 p-3 bg-background border border-border rounded-lg hover:border-primary/50 transition-all group ${snapshot.isDragging ? 'shadow-md' : ''}`}
                                            >
                                                <div {...provided.dragHandleProps} className="cursor-grab active:cursor-grabbing hover:bg-accent/50 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <GripVertical className="w-4 h-4 text-muted-foreground" />
                                                </div>

                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                    <HelpCircle className="w-4 h-4" />
                                                </div>

                                                <div className="flex-1">
                                                    <p className="font-medium text-sm">{quiz.title}</p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <Badge variant="outline" className="text-xs">
                                                            Pass: {quiz.passing_score}%
                                                        </Badge>
                                                        {quiz.is_final && (
                                                            <Badge variant="default" className="text-xs">
                                                                Final Quiz
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => onEditQuiz(quiz)}
                                                        className="h-7 w-7 p-0"
                                                    >
                                                        <Edit className="w-3.5 h-3.5" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => onDeleteQuiz(quiz.id)}
                                                        className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>

                    {/* Add Content Buttons */}
                    <div className="flex gap-2 pt-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onAddLesson(module.id)}
                            className="flex-1 gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Add Lesson
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onAddSession(module.id)}
                            className="flex-1 gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Add Session
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onAddQuiz(module.id)}
                            className="flex-1 gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Add Quiz
                        </Button>
                    </div>
                </div>
            )}
        </Card>
    );
}
