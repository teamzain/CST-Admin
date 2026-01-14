'use client';

import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Trash2, Calendar, Users, DollarSign, MapPin, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { useCoursesStore, TRAINING_TYPE, DELIVERY_MODE, type Course } from '@/stores/courses-store';
import { useState } from 'react';

import { DeleteConfirmationDialog } from '@/components/shared/delete-confirmation-dialog';

export default function CourseDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { getCourseById, updateCourse, deleteCourse } = useCoursesStore();
    const [course, setCourse] = useState<Course | null>(() => {
        return getCourseById(Number(id)) || null;
    });
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [formData, setFormData] = useState<Partial<Course>>(() => {
        const foundCourse = getCourseById(Number(id));
        return foundCourse || {};
    });

    if (!course) {
        return (
            <div className="flex-1 bg-background p-8">
                <div className="text-center">
                    <p className="text-muted-foreground">Course not found</p>
                </div>
            </div>
        );
    }

    const handleSave = () => {
        updateCourse(course.id, formData);
        setCourse({ ...course, ...formData });
        setIsEditing(false);
    };

    const handleDeleteClick = () => {
        setIsDeleteDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        deleteCourse(course.id);
        navigate('/courses');
    };

    const handleInputChange = (field: keyof Course, value: string | number | boolean | string[] | undefined) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    return (
        <div className="flex-1 bg-background">
             <DeleteConfirmationDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Delete Course"
                description="Are you sure you want to delete this course? This will remove all associated student enrollments and records."
                itemType="Course"
                itemName={course.title}
            />
            <div className="p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate('/courses')}
                        className="gap-2 mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Courses
                    </Button>
                    <div className="flex gap-2">
                        {isEditing ? (
                            <>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setIsEditing(false);
                                        setFormData(course);
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleSave}
                                    className="gap-2 bg-primary hover:bg-primary/90"
                                >
                                    <Save className="w-4 h-4" />
                                    Save Changes
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    variant="outline"
                                    onClick={() => setIsEditing(true)}
                                >
                                    Edit Course
                                </Button>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={handleDeleteClick}
                                    className="gap-2"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Delete
                                </Button>
                            </>
                        )}
                    </div>
                </div>

                {/* Course Title and Status */}
                <div className="mb-8">
                    <div className="flex items-start justify-between">
                        <div>
                            {isEditing ? (
                                <Input
                                    value={formData.title || ''}
                                    onChange={(e) => handleInputChange('title', e.target.value)}
                                    className="text-3xl font-bold h-auto p-2 mb-4"
                                />
                            ) : (
                                <h1 className="text-3xl font-bold text-foreground mb-4">
                                    {course.title}
                                </h1>
                            )}
                            <div className="flex gap-2 flex-wrap">
                                <Badge variant={course.is_active ? 'default' : 'secondary'}>
                                    {course.is_active ? '✓ Published' : '○ Unpublished'}
                                </Badge>
                                <Badge variant="outline" className="capitalize">
                                    {course.training_type.toLowerCase()}
                                </Badge>
                                <Badge variant="outline" className="capitalize">
                                    {course.delivery_mode.replace('_', ' ').toLowerCase()}
                                </Badge>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <Card className="bg-card border-border">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">Duration</p>
                                    <p className="text-2xl font-bold">{course.duration_hours}h</p>
                                </div>
                                <Calendar className="w-8 h-8 text-muted-foreground" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-card border-border">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">Enrolled</p>
                                    <p className="text-2xl font-bold">{course.enrolled_students || 0}</p>
                                </div>
                                <Users className="w-8 h-8 text-muted-foreground" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-card border-border">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">Price</p>
                                    <p className="text-2xl font-bold">${course.price.toFixed(2)}</p>
                                </div>
                                <DollarSign className="w-8 h-8 text-muted-foreground" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-card border-border">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">Instructor</p>
                                    <p className="text-lg font-bold">{course.instructor?.name || 'N/A'}</p>
                                </div>
                                <Award className="w-8 h-8 text-muted-foreground" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Tabs for detailed information */}
                <Tabs defaultValue="overview" className="space-y-4">
                    <TabsList className="grid w-full grid-cols-3 bg-muted/50">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="requirements">Requirements</TabsTrigger>
                        <TabsTrigger value="settings">Settings</TabsTrigger>
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview" className="space-y-4">
                        <Card className="bg-card border-border">
                            <CardHeader>
                                <CardTitle>Course Description</CardTitle>
                                <CardDescription>
                                    Detailed description of the course
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {isEditing ? (
                                    <Textarea
                                        value={formData.description || ''}
                                        onChange={(e) => handleInputChange('description', e.target.value)}
                                        placeholder="Enter course description"
                                        rows={5}
                                        className="bg-input border-border"
                                    />
                                ) : (
                                    <p className="text-foreground">{course.description}</p>
                                )}
                            </CardContent>
                        </Card>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Card className="bg-card border-border">
                                <CardHeader>
                                    <CardTitle className="text-lg">Basic Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {isEditing ? (
                                        <>
                                            <div>
                                                <Label>Training Type</Label>
                                                <Select
                                                    value={formData.training_type || TRAINING_TYPE.UNARMED}
                                                    onValueChange={(val) => handleInputChange('training_type', val)}
                                                >
                                                    <SelectTrigger className="bg-input border-border">
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
                                                    onValueChange={(val) => handleInputChange('delivery_mode', val)}
                                                >
                                                    <SelectTrigger className="bg-input border-border">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value={DELIVERY_MODE.ONLINE}>Online</SelectItem>
                                                        <SelectItem value={DELIVERY_MODE.IN_PERSON}>In Person</SelectItem>
                                                        <SelectItem value={DELIVERY_MODE.HYBRID}>Hybrid</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div>
                                                <Label>Duration (hours)</Label>
                                                <Input
                                                    type="number"
                                                    value={formData.duration_hours || 0}
                                                    onChange={(e) => handleInputChange('duration_hours', parseFloat(e.target.value))}
                                                    className="bg-input border-border"
                                                />
                                            </div>
                                        </>
                                    ) : (
                                        <>
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
                                        </>
                                    )}
                                </CardContent>
                            </Card>

                            <Card className="bg-card border-border">
                                <CardHeader>
                                    <CardTitle className="text-lg">Pricing & Location</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {isEditing ? (
                                        <>
                                            <div>
                                                <Label>Price</Label>
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    value={formData.price || 0}
                                                    onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
                                                    className="bg-input border-border"
                                                />
                                            </div>
                                            <div>
                                                <Label>Location (if In-Person)</Label>
                                                <Input
                                                    value={formData.location || ''}
                                                    onChange={(e) => handleInputChange('location', e.target.value)}
                                                    placeholder="e.g., Chicago, IL"
                                                    className="bg-input border-border"
                                                />
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Checkbox
                                                    id="price-negotiable"
                                                    checked={formData.is_price_negotiable || false}
                                                    onCheckedChange={(checked) => handleInputChange('is_price_negotiable', checked)}
                                                />
                                                <Label htmlFor="price-negotiable">Price Negotiable</Label>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div>
                                                <p className="text-sm text-muted-foreground">Price</p>
                                                <p className="text-2xl font-bold">${course.price.toFixed(2)}</p>
                                            </div>
                                            {course.location && (
                                                <div>
                                                    <p className="text-sm text-muted-foreground">Location</p>
                                                    <div className="flex items-center gap-2">
                                                        <MapPin className="w-4 h-4" />
                                                        <p className="font-semibold">{course.location}</p>
                                                    </div>
                                                </div>
                                            )}
                                            {course.is_price_negotiable && (
                                                <Badge variant="outline">Price Negotiable</Badge>
                                            )}
                                        </>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Requirements Tab */}
                    <TabsContent value="requirements" className="space-y-4">
                        <Card className="bg-card border-border">
                            <CardHeader>
                                <CardTitle>Pre-Requirements</CardTitle>
                                <CardDescription>
                                    Prerequisites students must meet before enrolling
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {isEditing ? (
                                    <Textarea
                                        value={formData.pre_requirements?.join('\n') || ''}
                                        onChange={(e) => handleInputChange('pre_requirements', e.target.value.split('\n').filter(r => r.trim()))}
                                        placeholder="Enter one requirement per line"
                                        rows={4}
                                        className="bg-input border-border"
                                    />
                                ) : (
                                    <div className="space-y-2">
                                        {course.pre_requirements?.length > 0 ? (
                                            course.pre_requirements.map((req, idx) => (
                                                <div key={idx} className="flex items-center gap-2 text-foreground">
                                                    <span className="text-primary">•</span>
                                                    {req}
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-muted-foreground">No pre-requirements</p>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card className="bg-card border-border">
                            <CardHeader>
                                <CardTitle>Assessments & Attendance</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {isEditing ? (
                                    <>
                                        <div className="flex items-center gap-2">
                                            <Checkbox
                                                id="requires-exam"
                                                checked={formData.requires_exam || false}
                                                onCheckedChange={(checked) => handleInputChange('requires_exam', checked)}
                                            />
                                            <Label htmlFor="requires-exam">Requires Exam</Label>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Checkbox
                                                id="requires-range"
                                                checked={formData.requires_range || false}
                                                onCheckedChange={(checked) => handleInputChange('requires_range', checked)}
                                            />
                                            <Label htmlFor="requires-range">Requires Range Training</Label>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Checkbox
                                                id="attendance-required"
                                                checked={formData.attendance_required || false}
                                                onCheckedChange={(checked) => handleInputChange('attendance_required', checked)}
                                            />
                                            <Label htmlFor="attendance-required">Attendance Required</Label>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Checkbox
                                                id="requires-id-verification"
                                                checked={formData.requires_id_verification || false}
                                                onCheckedChange={(checked) => handleInputChange('requires_id_verification', checked)}
                                            />
                                            <Label htmlFor="requires-id-verification">Requires ID Verification</Label>
                                        </div>
                                    </>
                                ) : (
                                    <div className="space-y-2">
                                        {course.requires_exam && <div className="text-sm">✓ Requires Exam</div>}
                                        {course.requires_range && <div className="text-sm">✓ Requires Range Training</div>}
                                        {course.attendance_required && <div className="text-sm">✓ Attendance Required</div>}
                                        {course.requires_id_verification && <div className="text-sm">✓ Requires ID Verification</div>}
                                        {!course.requires_exam && !course.requires_range && !course.attendance_required && !course.requires_id_verification && (
                                            <p className="text-muted-foreground">No specific requirements</p>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Settings Tab */}
                    <TabsContent value="settings" className="space-y-4">
                        <Card className="bg-card border-border">
                            <CardHeader>
                                <CardTitle>Course Status</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {isEditing ? (
                                    <div className="flex items-center gap-2">
                                        <Checkbox
                                            id="is-active"
                                            checked={formData.is_active || false}
                                            onCheckedChange={(checked) => handleInputChange('is_active', checked)}
                                        />
                                        <Label htmlFor="is-active">Publish Course</Label>
                                    </div>
                                ) : (
                                    <div>
                                        <Badge variant={course.is_active ? 'default' : 'secondary'} className="text-base">
                                            {course.is_active ? '✓ Published' : '○ Unpublished'}
                                        </Badge>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card className="bg-card border-border">
                            <CardHeader>
                                <CardTitle>Additional Options</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {isEditing ? (
                                    <>
                                        <div className="flex items-center gap-2">
                                            <Checkbox
                                                id="is-refresher"
                                                checked={formData.is_refresher || false}
                                                onCheckedChange={(checked) => handleInputChange('is_refresher', checked)}
                                            />
                                            <Label htmlFor="is-refresher">Is Refresher Course</Label>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Checkbox
                                                id="attendance-enabled"
                                                checked={formData.attendance_enabled || false}
                                                onCheckedChange={(checked) => handleInputChange('attendance_enabled', checked)}
                                            />
                                            <Label htmlFor="attendance-enabled">Enable Attendance Tracking</Label>
                                        </div>
                                        <div>
                                            <Label>Required Hours for Completion</Label>
                                            <Input
                                                type="number"
                                                value={formData.required_hours || 0}
                                                onChange={(e) => handleInputChange('required_hours', parseFloat(e.target.value))}
                                                className="bg-input border-border"
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <div className="space-y-2">
                                        {course.is_refresher && <div className="text-sm">✓ Refresher Course</div>}
                                        {course.attendance_enabled && <div className="text-sm">✓ Attendance Tracking Enabled</div>}
                                        <div className="text-sm">
                                            Required Hours: <span className="font-semibold">{course.required_hours}</span>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card className="bg-card border-border">
                            <CardHeader>
                                <CardTitle className="text-sm">System Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Course ID</span>
                                    <span className="font-mono">{course.id}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">State</span>
                                    <span>{course.state?.name || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Created</span>
                                    <span>{new Date(course.created_at).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Last Updated</span>
                                    <span>{new Date(course.updated_at).toLocaleDateString()}</span>
                                </div>
                                {course.published_at && (
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Published</span>
                                        <span>{new Date(course.published_at).toLocaleDateString()}</span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
