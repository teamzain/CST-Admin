import { type ColumnDef } from '@tanstack/react-table';
import { Calendar, MapPin } from 'lucide-react';

interface Session {
    id: number | string;
    title: string;
    course_title: string;
    module_title: string;
    session_type: string;
    start_time: string;
    location?: string;
    meeting_url?: string;
}

export const getSessionColumns = (): ColumnDef<Session>[] => [
    {
        accessorKey: 'title',
        header: 'Session Title',
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
        accessorKey: 'session_type',
        header: 'Type',
        cell: ({ row }) => {
            const value = row.getValue<string>('session_type');
            return (
                <div className="flex items-center gap-2">
                    {value === 'PHYSICAL' ? <MapPin className="w-4 h-4" /> : <Calendar className="w-4 h-4" />}
                    <span className="capitalize">{value.toLowerCase()}</span>
                </div>
            );
        },
    },
    {
        accessorKey: 'start_time',
        header: 'Start Time',
        cell: ({ row }) => (
            <span className="text-gray-600">{new Date(row.getValue<string>('start_time')).toLocaleString()}</span>
        ),
    },
    {
        accessorKey: 'location',
        header: 'Location / Link',
        cell: ({ row }) => {
            const session = row.original;
            return (
                <span className="text-gray-600">
                    {session.session_type === 'PHYSICAL' ? session.location : (session.meeting_url || 'System Generated')}
                </span>
            );
        },
    },
];
