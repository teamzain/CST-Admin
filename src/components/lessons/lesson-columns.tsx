import { type ColumnDef } from '@tanstack/react-table';
import { Video, FileText } from 'lucide-react';

interface Lesson {
    id: number | string;
    title: string;
    course_title: string;
    module_title: string;
    content_type: string;
    duration_min: number;
}

export const getLessonColumns = (): ColumnDef<Lesson>[] => [
    {
        accessorKey: 'title',
        header: 'Lesson Title',
        cell: ({ row }) => (
            <span className="font-medium text-gray-900">{row.getValue<string>('title')}</span>
        ),
    },
    {
        accessorKey: 'course_title',
        header: 'Course',
        cell: ({ row }) => (
            <span className="text-gray-600">{row.getValue<string>('course_title')}</span>
        ),
    },
    {
        accessorKey: 'module_title',
        header: 'Module',
        cell: ({ row }) => (
            <span className="text-gray-600">{row.getValue<string>('module_title')}</span>
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
];
