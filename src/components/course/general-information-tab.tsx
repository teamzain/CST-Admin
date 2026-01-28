'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, DollarSign, MapPin, Award, Upload, X } from 'lucide-react';
import { TRAINING_TYPE, DELIVERY_MODE, type Course, dummyInstructors, dummyStates } from '@/stores/courses-store';
import { bunnyUploadService } from '@/api/bunny-upload';
import { statesApiService } from '@/api/states-api';
import type { State } from '@/api/states-api';
import { useEffect } from 'react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface GeneralInformationTabProps {
    course: Course;
    formData: Partial<Course>;
    isEditing: boolean;
    onInputChange: (field: keyof Course, value: any) => void;
}

export function GeneralInformationTab({ course, formData, isEditing, onInputChange }: GeneralInformationTabProps) {
    const [thumbnailPreview, setThumbnailPreview] = useState<string>('');
    const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);
    const [allStates, setAllStates] = useState<State[]>([]);

    // Sync thumbnail preview with course/formData
    useEffect(() => {
        setThumbnailPreview(formData.thumbnail || course.thumbnail || '');
    }, [course.thumbnail, formData.thumbnail]);

    // Fetch states on mount
    useEffect(() => {
        const loadStates = async () => {
            try {
                const states = await statesApiService.getAllStates();
                setAllStates(states);
            } catch (error) {
                console.error('Error loading states:', error);
                setAllStates(dummyStates as State[]);
            }
        };
        loadStates();
    }, []);

    const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            toast.error('Invalid file type. Please upload JPEG, PNG, GIF, or WebP image.');
            return;
        }

        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('File size exceeds 5MB limit.');
            return;
        }

        setIsUploadingThumbnail(true);
        try {
            const result = await bunnyUploadService.uploadFile(file, 'course/');
            const fileUrl = result.url || result.path;
            onInputChange('thumbnail', fileUrl);
            setThumbnailPreview(fileUrl);
            toast.success('Thumbnail uploaded successfully');
        } catch (error) {
            console.error('Error uploading thumbnail:', error);
            toast.error('Failed to upload thumbnail');
        } finally {
            setIsUploadingThumbnail(false);
        }
    };

    const handleThumbnailDelete = async () => {
        const currentThumbnail = formData.thumbnail || course.thumbnail;
        if (!currentThumbnail) return;

        setIsUploadingThumbnail(true);
        try {
            // Extract path from URL or use it directly if it's already a path
            const path = currentThumbnail.includes('/') 
                ? currentThumbnail.split('/').slice(-2).join('/')  // Get last 2 parts (course/filename)
                : currentThumbnail;
            
            await bunnyUploadService.deleteFile(path);
            onInputChange('thumbnail', '');
            setThumbnailPreview('');
            toast.success('Thumbnail deleted successfully');
        } catch (error) {
            console.error('Error deleting thumbnail:', error);
            toast.error('Failed to delete thumbnail');
        } finally {
            setIsUploadingThumbnail(false);
        }
    };

    const displayCourse = { ...course, ...formData };

    return (
        <div className="space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="bg-muted/30 p-6 rounded-xl border border-border/50">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Duration</p>
                            <p className="text-2xl font-bold">{displayCourse.duration_hours}h</p>
                        </div>
                        <Calendar className="w-8 h-8 text-muted-foreground/50" />
                    </div>
                </div>

                <div className="bg-muted/30 p-6 rounded-xl border border-border/50">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Enrolled</p>
                            <p className="text-2xl font-bold">{displayCourse.enrolled_students || 0}</p>
                        </div>
                        <Users className="w-8 h-8 text-muted-foreground/50" />
                    </div>
                </div>

                <div className="bg-muted/30 p-6 rounded-xl border border-border/50">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Price</p>
                            <p className="text-2xl font-bold">${displayCourse.price.toFixed(2)}</p>
                        </div>
                        <DollarSign className="w-8 h-8 text-muted-foreground/50" />
                    </div>
                </div>

                <div className="bg-muted/30 p-6 rounded-xl border border-border/50">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Instructor</p>
                            <p className="text-lg font-bold truncate">{displayCourse.instructor?.name || 'N/A'}</p>
                        </div>
                        <Award className="w-8 h-8 text-muted-foreground/50" />
                    </div>
                </div>
            </div>

            {/* Course Description */}
            <div className="space-y-4">
                <div>
                    <h3 className="text-lg font-semibold">Course Title & Description</h3>
                    <p className="text-sm text-muted-foreground">Basic information about the course</p>
                </div>
                <div className="bg-muted/10 p-6 rounded-xl border border-border/50 space-y-4">
                    {isEditing ? (
                        <>
                            <div className="space-y-2">
                                <Label>Course Title</Label>
                                <Input
                                    value={formData.title || ''}
                                    onChange={(e) => onInputChange('title', e.target.value)}
                                    placeholder="Enter course title"
                                    className="bg-background border-border"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Description</Label>
                                <Textarea
                                    value={formData.description || ''}
                                    onChange={(e) => onInputChange('description', e.target.value)}
                                    placeholder="Enter course description"
                                    rows={5}
                                    className="bg-background border-border"
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            <h4 className="text-xl font-bold">{course.title}</h4>
                            <p className="text-foreground leading-relaxed">{course.description}</p>
                        </>
                    )}
                </div>
            </div>

            {/* Basic Information & Pricing */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Basic Information</h3>
                    <div className="bg-muted/10 p-6 rounded-xl border border-border/50 space-y-4">
                        {isEditing ? (
                            <>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label>State</Label>
                                        <Select
                                            value={formData.state_id ? String(formData.state_id) : String(course.state_id || '')}
                                            onValueChange={(val) => {
                                                const id = parseInt(val);
                                                onInputChange('state_id', id);
                                                const stateObj = allStates.find(s => s.id === id);
                                                if (stateObj) onInputChange('state', stateObj);
                                            }}
                                        >
                                            <SelectTrigger className="bg-background border-border">
                                                <SelectValue placeholder="Select State" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {(allStates.length > 0 ? allStates : dummyStates).map((state) => (
                                                    <SelectItem key={state.id} value={String(state.id)}>
                                                        {state.name} ({state.code})
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label>Instructor</Label>
                                        <Select
                                            value={formData.instructor_id ? String(formData.instructor_id) : (course.instructor_id ? String(course.instructor_id) : "unassigned")}
                                            onValueChange={(val) => {
                                                const id = val === "unassigned" ? undefined : parseInt(val);
                                                onInputChange('instructor_id', id);
                                                const instructor = dummyInstructors.find(i => i.id === id);
                                                onInputChange('instructor', instructor);
                                            }}
                                        >
                                            <SelectTrigger className="bg-background border-border">
                                                <SelectValue placeholder="Select Instructor" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="unassigned">Unassigned</SelectItem>
                                                {dummyInstructors.map((instructor) => (
                                                    <SelectItem key={instructor.id} value={String(instructor.id)}>
                                                        <div className="flex items-center gap-2">
                                                            <Avatar className="h-6 w-6">
                                                                <AvatarImage src={instructor.avatar} />
                                                                <AvatarFallback>{instructor.name.charAt(0)}</AvatarFallback>
                                                            </Avatar>
                                                            <span>{instructor.name}</span>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label>Training Type</Label>
                                        <Select
                                            value={formData.training_type || TRAINING_TYPE.UNARMED}
                                            onValueChange={(val) => onInputChange('training_type', val)}
                                        >
                                            <SelectTrigger className="bg-background border-border">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value={TRAINING_TYPE.UNARMED}>Unarmed</SelectItem>
                                                <SelectItem value={TRAINING_TYPE.ARMED}>Armed</SelectItem>
                                                <SelectItem value={TRAINING_TYPE.REFRESHER}>Refresher</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label>Delivery Mode</Label>
                                        <Select
                                            value={formData.delivery_mode || DELIVERY_MODE.ONLINE}
                                            onValueChange={(val) => onInputChange('delivery_mode', val)}
                                        >
                                            <SelectTrigger className="bg-background border-border">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value={DELIVERY_MODE.ONLINE}>Online</SelectItem>
                                                <SelectItem value={DELIVERY_MODE.IN_PERSON}>In Person</SelectItem>
                                                <SelectItem value={DELIVERY_MODE.HYBRID}>Hybrid</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label>Duration (hours)</Label>
                                        <Input
                                            type="number"
                                            value={formData.duration_hours || 0}
                                            onChange={(e) => onInputChange('duration_hours', parseFloat(e.target.value))}
                                            className="bg-background border-border"
                                        />
                                    </div>
                                    <div>
                                        <Label>Thumbnail</Label>
                                        <div className="space-y-3">
                                            {/* File Upload Input */}
                                            <div className="relative">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleThumbnailUpload}
                                                    disabled={isUploadingThumbnail}
                                                    className="hidden"
                                                    id="thumbnail-upload"
                                                />
                                                <label
                                                    htmlFor="thumbnail-upload"
                                                    className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-muted-foreground/30 rounded-lg cursor-pointer hover:border-muted-foreground/50 transition-colors bg-muted/5"
                                                >
                                                    <Upload className="w-4 h-4" />
                                                    <span className="text-sm text-muted-foreground">
                                                        {isUploadingThumbnail ? 'Uploading...' : 'Click to upload or drag and drop'}
                                                    </span>
                                                </label>
                                            </div>

                                            {/* Thumbnail Preview */}
                                            {thumbnailPreview && (
                                                <div className="relative w-full h-32 rounded-lg overflow-hidden border border-muted-foreground/20 bg-muted/10">
                                                    <img
                                                        src={thumbnailPreview}
                                                        alt="Thumbnail preview"
                                                        className="w-full h-full object-cover"
                                                    />
                                                    {isEditing && (
                                                        <button
                                                            onClick={handleThumbnailDelete}
                                                            disabled={isUploadingThumbnail}
                                                            className="absolute top-1 right-1 bg-destructive/90 hover:bg-destructive text-white p-1 rounded-md disabled:opacity-50"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            )}

                                            {/* File Info */}
                                            <p className="text-xs text-muted-foreground">Supported formats: JPEG, PNG, GIF, WebP (Max 5MB)</p>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="grid grid-cols-2 gap-y-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">State</p>
                                    <p className="font-semibold">{course.state?.name || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Instructor</p>
                                    <p className="font-semibold">{course.instructor?.name || 'Unassigned'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Training Type</p>
                                    <p className="font-semibold capitalize">{course.training_type.toLowerCase()}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Delivery Mode</p>
                                    <p className="font-semibold capitalize">{course.delivery_mode.replace('_', ' ').toLowerCase()}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Duration</p>
                                    <p className="font-semibold">{course.duration_hours} hours</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Pricing & Location</h3>
                    <div className="bg-muted/10 p-6 rounded-xl border border-border/50 space-y-4">
                        {isEditing ? (
                            <>
                                <div>
                                    <Label>Price</Label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        value={formData.price || 0}
                                        onChange={(e) => onInputChange('price', parseFloat(e.target.value))}
                                        className="bg-background border-border"
                                    />
                                </div>
                                <div>
                                    <Label>Location (if In-Person)</Label>
                                    <Input
                                        value={formData.location || ''}
                                        onChange={(e) => onInputChange('location', e.target.value)}
                                        placeholder="e.g., Chicago, IL"
                                        className="bg-background border-border"
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        id="price-negotiable"
                                        checked={formData.is_price_negotiable || false}
                                        onCheckedChange={(checked) => onInputChange('is_price_negotiable', checked)}
                                    />
                                    <Label htmlFor="price-negotiable">Price Negotiable</Label>
                                </div>
                            </>
                        ) : (
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Price</p>
                                    <p className="text-2xl font-bold text-primary-foreground bg-primary px-3 py-1 rounded-lg inline-block">${course.price.toFixed(2)}</p>
                                </div>
                                {course.location && (
                                    <div>
                                        <p className="text-sm text-muted-foreground">Location</p>
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-muted-foreground" />
                                            <p className="font-semibold">{course.location}</p>
                                        </div>
                                    </div>
                                )}
                                {course.is_price_negotiable && (
                                    <Badge variant="outline" className="border-primary text-primary">Price Negotiable</Badge>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Course Status */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">Course Status</h3>
                <div className="bg-muted/10 p-6 rounded-xl border border-border/50">
                    {isEditing ? (
                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="is-active"
                                checked={formData.is_active || false}
                                onCheckedChange={(checked) => onInputChange('is_active', checked)}
                            />
                            <Label htmlFor="is-active">Publish Course</Label>
                        </div>
                    ) : (
                        <div>
                            <Badge variant={course.is_active ? 'default' : 'secondary'} className="text-base px-4 py-1">
                                {course.is_active ? '✓ Published' : '○ Unpublished'}
                            </Badge>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
