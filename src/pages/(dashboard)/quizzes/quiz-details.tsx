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
import { useCoursesStore } from '@/stores/courses-store';
import { quizzesService, type Quiz, type Question } from '@/api/quizzes';
import { questionsService } from '@/api/questions';
import { toast } from 'sonner';

export default function QuizDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { courses } = useCoursesStore();

    const [isLoading, setIsLoading] = useState(true);
    const [quizSettings, setQuizSettings] = useState<Quiz>({
        id: 0,
        title: '',
        passing_score: 70,
        time_limit_minutes: 30,
        is_final: false,
        randomize_questions: false,
        attempts_allowed: null,
        order_index: 0,
        questions: [],
    });

    // Current Question State
    const [currentQuestion, setCurrentQuestion] = useState<Partial<Question>>({
        text: '',
        points: 5,
        options: [
            { id: 0, text: '' },
            { id: 1, text: '' },
            { id: 2, text: '' },
        ],
        correct_answers: [],
    });

    useEffect(() => {
        const fetchQuizData = async () => {
            if (!id) return;
            
            setIsLoading(true);
            try {
                // Fetch quiz and questions in parallel
                const [quiz, questions] = await Promise.all([
                    quizzesService.getQuizById(Number(id)),
                    questionsService.getQuestionsByQuiz(Number(id))
                ]);

                if (quiz) {
                    setQuizSettings({
                        ...quiz,
                        questions: questions || [],
                    });
                }
            } catch (error) {
                console.error('Error fetching quiz data:', error);
                
                // Fallback to local store
                let foundQuiz: Quiz | undefined;
                for (const course of courses) {
                    const modules = (course.modules || []) as { quizzes?: Quiz[] }[];
                    for (const module of modules) {
                        const quiz = (module.quizzes || []).find((q) => String(q.id) === id);
                        if (quiz) {
                            foundQuiz = quiz;
                            break;
                        }
                    }
                    if (foundQuiz) break;
                }

                if (foundQuiz) {
                    setQuizSettings({
                        ...foundQuiz,
                        questions: foundQuiz.questions || [],
                    });
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchQuizData();
    }, [id, courses]);

    const handleAddOption = () => {
        setCurrentQuestion((prev) => {
            const nextId = prev.options?.length || 0;
            return {
                ...prev,
                options: [...(prev.options || []), { id: nextId, text: '' }]
            };
        });
    };

    const handleRemoveOption = (index: number) => {
        setCurrentQuestion((prev) => {
            const newOptions = (prev.options || []).filter((_, i: number) => i !== index)
                .map((opt, i: number) => ({ ...opt, id: i })); // Re-index to keep 0, 1, 2...
            
            // Also need to update correct_answers if they shifted
            // Simplified: clear correct answers if you remove options to avoid mismatch, or map them
            return {
                ...prev,
                options: newOptions,
                correct_answers: [], // Simplest to reset correct answers when options structure changes
            };
        });
    };

    const handleOptionChange = (index: number, value: string) => {
        const newOptions = [...(currentQuestion.options || [])];
        newOptions[index] = { ...newOptions[index], text: value };
        setCurrentQuestion({ ...currentQuestion, options: newOptions });
    };

    const toggleCorrectAnswer = (optionId: number) => {
        const currentCorrect = (currentQuestion.correct_answers || []);
        let newCorrect;
        if (currentCorrect.includes(optionId)) {
            newCorrect = currentCorrect.filter((id) => id !== optionId);
        } else {
            newCorrect = [...currentCorrect, optionId];
        }
        setCurrentQuestion({ ...currentQuestion, correct_answers: newCorrect });
    };

    const handleAddQuestion = async () => {
        if (!currentQuestion.text || !currentQuestion.options?.length || !id) return;

        try {
            const newQuestionData = {
                text: currentQuestion.text,
                points: currentQuestion.points || 5,
                options: currentQuestion.options.map((opt, idx: number) => ({
                    id: idx,
                    text: opt.text
                })),
                correct_answers: currentQuestion.correct_answers || [],
                order_index: quizSettings.questions?.length || 0,
            };

            const createdQuestion = await questionsService.createQuestion(Number(id), newQuestionData);

            setQuizSettings((prev) => ({
                ...prev,
                questions: [...(prev.questions || []), createdQuestion]
            }));

            setCurrentQuestion({
                text: '',
                points: 5,
                options: [
                    { id: 0, text: '' },
                    { id: 1, text: '' },
                    { id: 2, text: '' },
                ],
                correct_answers: [],
            });
            toast.success('Question added successfully');
        } catch (error) {
            console.error('Error adding question:', error);
            toast.error('Failed to add question');
        }
    };

    const handleDeleteQuestion = async (questionId: number) => {
        try {
            await questionsService.deleteQuestion(questionId);
            setQuizSettings((prev) => ({
                ...prev,
                questions: prev.questions?.filter((q) => q.id !== questionId)
            }));
            toast.success('Question deleted');
        } catch (error) {
            console.error('Error deleting question:', error);
            toast.error('Failed to delete question');
        }
    };

    const handleSave = async () => {
        try {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { questions, ...quizData } = quizSettings;

            // Use API to update quiz
            await quizzesService.updateQuiz(Number(id), quizData);

            toast.success('Quiz saved successfully');
            navigate(-1);
        } catch (error) {
            console.error('Error saving quiz:', error);
            toast.error(quizzesService.getErrorMessage(error, 'Failed to save quiz'));
        }
    };

    const handleCSVImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !id) return;

        try {
            toast.loading('Importing questions...', { id: 'import-questions' });
            await questionsService.bulkImportQuestions(Number(id), file);
            
            // Re-fetch quiz data to ensure everything is in sync and decoded correctly
            const quizData = await quizzesService.getQuizById(Number(id));
            setQuizSettings(quizData);
            
            toast.success('Questions imported successfully', { id: 'import-questions' });
        } catch (error) {
            console.error('Error importing questions:', error);
            toast.error(questionsService.getErrorMessage(error, 'Failed to import questions'), { id: 'import-questions' });
        }
        e.target.value = '';
    };

    if (isLoading) {
        return (
            <div className="flex-1 bg-background flex items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <p className="text-sm text-muted-foreground">Loading quiz details...</p>
                </div>
            </div>
        );
    }

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
                                    {currentQuestion.options?.map((opt, idx: number) => (
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
                            <div className="flex items-center gap-2">
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
                                <div 
                                    className="cursor-help text-muted-foreground hover:text-foreground transition-colors"
                                    title="CSV Format Required:&#10;- question (Text)&#10;- options (Choice 1|Choice 2|Choice 3)&#10;- answer (Index 0, 1... or 0|1 for multiple)&#10;- points (Optional, default 5)&#10;&#10;Example: 'What color is sky?', 'Blue|Red|Green', '0', 5"
                                >
                                    <HelpCircle className="w-4 h-4" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {quizSettings.questions?.map((q, i: number) => (
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
                                                {Array.isArray(q.options) && q.options.map((opt) => {
                                                    const isCorrect = Array.isArray(q.correct_answers) && q.correct_answers.includes(opt.id);
                                                    return (
                                                        <div key={opt.id} className={`flex items-center gap-2 ${isCorrect ? 'text-green-600 font-medium' : ''}`}>
                                                            {isCorrect ? <CheckCircle2 className="w-3 h-3" /> : <div className="w-3 h-3 rounded-full border border-muted-foreground/30" />}
                                                            {opt.text}
                                                        </div>
                                                    );
                                                })}
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

                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">Randomize Questions</Label>
                                        <p className="text-xs text-muted-foreground">Shuffle questions for each student</p>
                                    </div>
                                    <Checkbox
                                        checked={quizSettings.randomize_questions}
                                        onCheckedChange={(c) => setQuizSettings({ ...quizSettings, randomize_questions: c as boolean })}
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
                                    <Select 
                                        value={quizSettings.attempts_allowed === null ? 'unlimited' : String(quizSettings.attempts_allowed)} 
                                        onValueChange={(v) => setQuizSettings({ ...quizSettings, attempts_allowed: v === 'unlimited' ? null : parseInt(v) })}
                                    >
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
