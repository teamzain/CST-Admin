import { type ColumnDef } from '@tanstack/react-table';
import { Video, FileText, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { type Lesson } from '@/api/lessons';

export const getLessonColumns = (onView: (lesson: Lesson) => void, onDelete: (lesson: Lesson) => void): ColumnDef<Lesson>[] => [
    {
        accessorKey: 'title',
        header: 'Lesson Title',
        cell: ({ row }) => (
            <span className="font-medium text-gray-900">{row.getValue<string>('title')}</span>
        ),
    },
    {
        id: 'course_title',
        header: 'Course',
        cell: ({ row }) => (
            <span className="text-gray-600">{row.original.course?.title || '-'}</span>
        ),
    },
    {
        accessorKey: 'content_type',
        header: 'Type',
        cell: ({ row }) => {
            const value = row.getValue<string>('content_type');
            return (
                <div className="flex items-center gap-2">
                    {value === 'video' ? <Video className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                    <span className="capitalize">{value}</span>
                </div>
            );
        },
    },
    {
        accessorKey: 'duration_min',
        header: 'Duration',
        cell: ({ row }) => {
            const value = row.getValue<number>('duration_min');
            return <span className="text-gray-600">{value ? `${value} min` : '-'}</span>;
        },
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const lesson = row.original;
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="w-4 h-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => onView(lesson)}>
                            View Lesson
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => onDelete(lesson)}
                            className="text-red-600"
                        >
                            Delete Lesson
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
