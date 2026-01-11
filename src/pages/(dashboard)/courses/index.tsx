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
import { Plus } from 'lucide-react';
import { DataTable } from '@/components/shared/data-table';
import { CourseModal } from './course-modal';

interface Course {
    id: number;
    name: string;
    state: string;
    hours: number;
    students: number;
    price: number;
    status: 'active' | 'draft';
}

const initialCourses: Course[] = [
    {
        id: 1,
        name: 'Illinois Unarmed 20-Hour',
        state: 'Illinois',
        hours: 20,
        students: 45,
        price: 199,
        status: 'active',
    },
    {
        id: 2,
        name: 'Illinois Armed 40-Hour',
        state: 'Illinois',
        hours: 40,
        students: 28,
        price: 499,
        status: 'active',
    },
    {
        id: 3,
        name: 'Texas Unarmed 6-Hour',
        state: 'Texas',
        hours: 6,
        students: 12,
        price: 79,
        status: 'active',
    },
    {
        id: 4,
        name: 'California Armed 32-Hour',
        state: 'California',
        hours: 32,
        students: 0,
        price: 449,
        status: 'draft',
    },
    {
        id: 5,
        name: 'Florida Refresher Course',
        state: 'Florida',
        hours: 8,
        students: 34,
        price: 99,
        status: 'active',
    },
    {
        id: 6,
        name: 'New York Basic Training',
        state: 'New York',
        hours: 16,
        students: 22,
        price: 149,
        status: 'active',
    },
];

export default function CoursesPage() {
    const [courses, setCourses] = useState<Course[]>(initialCourses);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState<Course | undefined>();

    const handleCreateClick = () => {
        setSelectedCourse(undefined);
        setModalOpen(true);
    };

    const handleEditClick = (course: Course) => {
        setSelectedCourse(course);
        setModalOpen(true);
    };

    const handleDeleteClick = (course: Course) => {
        if (window.confirm(`Delete course "${course.name}"?`)) {
            setCourses(courses.filter((c) => c.id !== course.id));
        }
    };

    const handleSaveCourse = (
        courseData: Omit<Course, 'id'> & { id?: number }
    ) => {
        if (courseData.id) {
            setCourses(
                courses.map((c) =>
                    c.id === courseData.id
                        ? { ...courseData, id: courseData.id }
                        : c
                )
            );
        } else {
            const newId = Math.max(...courses.map((c) => c.id), 0) + 1;
            setCourses([...courses, { ...courseData, id: newId }]);
        }
    };

    const columns = [
        {
            key: 'name' as const,
            label: 'Course Name',
            sortable: true,
            filterable: true,
        },
        {
            key: 'state' as const,
            label: 'State',
            sortable: true,
            filterable: true,
        },
        {
            key: 'hours' as const,
            label: 'Hours',
            sortable: true,
            render: (value: number) => `${value}h`,
        },
        {
            key: 'students' as const,
            label: 'Students',
            sortable: true,
        },
        {
            key: 'price' as const,
            label: 'Price',
            sortable: true,
            render: (value: number) => `$${value}`,
        },
        {
            key: 'status' as const,
            label: 'Status',
            sortable: true,
            render: (value: 'active' | 'draft') => (
                <Badge variant={value === 'active' ? 'default' : 'secondary'}>
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
                                Courses
                            </h1>
                            <p className="text-muted-foreground mt-2">
                                Manage training courses
                            </p>
                        </div>
                        <Button
                            onClick={handleCreateClick}
                            className="bg-primary hover:bg-primary/90 gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Create Course
                        </Button>
                    </div>

                    {/* Courses Table */}
                    <DataTable
                        data={courses}
                        columns={columns}
                        onEdit={handleEditClick}
                        onDelete={handleDeleteClick}
                        searchPlaceholder="Search courses..."
                        pageSize={10}
                    />

                    {/* Course Builder Preview */}
                    <Card className="mt-8 bg-card border-border">
                        <CardHeader>
                            <CardTitle>Course Builder</CardTitle>
                            <CardDescription>
                                Drag and drop to build course content
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="border border-dashed border-border rounded-lg p-8 text-center">
                                <p className="text-muted-foreground">
                                    Select a course to edit its structure
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <CourseModal
                open={modalOpen}
                onOpenChange={setModalOpen}
                course={selectedCourse}
                onSave={handleSaveCourse}
            />
        </div>
    );
}
