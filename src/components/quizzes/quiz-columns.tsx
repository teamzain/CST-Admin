import { type ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';

interface Quiz {
    id: number | string;
    title: string;
    course_title: string;
    module_title: string;
    passing_score: number;
    is_final: boolean;
    questions: unknown[];
}

export const getQuizColumns = (): ColumnDef<Quiz>[] => [
    {
        accessorKey: 'title',
        header: 'Quiz Title',
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
        accessorKey: 'passing_score',
        header: 'Passing Score',
        cell: ({ row }) => (
            <span className="text-gray-600">{row.getValue<number>('passing_score')}%</span>
        ),
    },
    {
        accessorKey: 'is_final',
        header: 'Type',
        cell: ({ row }) => {
            const value = row.getValue<boolean>('is_final');
            return (
                <Badge variant={value ? 'default' : 'secondary'}>
                    {value ? 'Final Exam' : 'Quiz'}
                </Badge>
            );
        },
    },
    {
        accessorKey: 'questions',
        header: 'Questions',
        cell: ({ row }) => {
            const value = row.getValue<unknown[]>('questions');
            return <span className="text-gray-600">{value?.length || 0}</span>;
        },
    },
];
