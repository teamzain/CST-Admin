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

interface Course {
    id: number;
    title: string;
    category: 'PRERECORDED' | 'LIVE_WEBINAR' | 'IN_PERSON';
    duration_hours: number;
    is_active: boolean;
    instructor: string;
    enrolled_students: number;
    price: number;
    state: string;
    delivery_mode: 'online' | 'in-person';
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
                title: '',
                category: 'PRERECORDED',
                duration_hours: 0,
                is_active: true,
                instructor: '',
                enrolled_students: 0,
                price: 0,
                state: '',
                delivery_mode: 'online',
            };
        }

        // strip id
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, ...rest } = course;
        return rest;
    }
    
    const [formData, setFormData] = useState<Omit<Course, 'id'>>(() => getInitialFormData(course));

    useEffect(() => {
        if (open) {
            setFormData(getInitialFormData(course));
        }
    }, [open, course]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(course ? { ...formData, id: course.id } : formData);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-card border-border max-w-2xl max-h-[90vh] overflow-y-auto">
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
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <Label htmlFor="title">Course Title</Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="e.g., Illinois Unarmed 20-Hour"
                                className="bg-input border-border mt-1"
                            />
                        </div>

                        <div>
                            <Label htmlFor="category">Category</Label>
                            <Select
                                value={formData.category}
                                onValueChange={(val: any) => setFormData({ ...formData, category: val })}
                            >
                                <SelectTrigger className="bg-input border-border mt-1">
                                    <SelectValue placeholder="Select Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="PRERECORDED">Prerecorded</SelectItem>
                                    <SelectItem value="LIVE_WEBINAR">Live Webinar</SelectItem>
                                    <SelectItem value="IN_PERSON">In Person</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label htmlFor="delivery_mode">Delivery Mode</Label>
                            <Select
                                value={formData.delivery_mode}
                                onValueChange={(val: any) => setFormData({ ...formData, delivery_mode: val })}
                            >
                                <SelectTrigger className="bg-input border-border mt-1">
                                    <SelectValue placeholder="Select Mode" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="online">Online</SelectItem>
                                    <SelectItem value="in-person">In Person</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label htmlFor="hours">Hours</Label>
                            <Input
                                id="hours"
                                type="number"
                                value={formData.duration_hours}
                                onChange={(e) => setFormData({ ...formData, duration_hours: parseInt(e.target.value) || 0 })}
                                className="bg-input border-border mt-1"
                            />
                        </div>

                        <div>
                            <Label htmlFor="price">Price ($)</Label>
                            <Input
                                id="price"
                                type="number"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                                className="bg-input border-border mt-1"
                            />
                        </div>

                        <div>
                            <Label htmlFor="instructor">Instructor</Label>
                            <Input
                                id="instructor"
                                value={formData.instructor}
                                onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                                className="bg-input border-border mt-1"
                            />
                        </div>

                        <div>
                            <Label htmlFor="state">State</Label>
                             <Select
                                value={formData.state}
                                onValueChange={(value) => setFormData({ ...formData, state: value })}
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

                        <div>
                            <Label htmlFor="status">Status</Label>
                            <Select
                                value={formData.is_active ? 'true' : 'false'}
                                onValueChange={(val) => setFormData({ ...formData, is_active: val === 'true' })}
                            >
                                <SelectTrigger className="bg-input border-border mt-1">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="true">Active</SelectItem>
                                    <SelectItem value="false">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
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
