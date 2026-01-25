import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, ChevronLeft, Video, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Lesson } from '@/components/course/module-item';
import { lessonsService } from '@/api/lessons';
import { Progress } from '@/components/ui/progress';
import { bunnyUploadService } from '@/api/bunny-upload';

export default function LessonDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const [lessonData, setLessonData] = useState<Partial<Lesson>>({
        title: '',
        content_type: 'video',
        duration_min: 0,
        description: '',
        content_url: '',
        pdf_url: '',
        content_text: '',
        enable_download: false,
    });

    useEffect(() => {
        const fetchLesson = async () => {
            if (!id) return;
            try {
                setIsLoading(true);
                const data = await lessonsService.getLessonById(parseInt(id));
                setLessonData(data);
            } catch (error) {
                console.error('Failed to fetch lesson:', error);
                toast.error('Failed to load lesson details');
            } finally {
                setIsLoading(false);
            }
        };

        fetchLesson();
    }, [id]);

    const handleSave = async () => {
        if (!id) return;
        try {
            setIsSaving(true);
            const { course, module, ...cleanData } = lessonData as any;
            await lessonsService.updateLesson(parseInt(id), cleanData);
            toast.success('Lesson updated successfully');
            navigate(-1);
        } catch (error) {
            console.error('Failed to update lesson:', error);
            toast.error(lessonsService.getErrorMessage(error, 'Failed to update lesson'));
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <Progress value={33} className="w-[200px] mb-4" />
                    <p className="text-muted-foreground">Loading lesson details...</p>
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
                        <h1 className="text-xl font-bold">Edit Lesson: {lessonData.title}</h1>
                        <p className="text-sm text-muted-foreground">Manage lesson content and settings</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={() => navigate(-1)} disabled={isSaving}>Cancel</Button>
                    <Button onClick={handleSave} className="gap-2 bg-primary hover:bg-primary/90 text-black font-medium" disabled={isSaving}>
                        <Save className="w-4 h-4" /> {isSaving ? 'Saving...' : 'Save Lesson'}
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
                                    <Label>Lesson Title *</Label>
                                    <Input
                                        value={lessonData.title}
                                        onChange={(e) => setLessonData({ ...lessonData, title: e.target.value })}
                                        placeholder="e.g., Introduction to Security"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Content Type *</Label>
                                    <Select
                                        value={lessonData.content_type}
                                        onValueChange={(v) => setLessonData({ ...lessonData, content_type: v as any })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="video">Video</SelectItem>
                                            <SelectItem value="text">Text Content</SelectItem>
                                            <SelectItem value="pdf">PDF Document</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Description</Label>
                                <Textarea
                                    value={lessonData.description || ''}
                                    onChange={(e) => setLessonData({ ...lessonData, description: e.target.value })}
                                    placeholder="Briefly describe what this lesson covers..."
                                    className="min-h-[100px]"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Duration (Minutes)</Label>
                                    <Input
                                        type="number"
                                        value={lessonData.duration_min || 0}
                                        onChange={(e) => setLessonData({ ...lessonData, duration_min: parseInt(e.target.value) || 0 })}
                                    />
                                </div>
                                <div className="flex items-center justify-between p-4 border rounded-lg mt-6">
                                    <div className="space-y-0.5">
                                        <Label>Enable Download</Label>
                                        <p className="text-xs text-muted-foreground">Allow students to download content</p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={!!lessonData.enable_download}
                                        onChange={(e) => setLessonData({ ...lessonData, enable_download: e.target.checked })}
                                        className="w-4 h-4"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Content</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {lessonData.content_type === 'video' && (
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Video URL (Bunny Stream / YouTube / Vimeo)</Label>
                                        <Input
                                            value={lessonData.content_url || ''}
                                            onChange={(e) => setLessonData({ ...lessonData, content_url: e.target.value })}
                                            placeholder="https://..."
                                        />
                                    </div>
                                    {lessonData.bunny_video_id ? (
                                        <div className="p-4 bg-muted rounded-lg space-y-4">
                                            <div className="flex items-center gap-3">
                                                <Video className="w-5 h-5 text-primary" />
                                                <div>
                                                    <p className="text-sm font-medium">Bunny Stream Video ID</p>
                                                    <p className="text-xs text-muted-foreground font-mono">{lessonData.bunny_video_id}</p>
                                                </div>
                                                <div className="ml-auto flex items-center gap-2">
                                                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full capitalize mr-2">
                                                        {lessonData.video_status || 'Ready'}
                                                    </span>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={async () => {
                                                            if (confirm('Are you sure you want to delete this video from Bunny Stream? This cannot be undone.')) {
                                                                try {
                                                                    const libraryId = lessonData.bunny_library_id || parseInt(import.meta.env.VITE_BUNNY_LIBRARY_ID);
                                                                    if (!libraryId) throw new Error('Library ID not found');
                                                                    await lessonsService.deleteBunnyVideo(libraryId, lessonData.bunny_video_id!);
                                                                    setLessonData({ ...lessonData, bunny_video_id: undefined, video_status: undefined, content_url: '' });
                                                                    toast.success('Video deleted from Bunny Stream');
                                                                } catch (error) {
                                                                    toast.error('Failed to delete video from Bunny Stream');
                                                                }
                                                            }
                                                        }}
                                                    >
                                                        Delete Video
                                                    </Button>
                                                </div>
                                            </div>

                                            <div className="pt-2 border-t border-border">
                                                <Label className="text-xs mb-2 block">Replace with new video file</Label>
                                                <Input
                                                    type="file"
                                                    accept="video/*"
                                                    onChange={async (e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file && id) {
                                                            try {
                                                                toast.loading('Replacing video...', { id: 'replace-video' });
                                                                const updatedLesson = await lessonsService.replaceVideo(parseInt(id), file);
                                                                setLessonData(updatedLesson);
                                                                toast.success('Video replaced successfully', { id: 'replace-video' });
                                                            } catch (error) {
                                                                toast.error('Failed to replace video', { id: 'replace-video' });
                                                            }
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="p-4 border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-3 bg-slate-50">
                                            <div className="w-16 h-16 flex items-center justify-center mb-2">
                                                <img src="/course/video_upload.svg" alt="" className="w-full h-full" />
                                            </div>
                                            <div className="text-center">
                                                <p className="text-sm font-medium text-slate-600">No Bunny Stream video linked</p>
                                                <p className="text-xs text-slate-400">Upload a video to get started</p>
                                            </div>
                                            <Input
                                                type="file"
                                                accept="video/*"
                                                className="max-w-xs"
                                                onChange={async (e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file && id) {
                                                        try {
                                                            toast.loading('Uploading video...', { id: 'upload-video' });
                                                            const updatedLesson = await lessonsService.replaceVideo(parseInt(id), file);
                                                            setLessonData(updatedLesson);
                                                            toast.success('Video uploaded successfully', { id: 'upload-video' });
                                                        } catch (error) {
                                                            toast.error('Failed to upload video', { id: 'upload-video' });
                                                        }
                                                    }
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>
                            )}

                            {lessonData.content_type === 'pdf' && (
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>PDF URL</Label>
                                        <Input
                                            value={lessonData.pdf_url || ''}
                                            onChange={(e) => setLessonData({ ...lessonData, pdf_url: e.target.value })}
                                            placeholder="https://..."
                                        />
                                    </div>
                                    {lessonData.pdf_url ? (
                                        <div className="p-4 bg-muted rounded-lg space-y-4">
                                            <div className="flex items-center gap-3">
                                                <FileText className="w-5 h-5 text-red-500" />
                                                <div className="flex-1 truncate">
                                                    <p className="text-sm font-medium truncate">{lessonData.pdf_url.split('/').pop()}</p>
                                                </div>
                                                <div className="ml-auto flex items-center gap-2">
                                                    <Button variant="ghost" size="sm" asChild>
                                                        <a href={lessonData.pdf_url} target="_blank" rel="noopener noreferrer">View</a>
                                                    </Button>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={async () => {
                                                            if (confirm('Are you sure you want to delete this PDF?')) {
                                                                try {
                                                                    if (lessonData.pdf_url) {
                                                                        // Extract path from URL: everything after the hostname
                                                                        const url = new URL(lessonData.pdf_url);
                                                                        const path = url.pathname.startsWith('/') ? url.pathname.substring(1) : url.pathname;
                                                                        await bunnyUploadService.deleteFile(path);
                                                                    }
                                                                    const updatedData = { ...lessonData, pdf_url: '' };
                                                                    const { course, module, ...cleanData } = updatedData as any;
                                                                    await lessonsService.updateLesson(parseInt(id!), cleanData);
                                                                    setLessonData(updatedData);
                                                                    toast.success('PDF deleted from storage');
                                                                } catch (error) {
                                                                    console.error('Failed to delete PDF:', error);
                                                                    toast.error('Failed to delete PDF from storage');
                                                                }
                                                            }
                                                        }}
                                                    >
                                                        Delete PDF
                                                    </Button>
                                                </div>
                                            </div>

                                            <div className="pt-2 border-t border-border">
                                                <Label className="text-xs mb-2 block">Replace with new PDF file</Label>
                                                <Input
                                                    type="file"
                                                    accept="application/pdf"
                                                    onChange={async (e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file && id) {
                                                            try {
                                                                toast.loading('Replacing PDF...', { id: 'pdf-upload' });

                                                                // 1. Delete old file if exists
                                                                if (lessonData.pdf_url) {
                                                                    try {
                                                                        const url = new URL(lessonData.pdf_url);
                                                                        const oldPath = url.pathname.startsWith('/') ? url.pathname.substring(1) : url.pathname;
                                                                        await bunnyUploadService.deleteFile(oldPath);
                                                                    } catch (e) {
                                                                        console.warn('Could not delete old PDF:', e);
                                                                    }
                                                                }

                                                                // 2. Upload new file
                                                                const uploadRes = await bunnyUploadService.uploadFile(file, 'course-lesson/');
                                                                const updatedData = { ...lessonData, pdf_url: uploadRes.url };
                                                                const { course, module, ...cleanData } = updatedData as any;
                                                                await lessonsService.updateLesson(parseInt(id), cleanData);
                                                                setLessonData(updatedData);
                                                                toast.success('PDF replaced successfully', { id: 'pdf-upload' });
                                                            } catch (error) {
                                                                toast.error('Failed to replace PDF', { id: 'pdf-upload' });
                                                            }
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="p-4 border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-3 bg-slate-50">
                                            <div className="w-16 h-16 flex items-center justify-center mb-2">
                                                <img src="/course/pdf_upload.svg" alt="" className="w-full h-full" />
                                            </div>
                                            <div className="text-center">
                                                <p className="text-sm font-medium text-slate-600">No PDF file linked</p>
                                                <p className="text-xs text-slate-400">Upload a PDF to get started</p>
                                            </div>
                                            <Input
                                                type="file"
                                                accept="application/pdf"
                                                className="max-w-xs"
                                                onChange={async (e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file && id) {
                                                        try {
                                                            toast.loading('Uploading PDF...', { id: 'pdf-upload' });
                                                            const uploadRes = await bunnyUploadService.uploadFile(file, 'course-lesson/');
                                                            const updatedData = { ...lessonData, pdf_url: uploadRes.url };
                                                            const { course, module, ...cleanData } = updatedData as any;
                                                            await lessonsService.updateLesson(parseInt(id), cleanData);
                                                            setLessonData(updatedData);
                                                            toast.success('PDF uploaded successfully', { id: 'pdf-upload' });
                                                        } catch (error) {
                                                            toast.error('Failed to upload PDF', { id: 'pdf-upload' });
                                                        }
                                                    }
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>
                            )}

                            {lessonData.content_type === 'text' && (
                                <div className="space-y-2">
                                    <Label>Text Content</Label>
                                    <Textarea
                                        value={lessonData.content_text || ''}
                                        onChange={(e) => setLessonData({ ...lessonData, content_text: e.target.value })}
                                        placeholder="Enter lesson text content here..."
                                        className="min-h-[300px] font-mono text-sm"
                                    />
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
