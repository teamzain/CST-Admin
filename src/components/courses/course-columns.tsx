import { type ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { type Course } from '@/stores/courses-store';
import { MoreHorizontal, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const getCourseColumns = (onEdit: (course: Course) => void, onDelete: (course: Course) => void): ColumnDef<Course>[] => [
    {
        accessorKey: 'title',
        header: 'Course Title',
        cell: ({ row }) => {
            const course = row.original;
            return (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 shrink-0">
                        {course.thumbnail ? (
                            <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <Clock className="w-5 h-5" />
                            </div>
                        )}
                    </div>
                    <span className="font-medium text-gray-900">{course.title}</span>
                </div>
            );
        },
    },
    {
        accessorKey: 'training_type',
        header: 'Category',
        cell: ({ row }) => (
            <span className="text-gray-600 capitalize">
                {row.getValue<string>('training_type').toLowerCase()}
            </span>
        ),
    },
    {
        accessorKey: 'duration_hours',
        header: 'Hours',
        cell: ({ row }) => (
            <div className="flex items-center gap-2 text-gray-600">
                <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center">
                    <Clock className="w-4 h-4 text-purple-600" />
                </div>
                <span>{row.getValue<number>('duration_hours')} Hours</span>
            </div>
        ),
    },
    {
        accessorKey: 'is_active',
        header: 'Status',
        cell: ({ row }) => {
            const isActive = row.getValue<boolean>('is_active');
            return (
                <Badge
                    variant="secondary"
                    className={isActive
                        ? "bg-green-50 text-green-700 border-green-100"
                        : "bg-gray-50 text-gray-700 border-gray-100"
                    }
                >
                    {isActive ? 'Published' : 'Draft'}
                </Badge>
            );
        },
    },
    {
        accessorKey: 'instructor.name',
        header: 'Instructor',
        cell: ({ row }) => (
            <span className="text-gray-600">{row.original.instructor?.name || 'N/A'}</span>
        ),
    },
    {
        accessorKey: 'enrolled_students',
        header: 'Enrolled',
        cell: ({ row }) => (
            <span className="text-gray-600">{row.getValue<number>('enrolled_students') || 0}</span>
        ),
    },
    {
        accessorKey: 'price',
        header: 'Price',
        cell: ({ row }) => (
            <span className="font-medium text-gray-900">${row.getValue<number>('price').toFixed(2)}</span>
        ),
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const course = row.original;
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="w-4 h-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => onEdit(course)}>
                            Edit Course
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => onDelete(course)}
                            className="text-red-600"
                        >
                            Delete Course
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
