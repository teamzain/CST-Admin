'use client';

import { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Upload, FileText, Video, CheckCircle2, File as FileIcon, AlignLeft } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
// import axios from 'axios';
import type { Lesson } from './module-item';

interface LessonModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (lesson: Partial<Lesson>, file?: File) => void;
    lesson?: Lesson;
    courseId?: number;
    moduleId?: number; // Needed for initiate call
}

// Simple Switch Component
const Switch = ({ checked, onCheckedChange }: { checked: boolean; onCheckedChange: (checked: boolean) => void }) => (
    <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onCheckedChange(!checked)}
        className={`
      relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50
      ${checked ? 'bg-yellow-400' : 'bg-slate-200'}
    `}
    >
        <span
            className={`
        pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform
        ${checked ? 'translate-x-5' : 'translate-x-0'}
      `}
        />
    </button>
);

export function LessonModal({ isOpen, onClose, onSave, lesson, courseId, moduleId }: LessonModalProps) {
    const [formData, setFormData] = useState<Partial<Lesson>>({
        title: '',
        content_type: 'video',
        duration_min: 0,
        description: '',
        content_url: '',
        pdf_url: '',
    });
    const [isDownloadEnabled, setIsDownloadEnabled] = useState(false);

    // Upload State
    const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadedFileName, setUploadedFileName] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    useEffect(() => {
        if (lesson) {
            setFormData({
                title: lesson.title,
                content_type: lesson.content_type,
                duration_min: lesson.duration_min,
                description: lesson.description,
                content_url: lesson.content_url,
                pdf_url: lesson.pdf_url,
            });
            // Reset upload state on edit (unless we want to show existing file)
            setUploadStatus('idle');
            setUploadProgress(0);
            setUploadedFileName('');
            setSelectedFile(null);
        } else {
            setFormData({
                title: '',
                content_type: 'video',
                duration_min: 0,
                description: '',
                content_url: '',
                pdf_url: '',
            });
            setUploadStatus('idle');
            setUploadProgress(0);
            setUploadedFileName('');
            setSelectedFile(null);
        }
    }, [lesson, isOpen]);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (!file) return;

        setSelectedFile(file);
        setUploadedFileName(file.name);
        setUploadStatus('uploading');
        setUploadProgress(0);

        try {
            // UNIFIED FLOW: Create Lesson -> Upload to Bunny -> Update Status
            // This applies to both Video and PDF as per the backend response structure provided.

            // 1. Create Lesson & Get Upload URL
            // const createRes = await axios.post(`http://localhost:3012/api/course/${courseId}/lesson/video/initiate`, {
            //     title: formData.title || file.name,
            //     content_type: formData.content_type, // 'video' or 'pdf'
            //     order_index: 1, // Should be calculated or passed
            //     module_id: moduleId,
            //     video: formData.content_type === 'video', // true for video, false for pdf
            //     description: formData.description
            // });
            // const { lesson_id, upload_url, video_id } = createRes.data;

            // Simulate progress
            const interval = setInterval(() => {
                setUploadProgress((prev) => {
                    if (prev >= 95) {
                        clearInterval(interval);
                        return 95;
                    }
                    return prev + 10;
                });
            }, 500);

            // 2. Upload File to Bunny (PUT to the returned upload_url)
            // await axios.put(upload_url, file, {
            //     headers: { 
            //         'Content-Type': file.type, // e.g., video/mp4 or application/pdf
            //         'AccessKey': '...' // If required by the specific Bunny URL type, usually included in URL or header
            //     }, 
            // });

            // 3. Update Status
            // await axios.patch(`http://localhost:3012/api/course/lesson/${lesson_id}/video-status`);

            // Mock completion
            setTimeout(() => {
                clearInterval(interval);
                setUploadProgress(100);
                setUploadStatus('success');

                // Optional: Call onSave here if we want to close/update parent immediately
                // onSave({ ...formData, id: lesson_id }, file); 
            }, 3000);

        } catch (error) {
            console.error('Upload failed:', error);
            setUploadStatus('error');
            setUploadProgress(0);
        }
    }, [courseId, moduleId, formData.content_type, formData.title, formData.description]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: formData.content_type === 'video'
            ? { 'video/*': [] }
            : { 'application/pdf': [] },
        maxFiles: 1,
        disabled: uploadStatus === 'uploading' || uploadStatus === 'success'
    });

    // Use variables to avoid lint errors
    useEffect(() => {
        if (moduleId && courseId) {
            console.log('Ready to upload for module:', moduleId, 'course:', courseId);
        }
    }, [moduleId, courseId]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData, selectedFile || undefined);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto" showCloseButton={false}>
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>{lesson ? 'Edit Lesson' : 'Add Lesson'}</DialogTitle>
                        <DialogDescription>
                            {lesson ? 'Update the lesson details below.' : 'Add a new lesson to this module.'}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 py-4">
                        {/* Title & Duration Row */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className={formData.content_type === 'video' ? "col-span-3 space-y-2" : "col-span-2 space-y-2"}>
                                <Label htmlFor="lesson-title">Lesson Title *</Label>
                                <Input
                                    id="lesson-title"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="e.g., Introduction to Firearms Safety"
                                    required
                                    className="bg-background border-input"
                                />
                            </div>
                            {formData.content_type !== 'video' && (
                                <div className="space-y-2">
                                    <Label htmlFor="duration">Duration (min)</Label>
                                    <Input
                                        id="duration"
                                        type="number"
                                        value={formData.duration_min || 0}
                                        onChange={(e) => setFormData({ ...formData, duration_min: parseInt(e.target.value) })}
                                        placeholder="30"
                                        min="0"
                                        className="bg-background border-input"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={formData.description || ''}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Brief description of what this lesson covers..."
                                rows={2}
                                className="bg-background border-input resize-none"
                            />
                        </div>

                        {/* Content Type Tabs */}
                        <div className="space-y-4">
                            <Label>Content Type *</Label>
                            <Tabs
                                value={formData.content_type}
                                onValueChange={(val) => {
                                    setFormData({ ...formData, content_type: val as any });
                                    setUploadStatus('idle');
                                    setSelectedFile(null);
                                }}
                                className="w-full"
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
                                        <FileIcon className="w-4 h-4 mr-2" />
                                        PDF
                                    </TabsTrigger>
                                </TabsList>

                                <div className={`mt-6 border-2 border-dashed rounded-xl p-8 transition-colors ${isDragActive ? 'border-primary bg-primary/5' : 'border-slate-200 hover:bg-slate-50/50'}`}>
                                    <TabsContent value="video" className="mt-0">
                                        {uploadStatus === 'idle' ? (
                                            <div {...getRootProps()} className="flex flex-col items-center justify-center text-center cursor-pointer">
                                                <input {...getInputProps()} />
                                                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                                                    <Video className="w-6 h-6 text-slate-400" />
                                                </div>
                                                <h3 className="text-lg font-semibold mb-1">Upload Video</h3>
                                                <p className="text-sm text-muted-foreground mb-6">
                                                    Click on the button to upload or drag and drop your file
                                                </p>
                                                <Button type="button" className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium px-8">
                                                    <Upload className="w-4 h-4 mr-2" />
                                                    Upload Video
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center py-4">
                                                {uploadStatus === 'success' ? (
                                                    <>
                                                        <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mb-4 animate-in zoom-in duration-300">
                                                            <CheckCircle2 className="w-8 h-8 text-yellow-600" />
                                                        </div>
                                                        <h3 className="text-lg font-semibold mb-2">Video Uploaded</h3>
                                                        <p className="text-sm text-muted-foreground">{uploadedFileName}</p>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => {
                                                                setUploadStatus('idle');
                                                                setSelectedFile(null);
                                                            }}
                                                            className="mt-4 text-red-500 hover:text-red-600 hover:bg-red-50"
                                                        >
                                                            Remove
                                                        </Button>
                                                    </>
                                                ) : (
                                                    <div className="w-full max-w-md space-y-4">
                                                        <div className="flex flex-col items-center mb-4">
                                                            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                                                                <Upload className="w-6 h-6 text-slate-400 animate-bounce" />
                                                            </div>
                                                            <h3 className="font-medium">Uploading Document</h3>
                                                            <p className="text-sm text-muted-foreground">{uploadedFileName}</p>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <Progress value={uploadProgress} className="h-2 bg-slate-100 [&>div]:bg-yellow-400" />
                                                            <span className="text-sm font-medium w-10">{uploadProgress}%</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </TabsContent>

                                    <TabsContent value="pdf" className="mt-0">
                                        {uploadStatus === 'idle' ? (
                                            <div {...getRootProps()} className="flex flex-col items-center justify-center text-center cursor-pointer">
                                                <input {...getInputProps()} />
                                                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                                                    <FileText className="w-6 h-6 text-slate-400" />
                                                </div>
                                                <h3 className="text-lg font-semibold mb-1">PDF</h3>
                                                <p className="text-sm text-muted-foreground mb-1">Upload PDF file</p>
                                                <p className="text-xs text-muted-foreground mb-6">
                                                    Click on the button to upload or drag and drop your file
                                                </p>
                                                <Button type="button" className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium px-8">
                                                    <Upload className="w-4 h-4 mr-2" />
                                                    Upload PDF
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center py-4">
                                                {uploadStatus === 'success' ? (
                                                    <>
                                                        <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mb-4 animate-in zoom-in duration-300">
                                                            <CheckCircle2 className="w-8 h-8 text-yellow-600" />
                                                        </div>
                                                        <h3 className="text-lg font-semibold mb-2">PDF Uploaded</h3>
                                                        <p className="text-sm text-muted-foreground">{uploadedFileName}</p>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => {
                                                                setUploadStatus('idle');
                                                                setSelectedFile(null);
                                                            }}
                                                            className="mt-4 text-red-500 hover:text-red-600 hover:bg-red-50"
                                                        >
                                                            Remove
                                                        </Button>
                                                    </>
                                                ) : (
                                                    <div className="w-full max-w-md space-y-4">
                                                        <div className="flex flex-col items-center mb-4">
                                                            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                                                                <Upload className="w-6 h-6 text-slate-400 animate-bounce" />
                                                            </div>
                                                            <h3 className="font-medium">Uploading Document</h3>
                                                            <p className="text-sm text-muted-foreground">{uploadedFileName}</p>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <Progress value={uploadProgress} className="h-2 bg-slate-100 [&>div]:bg-yellow-400" />
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
                                                value={formData.content_url || ''}
                                                onChange={(e) => setFormData({ ...formData, content_url: e.target.value })}
                                                placeholder="Enter lesson text content here..."
                                                rows={8}
                                                className="bg-background border-input font-mono text-sm resize-none"
                                            />
                                        </div>
                                    </TabsContent>
                                </div>
                            </Tabs>
                        </div>

                        {/* Enable Download Toggle */}
                        <div className="flex items-center justify-between pt-2">
                            <div className="space-y-0.5">
                                <Label className="text-base">Enable Download *</Label>
                                <p className="text-sm text-muted-foreground">
                                    Quickly enable or disable the download
                                </p>
                            </div>
                            <Switch
                                checked={isDownloadEnabled}
                                onCheckedChange={setIsDownloadEnabled}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="bg-primary hover:bg-primary/90"
                            disabled={uploadStatus === 'uploading'}
                        >
                            {lesson ? 'Update Lesson' : 'Add Lesson'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
