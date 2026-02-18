/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
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
import type { Employer } from '@/repositories/employers';
import { StatesRepository } from '@/repositories/states';

interface EmployerModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    employer?: Employer;
    onSave: (employer: any) => void;
}

const industries = [
    'Security Services',
    'Corporate',
    'Government',
    'Retail',
    'Healthcare',
    'Finance',
    'Technology',
    'Transportation',
];

export function EmployerModal({
    open,
    onOpenChange,
    employer,
    onSave,
}: EmployerModalProps) {
    const { data: allStates = [] } = useQuery({
        queryKey: ['states'],
        queryFn: () => StatesRepository.getAll(),
    });

    const [formData, setFormData] = useState<any>({
        first_name: '',
        last_name: '',
        username: '',
        email: '',
        password: '',
        phone: '',
        company_name: '',
        contact_email: '',
        contact_phone: '',
        address: '',
        website: '',
        state_id: '',
        industry: '',
        status: 'active',
    });

    useEffect(() => {
        if (employer) {
            setFormData({
                first_name: employer.first_name || '',
                last_name: employer.last_name || '',
                username: employer.username || '',
                email: employer.email || '',
                password: '', // Don't populate password on edit
                phone: employer.phone || '',
                company_name: employer.company_name || '',
                contact_email: employer.contact_email || '',
                contact_phone: employer.contact_phone || '',
                address: employer.address || '',
                website: employer.website || '',
                state_id: employer.state_id || '',
                industry: employer.industry || '',
                status: employer.status || 'active',
            });
        } else {
            setFormData({
                first_name: '',
                last_name: '',
                username: '',
                email: '',
                password: '',
                phone: '',
                company_name: '',
                contact_email: '',
                contact_phone: '',
                address: '',
                website: '',
                state_id: '',
                industry: '',
                status: 'active',
            });
        }
    }, [employer, open]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(employer ? { ...formData, id: employer.id } : formData);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-card border-border max-w-2xl max-h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>
                        {employer ? 'Edit Employer' : 'Add Employer'}
                    </DialogTitle>
                    <DialogDescription>
                        {employer
                            ? 'Update employer information below.'
                            : 'Fill in the details to add a new employer.'}
                    </DialogDescription>
                </DialogHeader>

                <div className="overflow-y-auto flex-1">
                    <form id="employer-form" onSubmit={handleSubmit} className="space-y-4 px-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="first_name">First Name *</Label>
                            <Input
                                id="first_name"
                                value={formData.first_name}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        first_name: e.target.value,
                                    })
                                }
                                placeholder="John"
                                className="bg-input border-border mt-1"
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="last_name">Last Name *</Label>
                            <Input
                                id="last_name"
                                value={formData.last_name}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        last_name: e.target.value,
                                    })
                                }
                                placeholder="Doe"
                                className="bg-input border-border mt-1"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="company_name">Company Name *</Label>
                        <Input
                            id="company_name"
                            value={formData.company_name}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    company_name: e.target.value,
                                })
                            }
                            placeholder="Acme Security Corp"
                            className="bg-input border-border mt-1"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="email">Email *</Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        email: e.target.value,
                                    })
                                }
                                placeholder="john@acme.com"
                                className="bg-input border-border mt-1"
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="contact_email">Contact Email *</Label>
                            <Input
                                id="contact_email"
                                type="email"
                                value={formData.contact_email}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        contact_email: e.target.value,
                                    })
                                }
                                placeholder="contact@acme.com"
                                className="bg-input border-border mt-1"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="username">Username *</Label>
                            <Input
                                id="username"
                                value={formData.username}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        username: e.target.value,
                                    })
                                }
                                placeholder="johndoe"
                                className="bg-input border-border mt-1"
                                required
                            />
                        </div>
                        {!employer && (
                            <div>
                                <Label htmlFor="password">Password *</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            password: e.target.value,
                                        })
                                    }
                                    placeholder="••••••••"
                                    className="bg-input border-border mt-1"
                                    required
                                />
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                                id="phone"
                                value={formData.phone}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        phone: e.target.value,
                                    })
                                }
                                placeholder="(555) 123-4567"
                                className="bg-input border-border mt-1"
                            />
                        </div>
                        <div>
                            <Label htmlFor="contact_phone">Contact Phone</Label>
                            <Input
                                id="contact_phone"
                                value={formData.contact_phone}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        contact_phone: e.target.value,
                                    })
                                }
                                placeholder="(555) 123-4567"
                                className="bg-input border-border mt-1"
                            />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="address">Address</Label>
                        <Input
                            id="address"
                            value={formData.address}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    address: e.target.value,
                                })
                            }
                            placeholder="123 Main St"
                            className="bg-input border-border mt-1"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="website">Website</Label>
                            <Input
                                id="website"
                                type="url"
                                value={formData.website}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        website: e.target.value,
                                    })
                                }
                                placeholder="https://example.com"
                                className="bg-input border-border mt-1"
                            />
                        </div>
                        <div>
                            <Label htmlFor="state_id">State *</Label>
                            <Select
                                value={formData.state_id?.toString() || ''}
                                onValueChange={(value) =>
                                    setFormData({
                                        ...formData,
                                        state_id: parseInt(value),
                                    })
                                }
                            >
                                <SelectTrigger className="bg-input border-border mt-1">
                                    <SelectValue placeholder="Select a state" />
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
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="industry">Industry</Label>
                            <Select
                                value={formData.industry || undefined}
                                onValueChange={(value) =>
                                    setFormData({ ...formData, industry: value })
                                }
                            >
                                <SelectTrigger className="bg-input border-border mt-1">
                                    <SelectValue placeholder="Select industry" />
                                </SelectTrigger>
                                <SelectContent>
                                    {/* Include stored industry if not in static list */}
                                    {formData.industry && !industries.includes(formData.industry) && (
                                        <SelectItem key={formData.industry} value={formData.industry}>
                                            {formData.industry}
                                        </SelectItem>
                                    )}
                                    {industries.map((ind) => (
                                        <SelectItem key={ind} value={ind}>
                                            {ind}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="status">Status</Label>
                            <Select
                                value={formData.status}
                                onValueChange={(
                                    value: 'active' | 'inactive' | 'pending'
                                ) => setFormData({ ...formData, status: value })}
                            >
                                <SelectTrigger className="bg-input border-border mt-1">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">
                                        Inactive
                                    </SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </form>
                </div>

                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="border-border"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        form="employer-form"
                        className="bg-primary hover:bg-primary/90"
                    >
                        {employer ? 'Update' : 'Add'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
