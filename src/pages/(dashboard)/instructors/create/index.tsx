'use client';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save } from 'lucide-react';

export default function CreateInstructorPage() {
    const router = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        stateId: '',
        licenseNo: '',
        licenseExpiry: '',
        userId: '', // Optional: if linking to existing user
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // API call to create instructor
            const response = await fetch('/api/instructors', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                router('/instructors');
            }
        } catch (error) {
            console.error('Error creating instructor:', error);
        } finally {
            setLoading(false);
        }
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
                                                <SelectItem value="1">
                                                    Illinois
                                                </SelectItem>
                                                <SelectItem value="2">
                                                    Texas
                                                </SelectItem>
                                                <SelectItem value="3">
                                                    California
                                                </SelectItem>
                                                <SelectItem value="4">
                                                    New York
                                                </SelectItem>
                                                <SelectItem value="5">
                                                    Florida
                                                </SelectItem>
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
                                    <Input
                                        id="licenseExpiry"
                                        name="licenseExpiry"
                                        type="date"
                                        value={formData.licenseExpiry}
                                        onChange={handleChange}
                                    />
                                </div>
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
                            disabled={loading}
                        >
                            <Save className="w-4 h-4" />
                            {loading ? 'Creating...' : 'Create Instructor'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
