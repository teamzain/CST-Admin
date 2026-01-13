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

const initialCourses: Course[] = [
    {
        id: 1,
        title: 'Illinois Unarmed 20-Hour',
        category: 'IN_PERSON',
        duration_hours: 20,
        is_active: true,
        instructor: 'John Doe',
        enrolled_students: 45,
        price: 199,
        state: 'Illinois',
        delivery_mode: 'in-person',
    },
    {
        id: 2,
        title: 'Illinois Armed 40-Hour',
        category: 'IN_PERSON',
        duration_hours: 40,
        is_active: true,
        instructor: 'Jane Smith',
        enrolled_students: 28,
        price: 499,
        state: 'Illinois',
        delivery_mode: 'in-person',
    },
    {
        id: 3,
        title: 'Texas Unarmed 6-Hour',
        category: 'PRERECORDED',
        duration_hours: 6,
        is_active: true,
        instructor: 'Mike Johnson',
        enrolled_students: 12,
        price: 79,
        state: 'Texas',
        delivery_mode: 'online',
    },
    {
        id: 4,
        title: 'California Armed 32-Hour',
        category: 'IN_PERSON',
        duration_hours: 32,
        is_active: false,
        instructor: 'Sarah Williams',
        enrolled_students: 0,
        price: 449,
        state: 'California',
        delivery_mode: 'in-person',
    },
    {
        id: 5,
        title: 'Florida Refresher Course',
        category: 'LIVE_WEBINAR',
        duration_hours: 8,
        is_active: true,
        instructor: 'David Brown',
        enrolled_students: 34,
        price: 99,
        state: 'Florida',
        delivery_mode: 'online',
    },
    {
        id: 6,
        title: 'New York Basic Training',
        category: 'IN_PERSON',
        duration_hours: 16,
        is_active: true,
        instructor: 'Emily Davis',
        enrolled_students: 22,
        price: 149,
        state: 'New York',
        delivery_mode: 'in-person',
    },
    {
        id: 7,
        title: 'Advanced Pistol Marksmanship',
        category: 'IN_PERSON',
        duration_hours: 10,
        is_active: true,
        instructor: 'John Doe',
        enrolled_students: 15,
        price: 299,
        state: 'Illinois',
        delivery_mode: 'in-person',
    },
    {
        id: 8,
        title: 'Security Law & Ethics',
        category: 'PRERECORDED',
        duration_hours: 4,
        is_active: true,
        instructor: 'Mike Johnson',
        enrolled_students: 56,
        price: 49,
        state: 'Texas',
        delivery_mode: 'online',
    },
    {
        id: 9,
        title: 'Crisis Management Workshop',
        category: 'LIVE_WEBINAR',
        duration_hours: 3,
        is_active: false,
        instructor: 'Jane Smith',
        enrolled_students: 0,
        price: 89,
        state: 'Florida',
        delivery_mode: 'online',
    },
    {
        id: 10,
        title: 'Active Shooter Response',
        category: 'IN_PERSON',
        duration_hours: 8,
        is_active: true,
        instructor: 'Robert Wilson',
        enrolled_students: 40,
        price: 199,
        state: 'California',
        delivery_mode: 'in-person',
    },
    {
        id: 11,
        title: 'First Aid & CPR',
        category: 'IN_PERSON',
        duration_hours: 6,
        is_active: true,
        instructor: 'Sarah Williams',
        enrolled_students: 30,
        price: 120,
        state: 'New York',
        delivery_mode: 'in-person',
    },
    {
        id: 12,
        title: 'Report Writing 101',
        category: 'PRERECORDED',
        duration_hours: 2,
        is_active: true,
        instructor: 'David Brown',
        enrolled_students: 88,
        price: 29,
        state: 'Illinois',
        delivery_mode: 'online',
    },
];

export default function CoursesPage() {
    const [courses, setCourses] = useState<Course[]>(initialCourses);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState<Course | undefined>();

    // Filters
    const [filters, setFilters] = useState({
        isActive: 'all',
        category: 'all',
        deliveryMode: 'all',
        instructor: 'all',
        state: 'all',
    });

    const filteredCourses = courses.filter((course) => {
        if (filters.isActive !== 'all' && String(course.is_active) !== filters.isActive) return false;
        if (filters.category !== 'all' && course.category !== filters.category) return false;
        if (filters.deliveryMode !== 'all' && course.delivery_mode !== filters.deliveryMode) return false;
        if (filters.instructor !== 'all' && course.instructor !== filters.instructor) return false;
        if (filters.state !== 'all' && course.state !== filters.state) return false;
        return true;
    });

    const handleCreateClick = () => {
        setSelectedCourse(undefined);
        setModalOpen(true);
    };

    const handleEditClick = (course: Course) => {
        setSelectedCourse(course);
        setModalOpen(true);
    };

    const handleDeleteClick = (course: Course) => {
        if (window.confirm(`Delete course "${course.title}"?`)) {
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
            key: 'title' as const,
            label: 'Course Title',
            sortable: true,
            filterable: true,
        },
        {
            key: 'category' as const,
            label: 'Category',
            sortable: true,
            filterable: true,
            render: (value: string) => value.replace('_', ' '),
        },
        {
            key: 'duration_hours' as const,
            label: 'Hours',
            sortable: true,
            render: (value: number) => `${value}h`,
        },
        {
            key: 'is_active' as const,
            label: 'Status',
            sortable: true,
            render: (value: boolean) => (
                <Badge variant={value ? 'default' : 'secondary'}>
                    {value ? 'Active' : 'Inactive'}
                </Badge>
            ),
        },
        {
            key: 'instructor' as const,
            label: 'Instructor',
            sortable: true,
            filterable: true,
        },
        {
            key: 'enrolled_students' as const,
            label: 'Enrolled',
            sortable: true,
        },
        {
            key: 'price' as const,
            label: 'Price',
            sortable: true,
            render: (value: number) => `$${value}`,
        },
    ];

    // Unique values for filters
    const instructors = Array.from(new Set(courses.map(c => c.instructor)));
    const states = Array.from(new Set(courses.map(c => c.state)));

    const extraFilters = (
        <>
             <Select value={filters.isActive} onValueChange={(val) => setFilters({ ...filters, isActive: val })}>
                <SelectTrigger className="w-[130px] bg-background border-input">
                    <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Any Status</SelectItem>
                    <SelectItem value="true">Active</SelectItem>
                    <SelectItem value="false">Inactive</SelectItem>
                </SelectContent>
            </Select>

            <Select value={filters.category} onValueChange={(val) => setFilters({ ...filters, category: val })}>
                <SelectTrigger className="w-[160px] bg-background border-input">
                    <SelectValue placeholder="Training Type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Any Type</SelectItem>
                    <SelectItem value="PRERECORDED">Prerecorded</SelectItem>
                    <SelectItem value="LIVE_WEBINAR">Live Webinar</SelectItem>
                    <SelectItem value="IN_PERSON">In Person</SelectItem>
                </SelectContent>
            </Select>

            <Select value={filters.deliveryMode} onValueChange={(val) => setFilters({ ...filters, deliveryMode: val })}>
                <SelectTrigger className="w-[150px] bg-background border-input">
                    <SelectValue placeholder="Delivery Mode" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Any Mode</SelectItem>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="in-person">In Person</SelectItem>
                </SelectContent>
            </Select>

            <Select value={filters.instructor} onValueChange={(val) => setFilters({ ...filters, instructor: val })}>
                <SelectTrigger className="w-[150px] bg-background border-input">
                    <SelectValue placeholder="Instructor" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Instructors</SelectItem>
                    {instructors.map((inst) => (
                        <SelectItem key={inst} value={inst}>{inst}</SelectItem>
                    ))}
                </SelectContent>
            </Select>

             <Select value={filters.state} onValueChange={(val) => setFilters({ ...filters, state: val })}>
                <SelectTrigger className="w-[140px] bg-background border-input">
                    <SelectValue placeholder="State" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All States</SelectItem>
                    {states.map((st) => (
                        <SelectItem key={st} value={st}>{st}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </>
    );

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
                        data={filteredCourses}
                        columns={columns}
                        onEdit={handleEditClick}
                        onDelete={handleDeleteClick}
                        searchPlaceholder="Search courses..."
                        pageSize={10}
                        extraFilters={extraFilters}
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
