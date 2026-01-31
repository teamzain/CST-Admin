import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { StatesRepository } from '@/repositories/states';
import { useStatesStore, type State } from '@/stores/states-store';
import type { CreateStateInput } from '@/repositories/states';

export default function StateFormPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { addState, updateState, getStateById } = useStatesStore();

    const [isLoading, setIsLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<CreateStateInput>({
        name: '',
        code: '',
        unarmed_hours: 20,
        armed_hours: 40,
        unarmed_passing_score: 70,
        armed_passing_score: 80,
        requires_range_training: false,
        requires_range_pass: false,
        certificate_template: '',
        certificate_validity_years: 1,
        is_active: true,
        is_seat_time_enabled: true,
        id_check_frequency: 3,
    });

    // Load state data if editing
    useEffect(() => {
        if (id) {
            setIsEditing(true);
            const existingState = getStateById(Number(id));
            if (existingState) {
                setFormData({
                    name: existingState.name,
                    code: existingState.code,
                    unarmed_hours: existingState.unarmed_hours,
                    armed_hours: existingState.armed_hours,
                    unarmed_passing_score: existingState.unarmed_passing_score,
                    armed_passing_score: existingState.armed_passing_score,
                    requires_range_training:
                        existingState.requires_range_training,
                    requires_range_pass: existingState.requires_range_pass,
                    certificate_template:
                        existingState.certificate_template || '',
                    certificate_validity_years:
                        existingState.certificate_validity_years || 1,
                    is_active: existingState.is_active,
                    is_seat_time_enabled: existingState.is_seat_time_enabled,
                    id_check_frequency: existingState.id_check_frequency,
                });
            }
        }
    }, [id, getStateById]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'number' ? Number(value) : value,
        }));
    };

    const handleCheckboxChange = (name: string) => {
        setFormData((prev) => ({
            ...prev,
            [name]: !prev[name as keyof CreateStateInput],
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!formData.name.trim()) {
            toast.error('State name is required');
            return;
        }
        if (!formData.code.trim()) {
            toast.error('State code is required');
            return;
        }
        if (formData.code.length !== 2) {
            toast.error('State code must be exactly 2 characters');
            return;
        }
        if (formData.unarmed_hours < 0) {
            toast.error('Unarmed hours must be >= 0');
            return;
        }
        if (formData.armed_hours < 0) {
            toast.error('Armed hours must be >= 0');
            return;
        }
        if (
            formData.unarmed_passing_score < 0 ||
            formData.unarmed_passing_score > 100
        ) {
            toast.error('Unarmed passing score must be between 0 and 100');
            return;
        }
        if (
            formData.armed_passing_score < 0 ||
            formData.armed_passing_score > 100
        ) {
            toast.error('Armed passing score must be between 0 and 100');
            return;
        }

        setIsLoading(true);
        try {
            if (isEditing && id) {
                const response = await StatesRepository.update(
                    Number(id),
                    formData
                );
                updateState(Number(id), response);
                toast.success('State updated successfully');
            } else {
                const response = await StatesRepository.create(formData);
                addState(response as State);
                toast.success('State created successfully');
            }
            navigate('/states');
        } catch (error) {
            console.error('Error saving state:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6 pt-2 md:pt-4">
            <div className="mx-auto max-w-[1600px]">
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                    <button
                        onClick={() => navigate('/states')}
                        className="p-1 hover:bg-gray-100 rounded-lg transition-colors group"
                        title="Back to States"
                    >
                        <ArrowLeft className="w-6 h-6 text-gray-400 group-hover:text-gray-900" />
                    </button>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                            {isEditing ? 'Edit State' : 'Create New State'}
                        </h1>
                        <p className="text-sm text-gray-500">
                            {isEditing
                                ? 'Update state compliance requirements'
                                : 'Configure state training requirements'}
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Basic Information */}
                    <Card className="mb-6 bg-white border-gray-200 shadow-sm">
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                            <CardDescription>
                                State name and identification
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="name">State Name *</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="e.g., Illinois"
                                        className="mt-1"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="code">State Code *</Label>
                                    <Input
                                        id="code"
                                        name="code"
                                        value={formData.code}
                                        onChange={handleChange}
                                        placeholder="e.g., IL"
                                        maxLength={2}
                                        className="mt-1 uppercase"
                                        required
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Training Requirements */}
                    <Card className="mb-6 bg-white border-gray-200 shadow-sm">
                        <CardHeader>
                            <CardTitle>Training Requirements</CardTitle>
                            <CardDescription>
                                Hours required for each training type
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="unarmed_hours">
                                        Unarmed Training Hours *
                                    </Label>
                                    <Input
                                        id="unarmed_hours"
                                        name="unarmed_hours"
                                        type="number"
                                        value={formData.unarmed_hours}
                                        onChange={handleChange}
                                        className="mt-1"
                                        required
                                        min="0"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="armed_hours">
                                        Armed Training Hours *
                                    </Label>
                                    <Input
                                        id="armed_hours"
                                        name="armed_hours"
                                        type="number"
                                        value={formData.armed_hours}
                                        onChange={handleChange}
                                        className="mt-1"
                                        required
                                        min="0"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Passing Scores */}
                    <Card className="mb-6 bg-white border-gray-200 shadow-sm">
                        <CardHeader>
                            <CardTitle>Compliance Passing Scores</CardTitle>
                            <CardDescription>
                                Minimum passing percentage for exams
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="unarmed_passing_score">
                                        Unarmed Passing Score (%) *
                                    </Label>
                                    <Input
                                        id="unarmed_passing_score"
                                        name="unarmed_passing_score"
                                        type="number"
                                        value={formData.unarmed_passing_score}
                                        onChange={handleChange}
                                        className="mt-1"
                                        required
                                        min="0"
                                        max="100"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="armed_passing_score">
                                        Armed Passing Score (%) *
                                    </Label>
                                    <Input
                                        id="armed_passing_score"
                                        name="armed_passing_score"
                                        type="number"
                                        value={formData.armed_passing_score}
                                        onChange={handleChange}
                                        className="mt-1"
                                        required
                                        min="0"
                                        max="100"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Range & Requirements */}
                    <Card className="mb-6 bg-white border-gray-200 shadow-sm">
                        <CardHeader>
                            <CardTitle>Range & Training Requirements</CardTitle>
                            <CardDescription>
                                Additional compliance requirements
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="requires_range_training"
                                    checked={formData.requires_range_training}
                                    onCheckedChange={() =>
                                        handleCheckboxChange(
                                            'requires_range_training'
                                        )
                                    }
                                />
                                <Label
                                    htmlFor="requires_range_training"
                                    className="cursor-pointer"
                                >
                                    Requires Range Training
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="requires_range_pass"
                                    checked={formData.requires_range_pass}
                                    onCheckedChange={() =>
                                        handleCheckboxChange(
                                            'requires_range_pass'
                                        )
                                    }
                                />
                                <Label
                                    htmlFor="requires_range_pass"
                                    className="cursor-pointer"
                                >
                                    Requires Range Pass
                                </Label>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Certificate Configuration */}
                    <Card className="mb-6 bg-white border-gray-200 shadow-sm">
                        <CardHeader>
                            <CardTitle>Certificate Configuration</CardTitle>
                            <CardDescription>
                                Certificate template and validity
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="certificate_template">
                                        Certificate Template
                                    </Label>
                                    <Input
                                        id="certificate_template"
                                        name="certificate_template"
                                        value={formData.certificate_template}
                                        onChange={handleChange}
                                        placeholder="e.g., standard_il_v1"
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="certificate_validity_years">
                                        Certificate Validity (Years)
                                    </Label>
                                    <Input
                                        id="certificate_validity_years"
                                        name="certificate_validity_years"
                                        type="number"
                                        value={
                                            formData.certificate_validity_years
                                        }
                                        onChange={handleChange}
                                        className="mt-1"
                                        min="1"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Seat Time & Identity Check */}
                    <Card className="mb-6 bg-white border-gray-200 shadow-sm">
                        <CardHeader>
                            <CardTitle>Course Integrity</CardTitle>
                            <CardDescription>
                                Control seat time requirements and identity
                                verification
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center space-x-2 p-3 rounded-lg border border-gray-200">
                                <Checkbox
                                    id="is_seat_time_enabled"
                                    checked={formData.is_seat_time_enabled}
                                    onCheckedChange={() =>
                                        handleCheckboxChange(
                                            'is_seat_time_enabled'
                                        )
                                    }
                                />
                                <div className="flex-1">
                                    <Label
                                        htmlFor="is_seat_time_enabled"
                                        className="cursor-pointer font-medium"
                                    >
                                        Enable Seat Time Requirement
                                    </Label>
                                    <p className="text-xs text-gray-600 mt-1">
                                        Enforce minimum time spent on course
                                        (prevents finishing 20-hour course in 5
                                        minutes)
                                    </p>
                                </div>
                            </div>

                            <div>
                                <Label
                                    htmlFor="id_check_frequency"
                                    className="block mb-2"
                                >
                                    Identity Check Frequency (Units)
                                </Label>
                                <Input
                                    id="id_check_frequency"
                                    name="id_check_frequency"
                                    type="number"
                                    value={formData.id_check_frequency}
                                    onChange={handleChange}
                                    placeholder="e.g., 3"
                                    className="mt-1"
                                    min="1"
                                    max="100"
                                    required
                                />
                                <p className="text-xs text-gray-600 mt-2">
                                    Ask for selfie/ID check every N units (e.g.,
                                    3 = check every 3 units)
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Status */}
                    <Card className="mb-6 bg-white border-gray-200 shadow-sm">
                        <CardHeader>
                            <CardTitle>Status</CardTitle>
                            <CardDescription>
                                Publish or save as draft
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="is_active"
                                    checked={formData.is_active}
                                    onCheckedChange={() =>
                                        handleCheckboxChange('is_active')
                                    }
                                />
                                <Label
                                    htmlFor="is_active"
                                    className="cursor-pointer"
                                >
                                    Active / Published
                                </Label>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Form Actions */}
                    <div className="flex gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => navigate('/states')}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 bg-primary text-black hover:bg-primary/90"
                        >
                            {isLoading
                                ? 'Saving...'
                                : isEditing
                                  ? 'Update State'
                                  : 'Create State'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
