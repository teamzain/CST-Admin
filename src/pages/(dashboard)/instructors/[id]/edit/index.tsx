'use client';

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { InstructorsRepository } from '@/repositories/instructors/repo';
import { StatesRepository } from '@/repositories/states';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SignatureUpload } from '@/components/shared/signature-upload';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DatePickerInput } from '@/components/shared/date-picker';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';

export default function EditInstructorPage() {
    const router = useNavigate();
    const params = useParams();
    const queryClient = useQueryClient();
    const instructorId = Number(params.id);

    // Fetch instructor data
    const { data: instructor, isLoading: isLoadingInstructor } = useQuery({
        queryKey: ['instructor', instructorId],
        queryFn: () => InstructorsRepository.getInstructorById(instructorId),
        enabled: !!instructorId,
    });

    // Fetch states dynamically
    const { data: allStates = [] } = useQuery({
        queryKey: ['states'],
        queryFn: () => StatesRepository.getAll(),
    });

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        stateId: '',
        licenseNo: '',
        licenseExpiry: '',
        signature: null as string | null,
        status: 'ACTIVE',
    });

    // Pre-populate form when instructor data loads
    useEffect(() => {
        if (instructor) {
            const license = instructor.instructorLicenses?.[0] || instructor.licenses?.[0];
            setFormData({
                firstName: instructor.first_name || '',
                lastName: instructor.last_name || '',
                email: instructor.email || '',
                phone: instructor.phone || '',
                stateId: String(instructor.state_id || license?.state_id || ''),
                licenseNo: instructor.license_no || license?.license_no || '',
                licenseExpiry: instructor.license_expiry
                    ? new Date(instructor.license_expiry as string).toISOString().split('T')[0]
                    : license?.license_expiry
                    ? new Date(license.license_expiry as string).toISOString().split('T')[0]
                    : '',
                signature: instructor.signature || license?.signature || null,
                status: String(instructor.status || 'ACTIVE').toUpperCase(),
            });
        }
    }, [instructor]);

    const mutation = useMutation({
        mutationFn: async (data: typeof formData) => {
            const payload: Record<string, any> = {
                first_name: data.firstName,
                last_name: data.lastName,
                email: data.email,
                phone: data.phone || undefined,
                state_id: parseInt(data.stateId),
                license_no: data.licenseNo || undefined,
                license_expiry: data.licenseExpiry || undefined,
                signature: data.signature ?? null,
                status: data.status,
            };
            console.log('📤 Sending payload to backend:', JSON.stringify(payload, null, 2));
            return InstructorsRepository.updateInstructor(instructorId, payload);
        },
        onSuccess: async () => {
            toast.success('Instructor updated successfully');
            // Refetch to immediately get updated data from DB
            await queryClient.refetchQueries({ queryKey: ['instructor', instructorId] });
            await queryClient.refetchQueries({ queryKey: ['instructors'] });
            router(`/instructors/${instructorId}`);
        },
        onError: (error: any) => {
            console.error('Error updating instructor:', error);
            toast.error(error.message || 'Failed to update instructor');
        },
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate(formData);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    if (isLoadingInstructor) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <Button
                        variant="ghost"
                        onClick={() => router(`/instructors/${instructorId}`)}
                        className="mb-4 gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Instructor
                    </Button>
                    <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
                        Edit Instructor
                    </h1>
                    <p className="text-sm text-gray-600 mt-1">
                        Update instructor details below
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Instructor Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Personal Information */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">First Name *</Label>
                                    <Input
                                        id="firstName"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Last Name *</Label>
                                    <Input
                                        id="lastName"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email *</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone</Label>
                                    <Input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        value={formData.phone}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            {/* Status */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="status">Status</Label>
                                    <Select
                                        value={formData.status}
                                        onValueChange={(value) => handleSelectChange('status', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ACTIVE">Active</SelectItem>
                                            <SelectItem value="INACTIVE">Inactive</SelectItem>
                                            <SelectItem value="EXPIRED">Expired</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* License Information */}
                            <div className="pt-4 border-t">
                                <h3 className="text-lg font-medium mb-4">License Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="stateId">State *</Label>
                                        <Select
                                            value={formData.stateId}
                                            onValueChange={(value) => handleSelectChange('stateId', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select state" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {allStates.map((state: any) => (
                                                    <SelectItem key={state.id} value={state.id.toString()}>
                                                        {state.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="licenseNo">License Number</Label>
                                        <Input
                                            id="licenseNo"
                                            name="licenseNo"
                                            value={formData.licenseNo}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2 mt-4">
                                    <Label htmlFor="licenseExpiry">License Expiry Date</Label>
                                    <DatePickerInput
                                        value={formData.licenseExpiry}
                                        onChange={(date) => setFormData((prev) => ({ ...prev, licenseExpiry: date }))}
                                        title="License Expiry Date"
                                    />
                                </div>
                            </div>

                            {/* Signature Upload */}
                            <div className="pt-4 border-t">
                                <SignatureUpload
                                    value={formData.signature || undefined}
                                    onChange={(url) => {
                                        console.log('🖋️ Signature changed:', url);
                                        setFormData({ ...formData, signature: url });
                                    }}
                                    label="Instructor Signature"
                                    disabled={mutation.isPending}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 mt-6">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router(`/instructors/${instructorId}`)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" className="gap-2" disabled={mutation.isPending}>
                            <Save className="w-4 h-4" />
                            {mutation.isPending ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
