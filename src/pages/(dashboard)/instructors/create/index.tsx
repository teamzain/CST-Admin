'use client';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { ArrowLeft, Save } from 'lucide-react';

export default function CreateInstructorPage() {
    const router = useNavigate();
    const queryClient = useQueryClient();
    
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
        userId: '', // Optional: if linking to existing user
    });

    const mutation = useMutation({
        mutationFn: async (data: typeof formData) => {
            const payload = {
                first_name: data.firstName,
                last_name: data.lastName,
                email: data.email,
                phone: data.phone || undefined,
                state_id: parseInt(data.stateId),
                license_no: data.licenseNo,
                license_expiry: data.licenseExpiry,
                signature: data.signature || undefined,
                username: `${data.firstName.toLowerCase()}_${Date.now()}`,
            };
            return InstructorsRepository.createInstructor(payload);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['instructors'] });
            toast.success('Instructor created successfully');
            router('/instructors');
        },
        onError: (error: any) => {
            console.error('Error creating instructor:', error);
            toast.error(error.message || 'Failed to create instructor');
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

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="mx-auto ">
                {/* Header */}
                <div className="mb-6">
                    <Button
                        variant="ghost"
                        onClick={() => router('/instructors')}
                        className="mb-4 gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Instructors
                    </Button>
                    <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
                        Add New Instructor
                    </h1>
                    <p className="text-sm text-gray-600 mt-1">
                        Fill in the instructor details below
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
                                    <Label htmlFor="firstName">
                                        First Name *
                                    </Label>
                                    <Input
                                        id="firstName"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName">
                                        Last Name *
                                    </Label>
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

                            {/* License Information */}
                            <div className="pt-4 border-t">
                                <h3 className="text-lg font-medium mb-4">
                                    License Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="stateId">State *</Label>
                                        <Select
                                            value={formData.stateId}
                                            onValueChange={(value) =>
                                                handleSelectChange(
                                                    'stateId',
                                                    value
                                                )
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select state" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {allStates.map((state: any) => (
                                                    <SelectItem
                                                        key={state.id}
                                                        value={state.id.toString()}
                                                    >
                                                        {state.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="licenseNo">
                                            License Number
                                        </Label>
                                        <Input
                                            id="licenseNo"
                                            name="licenseNo"
                                            value={formData.licenseNo}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2 mt-4">
                                    <Label htmlFor="licenseExpiry">
                                        License Expiry Date
                                    </Label>
                                    <DatePickerInput
                                        value={formData.licenseExpiry}
                                        onChange={(date) => setFormData((prev: any) => ({ ...prev, licenseExpiry: date }))}
                                        title="License Expiry Date"
                                    />
                                </div>
                            </div>

                            {/* Signature Upload */}
                            <div className="pt-4 border-t">
                                <SignatureUpload
                                    value={formData.signature || undefined}
                                    onChange={(url) =>
                                        setFormData({
                                            ...formData,
                                            signature: url,
                                        })
                                    }
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
                            onClick={() => router('/instructors')}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="gap-2"
                            disabled={mutation.isPending}
                        >
                            <Save className="w-4 h-4" />
                            {mutation.isPending ? 'Creating...' : 'Create Instructor'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
