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
import { CoursesRepository } from '@/repositories/courses';

interface AssignSeatsModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    employerId: number;
    employerName: string;
    onSubmit: (data: { employer_id: number; course_id: number; total_seats: number }) => void;
    isLoading?: boolean;
}

export function AssignSeatsModal({
    open,
    onOpenChange,
    employerId,
    employerName,
    onSubmit,
    isLoading = false,
}: AssignSeatsModalProps) {
    // Fetch courses
    const { data: courses = [] } = useQuery({
        queryKey: ['courses'],
        queryFn: () => CoursesRepository.getAll(),
    });

    const [formData, setFormData] = useState({
        course_id: '',
        total_seats: '',
    });

    const handleReset = () => {
        setFormData({
            course_id: '',
            total_seats: '',
        });
    };

    useEffect(() => {
        if (!open) {
            handleReset();
        }
    }, [open]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.course_id || !formData.total_seats) {
            return;
        }

        onSubmit({
            employer_id: employerId,
            course_id: parseInt(formData.course_id),
            total_seats: parseInt(formData.total_seats),
        });

        handleReset();
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-card border-border max-w-md">
                <DialogHeader>
                    <DialogTitle>Assign Seats</DialogTitle>
                    <DialogDescription>
                        Assign course seats to {employerName}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="employer_name">Employer</Label>
                        <Input
                            id="employer_name"
                            value={employerName}
                            disabled
                            className="bg-input border-border mt-1"
                        />
                    </div>

                    <div>
                        <Label htmlFor="course_id">Course *</Label>
                        <Select
                            value={formData.course_id}
                            onValueChange={(value) =>
                                setFormData({ ...formData, course_id: value })
                            }
                        >
                            <SelectTrigger className="bg-input border-border mt-1">
                                <SelectValue placeholder="Select a course" />
                            </SelectTrigger>
                            <SelectContent>
                                {courses.map((course: any) => (
                                    <SelectItem
                                        key={course.id}
                                        value={course.id.toString()}
                                    >
                                        {course.title || course.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label htmlFor="total_seats">Number of Seats *</Label>
                        <Input
                            id="total_seats"
                            type="number"
                            min="1"
                            max="10000"
                            value={formData.total_seats}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    total_seats: e.target.value,
                                })
                            }
                            placeholder="e.g., 50"
                            className="bg-input border-border mt-1"
                            required
                        />
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            className="border-border"
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="bg-primary hover:bg-primary/90"
                            disabled={isLoading || !formData.course_id || !formData.total_seats}
                        >
                            {isLoading ? 'Assigning...' : 'Assign Seats'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
