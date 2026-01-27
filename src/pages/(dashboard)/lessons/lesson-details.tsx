import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, ChevronLeft, Video, FileText, Upload, AlignLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Lesson } from '@/components/course/module-item';
import { lessonsService } from '@/api/lessons';
import { Progress } from '@/components/ui/progress';
import { bunnyUploadService } from '@/api/bunny-upload';
import { useDropzone } from 'react-dropzone';

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

    // Upload State
    const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadedFileName, setUploadedFileName] = useState('');

    useEffect(() => {
        const fetchLesson = async () => {
            if (!id) return;
            try {
                setIsLoading(true);
                const data = await lessonsService.getLessonById(parseInt(id));
                setLessonData(data);

                // Initialize upload status if content exists
                if (data.content_type === 'video' && data.bunny_video_id) {
                    setUploadStatus('success');
                    setUploadedFileName('Current Video');
                } else if (data.content_type === 'pdf' && data.pdf_url) {
                    setUploadStatus('success');
                    setUploadedFileName(data.pdf_url.split('/').pop() || 'Current PDF');
                }

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

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (!file || !id) return;

        setUploadedFileName(file.name);
        setUploadStatus('uploading');
        setUploadProgress(0);

        try {
            // Simulate progress
            const interval = setInterval(() => {
                setUploadProgress((prev) => {
                    if (prev >= 90) return 90;
                    return prev + 10;
                });
            }, 500);

            if (lessonData.content_type === 'video') {
                toast.loading('Uploading video...', { id: 'upload-video' });
                const updatedLesson = await lessonsService.replaceVideo(parseInt(id), file);
                setLessonData(updatedLesson);
                toast.success('Video uploaded successfully', { id: 'upload-video' });
            } else if (lessonData.content_type === 'pdf') {
                toast.loading('Uploading PDF...', { id: 'pdf-upload' });

                // Delete old PDF if exists
                if (lessonData.pdf_url) {
                    try {
                        const url = new URL(lessonData.pdf_url);
                        const oldPath = url.pathname.startsWith('/') ? url.pathname.substring(1) : url.pathname;
                        await bunnyUploadService.deleteFile(oldPath);
                    } catch (e) {
                        console.warn('Could not delete old PDF:', e);
                    }
                }

                const uploadRes = await bunnyUploadService.uploadFile(file, 'course-lesson/');
                const updatedData = { ...lessonData, pdf_url: uploadRes.url };
                const { course, module, ...cleanData } = updatedData as any;
                await lessonsService.updateLesson(parseInt(id), cleanData);
                setLessonData(updatedData);
                toast.success('PDF uploaded successfully', { id: 'pdf-upload' });
            }

            clearInterval(interval);
            setUploadProgress(100);
            setUploadStatus('success');

        } catch (error) {
            console.error('Upload failed:', error);
            setUploadStatus('error');
            setUploadProgress(0);
            if (lessonData.content_type === 'video') {
                toast.error('Failed to upload video', { id: 'upload-video' });
            } else {
                toast.error('Failed to upload PDF', { id: 'pdf-upload' });
            }
        }
    }, [id, lessonData]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: lessonData.content_type === 'video'
            ? { 'video/*': [] }
            : lessonData.content_type === 'pdf'
                ? { 'application/pdf': [] }
                : undefined,
        maxFiles: 1,
        disabled: uploadStatus === 'uploading'
    });

    const handleDeleteContent = async () => {
        if (!id) return;

        if (lessonData.content_type === 'video' && lessonData.bunny_video_id) {
            try {
                const libraryId = lessonData.bunny_library_id || parseInt(import.meta.env.VITE_BUNNY_LIBRARY_ID);
                if (!libraryId) throw new Error('Library ID not found');
                await lessonsService.deleteBunnyVideo(libraryId, lessonData.bunny_video_id);
                setLessonData({ ...lessonData, bunny_video_id: undefined, video_status: undefined, content_url: '' });
                setUploadStatus('idle');
                setUploadedFileName('');
                toast.success('Video deleted from Bunny Stream');
            } catch (error) {
                toast.error('Failed to delete video from Bunny Stream');
            }
        } else if (lessonData.content_type === 'pdf' && lessonData.pdf_url) {
            try {
                const url = new URL(lessonData.pdf_url);
                const path = url.pathname.startsWith('/') ? url.pathname.substring(1) : url.pathname;
                await bunnyUploadService.deleteFile(path);

                const updatedData = { ...lessonData, pdf_url: '' };
                const { course, module, ...cleanData } = updatedData as any;
                await lessonsService.updateLesson(parseInt(id), cleanData);
                setLessonData(updatedData);
                setUploadStatus('idle');
                setUploadedFileName('');
                toast.success('PDF deleted from storage');
            } catch (error) {
                console.error('Failed to delete PDF:', error);
                toast.error('Failed to delete PDF from storage');
            }
        } else {
            // Just reset state if no remote content
            setUploadStatus('idle');
            setUploadedFileName('');
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
                                <div className="col-span-2 space-y-2">
                                    <Label>Lesson Title *</Label>
                                    <Input
                                        value={lessonData.title}
                                        onChange={(e) => setLessonData({ ...lessonData, title: e.target.value })}
                                        placeholder="e.g., Introduction to Security"
                                    />
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
                            <div className="space-y-4">
                                <Label>Content Type *</Label>
                                <Tabs
                                    value={lessonData.content_type}
                                    onValueChange={(val) => {
                                        setLessonData({ ...lessonData, content_type: val as any });
                                        // Reset upload status when switching tabs if no content exists for that type
                                        if (val === 'video' && !lessonData.bunny_video_id) {
                                            setUploadStatus('idle');
                                            setUploadedFileName('');
                                        } else if (val === 'pdf' && !lessonData.pdf_url) {
                                            setUploadStatus('idle');
                                            setUploadedFileName('');
                                        } else if (val === 'video' && lessonData.bunny_video_id) {
                                            setUploadStatus('success');
                                            setUploadedFileName('Current Video');
                                        } else if (val === 'pdf' && lessonData.pdf_url) {
                                            setUploadStatus('success');
                                            setUploadedFileName(lessonData.pdf_url.split('/').pop() || 'Current PDF');
                                        }
                                    }}
                                    className="w-full mt-2"
                                >
                                    <TabsList className="grid w-full grid-cols-3 bg-muted/50 p-1">
                                        <TabsTrigger value="video" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                                            <Video className="w-4 h-4 mr-2" />
                                            Video
                                        </TabsTrigger>
                                        <TabsTrigger value="text" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                                            <AlignLeft className="w-4 h-4 mr-2" />
                                            Text
                                        </TabsTrigger>
                                        <TabsTrigger value="pdf" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                                            <FileText className="w-4 h-4 mr-2" />
                                            PDF
                                        </TabsTrigger>
                                    </TabsList>

                                    <div className={`mt-6 border-2 border-dashed rounded-xl p-8 transition-colors ${isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:bg-slate-50/50'}`}>
                                        <TabsContent value="video" className="mt-0">
                                            {uploadStatus === 'idle' ? (
                                                <div className="space-y-6">
                                                    <div {...getRootProps()} className="flex flex-col items-center justify-center text-center cursor-pointer border-2 border-dashed rounded-xl p-8 hover:bg-slate-50/50 transition-colors">
                                                        <input {...getInputProps()} />
                                                        <div className="w-16 h-16 flex items-center justify-center mb-4">
                                                            <img src="/course/video_upload.svg" alt="" className="w-full h-full" />
                                                        </div>
                                                        <h3 className="text-lg font-semibold mb-1">Upload Video</h3>
                                                        <p className="text-sm text-muted-foreground mb-6">
                                                            Click on the button to upload or drag and drop your file
                                                        </p>
                                                        <Button type="button" className="bg-primary hover:bg-primary/90 text-black font-medium px-8">
                                                            <Upload className="w-4 h-4 mr-2" />
                                                            Upload Video
                                                        </Button>
                                                    </div>

                                                    <div className="relative">
                                                        <div className="absolute inset-0 flex items-center">
                                                            <span className="w-full border-t" />
                                                        </div>
                                                        <div className="relative flex justify-center text-xs uppercase">
                                                            <span className="bg-background px-2 text-muted-foreground">Or provide a URL</span>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label>Video URL (Bunny Stream / YouTube / Vimeo)</Label>
                                                        <Input
                                                            value={lessonData.content_url || ''}
                                                            onChange={(e) => setLessonData({ ...lessonData, content_url: e.target.value })}
                                                            placeholder="https://..."
                                                            className="bg-background border-border"
                                                        />
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center justify-center py-4">
                                                    {uploadStatus === 'success' ? (
                                                        <>
                                                            <div className="w-16 h-16 flex items-center justify-center mb-4 animate-in zoom-in duration-300">
                                                                <img src="/course/upload_completed.svg" alt="" className="w-full h-full" />
                                                            </div>
                                                            <h3 className="text-lg font-semibold mb-2">Video Uploaded</h3>
                                                            <p className="text-sm text-muted-foreground">{uploadedFileName}</p>
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={handleDeleteContent}
                                                                className="mt-4 text-red-500 hover:text-red-600 hover:bg-red-50"
                                                            >
                                                                Remove / Replace
                                                            </Button>
                                                            {lessonData.content_url && (
                                                                <Button
                                                                    type="button"
                                                                    variant="link"
                                                                    size="sm"
                                                                    asChild
                                                                    className="mt-2"
                                                                >
                                                                    <a href={lessonData.content_url} target="_blank" rel="noopener noreferrer">
                                                                        View Video
                                                                    </a>
                                                                </Button>
                                                            )}
                                                        </>
                                                    ) : (
                                                        <div className="w-full max-w-md space-y-4">
                                                            <div className="flex flex-col items-center mb-4">
                                                                <div className="w-16 h-16 flex items-center justify-center mb-3">
                                                                    <img src="/course/uploading_document.svg" alt="" className="w-full h-full animate-pulse" />
                                                                </div>
                                                                <h3 className="font-medium">Uploading Video</h3>
                                                                <p className="text-sm text-muted-foreground">{uploadedFileName}</p>
                                                            </div>
                                                            <div className="flex items-center gap-3">
                                                                <Progress value={uploadProgress} className="h-2 bg-slate-100 [&>div]:bg-primary" />
                                                                <span className="text-sm font-medium w-10">{uploadProgress}%</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </TabsContent>

                                        <TabsContent value="pdf" className="mt-0">
                                            {uploadStatus === 'idle' ? (
                                                <div className="space-y-6">
                                                    <div {...getRootProps()} className="flex flex-col items-center justify-center text-center cursor-pointer border-2 border-dashed rounded-xl p-8 hover:bg-slate-50/50 transition-colors">
                                                        <input {...getInputProps()} />
                                                        <div className="w-16 h-16 flex items-center justify-center mb-4">
                                                            <img src="/course/pdf_upload.svg" alt="" className="w-full h-full" />
                                                        </div>
                                                        <h3 className="text-lg font-semibold mb-1">PDF</h3>
                                                        <p className="text-sm text-muted-foreground mb-1">Upload PDF file</p>
                                                        <p className="text-xs text-muted-foreground mb-6">
                                                            Click on the button to upload or drag and drop your file
                                                        </p>
                                                        <Button type="button" className="bg-primary hover:bg-primary/90 text-black font-medium px-8">
                                                            <Upload className="w-4 h-4 mr-2" />
                                                            Upload PDF
                                                        </Button>
                                                    </div>

                                                    <div className="relative">
                                                        <div className="absolute inset-0 flex items-center">
                                                            <span className="w-full border-t" />
                                                        </div>
                                                        <div className="relative flex justify-center text-xs uppercase">
                                                            <span className="bg-background px-2 text-muted-foreground">Or provide a URL</span>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label>PDF URL</Label>
                                                        <Input
                                                            value={lessonData.pdf_url || ''}
                                                            onChange={(e) => setLessonData({ ...lessonData, pdf_url: e.target.value })}
                                                            placeholder="https://..."
                                                            className="bg-background border-border"
                                                        />
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center justify-center py-4">
                                                    {uploadStatus === 'success' ? (
                                                        <>
                                                            <div className="w-16 h-16 flex items-center justify-center mb-4 animate-in zoom-in duration-300">
                                                                <img src="/course/upload_completed.svg" alt="" className="w-full h-full" />
                                                            </div>
                                                            <h3 className="text-lg font-semibold mb-2">PDF Uploaded</h3>
                                                            <p className="text-sm text-muted-foreground">{uploadedFileName}</p>
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={handleDeleteContent}
                                                                className="mt-4 text-red-500 hover:text-red-600 hover:bg-red-50"
                                                            >
                                                                Remove / Replace
                                                            </Button>
                                                            {lessonData.pdf_url && (
                                                                <Button
                                                                    type="button"
                                                                    variant="link"
                                                                    size="sm"
                                                                    asChild
                                                                    className="mt-2"
                                                                >
                                                                    <a href={lessonData.pdf_url} target="_blank" rel="noopener noreferrer">
                                                                        View PDF
                                                                    </a>
                                                                </Button>
                                                            )}
                                                        </>
                                                    ) : (
                                                        <div className="w-full max-w-md space-y-4">
                                                            <div className="flex flex-col items-center mb-4">
                                                                <div className="w-16 h-16 flex items-center justify-center mb-3">
                                                                    <img src="/course/uploading_document.svg" alt="" className="w-full h-full animate-pulse" />
                                                                </div>
                                                                <h3 className="font-medium">Uploading Document</h3>
                                                                <p className="text-sm text-muted-foreground">{uploadedFileName}</p>
                                                            </div>
                                                            <div className="flex items-center gap-3">
                                                                <Progress value={uploadProgress} className="h-2 bg-slate-100 [&>div]:bg-primary" />
                                                                <span className="text-sm font-medium w-10">{uploadProgress}%</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </TabsContent>

                                        <TabsContent value="text" className="mt-0">
                                            <div className="space-y-4">
                                                <div className="flex flex-col items-center justify-center text-center mb-4">
                                                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-2">
                                                        <AlignLeft className="w-6 h-6 text-slate-400" />
                                                    </div>
                                                    <h3 className="text-lg font-semibold">Text Content</h3>
                                                </div>
                                                <Textarea
                                                    value={lessonData.content_text || ''}
                                                    onChange={(e) => setLessonData({ ...lessonData, content_text: e.target.value })}
                                                    placeholder="Enter lesson text content here..."
                                                    rows={8}
                                                    className="bg-background border-border font-mono text-sm resize-none mt-2"
                                                />
                                            </div>
                                        </TabsContent>
                                    </div>
                                </Tabs>
                            </div>
                        </CardContent>
                    </Card>
                </div >
            </div >
        </div >
    );
}
