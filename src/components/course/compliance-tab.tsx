'use client';

import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import type { Course } from '@/repositories/courses';

interface ComplianceTabProps {
    course: Course;
    formData: Partial<Course>;
    isEditing: boolean;
    onInputChange: (field: keyof Course, value: any) => void;
}

export function ComplianceTab({ course, formData, isEditing, onInputChange }: ComplianceTabProps) {
    return (
        <div className="space-y-8">
            {/* Pre-Requirements */}
            <div className="space-y-4">
                <div>
                    <h3 className="text-lg font-semibold">Pre-Requirements</h3>
                    <p className="text-sm text-muted-foreground">Prerequisites students must meet before enrolling</p>
                </div>
                <div className="bg-muted/10 p-6 rounded-xl border border-border/50">
                    {isEditing ? (
                        <div className="space-y-2">
                            <Label htmlFor="pre-requirements">Requirements (one per line)</Label>
                            <Textarea
                                id="pre-requirements"
                                value={formData.pre_requirements?.join('\n') || ''}
                                onChange={(e) => onInputChange('pre_requirements', e.target.value.split('\n').filter(r => r.trim()))}
                                placeholder="Enter one requirement per line&#10;Example:&#10;Must be 18 years or older&#10;Valid government-issued ID&#10;Background check clearance"
                                rows={6}
                                className="bg-background border-border font-mono text-sm"
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
                </div>
            </div>

            {/* Assessments & Verification */}
            <div className="space-y-4">
                <div>
                    <h3 className="text-lg font-semibold">Assessments & Verification</h3>
                    <p className="text-sm text-muted-foreground">Required assessments and verification procedures</p>
                </div>
                <div className="bg-muted/10 p-6 rounded-xl border border-border/50">
                    {isEditing ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                </div>
            </div>

            {/* Course Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Course Settings</h3>
                    <div className="bg-muted/10 p-6 rounded-xl border border-border/50 space-y-4">
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
                                        className="bg-background border-border max-w-xs"
                                        min="0"
                                        step="0.5"
                                    />
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
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">System Information</h3>
                    <div className="bg-muted/10 p-6 rounded-xl border border-border/50 space-y-2 text-sm">
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
                    </div>
                </div>
            </div>
        </div>
    );
}
