'use client';

import type React from 'react';

import { useState } from 'react';
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

interface Course {
    id: number;
    name: string;
    state: string;
    hours: number;
    students: number;
    price: number;
    status: 'active' | 'draft';
}

interface CourseModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    course?: Course;
    onSave: (course: Omit<Course, 'id'> & { id?: number }) => void;
}

const states = [
    'Illinois',
    'Texas',
    'California',
    'Florida',
    'New York',
    'Ohio',
];

export function CourseModal({
    open,
    onOpenChange,
    course,
    onSave,
}: CourseModalProps) {
    function getInitialFormData(course?: Course): Omit<Course, 'id'> {
        if (!course) {
            return {
                name: '',
                state: '',
                hours: 0,
                students: 0,
                price: 0,
                status: 'active',
            };
        }

        // strip id
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, ...rest } = course;
        return rest;
    }
    
    const [formData, setFormData] = useState(() => getInitialFormData(course));




    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(course ? { ...formData, id: course.id } : formData);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-card border-border">
                <DialogHeader>
                    <DialogTitle>
                        {course ? 'Edit Course' : 'Create New Course'}
                    </DialogTitle>
                    <DialogDescription>
                        {course
                            ? 'Update the course information below.'
                            : 'Fill in the details to create a new course.'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="name">Course Name</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    name: e.target.value,
                                })
                            }
                            placeholder="e.g., Illinois Unarmed 20-Hour"
                            className="bg-input border-border mt-1"
                        />
                    </div>

                    <div>
                        <Label htmlFor="state">State</Label>
                        <Select
                            value={formData.state}
                            onValueChange={(value) =>
                                setFormData({ ...formData, state: value })
                            }
                        >
                            <SelectTrigger className="bg-input border-border mt-1">
                                <SelectValue placeholder="Select state" />
                            </SelectTrigger>
                            <SelectContent>
                                {states.map((state) => (
                                    <SelectItem key={state} value={state}>
                                        {state}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="hours">Hours</Label>
                            <Input
                                id="hours"
                                type="number"
                                value={formData.hours}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        hours: Number.parseInt(e.target.value),
                                    })
                                }
                                placeholder="20"
                                className="bg-input border-border mt-1"
                            />
                        </div>

                        <div>
                            <Label htmlFor="price">Price ($)</Label>
                            <Input
                                id="price"
                                type="number"
                                value={formData.price}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        price: Number.parseInt(e.target.value),
                                    })
                                }
                                placeholder="199"
                                className="bg-input border-border mt-1"
                            />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="status">Status</Label>
                        <Select
                            value={formData.status}
                            onValueChange={(value: 'active' | 'draft') =>
                                setFormData({ ...formData, status: value })
                            }
                        >
                            <SelectTrigger className="bg-input border-border mt-1">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="draft">Draft</SelectItem>
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
                            {course ? 'Update' : 'Create'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
