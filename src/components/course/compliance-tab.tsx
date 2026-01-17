'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import type { Course } from '@/stores/courses-store';

interface ComplianceTabProps {
    course: Course;
    formData: Partial<Course>;
    isEditing: boolean;
    onInputChange: (field: keyof Course, value: any) => void;
}

export function ComplianceTab({ course, formData, isEditing, onInputChange }: ComplianceTabProps) {
    return (
        <div className="space-y-6">
            {/* Pre-Requirements */}
            <Card className="bg-card border-border">
                <CardHeader>
                    <CardTitle>Pre-Requirements</CardTitle>
                    <CardDescription>
                        Prerequisites students must meet before enrolling
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {isEditing ? (
                        <div className="space-y-2">
                            <Label htmlFor="pre-requirements">Requirements (one per line)</Label>
                            <Textarea
                                id="pre-requirements"
                                value={formData.pre_requirements?.join('\n') || ''}
                                onChange={(e) => onInputChange('pre_requirements', e.target.value.split('\n').filter(r => r.trim()))}
                                placeholder="Enter one requirement per line&#10;Example:&#10;Must be 18 years or older&#10;Valid government-issued ID&#10;Background check clearance"
                                rows={6}
                                className="bg-input border-border font-mono text-sm"
                            />
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {course.pre_requirements?.length > 0 ? (
                                course.pre_requirements.map((req, idx) => (
                                    <div key={idx} className="flex items-start gap-3 text-foreground">
                                        <span className="text-primary mt-1">•</span>
                                        <span>{req}</span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-muted-foreground">No pre-requirements specified</p>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Assessments & Verification */}
            <Card className="bg-card border-border">
                <CardHeader>
                    <CardTitle>Assessments & Verification</CardTitle>
                    <CardDescription>
                        Required assessments and verification procedures
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {isEditing ? (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="requires-exam"
                                    checked={formData.requires_exam || false}
                                    onCheckedChange={(checked) => onInputChange('requires_exam', checked)}
                                />
                                <Label htmlFor="requires-exam" className="font-normal cursor-pointer">
                                    Requires Final Exam
                                </Label>
                            </div>
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="requires-range"
                                    checked={formData.requires_range || false}
                                    onCheckedChange={(checked) => onInputChange('requires_range', checked)}
                                />
                                <Label htmlFor="requires-range" className="font-normal cursor-pointer">
                                    Requires Range Training
                                </Label>
                            </div>
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="attendance-required"
                                    checked={formData.attendance_required || false}
                                    onCheckedChange={(checked) => onInputChange('attendance_required', checked)}
                                />
                                <Label htmlFor="attendance-required" className="font-normal cursor-pointer">
                                    Attendance Tracking Required
                                </Label>
                            </div>
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="requires-id-verification"
                                    checked={formData.requires_id_verification || false}
                                    onCheckedChange={(checked) => onInputChange('requires_id_verification', checked)}
                                />
                                <Label htmlFor="requires-id-verification" className="font-normal cursor-pointer">
                                    Requires ID Verification
                                </Label>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {course.requires_exam && (
                                <div className="flex items-center gap-2 text-sm">
                                    <span className="text-green-600">✓</span>
                                    <span>Requires Final Exam</span>
                                </div>
                            )}
                            {course.requires_range && (
                                <div className="flex items-center gap-2 text-sm">
                                    <span className="text-green-600">✓</span>
                                    <span>Requires Range Training</span>
                                </div>
                            )}
                            {course.attendance_required && (
                                <div className="flex items-center gap-2 text-sm">
                                    <span className="text-green-600">✓</span>
                                    <span>Attendance Tracking Required</span>
                                </div>
                            )}
                            {course.requires_id_verification && (
                                <div className="flex items-center gap-2 text-sm">
                                    <span className="text-green-600">✓</span>
                                    <span>Requires ID Verification</span>
                                </div>
                            )}
                            {!course.requires_exam && !course.requires_range && !course.attendance_required && !course.requires_id_verification && (
                                <p className="text-muted-foreground">No specific assessment requirements</p>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Course Settings */}
            <Card className="bg-card border-border">
                <CardHeader>
                    <CardTitle>Course Settings</CardTitle>
                    <CardDescription>
                        Additional course configuration options
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {isEditing ? (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="is-refresher"
                                    checked={formData.is_refresher || false}
                                    onCheckedChange={(checked) => onInputChange('is_refresher', checked)}
                                />
                                <Label htmlFor="is-refresher" className="font-normal cursor-pointer">
                                    This is a Refresher Course
                                </Label>
                            </div>
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="attendance-enabled"
                                    checked={formData.attendance_enabled || false}
                                    onCheckedChange={(checked) => onInputChange('attendance_enabled', checked)}
                                />
                                <Label htmlFor="attendance-enabled" className="font-normal cursor-pointer">
                                    Enable Attendance Tracking
                                </Label>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="required-hours">Required Hours for Completion</Label>
                                <Input
                                    id="required-hours"
                                    type="number"
                                    value={formData.required_hours || 0}
                                    onChange={(e) => onInputChange('required_hours', parseFloat(e.target.value))}
                                    className="bg-input border-border max-w-xs"
                                    min="0"
                                    step="0.5"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Minimum hours students must complete to finish the course
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {course.is_refresher && (
                                <div className="flex items-center gap-2 text-sm">
                                    <span className="text-green-600">✓</span>
                                    <span>Refresher Course</span>
                                </div>
                            )}
                            {course.attendance_enabled && (
                                <div className="flex items-center gap-2 text-sm">
                                    <span className="text-green-600">✓</span>
                                    <span>Attendance Tracking Enabled</span>
                                </div>
                            )}
                            <div className="text-sm">
                                <span className="text-muted-foreground">Required Hours: </span>
                                <span className="font-semibold">{course.required_hours || 0} hours</span>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* System Information */}
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
        </div>
    );
}
