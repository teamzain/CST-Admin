/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
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

interface Employer {
    id: number;
    name: string;
    email: string;
    contact: string;
    industry: string;
    seats: number;
    usedSeats: number;
    status: 'active' | 'inactive' | 'pending';
}

interface EmployerModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    employer?: Employer;
    onSave: (employer: Omit<Employer, 'id'> & { id?: number }) => void;
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
    const [formData, setFormData] = useState<Omit<Employer, 'id'>>({
        name: '',
        email: '',
        contact: '',
        industry: '',
        seats: 0,
        usedSeats: 0,
        status: 'active',
    });

    useEffect(() => {
        if (employer) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { id, ...rest } = employer;
            setFormData(rest);
        } else {
            setFormData({
                name: '',
                email: '',
                contact: '',
                industry: '',
                seats: 0,
                usedSeats: 0,
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
            <DialogContent className="bg-card border-border">
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

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="name">Company Name</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    name: e.target.value,
                                })
                            }
                            placeholder="Acme Security Corp"
                            className="bg-input border-border mt-1"
                        />
                    </div>

                    <div>
                        <Label htmlFor="contact">Contact Person</Label>
                        <Input
                            id="contact"
                            value={formData.contact}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    contact: e.target.value,
                                })
                            }
                            placeholder="John Manager"
                            className="bg-input border-border mt-1"
                        />
                    </div>

                    <div>
                        <Label htmlFor="email">Email</Label>
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
                            placeholder="contact@acme.com"
                            className="bg-input border-border mt-1"
                        />
                    </div>

                    <div>
                        <Label htmlFor="industry">Industry</Label>
                        <Select
                            value={formData.industry}
                            onValueChange={(value) =>
                                setFormData({ ...formData, industry: value })
                            }
                        >
                            <SelectTrigger className="bg-input border-border mt-1">
                                <SelectValue placeholder="Select industry" />
                            </SelectTrigger>
                            <SelectContent>
                                {industries.map((ind) => (
                                    <SelectItem key={ind} value={ind}>
                                        {ind}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label htmlFor="seats">Total Seats</Label>
                        <Input
                            id="seats"
                            type="number"
                            value={formData.seats}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    seats: Number.parseInt(e.target.value),
                                })
                            }
                            placeholder="50"
                            className="bg-input border-border mt-1"
                        />
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
                            className="bg-primary hover:bg-primary/90"
                        >
                            {employer ? 'Update' : 'Add'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
