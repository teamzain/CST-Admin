/* eslint-disable @typescript-eslint/no-unused-vars */
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

interface Student {
    id: number;
    name: string;
    email: string;
    course: string;
    progress: number;
    status: 'enrolled' | 'completed' | 'dropped';
}

interface StudentModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    student?: Student;
    onSave: (student: Omit<Student, 'id'> & { id?: number }) => void;
}

const courses = [
    'Illinois Unarmed 20-Hour',
    'Illinois Armed 40-Hour',
    'Texas Unarmed 6-Hour',
    'California Armed 32-Hour',
];

export function StudentModal({
    open,
    onOpenChange,
    student,
    onSave,
}: StudentModalProps) {
    const [formData, setFormData] = useState<Omit<Student, 'id'>>({
        name: '',
        email: '',
        course: '',
        progress: 0,
        status: 'enrolled',
    });

    useEffect(() => {
        if (student) {
            const { id, ...rest } = student;
            setFormData(rest);
        } else {
            setFormData({
                name: '',
                email: '',
                course: '',
                progress: 0,
                status: 'enrolled',
            });
        }
    }, [student, open]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(student ? { ...formData, id: student.id } : formData);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-card border-border">
                <DialogHeader>
                    <DialogTitle>
                        {student ? 'Edit Student' : 'Enroll Student'}
                    </DialogTitle>
                    <DialogDescription>
                        {student
                            ? 'Update student information below.'
                            : 'Fill in the details to enroll a new student.'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    name: e.target.value,
                                })
                            }
                            placeholder="John Doe"
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
                            placeholder="john@example.com"
                            className="bg-input border-border mt-1"
                        />
                    </div>

                    <div>
                        <Label htmlFor="course">Course</Label>
                        <Select
                            value={formData.course}
                            onValueChange={(value) =>
                                setFormData({ ...formData, course: value })
                            }
                        >
                            <SelectTrigger className="bg-input border-border mt-1">
                                <SelectValue placeholder="Select course" />
                            </SelectTrigger>
                            <SelectContent>
                                {courses.map((course) => (
                                    <SelectItem key={course} value={course}>
                                        {course}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label htmlFor="progress">Progress (%)</Label>
                        <Input
                            id="progress"
                            type="number"
                            min="0"
                            max="100"
                            value={formData.progress}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    progress: Number.parseInt(e.target.value),
                                })
                            }
                            placeholder="0"
                            className="bg-input border-border mt-1"
                        />
                    </div>

                    <div>
                        <Label htmlFor="status">Status</Label>
                        <Select
                            value={formData.status}
                            onValueChange={(
                                value: 'enrolled' | 'completed' | 'dropped'
                            ) => setFormData({ ...formData, status: value })}
                        >
                            <SelectTrigger className="bg-input border-border mt-1">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="enrolled">
                                    Enrolled
                                </SelectItem>
                                <SelectItem value="completed">
                                    Completed
                                </SelectItem>
                                <SelectItem value="dropped">Dropped</SelectItem>
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
                            {student ? 'Update' : 'Enroll'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
