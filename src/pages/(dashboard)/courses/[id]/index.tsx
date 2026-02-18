'use client';

import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Save, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CoursesRepository, type Course, type UpdateCourseInput } from '@/repositories/courses';
import { useState, useEffect } from 'react';
import { DeleteConfirmationDialog } from '@/components/shared/delete-confirmation-dialog';
import { GeneralInformationTab } from '@/components/course/general-information-tab';
import { CurriculumTab } from '@/components/course/curriculum-tab';
import { ComplianceTab } from '@/components/course/compliance-tab';
import { toast } from 'sonner';

export default function CourseDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [searchParams, setSearchParams] = useSearchParams();

    // Get initial tab from URL or default to 'general'
    const initialTab = searchParams.get('tab') || 'general';
    const [activeTab, setActiveTab] = useState(initialTab);

    const [isEditing, setIsEditing] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [formData, setFormData] = useState<Partial<Course>>({});

    // Fetch course with TanStack Query
    const { data: course, isLoading } = useQuery({
        queryKey: ['course', id],
        queryFn: async () => {
            const courseData = await CoursesRepository.getById(Number(id));
            return courseData;
        },
        enabled: !!id,
    });

    // Update mutation
    const updateMutation = useMutation({
        mutationFn: (data: UpdateCourseInput) => CoursesRepository.update(Number(id), data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['course', id] });
            queryClient.invalidateQueries({ queryKey: ['courses'] });
            toast.success('Course updated successfully');
            setIsEditing(false);
        },
        onError: (error) => {
            console.error('Failed to update course:', error);
            toast.error('Failed to update course');
        },
    });

    // Delete mutation
    const deleteMutation = useMutation({
        mutationFn: () => CoursesRepository.permanentDelete(Number(id)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['courses'] });
            toast.success('Course deleted successfully');
            navigate('/courses');
        },
        onError: (error) => {
            console.error('Failed to delete course:', error);
            toast.error('Failed to delete course');
        },
    });

    useEffect(() => {
        if (course && !isEditing) {
            const courseData = { ...course };
            // Set instructor_id to the User ID (not Instructor table PK)
            // so it matches dropdown option values from getAllInstructors
            if (course.instructor?.user_id) {
                courseData.instructor_id = course.instructor.user_id;
            } else if (course.instructor?.user?.id) {
                courseData.instructor_id = course.instructor.user.id;
            }
            setFormData(courseData);
        }
    }, [course, isEditing]);

    if (isLoading) {
        return (
            <div className="flex-1 bg-background p-8 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!course) {
        return (
            <div className="flex-1 bg-background p-8">
                <div className="text-center">
                    <p className="text-muted-foreground">Course not found</p>
                    <Button
                        variant="link"
                        onClick={() => navigate('/courses')}
                        className="mt-4"
                    >
                        Back to Courses
                    </Button>
                </div>
            </div>
        );
    }

    const handleSave = async () => {
        if (!course) return;
        
        // Build update data — only send scalar fields the backend expects.
        // Never send nested relations (instructor, state object, lessons, etc.)
        const updateData: UpdateCourseInput = {};
        
        if (formData.title !== undefined) updateData.title = formData.title;
        if (formData.description !== undefined) updateData.description = formData.description;
        if (formData.duration_hours !== undefined) updateData.duration_hours = Number(formData.duration_hours);
        if (formData.required_hours !== undefined) updateData.required_hours = Number(formData.required_hours);
        if (formData.training_type !== undefined) updateData.training_type = formData.training_type;
        if (formData.delivery_mode !== undefined) updateData.delivery_mode = formData.delivery_mode;
        if (formData.thumbnail !== undefined) updateData.thumbnail = formData.thumbnail;
        if (formData.price !== undefined) updateData.price = Number(formData.price);
        if (formData.location !== undefined) updateData.location = formData.location;
        if (formData.requires_exam !== undefined) updateData.requires_exam = formData.requires_exam;
        if (formData.requires_range !== undefined) updateData.requires_range = formData.requires_range;
        if (formData.attendance_required !== undefined) updateData.attendance_required = formData.attendance_required;
        if (formData.attendance_enabled !== undefined) updateData.attendance_enabled = formData.attendance_enabled;
        if (formData.requires_id_verification !== undefined) updateData.requires_id_verification = formData.requires_id_verification;
        if (formData.is_refresher !== undefined) updateData.is_refresher = formData.is_refresher;
        if (formData.is_price_negotiable !== undefined) updateData.is_price_negotiable = formData.is_price_negotiable;
        if (formData.pre_requirements !== undefined) updateData.pre_requirements = formData.pre_requirements.filter(r => r.trim() !== '');
        if (formData.certificate_template !== undefined) updateData.certificate_template = formData.certificate_template;
        if (formData.instructor_id !== undefined) updateData.instructor_id = formData.instructor_id;
        if (formData.is_active !== undefined) updateData.is_active = formData.is_active;
        
        // Send state_id (integer FK). If the user changed state via the select,
        // formData.state_id is already set. Convert state object → state_id if needed.
        if (formData.state_id !== undefined) {
            updateData.state_id = Number(formData.state_id);
        } else if (formData.state && typeof formData.state === 'object' && formData.state.id) {
            updateData.state_id = formData.state.id;
        }
        
        // Don't send 'state' as a string — backend uses state_id FK
        delete (updateData as any).state;
        
        updateMutation.mutate(updateData);
    };

    const handleDeleteClick = () => {
        setIsDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        deleteMutation.mutate();
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
                description="WARNING: This will PERMANENTLY delete the course from the database. This action is irreversible and will remove all modules, lessons, sessions, quizzes, and student records forever."
                itemType="Course"
                itemName={course.title}
            />

            <div className="p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/courses')}
                            className="p-2 hover:bg-accent rounded-full transition-colors"
                        >
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold">
                                {isEditing ? (formData.title || course.title) : course.title}
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Manage and organize modules and lessons for your course.
                            </p>
                        </div>
                    </div>

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

                {/* Tabs Container */}
                <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                    <Tabs value={activeTab} onValueChange={(value) => {
                        setActiveTab(value);
                        setSearchParams({ tab: value });
                    }} className="w-full">
                        <TabsList className="flex w-full justify-start bg-muted/30 h-14 p-0 border-b border-border rounded-none gap-8 px-8">
                            <TabsTrigger
                                value="general"
                                className="group gap-2 h-full bg-transparent data-[state=active]:bg-transparent data-[state=active]:text-black text-black transition-all rounded-none !border-x-0 !border-t-0 border-b-2 border-transparent data-[state=active]:border-primary px-4 !shadow-none outline-none ring-0"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-colors text-black group-data-[state=active]:text-primary">
                                    <path opacity="0.2" d="M3 7.5L12 12.75L21 7.5L12 2.25L3 7.5Z" fill="currentColor" />
                                    <path d="M3 16.5L12 21.75L21 16.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M3 12L12 17.25L21 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M3 7.5L12 12.75L21 7.5L12 2.25L3 7.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                General Information
                            </TabsTrigger>
                            <TabsTrigger
                                value="curriculum"
                                className="group gap-2 h-full bg-transparent data-[state=active]:bg-transparent data-[state=active]:text-black text-black transition-all rounded-none !border-x-0 !border-t-0 border-b-2 border-transparent data-[state=active]:border-primary px-4 !shadow-none outline-none ring-0"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-colors text-black group-data-[state=active]:text-primary">
                                    <path opacity="0.2" d="M19.5 4.5H4.5C4.10218 4.5 3.72065 4.65804 3.43934 4.93934C3.15804 5.22065 3 5.60218 3 6V16.5C3 16.8978 3.15804 17.2794 3.43934 17.5607C3.72065 17.842 4.10218 18 4.5 18H19.5C19.8978 18 20.2794 17.842 20.5607 17.5607C20.842 17.2794 21 16.8978 21 16.5V6C21 5.60218 20.842 5.22065 20.5607 4.93934C20.2794 4.65804 19.8978 4.5 19.5 4.5ZM10.5 14.25V8.25L15 11.25L10.5 14.25Z" fill="currentColor" />
                                    <path d="M4.5 18L19.5 18C20.3284 18 21 17.3284 21 16.5V6C21 5.17157 20.3284 4.5 19.5 4.5L4.5 4.5C3.67157 4.5 3 5.17157 3 6V16.5C3 17.3284 3.67157 18 4.5 18Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M15 21H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M15 11.25L10.5 8.25V14.25L15 11.25Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Curriculum
                            </TabsTrigger>
                            <TabsTrigger
                                value="compliance"
                                className="group gap-2 h-full bg-transparent data-[state=active]:bg-transparent data-[state=active]:text-black text-black transition-all rounded-none !border-x-0 !border-t-0 border-b-2 border-transparent data-[state=active]:border-primary px-4 !shadow-none outline-none ring-0"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-colors text-black group-data-[state=active]:text-primary">
                                    <path opacity="0.2" d="M15 3.75C15.488 4.39855 15.7512 5.18842 15.75 6V6.75H8.25V6C8.24877 5.18842 8.51205 4.39855 8.99995 3.75H5.25C5.15151 3.75 5.05398 3.76939 4.96298 3.80708C4.87199 3.84477 4.78931 3.90002 4.71966 3.96966C4.65002 4.03931 4.59477 4.12199 4.55708 4.21298C4.51939 4.30398 4.5 4.40151 4.5 4.5V20.25C4.5 20.3485 4.51939 20.446 4.55708 20.537C4.59477 20.628 4.65002 20.7107 4.71966 20.7803C4.78931 20.85 4.87199 20.9052 4.96298 20.9429C5.05398 20.9806 5.15151 21 5.25 21H18.75C18.8485 21 18.946 20.9806 19.037 20.9429C19.128 20.9052 19.2107 20.85 19.2803 20.7803C19.35 20.7107 19.4052 20.628 19.4429 20.537C19.4806 20.446 19.5 20.3485 19.5 20.25V4.5C19.5 4.40151 19.4806 4.30398 19.4429 4.21298C19.4052 4.12199 19.35 4.03931 19.2803 3.96966C19.2107 3.90002 19.128 3.84477 19.037 3.80708C18.946 3.76939 18.8485 3.75 18.75 3.75H15Z" fill="currentColor" />
                                    <path d="M9 14.25H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M9 11.25H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M15.0002 3.75H18.75C18.9489 3.75 19.1397 3.82902 19.2803 3.96967C19.421 4.11032 19.5 4.30109 19.5 4.5V20.25C19.5 20.4489 19.421 20.6397 19.2803 20.7803C19.1397 20.921 18.9489 21 18.75 21H5.25C5.05109 21 4.86032 20.921 4.71967 20.7803C4.57902 20.6397 4.5 20.4489 4.5 20.25V4.5C4.5 4.30109 4.57902 4.11032 4.71967 3.96967C4.86032 3.82902 5.05109 3.75 5.25 3.75H8.9998" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M8.25 6.75V6C8.25 5.00544 8.64509 4.05161 9.34835 3.34835C10.0516 2.64509 11.0054 2.25 12 2.25C12.9946 2.25 13.9484 2.64509 14.6517 3.34835C15.3549 4.05161 15.75 5.00544 15.75 6V6.75H8.25Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Compliance
                            </TabsTrigger>
                        </TabsList>

                        <div className="p-8">
                            <TabsContent value="general" className="mt-0 outline-none">
                                <GeneralInformationTab
                                    course={course}
                                    formData={formData}
                                    isEditing={isEditing}
                                    onInputChange={handleInputChange}
                                />
                            </TabsContent>

                            <TabsContent value="curriculum" className="mt-0 outline-none">
                                <CurriculumTab courseId={course.id} />
                            </TabsContent>

                            <TabsContent value="compliance" className="mt-0 outline-none">
                                <ComplianceTab
                                    course={course}
                                    formData={formData}
                                    isEditing={isEditing}
                                    onInputChange={handleInputChange}
                                />
                            </TabsContent>
                        </div>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}
