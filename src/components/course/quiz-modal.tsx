'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, Edit, X, Upload } from 'lucide-react';
import { Card } from '@/components/ui/card';
import type { Quiz, Question } from './module-item';

interface QuizModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (quiz: Partial<Quiz>) => void;
    quiz?: Quiz;
}

export function QuizModal({ isOpen, onClose, onSave, quiz }: QuizModalProps) {
    const [formData, setFormData] = useState<Partial<Quiz>>({
        title: '',
        passing_score: 70,
        is_final: false,
        time_limit_minutes: 0,
        questions: [],
    });

    const [activeTab, setActiveTab] = useState<'details' | 'questions'>('details');
    const [editingQuestion, setEditingQuestion] = useState<Partial<Question> | null>(null);
    const [isAddingQuestion, setIsAddingQuestion] = useState(false);

    useEffect(() => {
        if (quiz) {
            setFormData({
                title: quiz.title,
                passing_score: quiz.passing_score,
                is_final: quiz.is_final,
                time_limit_minutes: quiz.time_limit_minutes || 0,
                questions: quiz.questions || [],
            });
        } else {
            setFormData({
                title: '',
                passing_score: 70,
                is_final: false,
                time_limit_minutes: 0,
                questions: [],
            });
        }
        setActiveTab('details');
        setEditingQuestion(null);
        setIsAddingQuestion(false);
    }, [quiz, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

    const handleAddQuestion = () => {
        setEditingQuestion({
            id: Date.now(), // Temp ID
            text: '',
            options: [
                { id: 1, text: '' },
                { id: 2, text: '' }
            ],
            correct_answers: [],
            points: 1,
            order_index: (formData.questions?.length || 0),
        });
        setIsAddingQuestion(true);
    };

    const handleSaveQuestion = () => {
        if (!editingQuestion || !editingQuestion.text) return;

        // Filter out empty options
        const validOptions = editingQuestion.options?.filter(opt => opt.text.trim() !== '') || [];
        if (validOptions.length < 2) {
            alert('Please provide at least 2 options.');
            return;
        }
        if ((editingQuestion.correct_answers?.length || 0) === 0) {
            alert('Please select at least one correct answer.');
            return;
        }

        const newQuestion = {
            ...editingQuestion,
            options: validOptions,
        } as Question;

        const currentQuestions = formData.questions || [];

        if (isAddingQuestion) {
            // Add new
            setFormData({
                ...formData,
                questions: [...currentQuestions, newQuestion],
            });
        } else {
            // Update existing
            setFormData({
                ...formData,
                questions: currentQuestions.map(q => q.id === newQuestion.id ? newQuestion : q),
            });
        }

        setEditingQuestion(null);
        setIsAddingQuestion(false);
    };

    const handleEditQuestion = (q: Question) => {
        setEditingQuestion({ ...q });
        setIsAddingQuestion(false);
    };

    const handleDeleteQuestion = (qId: number) => {
        setFormData({
            ...formData,
            questions: formData.questions?.filter(q => q.id !== qId) || [],
        });
    };

    // Question Editor Sub-component logic
    const updateOptionText = (optId: number, text: string) => {
        if (!editingQuestion) return;
        setEditingQuestion({
            ...editingQuestion,
            options: editingQuestion.options?.map(opt => opt.id === optId ? { ...opt, text } : opt),
        });
    };

    const toggleCorrectAnswer = (optId: number) => {
        if (!editingQuestion) return;
        const currentCorrect = editingQuestion.correct_answers || [];
        const isCorrect = currentCorrect.includes(optId);

        setEditingQuestion({
            ...editingQuestion,
            correct_answers: isCorrect
                ? currentCorrect.filter(id => id !== optId)
                : [...currentCorrect, optId],
        });
    };

    const addOption = () => {
        if (!editingQuestion) return;
        const newId = (editingQuestion.options?.length || 0) + 1;
        setEditingQuestion({
            ...editingQuestion,
            options: [...(editingQuestion.options || []), { id: newId, text: '' }],
        });
    };

    const removeOption = (optId: number) => {
        if (!editingQuestion) return;
        setEditingQuestion({
            ...editingQuestion,
            options: editingQuestion.options?.filter(opt => opt.id !== optId),
            correct_answers: editingQuestion.correct_answers?.filter(id => id !== optId),
        });
    };

    const handleCSVImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target?.result as string;
            const lines = text.split('\n');
            const newQuestions: Question[] = [];

            lines.forEach((line, index) => {
                if (!line.trim() || (index === 0 && line.toLowerCase().includes('question'))) return;

                // Split by comma, ignoring commas in quotes
                const parts = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(p => p.replace(/^"|"$/g, '').trim());

                if (parts.length < 4) return;

                const [qText, pointsStr, correctStr, ...opts] = parts;

                // Filter out empty options
                const validOpts = opts.filter(o => o);
                const options = validOpts.map((opt, i) => ({ id: i + 1, text: opt }));

                // Parse correct answers (e.g. "1|3" or "1")
                const correctIndices = correctStr.split('|').map(s => parseInt(s.trim())).filter(n => !isNaN(n));

                if (options.length >= 2 && correctIndices.length > 0) {
                    newQuestions.push({
                        id: Date.now() + index,
                        text: qText,
                        points: parseInt(pointsStr) || 1,
                        correct_answers: correctIndices,
                        options: options,
                        order_index: (formData.questions?.length || 0) + index
                    });
                }
            });

            if (newQuestions.length > 0) {
                setFormData(prev => ({
                    ...prev,
                    questions: [...(prev.questions || []), ...newQuestions]
                }));
                alert(`Successfully imported ${newQuestions.length} questions.`);
            } else {
                alert('No valid questions found. Please check the CSV format: Question, Points, Correct(1|2), Opt1, Opt2...');
            }

            // Reset input
            e.target.value = '';
        };
        reader.readAsText(file);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{quiz ? 'Edit Quiz' : 'Create Quiz'}</DialogTitle>
                    <DialogDescription>
                        Configure quiz settings and manage questions.
                    </DialogDescription>
                </DialogHeader>

                <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="details">Quiz Details</TabsTrigger>
                        <TabsTrigger value="questions">Questions ({formData.questions?.length || 0})</TabsTrigger>
                    </TabsList>

                    <TabsContent value="details" className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="quiz-title">Quiz Title *</Label>
                            <Input
                                id="quiz-title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="e.g., Module 1 Assessment"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="passing-score">Passing Score (%) *</Label>
                                <Input
                                    id="passing-score"
                                    type="number"
                                    value={formData.passing_score}
                                    onChange={(e) => setFormData({ ...formData, passing_score: parseInt(e.target.value) })}
                                    placeholder="70"
                                    min="0"
                                    max="100"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="time-limit">Time Limit (minutes)</Label>
                                <Input
                                    id="time-limit"
                                    type="number"
                                    value={formData.time_limit_minutes || ''}
                                    onChange={(e) => setFormData({ ...formData, time_limit_minutes: parseInt(e.target.value) })}
                                    placeholder="Optional (e.g. 30)"
                                    min="0"
                                />
                            </div>
                        </div>

                        <div className="flex items-center space-x-2 pt-2">
                            <Checkbox
                                id="is-final"
                                checked={formData.is_final}
                                onCheckedChange={(checked) => setFormData({ ...formData, is_final: checked as boolean })}
                            />
                            <Label htmlFor="is-final" className="font-normal cursor-pointer">
                                This is the final quiz for the course
                            </Label>
                        </div>
                    </TabsContent>

                    <TabsContent value="questions" className="space-y-4 py-4">
                        {!editingQuestion ? (
                            <>
                                <div className="flex justify-between items-center">
                                    <h3 className="text-sm font-medium">Questions List</h3>
                                    <div className="flex gap-2">
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
                                        <Button onClick={handleAddQuestion} size="sm" className="gap-2">
                                            <Plus className="w-4 h-4" /> Add Question
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    {formData.questions?.length === 0 ? (
                                        <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                                            No questions added yet.
                                        </div>
                                    ) : (
                                        formData.questions?.map((q, idx) => (
                                            <Card key={q.id} className="p-3 flex items-start gap-3 group hover:border-primary/50 transition-colors">
                                                <div className="mt-1 bg-muted w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium">
                                                    {idx + 1}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-medium text-sm">{q.text}</p>
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        {q.options.length} options • {q.points} points
                                                    </p>
                                                </div>
                                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Button variant="ghost" size="sm" onClick={() => handleEditQuestion(q)} className="h-8 w-8 p-0">
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="sm" onClick={() => handleDeleteQuestion(q.id)} className="h-8 w-8 p-0 text-destructive">
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </Card>
                                        ))
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="space-y-4 border rounded-lg p-4 bg-slate-50/50">
                                <div className="flex justify-between items-center border-b pb-2">
                                    <h3 className="font-medium">{isAddingQuestion ? 'New Question' : 'Edit Question'}</h3>
                                    <Button variant="ghost" size="sm" onClick={() => setEditingQuestion(null)}>
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>

                                <div className="space-y-2">
                                    <Label>Question Text</Label>
                                    <Input
                                        value={editingQuestion.text}
                                        onChange={(e) => setEditingQuestion({ ...editingQuestion, text: e.target.value })}
                                        placeholder="Enter your question here..."
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Points</Label>
                                    <Input
                                        type="number"
                                        value={editingQuestion.points}
                                        onChange={(e) => setEditingQuestion({ ...editingQuestion, points: parseInt(e.target.value) })}
                                        min="1"
                                        className="w-24"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Options</Label>
                                    <div className="space-y-2">
                                        {editingQuestion.options?.map((opt, idx) => (
                                            <div key={idx} className="flex items-center gap-2">
                                                <Checkbox
                                                    checked={editingQuestion.correct_answers?.includes(opt.id)}
                                                    onCheckedChange={() => toggleCorrectAnswer(opt.id)}
                                                    className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                                                />
                                                <Input
                                                    value={opt.text}
                                                    onChange={(e) => updateOptionText(opt.id, e.target.value)}
                                                    placeholder={`Option ${idx + 1}`}
                                                    className={editingQuestion.correct_answers?.includes(opt.id) ? "border-green-500 bg-green-50" : ""}
                                                />
                                                <Button variant="ghost" size="sm" onClick={() => removeOption(opt.id)} disabled={editingQuestion.options!.length <= 2}>
                                                    <X className="w-4 h-4 text-muted-foreground" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                    <Button variant="outline" size="sm" onClick={addOption} className="mt-2 text-xs">
                                        <Plus className="w-3 h-3 mr-1" /> Add Option
                                    </Button>
                                </div>

                                <div className="pt-4 flex justify-end gap-2">
                                    <Button variant="outline" onClick={() => setEditingQuestion(null)}>Cancel</Button>
                                    <Button onClick={handleSaveQuestion}>Save Question</Button>
                                </div>
                            </div>
                        )}
                    </TabsContent>
                </Tabs>

                <DialogFooter>
                    <Button type="button" variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="button" onClick={handleSubmit} className="bg-primary hover:bg-primary/90">
                        {quiz ? 'Update Quiz' : 'Create Quiz'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
