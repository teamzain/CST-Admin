'use client';

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Plus, Trash2, Save, Upload, CheckCircle2, GripVertical, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCoursesStore, type Course } from '@/stores/courses-store';
import { toast } from 'sonner';

export default function QuizDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { courses, updateCourse } = useCoursesStore();

    const [quizSettings, setQuizSettings] = useState<any>({
        title: '',
        passing_score: 70,
        time_limit_minutes: 30,
        is_final: false,
        questions: [],
    });

    // Current Question State
    const [currentQuestion, setCurrentQuestion] = useState<any>({
        text: '',
        points: 1,
        options: [
            { id: 1, text: '' },
            { id: 2, text: '' },
        ],
        correct_answers: [],
    });

    useEffect(() => {
        if (id) {
            let foundQuiz: any;
            let foundCourseId: number | undefined;
            let foundModuleId: number | undefined;

            for (const course of courses) {
                for (const module of (course.modules || []) as any[]) {
                    const quiz = module.quizzes?.find((q: any) => String(q.id) === id);
                    if (quiz) {
                        foundQuiz = quiz;
                        foundCourseId = course.id;
                        foundModuleId = module.id;
                        break;
                    }
                }
                if (foundQuiz) break;
            }

            if (foundQuiz) {
                setQuizSettings({
                    ...foundQuiz,
                    courseId: foundCourseId,
                    moduleId: foundModuleId
                });
            }
        }
    }, [id, courses]);

    const handleAddOption = () => {
        setCurrentQuestion((prev: any) => ({
            ...prev,
            options: [...(prev.options || []), { id: (prev.options?.length || 0) + 1, text: '' }]
        }));
    };

    const handleRemoveOption = (index: number) => {
        setCurrentQuestion((prev: any) => ({
            ...prev,
            options: prev.options?.filter((_: any, i: number) => i !== index),
            correct_answers: prev.correct_answers?.filter((id: any) => id !== index + 1)
        }));
    };

    const handleOptionChange = (index: number, value: string) => {
        const newOptions = [...(currentQuestion.options || [])];
        newOptions[index] = { ...newOptions[index], text: value };
        setCurrentQuestion({ ...currentQuestion, options: newOptions });
    };

    const toggleCorrectAnswer = (optionId: number) => {
        const currentCorrect = (currentQuestion.correct_answers || []) as any[];
        let newCorrect;
        if (currentCorrect.includes(optionId)) {
            newCorrect = currentCorrect.filter((id: any) => id !== optionId);
        } else {
            newCorrect = [...currentCorrect, optionId];
        }
        setCurrentQuestion({ ...currentQuestion, correct_answers: newCorrect });
    };

    const handleAddQuestion = () => {
        if (!currentQuestion.text || !currentQuestion.options?.length) return;

        const newQuestion: any = {
            id: Date.now(),
            text: currentQuestion.text,
            points: currentQuestion.points || 1,
            options: currentQuestion.options as any[],
            correct_answers: currentQuestion.correct_answers || [],
            order_index: quizSettings.questions?.length || 0,
        };

        setQuizSettings((prev: any) => ({
            ...prev,
            questions: [...(prev.questions || []), newQuestion]
        }));

        setCurrentQuestion({
            text: '',
            points: 1,
            options: [
                { id: 1, text: '' },
                { id: 2, text: '' },
            ],
            correct_answers: [],
        });
    };

    const handleDeleteQuestion = (id: number) => {
        setQuizSettings((prev: any) => ({
            ...prev,
            questions: prev.questions?.filter((q: any) => q.id !== id)
        }));
    };

    const handleSave = () => {
        const { courseId, moduleId, ...quizData } = quizSettings;

        if (!courseId || !moduleId) {
            toast.error('Could not find course or module context');
            return;
        }

        const course = courses.find((c: Course) => c.id === courseId);
        if (!course) return;

        const updatedModules = (course.modules as any[])?.map((m: any) => {
            if (m.id === moduleId) {
                return {
                    ...m,
                    quizzes: m.quizzes?.map((q: any) => String(q.id) === id ? { ...q, ...quizData } : q)
                };
            }
            return m;
        });

        updateCourse(courseId, { modules: updatedModules });
        toast.success('Quiz saved successfully');
        navigate(-1);
    };

    const handleCSVImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target?.result as string;
            const lines = text.split('\n');
            const newQuestions: any[] = [];

            lines.forEach((line, index) => {
                if (!line.trim() || (index === 0 && line.toLowerCase().includes('question'))) return;
                const parts = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(p => p.replace(/^"|"$/g, '').trim());
                if (parts.length < 4) return;
                const [qText, pointsStr, correctStr, ...opts] = parts;
                const validOpts = opts.filter(o => o);
                const options = validOpts.map((opt, i) => ({ id: i + 1, text: opt }));
                const correctIndices = correctStr.split('|').map(s => parseInt(s.trim())).filter(n => !isNaN(n));

                if (options.length >= 2 && correctIndices.length > 0) {
                    newQuestions.push({
                        id: Date.now() + index,
                        text: qText,
                        points: parseInt(pointsStr) || 1,
                        correct_answers: correctIndices,
                        options: options,
                        order_index: (quizSettings.questions?.length || 0) + index
                    });
                }
            });

            if (newQuestions.length > 0) {
                setQuizSettings((prev: any) => ({
                    ...prev,
                    questions: [...(prev.questions || []), ...newQuestions]
                }));
            }
            e.target.value = '';
        };
        reader.readAsText(file);
    };

    return (
        <div className="flex flex-col h-screen bg-background">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                        <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-xl font-bold">Quiz Builder: {quizSettings.title}</h1>
                        <p className="text-sm text-muted-foreground">Manage quiz questions and settings</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
                    <Button onClick={handleSave} className="gap-2">
                        <Save className="w-4 h-4" /> Save Quiz
                    </Button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-hidden grid grid-cols-12 bg-muted/30">
                {/* Left Panel: Question Editor & List */}
                <div className="col-span-8 p-6 overflow-y-auto space-y-6 border-r border-border bg-background">
                    {/* Question Editor Card */}
                    <Card className="border-border shadow-sm">
                        <CardHeader className="pb-3">
                            <div className="flex justify-between items-center">
                                <CardTitle className="text-lg">Question Editor</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label className="mb-2 block">Question Text</Label>
                                <Textarea
                                    value={currentQuestion.text}
                                    onChange={(e) => setCurrentQuestion({ ...currentQuestion, text: e.target.value })}
                                    placeholder="Enter your question here..."
                                    className="min-h-[100px] resize-none"
                                />
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <Label>Answer Options</Label>
                                    <Button variant="ghost" size="sm" onClick={handleAddOption} className="h-8 text-primary">
                                        <Plus className="w-4 h-4 mr-1" /> Add Option
                                    </Button>
                                </div>

                                <div className="space-y-2">
                                    {/* MCQ Options (Dynamic) */}
                                    {(currentQuestion.options as any[])?.map((opt: any, idx: number) => (
                                        <div key={idx} className="flex items-center gap-3">
                                            <div className="flex items-center justify-center pt-2">
                                                <Checkbox
                                                    checked={currentQuestion.correct_answers?.includes(opt.id)}
                                                    onCheckedChange={() => toggleCorrectAnswer(opt.id)}
                                                    className="rounded-full w-5 h-5"
                                                />
                                            </div>
                                            <Input
                                                value={opt.text}
                                                onChange={(e) => handleOptionChange(idx, e.target.value)}
                                                placeholder={`Option ${idx + 1}`}
                                                className="flex-1"
                                            />
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleRemoveOption(idx)}
                                                className="text-muted-foreground hover:text-destructive"
                                                disabled={(currentQuestion.options?.length || 0) <= 2}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <Label>Points</Label>
                                        <Input
                                            type="number"
                                            value={currentQuestion.points}
                                            onChange={(e) => setCurrentQuestion({ ...currentQuestion, points: parseInt(e.target.value) || 1 })}
                                            className="w-20"
                                            min={1}
                                        />
                                    </div>
                                </div>
                                <Button onClick={handleAddQuestion} disabled={!currentQuestion.text}>
                                    <Plus className="w-4 h-4 mr-2" /> Add Question
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Questions List */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold">Questions ({quizSettings.questions?.length || 0})</h3>
                            <div className="relative">
                                <input
                                    type="file"
                                    accept=".csv"
                                    onChange={handleCSVImport}
                                    className="absolute inset-0 opacity-0 cursor-pointer w-full"
                                    title="Import CSV"
                                />
                                <Button variant="outline" size="sm" className="gap-2">
                                    <Upload className="w-4 h-4" /> Import CSV
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {quizSettings.questions?.map((q: any, i: number) => (
                                <Card key={q.id} className="bg-card border-border hover:border-primary/50 transition-colors">
                                    <CardContent className="p-4 flex gap-4">
                                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                            <span className="font-mono text-sm">Q{i + 1}</span>
                                            <GripVertical className="w-4 h-4 cursor-grab" />
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <div className="flex justify-between">
                                                <p className="font-medium">{q.text}</p>
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="secondary">{q.points} pts</Badge>
                                                    <Button variant="ghost" size="icon" onClick={() => handleDeleteQuestion(q.id)} className="h-6 w-6 text-destructive">
                                                        <Trash2 className="w-3 h-3" />
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                                                {q.options.map((opt: any) => (
                                                    <div key={opt.id} className={`flex items-center gap-2 ${q.correct_answers.includes(opt.id) ? 'text-green-600 font-medium' : ''}`}>
                                                        {q.correct_answers.includes(opt.id) ? <CheckCircle2 className="w-3 h-3" /> : <div className="w-3 h-3 rounded-full border border-muted-foreground/30" />}
                                                        {opt.text}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                            {(!quizSettings.questions || quizSettings.questions.length === 0) && (
                                <div className="text-center py-12 border-2 border-dashed rounded-lg text-muted-foreground">
                                    <HelpCircle className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                    <p>No questions added yet.</p>
                                    <p className="text-sm">Use the editor above to create questions or import from CSV.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Panel: Settings */}
                <div className="col-span-4 p-6 bg-card border-l border-border h-full overflow-y-auto">
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold mb-1">Quiz Settings</h3>
                            <p className="text-sm text-muted-foreground">Configure global settings for this quiz.</p>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Quiz Title</Label>
                                <Input
                                    value={quizSettings.title}
                                    onChange={(e) => setQuizSettings({ ...quizSettings, title: e.target.value })}
                                    placeholder="e.g., Final Assessment"
                                />
                            </div>

                            <div className="space-y-4 pt-4 border-t">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">Final Quiz</Label>
                                        <p className="text-xs text-muted-foreground">Mark this as the final course exam</p>
                                    </div>
                                    <Checkbox
                                        checked={quizSettings.is_final}
                                        onCheckedChange={(c) => setQuizSettings({ ...quizSettings, is_final: c as boolean })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t">
                                <div className="space-y-2">
                                    <Label>Passing Score (%)</Label>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            type="number"
                                            value={quizSettings.passing_score}
                                            onChange={(e) => setQuizSettings({ ...quizSettings, passing_score: parseInt(e.target.value) || 0 })}
                                            max={100}
                                        />
                                        <span className="text-sm text-muted-foreground">%</span>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Time Limit (Minutes)</Label>
                                    <Input
                                        type="number"
                                        value={quizSettings.time_limit_minutes || ''}
                                        onChange={(e) => setQuizSettings({ ...quizSettings, time_limit_minutes: parseInt(e.target.value) || 0 })}
                                        placeholder="e.g. 30"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Attempts Allowed</Label>
                                    <Select defaultValue="unlimited">
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select attempts" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">1 Attempt</SelectItem>
                                            <SelectItem value="2">2 Attempts</SelectItem>
                                            <SelectItem value="3">3 Attempts</SelectItem>
                                            <SelectItem value="unlimited">Unlimited</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
