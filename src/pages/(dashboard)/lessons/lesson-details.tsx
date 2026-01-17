import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, ChevronLeft, Upload, Video, FileText } from 'lucide-react';
import { useCoursesStore } from '@/stores/courses-store';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Lesson } from '@/components/course/module-item';

export default function LessonDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { courses, updateCourse } = useCoursesStore();

    const [lessonData, setLessonData] = useState<Partial<Lesson>>({
        title: '',
        content_type: 'video',
        duration_min: 0,
        description: '',
        content_url: '',
        pdf_url: '',
    });

    useEffect(() => {
        let foundLesson: any = null;
        courses.forEach(course => {
            course.modules?.forEach(module => {
                const l = module.lessons?.find((l: any) => String(l.id) === id);
                if (l) foundLesson = { ...l, courseId: course.id, moduleId: module.id };
            });
        });

        if (foundLesson) {
            setLessonData(foundLesson);
        }
    }, [id, courses]);

    const handleSave = () => {
        const { courseId, moduleId, ...data } = lessonData as any;

        if (!courseId || !moduleId) {
            toast.error('Could not find course or module context');
            return;
        }

        const course = courses.find(c => c.id === courseId);
        if (!course) return;

        const updatedModules = course.modules?.map(m => {
            if (m.id === moduleId) {
                return {
                    ...m,
                    lessons: m.lessons?.map((l: any) => String(l.id) === id ? { ...l, ...data } : l)
                };
            }
            return m;
        });

        updateCourse(courseId, { modules: updatedModules });
        toast.success('Lesson saved successfully');
        navigate(-1);
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
                        <h1 className="text-xl font-bold">Lesson Details: {lessonData.title}</h1>
                        <p className="text-sm text-muted-foreground">Manage lesson content and settings</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
                    <Button onClick={handleSave} className="gap-2">
                        <Save className="w-4 h-4" /> Save Lesson
                    </Button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto p-8 bg-muted/30">
                <div className="max-w-4xl mx-auto space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>General Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Lesson Title</Label>
                                    <Input
                                        value={lessonData.title}
                                        onChange={(e) => setLessonData({ ...lessonData, title: e.target.value })}
                                        placeholder="e.g., Introduction to Security"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Content Type</Label>
                                    <Select
                                        value={lessonData.content_type}
                                        onValueChange={(v) => setLessonData({ ...lessonData, content_type: v as any })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="video">Video</SelectItem>
                                            <SelectItem value="pdf">PDF Document</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Description</Label>
                                <Textarea
                                    value={lessonData.description}
                                    onChange={(e) => setLessonData({ ...lessonData, description: e.target.value })}
                                    placeholder="Briefly describe what this lesson covers..."
                                    className="min-h-[100px]"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Duration (Minutes)</Label>
                                <Input
                                    type="number"
                                    value={lessonData.duration_min}
                                    onChange={(e) => setLessonData({ ...lessonData, duration_min: parseInt(e.target.value) || 0 })}
                                    className="w-32"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Content</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {lessonData.content_type === 'video' ? (
                                <div className="space-y-4">
                                    <div className="border-2 border-dashed rounded-lg p-12 text-center space-y-4">
                                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                                            <Video className="w-8 h-8 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-medium">Upload Video Lesson</p>
                                            <p className="text-sm text-muted-foreground">MP4, WebM or Ogg. Max 500MB.</p>
                                        </div>
                                        <Button variant="outline" className="gap-2">
                                            <Upload className="w-4 h-4" /> Select Video
                                        </Button>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Or Video URL (Bunny Stream / YouTube / Vimeo)</Label>
                                        <Input
                                            value={lessonData.content_url}
                                            onChange={(e) => setLessonData({ ...lessonData, content_url: e.target.value })}
                                            placeholder="https://..."
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="border-2 border-dashed rounded-lg p-12 text-center space-y-4">
                                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                                            <FileText className="w-8 h-8 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-medium">Upload PDF Document</p>
                                            <p className="text-sm text-muted-foreground">PDF files only. Max 50MB.</p>
                                        </div>
                                        <Button variant="outline" className="gap-2">
                                            <Upload className="w-4 h-4" /> Select PDF
                                        </Button>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Or PDF URL</Label>
                                        <Input
                                            value={lessonData.pdf_url}
                                            onChange={(e) => setLessonData({ ...lessonData, pdf_url: e.target.value })}
                                            placeholder="https://..."
                                        />
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
