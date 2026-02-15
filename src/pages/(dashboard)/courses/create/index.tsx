'use client';

import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Upload as UploadIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
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
import { Checkbox } from '@/components/ui/checkbox';
import { useState, useEffect } from 'react';
import {
    CoursesRepository,
    type CreateCourseInput,
    TRAINING_TYPE,
    DELIVERY_MODE,
} from '@/repositories/courses';
import { StatesRepository } from '@/repositories/states';
import { InstructorsRepository } from '@/repositories/instructors/repo';
import { bunnyUploadService } from '@/api/bunny-upload';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';

export default function CreateCoursePage() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // Create mutation
    const createMutation = useMutation({
        mutationFn: (data: CreateCourseInput) => CoursesRepository.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['courses'] });
            toast.success('Course created successfully');
            navigate('/courses');
        },
        onError: (error: unknown) => {
            console.error('Failed to create course:', error);
            // Extract error message from API response
            const axiosError = error as {
                response?: { data?: { message?: string | string[] } };
            };
            const message = axiosError?.response?.data?.message;
            if (Array.isArray(message)) {
                toast.error(message.join(', '));
            } else if (message) {
                toast.error(message);
            } else {
                toast.error('Failed to create course');
            }
            // Form state is preserved - no reset on error
        },
    });

    // Fetch states with TanStack Query
    const { data: allStates = [] } = useQuery({
        queryKey: ['states'],
        queryFn: () => StatesRepository.getAll(),
    });

    // Fetch instructors with TanStack Query 
    const { data: allInstructors = [] } = useQuery({
        queryKey: ['instructors-course-create'],
        queryFn: () => InstructorsRepository.getAllInstructors(),
        staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    });

    const [step, setStep] = useState(1);
    const [thumbnailPreview, setThumbnailPreview] = useState<
        string | undefined
    >();
    const [preRequirementsText, setPreRequirementsText] = useState('');
    const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);
    const [formData, setFormData] = useState<{
        title: string;
        description: string;
        training_type: TRAINING_TYPE;
        delivery_mode: DELIVERY_MODE;
        duration_hours: number;
        price: number;
        location: string;
        is_active: boolean;
        required_hours: number;
        is_refresher: boolean;
        pre_requirements: string[];
        requires_exam: boolean;
        requires_range: boolean;
        attendance_required: boolean;
        attendance_enabled: boolean;
        requires_id_verification: boolean;
        is_price_negotiable: boolean;
        thumbnail: string | undefined;
        certificate_template: string | undefined;
        state_id: number;
        instructor_id: number | undefined;
    }>({
        title: '',
        description: '',
        training_type: TRAINING_TYPE.UNARMED,
        delivery_mode: DELIVERY_MODE.ONLINE,
        duration_hours: 0,
        price: 0,
        location: '',
        is_active: true,
        required_hours: 0,
        is_refresher: false,
        pre_requirements: [],
        requires_exam: false,
        requires_range: false,
        attendance_required: false,
        attendance_enabled: false,
        requires_id_verification: false,
        is_price_negotiable: false,
        thumbnail: undefined,
        certificate_template: undefined,
        state_id: 1,
        instructor_id: undefined,
    });

    // Set first state as default when states are loaded
    useEffect(() => {
        if (allStates.length > 0 && formData.state_id === 1) {
            setFormData((prev) => ({ ...prev, state_id: allStates[0].id }));
        }
    }, [allStates]);

    const handleInputChange = (
        field: string,
        value: string | number | boolean | string[] | undefined
    ) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleThumbnailUpload = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploadingThumbnail(true);
        try {
            const response = await bunnyUploadService.uploadFile(
                file,
                'course/'
            );
            setFormData((prev) => ({ ...prev, thumbnail: response.url }));
            setThumbnailPreview(response.url);
            toast.success('Thumbnail uploaded successfully');
        } catch (error) {
            console.error('Error uploading thumbnail:', error);
            toast.error('Failed to upload thumbnail');
        } finally {
            setIsUploadingThumbnail(false);
        }
    };

    // Auto-fill requirements based on State and Training Type
    useEffect(() => {
        const selectedState = allStates.find((s) => s.id === formData.state_id);

        if (!selectedState) return;

        let requiredHours = 0;
        let requiresRange = false;

        if (formData.training_type === TRAINING_TYPE.UNARMED) {
            requiredHours = selectedState.unarmed_hours || 20;
            requiresRange = false;
        } else if (formData.training_type === TRAINING_TYPE.ARMED) {
            requiredHours = selectedState.armed_hours || 40;
            requiresRange = selectedState.requires_range_training || false;
        }

        if (requiredHours > 0) {
            setFormData((prev) => ({
                ...prev,
                required_hours: requiredHours,
                duration_hours:
                    prev.duration_hours === 0
                        ? requiredHours
                        : prev.duration_hours,
                requires_range: requiresRange,
            }));
        }
    }, [formData.state_id, formData.training_type, allStates]);

    const handleSubmit = async () => {
        const selectedState = allStates.find((s) => s.id === formData.state_id);
        const stateName = selectedState?.name || '';

        if (!stateName) {
            toast.error('Please select a valid state');
            return;
        }

        // Convert text to array on submit
        const preReqs = preRequirementsText
            .split('\n')
            .map((r) => r.trim())
            .filter((r) => r !== '');

        // Send only the fields the backend expects
        const courseData: CreateCourseInput = {
            title: formData.title,
            description: formData.description,
            duration_hours: formData.duration_hours,
            required_hours: formData.required_hours,
            training_type: formData.training_type,
            delivery_mode: formData.delivery_mode,
            thumbnail: formData.thumbnail,
            price: formData.price,
            state: stateName, // Send state as string
            location: formData.location,
            requires_exam: formData.requires_exam,
            requires_range: formData.requires_range,
            attendance_required: formData.attendance_required,
            attendance_enabled: formData.attendance_enabled,
            requires_id_verification: formData.requires_id_verification,
            is_refresher: formData.is_refresher,
            is_price_negotiable: formData.is_price_negotiable,
            pre_requirements: preReqs,
            certificate_template: formData.certificate_template,
            instructor_id: formData.instructor_id,
        };

        try {
            createMutation.mutate(courseData);
        } catch (error) {
            console.error('Failed to create course:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6 pt-2 md:pt-4">
            <div className="mx-auto max-w-[1600px]">
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                    <button
                        onClick={() => navigate('/courses')}
                        className="p-1 hover:bg-gray-100 rounded-lg transition-colors group"
                        title="Back to Courses"
                    >
                        <ArrowLeft className="w-6 h-6 text-gray-400 group-hover:text-gray-900" />
                    </button>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                            Create New Course
                        </h1>
                        <p className="text-sm text-gray-500">
                            Follow the steps below to create a new training
                            course
                        </p>
                    </div>
                </div>

                {/* Progress Indicator */}
                <div className="mb-6 flex gap-4 justify-center">
                    {[1, 2, 3].map((s) => (
                        <button
                            key={s}
                            onClick={() => setStep(s)}
                            className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold cursor-pointer transition-all ${
                                step === s
                                    ? 'bg-primary text-black scale-110 shadow-md'
                                    : step > s
                                      ? 'bg-primary/20 text-primary border-2 border-primary/30'
                                      : 'bg-muted text-muted-foreground'
                            }`}
                        >
                            {s}
                        </button>
                    ))}
                </div>

                {/* Step 1: Basic Information */}
                {step === 1 && (
                    <Card className="bg-card border-border max-w-full">
                        <CardHeader>
                            <CardTitle>Step 1: Basic Information</CardTitle>
                            <CardDescription>
                                Enter the fundamental details of your course
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <Label>Course Title *</Label>
                                <Input
                                    value={formData.title}
                                    onChange={(e) =>
                                        handleInputChange(
                                            'title',
                                            e.target.value
                                        )
                                    }
                                    placeholder="e.g., Illinois Unarmed 20-Hour"
                                    className="bg-input border-border mt-2"
                                />
                            </div>

                            <div>
                                <Label>Description *</Label>
                                <Textarea
                                    value={formData.description}
                                    onChange={(e) =>
                                        handleInputChange(
                                            'description',
                                            e.target.value
                                        )
                                    }
                                    placeholder="Detailed description of the course content and objectives"
                                    rows={5}
                                    className="bg-input border-border mt-2"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>State *</Label>
                                    <Select
                                        value={String(formData.state_id)}
                                        onValueChange={(val) =>
                                            handleInputChange(
                                                'state_id',
                                                parseInt(val)
                                            )
                                        }
                                    >
                                        <SelectTrigger className="bg-input border-border mt-2">
                                            <SelectValue placeholder="Select State" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {allStates.map((state) => (
                                                <SelectItem
                                                    key={state.id}
                                                    value={String(state.id)}
                                                >
                                                    {state.name} ({state.code})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label>Instructor (Optional)</Label>
                                    <Select
                                        value={
                                            formData.instructor_id
                                                ? String(formData.instructor_id)
                                                : 'unassigned'
                                        }
                                        onValueChange={(val) =>
                                            handleInputChange(
                                                'instructor_id',
                                                val === 'unassigned'
                                                    ? undefined
                                                    : parseInt(val)
                                            )
                                        }
                                    >
                                        <SelectTrigger className="bg-input border-border mt-2">
                                            <SelectValue placeholder="Select Instructor" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="unassigned">
                                                Unassigned
                                            </SelectItem>
                                            {allInstructors.map(
                                                (instructor: any) => (
                                                    <SelectItem
                                                        key={instructor.id}
                                                        value={String(
                                                            instructor.id
                                                        )}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <Avatar className="h-6 w-6">
                                                                <AvatarImage
                                                                    src={
                                                                        instructor.avatar
                                                                    }
                                                                />
                                                                <AvatarFallback>
                                                                    {`${instructor.first_name?.[0]}${instructor.last_name?.[0]}`}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <span>
                                                                {instructor.first_name} {instructor.last_name}
                                                            </span>
                                                        </div>
                                                    </SelectItem>
                                                )
                                            )}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Training Type *</Label>
                                    <Select
                                        value={formData.training_type}
                                        onValueChange={(val) =>
                                            handleInputChange(
                                                'training_type',
                                                val
                                            )
                                        }
                                    >
                                        <SelectTrigger className="bg-input border-border mt-2">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem
                                                value={TRAINING_TYPE.UNARMED}
                                            >
                                                Unarmed
                                            </SelectItem>
                                            <SelectItem
                                                value={TRAINING_TYPE.ARMED}
                                            >
                                                Armed
                                            </SelectItem>
                                            <SelectItem
                                                value={TRAINING_TYPE.REFRESHER}
                                            >
                                                Refresher
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label>Delivery Mode *</Label>
                                    <Select
                                        value={formData.delivery_mode}
                                        onValueChange={(val) =>
                                            handleInputChange(
                                                'delivery_mode',
                                                val
                                            )
                                        }
                                    >
                                        <SelectTrigger className="bg-input border-border mt-2">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem
                                                value={DELIVERY_MODE.ONLINE}
                                            >
                                                Online
                                            </SelectItem>
                                            <SelectItem
                                                value={DELIVERY_MODE.IN_PERSON}
                                            >
                                                In Person
                                            </SelectItem>
                                            <SelectItem
                                                value={DELIVERY_MODE.HYBRID}
                                            >
                                                Hybrid
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Duration (hours) *</Label>
                                    <Input
                                        type="number"
                                        value={formData.duration_hours}
                                        onChange={(e) =>
                                            handleInputChange(
                                                'duration_hours',
                                                parseFloat(e.target.value)
                                            )
                                        }
                                        placeholder="20"
                                        className="bg-input border-border mt-2"
                                    />
                                </div>

                                <div>
                                    <Label>Required Hours *</Label>
                                    <Input
                                        type="number"
                                        value={formData.required_hours}
                                        onChange={(e) =>
                                            handleInputChange(
                                                'required_hours',
                                                parseFloat(e.target.value)
                                            )
                                        }
                                        placeholder="20"
                                        className="bg-input border-border mt-2"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="is-refresher"
                                    checked={formData.is_refresher}
                                    onCheckedChange={(checked) =>
                                        handleInputChange(
                                            'is_refresher',
                                            checked
                                        )
                                    }
                                />
                                <Label htmlFor="is-refresher" className="cursor-pointer">
                                    Is this a Refresher Course?
                                </Label>
                            </div>

                            <div className="flex justify-end gap-4 pt-4">
                                <Button
                                    onClick={() => setStep(2)}
                                    className="bg-primary hover:bg-primary/90"
                                >
                                    Next Step
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Step 2: Pricing & Location */}
                {step === 2 && (
                    <Card className="bg-card border-border max-w-full">
                        <CardHeader>
                            <CardTitle>Step 2: Pricing & Location</CardTitle>
                            <CardDescription>
                                Set pricing details and location information
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Price (USD) *</Label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        value={formData.price}
                                        onChange={(e) =>
                                            handleInputChange(
                                                'price',
                                                parseFloat(e.target.value)
                                            )
                                        }
                                        placeholder="199.00"
                                        className="bg-input border-border mt-2"
                                    />
                                </div>

                                <div>
                                    <Label>Location (if In-Person)</Label>
                                    <Input
                                        value={formData.location}
                                        onChange={(e) =>
                                            handleInputChange(
                                                'location',
                                                e.target.value
                                            )
                                        }
                                        placeholder="e.g., Chicago, IL"
                                        className="bg-input border-border mt-2"
                                    />
                                </div>
                            </div>

                            <div>
                                <Label>Course Thumbnail Image</Label>
                                <div className="mt-2 border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleThumbnailUpload}
                                        disabled={isUploadingThumbnail}
                                        className="hidden"
                                        id="thumbnail-input"
                                    />
                                    <label
                                        htmlFor="thumbnail-input"
                                        className="cursor-pointer block"
                                    >
                                        {thumbnailPreview ? (
                                            <div className="space-y-2">
                                                <img
                                                    src={thumbnailPreview}
                                                    alt="Thumbnail preview"
                                                    className="h-32 w-32 object-cover rounded mx-auto"
                                                />
                                                <p className="text-sm text-muted-foreground">
                                                    Click to change thumbnail
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                <UploadIcon className="w-8 h-8 mx-auto text-muted-foreground" />
                                                <p className="text-sm font-medium">
                                                    {isUploadingThumbnail
                                                        ? 'Uploading...'
                                                        : 'Click to upload thumbnail'}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    PNG, JPG, GIF up to 5MB
                                                </p>
                                            </div>
                                        )}
                                    </label>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="price-negotiable"
                                    checked={formData.is_price_negotiable}
                                    onCheckedChange={(checked) =>
                                        handleInputChange(
                                            'is_price_negotiable',
                                            checked
                                        )
                                    }
                                />
                                <Label htmlFor="price-negotiable" className="cursor-pointer">
                                    Price is Negotiable
                                </Label>
                            </div>

                            <div>
                                <Label>Certificate Template</Label>
                                <Input
                                    value={formData.certificate_template || ''}
                                    onChange={(e) =>
                                        handleInputChange(
                                            'certificate_template',
                                            e.target.value || undefined
                                        )
                                    }
                                    placeholder="e.g., template-name or URL"
                                    className="bg-input border-border mt-2"
                                />
                                <p className="text-xs text-muted-foreground mt-1">
                                    Certificate template identifier for course completion certificates
                                </p>
                            </div>

                            <div>
                                <Label>Pre-Requirements (one per line)</Label>
                                <Textarea
                                    value={preRequirementsText}
                                    onChange={(e) =>
                                        setPreRequirementsText(e.target.value)
                                    }
                                    placeholder="e.g., High School Diploma&#10;Valid ID&#10;Background Check"
                                    rows={4}
                                    className="bg-input border-border mt-2"
                                />
                            </div>

                            <div className="flex justify-between gap-4 pt-4">
                                <Button
                                    variant="outline"
                                    onClick={() => setStep(1)}
                                >
                                    Previous Step
                                </Button>
                                <Button
                                    onClick={() => setStep(3)}
                                    className="bg-primary hover:bg-primary/90"
                                >
                                    Next Step
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Step 3: Requirements & Settings */}
                {step === 3 && (
                    <Card className="bg-card border-border max-w-full">
                        <CardHeader>
                            <CardTitle>
                                Step 3: Requirements & Settings
                            </CardTitle>
                            <CardDescription>
                                Configure course requirements and publish
                                settings
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <Label className="text-base font-semibold mb-4 block">
                                    Course Requirements
                                </Label>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <Checkbox
                                            id="requires-exam"
                                            checked={formData.requires_exam}
                                            onCheckedChange={(checked) =>
                                                handleInputChange('requires_exam', checked)
                                            }
                                        />
                                        <Label htmlFor="requires-exam" className="cursor-pointer">
                                            Requires Exam
                                        </Label>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Checkbox
                                            id="requires-range"
                                            checked={formData.requires_range}
                                            onCheckedChange={(checked) =>
                                                handleInputChange('requires_range', checked)
                                            }
                                        />
                                        <Label htmlFor="requires-range" className="cursor-pointer">
                                            Requires Range Training
                                        </Label>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Checkbox
                                            id="attendance-required"
                                            checked={formData.attendance_required}
                                            onCheckedChange={(checked) =>
                                                handleInputChange('attendance_required', checked)
                                            }
                                        />
                                        <Label htmlFor="attendance-required" className="cursor-pointer">
                                            Attendance Required
                                        </Label>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Checkbox
                                            id="attendance-enabled"
                                            checked={formData.attendance_enabled}
                                            onCheckedChange={(checked) =>
                                                handleInputChange('attendance_enabled', checked)
                                            }
                                        />
                                        <Label htmlFor="attendance-enabled" className="cursor-pointer">
                                            Enable Attendance Tracking
                                        </Label>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Checkbox
                                            id="requires-id-verification"
                                            checked={formData.requires_id_verification}
                                            onCheckedChange={(checked) =>
                                                handleInputChange('requires_id_verification', checked)
                                            }
                                        />
                                        <Label htmlFor="requires-id-verification" className="cursor-pointer">
                                            Requires ID Verification
                                        </Label>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-border pt-6">
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        id="is-active"
                                        checked={formData.is_active}
                                        onCheckedChange={(checked) =>
                                            handleInputChange(
                                                'is_active',
                                                checked
                                            )
                                        }
                                    />
                                    <div>
                                        <Label
                                            htmlFor="is-active"
                                            className="text-base font-semibold cursor-pointer"
                                        >
                                            Publish Course
                                        </Label>
                                        <p className="text-sm text-muted-foreground mt-0.5">Make it available to students</p>
                                    </div>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Unpublished courses will not be visible to
                                    students unless they have direct access
                                </p>
                            </div>

                            <div className="flex justify-between gap-4 pt-4">
                                <Button
                                    variant="outline"
                                    onClick={() => setStep(2)}
                                >
                                    Previous Step
                                </Button>
                                <Button
                                    onClick={handleSubmit}
                                    className="bg-primary hover:bg-primary/90 px-8"
                                    disabled={
                                        !formData.title || !formData.description
                                    }
                                >
                                    Create Course
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
