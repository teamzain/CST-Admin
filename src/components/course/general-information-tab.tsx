'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, DollarSign, MapPin, Award } from 'lucide-react';
import { TRAINING_TYPE, DELIVERY_MODE, type Course } from '@/stores/courses-store';

interface GeneralInformationTabProps {
    course: Course;
    formData: Partial<Course>;
    isEditing: boolean;
    onInputChange: (field: keyof Course, value: any) => void;
}

export function GeneralInformationTab({ course, formData, isEditing, onInputChange }: GeneralInformationTabProps) {
    return (
        <div className="space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="bg-muted/30 p-6 rounded-xl border border-border/50">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Duration</p>
                            <p className="text-2xl font-bold">{course.duration_hours}h</p>
                        </div>
                        <Calendar className="w-8 h-8 text-muted-foreground/50" />
                    </div>
                </div>

                <div className="bg-muted/30 p-6 rounded-xl border border-border/50">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Enrolled</p>
                            <p className="text-2xl font-bold">{course.enrolled_students || 0}</p>
                        </div>
                        <Users className="w-8 h-8 text-muted-foreground/50" />
                    </div>
                </div>

                <div className="bg-muted/30 p-6 rounded-xl border border-border/50">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Price</p>
                            <p className="text-2xl font-bold">${course.price.toFixed(2)}</p>
                        </div>
                        <DollarSign className="w-8 h-8 text-muted-foreground/50" />
                    </div>
                </div>

                <div className="bg-muted/30 p-6 rounded-xl border border-border/50">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Instructor</p>
                            <p className="text-lg font-bold truncate">{course.instructor?.name || 'N/A'}</p>
                        </div>
                        <Award className="w-8 h-8 text-muted-foreground/50" />
                    </div>
                </div>
            </div>

            {/* Course Description */}
            <div className="space-y-4">
                <div>
                    <h3 className="text-lg font-semibold">Course Description</h3>
                    <p className="text-sm text-muted-foreground">Detailed description of the course</p>
                </div>
                <div className="bg-muted/10 p-6 rounded-xl border border-border/50">
                    {isEditing ? (
                        <Textarea
                            value={formData.description || ''}
                            onChange={(e) => onInputChange('description', e.target.value)}
                            placeholder="Enter course description"
                            rows={5}
                            className="bg-background border-border"
                        />
                    ) : (
                        <p className="text-foreground leading-relaxed">{course.description}</p>
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
                                        <Label>Thumbnail URL</Label>
                                        <Input
                                            value={formData.thumbnail || ''}
                                            onChange={(e) => onInputChange('thumbnail', e.target.value)}
                                            placeholder="https://..."
                                            className="bg-background border-border"
                                        />
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="grid grid-cols-2 gap-y-4">
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
