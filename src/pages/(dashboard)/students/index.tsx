'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, Plus } from 'lucide-react';
import { DataTable } from '@/components/shared/data-table';
import { StudentModal } from './students-modal';


interface Student {
    id: number;
    name: string;
    email: string;
    course: string;
    progress: number;
    status: 'enrolled' | 'completed' | 'dropped';
}

const initialStudents: Student[] = [
    {
        id: 1,
        name: 'John Smith',
        email: 'john@example.com',
        course: 'Illinois Armed 40-Hour',
        progress: 75,
        status: 'enrolled',
    },
    {
        id: 2,
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        course: 'Illinois Unarmed 20-Hour',
        progress: 100,
        status: 'completed',
    },
    {
        id: 3,
        name: 'Mike Davis',
        email: 'mike@example.com',
        course: 'Texas Unarmed 6-Hour',
        progress: 40,
        status: 'enrolled',
    },
    {
        id: 4,
        name: 'Emily Wilson',
        email: 'emily@example.com',
        course: 'Illinois Armed 40-Hour',
        progress: 30,
        status: 'enrolled',
    },
    {
        id: 5,
        name: 'Robert Brown',
        email: 'robert@example.com',
        course: 'Florida Refresher',
        progress: 100,
        status: 'completed',
    },
    {
        id: 6,
        name: 'Lisa Anderson',
        email: 'lisa@example.com',
        course: 'Illinois Unarmed 20-Hour',
        progress: 60,
        status: 'enrolled',
    },
];

export default function StudentsPage() {
    const [students, setStudents] = useState<Student[]>(initialStudents);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<
        Student | undefined
    >();

    const handleCreateClick = () => {
        setSelectedStudent(undefined);
        setModalOpen(true);
    };

    const handleEditClick = (student: Student) => {
        setSelectedStudent(student);
        setModalOpen(true);
    };

    const handleDeleteClick = (student: Student) => {
        if (window.confirm(`Remove student "${student.name}"?`)) {
            setStudents(students.filter((s) => s.id !== student.id));
        }
    };

    const handleSaveStudent = (
        studentData: Omit<Student, 'id'> & { id?: number }
    ) => {
        if (studentData.id) {
            setStudents(
                students.map((s) =>
                    s.id === studentData.id
                        ? { ...studentData, id: studentData.id }
                        : s
                )
            );
        } else {
            const newId = Math.max(...students.map((s) => s.id), 0) + 1;
            setStudents([...students, { ...studentData, id: newId }]);
        }
    };

    const columns = [
        {
            key: 'name' as const,
            label: 'Name',
            sortable: true,
            filterable: true,
        },
        {
            key: 'email' as const,
            label: 'Email',
            sortable: true,
        },
        {
            key: 'course' as const,
            label: 'Course',
            sortable: true,
            filterable: true,
        },
        {
            key: 'progress' as const,
            label: 'Progress',
            sortable: true,
            render: (value: number) => (
                <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary"
                            style={{ width: `${value}%` }}
                        />
                    </div>
                    <span className="text-sm font-medium">{value}%</span>
                </div>
            ),
        },
        {
            key: 'status' as const,
            label: 'Status',
            sortable: true,
            render: (value: 'enrolled' | 'completed' | 'dropped') => (
                <Badge
                    variant={
                        value === 'completed'
                            ? 'default'
                            : value === 'dropped'
                            ? 'destructive'
                            : 'secondary'
                    }
                >
                    {value.charAt(0).toUpperCase() + value.slice(1)}
                </Badge>
            ),
        },
    ];

    return (
        <div className="flex">
            <div className="flex-1 bg-background">
                <div className="p-8">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-foreground">
                                Students
                            </h1>
                            <p className="text-muted-foreground mt-2">
                                Manage and track student progress
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Button className="bg-secondary hover:bg-secondary/90 gap-2">
                                <Download className="w-4 h-4" />
                                Import CSV
                            </Button>
                            <Button
                                onClick={handleCreateClick}
                                className="bg-primary hover:bg-primary/90 gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                Add Student
                            </Button>
                        </div>
                    </div>

                    {/* Students Table */}
                    <DataTable
                        data={students}
                        columns={columns}
                        onEdit={handleEditClick}
                        onDelete={handleDeleteClick}
                        searchPlaceholder="Search by name or email..."
                        pageSize={10}
                    />

                    {/* Bulk Enrollment */}
                    <Card className="mt-8 bg-card border-border">
                        <CardHeader>
                            <CardTitle>Bulk Enrollment</CardTitle>
                            <CardDescription>
                                Upload CSV file to enroll multiple students at
                                once
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                                <p className="text-muted-foreground">
                                    Drag and drop CSV file here or click to
                                    browse
                                </p>
                                <p className="text-xs text-muted-foreground mt-2">
                                    Supported format: CSV with columns (name,
                                    email, course)
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <StudentModal
                open={modalOpen}
                onOpenChange={setModalOpen}
                student={selectedStudent}
                onSave={handleSaveStudent}
            />
        </div>
    );
}
