'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, AlertTriangle } from 'lucide-react';
import { DataTable } from '@/components/shared/data-table';
import { InstructorModal } from './instructor-modal';

interface Instructor {
    id: number;
    name: string;
    email: string;
    license: string;
    state: string;
    expiry: string;
    status: 'active' | 'expired' | 'pending';
}

const initialInstructors: Instructor[] = [
    {
        id: 1,
        name: 'John Martinez',
        email: 'john.m@example.com',
        license: 'IL-ARM-001',
        state: 'Illinois',
        expiry: '2025-07-15',
        status: 'active',
    },
    {
        id: 2,
        name: 'Sarah Chen',
        email: 'sarah.c@example.com',
        license: 'IL-ARM-002',
        state: 'Illinois',
        expiry: '2025-12-30',
        status: 'active',
    },
    {
        id: 3,
        name: 'Mike Thompson',
        email: 'mike.t@example.com',
        license: 'TX-ARM-001',
        state: 'Texas',
        expiry: '2025-08-20',
        status: 'active',
    },
    {
        id: 4,
        name: 'Lisa Garcia',
        email: 'lisa.g@example.com',
        license: 'CA-ARM-001',
        state: 'California',
        expiry: '2024-06-10',
        status: 'expired',
    },
];

export default function InstructorsPage() {
    const [instructors, setInstructors] =
        useState<Instructor[]>(initialInstructors);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedInstructor, setSelectedInstructor] = useState<
        Instructor | undefined
    >();

    const handleCreateClick = () => {
        setSelectedInstructor(undefined);
        setModalOpen(true);
    };

    const handleEditClick = (instructor: Instructor) => {
        setSelectedInstructor(instructor);
        setModalOpen(true);
    };

    const handleDeleteClick = (instructor: Instructor) => {
        if (window.confirm(`Delete instructor "${instructor.name}"?`)) {
            setInstructors(instructors.filter((i) => i.id !== instructor.id));
        }
    };

    const handleSaveInstructor = (
        instructorData: Omit<Instructor, 'id'> & { id?: number }
    ) => {
        if (instructorData.id) {
            setInstructors(
                instructors.map((i) =>
                    i.id === instructorData.id
                        ? { ...instructorData, id: instructorData.id }
                        : i
                )
            );
        } else {
            const newId = Math.max(...instructors.map((i) => i.id), 0) + 1;
            setInstructors([...instructors, { ...instructorData, id: newId }]);
        }
    };

    const getDaysLeft = (expiry: string) => {
        const expiryDate = new Date(expiry);
        const today = new Date();
        const daysLeft = Math.ceil(
            (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
        );
        return daysLeft;
    };

    const columns = [
        {
            key: 'name' as const,
            label: 'Name',
            sortable: true,
            filterable: true,
        },
        {
            key: 'license' as const,
            label: 'License',
            sortable: true,
        },
        {
            key: 'state' as const,
            label: 'State',
            sortable: true,
            filterable: true,
        },
        {
            key: 'expiry' as const,
            label: 'License Expiry',
            sortable: true,
        },
        {
            key: 'status' as const,
            label: 'Status',
            sortable: true,
            render: (
                value: 'active' | 'expired' | 'pending',
                row: Instructor
            ) => {
                const daysLeft = getDaysLeft(row.expiry);
                return (
                    <div className="flex items-center gap-2">
                        {daysLeft > 0 && daysLeft <= 7 && (
                            <AlertTriangle className="w-4 h-4 text-yellow-500" />
                        )}
                        <Badge
                            variant={
                                value === 'active'
                                    ? 'default'
                                    : value === 'expired'
                                    ? 'destructive'
                                    : 'secondary'
                            }
                        >
                            {value === 'expired'
                                ? 'Expired'
                                : value.charAt(0).toUpperCase() +
                                  value.slice(1)}
                        </Badge>
                        {daysLeft > 0 && daysLeft <= 7 && (
                            <span className="text-xs text-yellow-500">
                                {daysLeft} days left
                            </span>
                        )}
                    </div>
                );
            },
        },
    ];

    return (
        <div className="flex">
            <div className="flex-1 bg-background">
                <div className="p-8">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-foreground">
                                Instructors
                            </h1>
                            <p className="text-muted-foreground mt-2">
                                Manage instructors and certifications
                            </p>
                        </div>
                        <Button
                            onClick={handleCreateClick}
                            className="bg-primary hover:bg-primary/90 gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Add Instructor
                        </Button>
                    </div>

                    {/* Instructors Table */}
                    <DataTable
                        data={instructors}
                        columns={columns}
                        onEdit={handleEditClick}
                        onDelete={handleDeleteClick}
                        searchPlaceholder="Search instructors..."
                        pageSize={10}
                    />
                </div>
            </div>

            <InstructorModal
                open={modalOpen}
                onOpenChange={setModalOpen}
                instructor={selectedInstructor}
                onSave={handleSaveInstructor}
            />
        </div>
    );
}
