'use client';

import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Trash2, FileText, BookOpen, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCoursesStore, type Course } from '@/stores/courses-store';
import { useState } from 'react';
import { DeleteConfirmationDialog } from '@/components/shared/delete-confirmation-dialog';
import { GeneralInformationTab } from '@/components/course/general-information-tab';
import { CurriculumTab } from '@/components/course/curriculum-tab';
import { ComplianceTab } from '@/components/course/compliance-tab';

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
                description="Are you sure you want to delete this course? This will remove all associated modules, lessons, and student enrollments."
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
                        className="gap-2"
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

                {/* Course Title */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground mb-2">
                        {course.title}
                    </h1>
                    <p className="text-muted-foreground">
                        Manage and organize modules and lessons for your course.
                    </p>
                </div>

                {/* Tabs */}
                <Tabs defaultValue="general" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-3 bg-muted/50">
                        <TabsTrigger value="general" className="gap-2">
                            <FileText className="w-4 h-4" />
                            General Information
                        </TabsTrigger>
                        <TabsTrigger value="curriculum" className="gap-2">
                            <BookOpen className="w-4 h-4" />
                            Curriculum
                        </TabsTrigger>
                        <TabsTrigger value="compliance" className="gap-2">
                            <Shield className="w-4 h-4" />
                            Compliance
                        </TabsTrigger>
                    </TabsList>

                    {/* General Information Tab */}
                    <TabsContent value="general">
                        <GeneralInformationTab
                            course={course}
                            formData={formData}
                            isEditing={isEditing}
                            onInputChange={handleInputChange}
                        />
                    </TabsContent>

                    {/* Curriculum Tab */}
                    <TabsContent value="curriculum">
                        <CurriculumTab courseId={course.id} />
                    </TabsContent>

                    {/* Compliance Tab */}
                    <TabsContent value="compliance">
                        <ComplianceTab
                            course={course}
                            formData={formData}
                            isEditing={isEditing}
                            onInputChange={handleInputChange}
                        />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
