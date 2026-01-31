import { type ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { MoreVertical, Eye, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { type Quiz } from '@/repositories/quizzes';

interface QuizWithDetails extends Quiz {
    course_title?: string;
    module_title?: string;
}

export const getQuizColumns = (
    onView: (quiz: QuizWithDetails) => void,
    onDelete: (quiz: QuizWithDetails) => void
): ColumnDef<QuizWithDetails>[] => [
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
        header: () => <span className="whitespace-nowrap">Passing Score</span>,
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
        id: 'questions_count',
        header: 'Questions',
        cell: ({ row }) => {
            const quiz = row.original;
            // Try questions array first, then _count, then 0
            const count = quiz.questions?.length ?? quiz._count?.questions ?? 0;
            return <span className="text-gray-600">{count}</span>;
        },
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const quiz = row.original;
            return (
                <div className="flex justify-end pr-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreVertical className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => onView(quiz)} className="gap-2">
                                <Eye className="w-4 h-4" />
                                View Quiz
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => onDelete(quiz)}
                                className="text-red-600 gap-2"
                            >
                                <Trash2 className="w-4 h-4" />
                                Delete Quiz
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            );
        },
    },
];
