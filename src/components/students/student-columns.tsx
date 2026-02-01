import { type ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    MoreVertical,
    Eye,
    Edit2,
    Trash2,
    Ban,
    CheckCircle,
} from 'lucide-react';
import {
    type StudentWithEnrollments,
    StudentStatus,
} from '@/repositories/students/types';
import { Badge } from '@/components/ui/badge';

const getStatusColor = (status: StudentStatus) => {
    switch (status) {
        case StudentStatus.ACTIVE:
            return 'bg-green-100 text-green-700 hover:bg-green-100';
        case StudentStatus.SUSPENDED:
            return 'bg-red-100 text-red-700 hover:bg-red-100';
        case StudentStatus.INACTIVE:
            return 'bg-gray-100 text-gray-700 hover:bg-gray-100';
        default:
            return 'bg-gray-100 text-gray-700 hover:bg-gray-100';
    }
};

export const getStudentColumns = (
    onView: (id: number) => void,
    onEdit: (id: number) => void,
    onDelete: (id: number) => void,
    onStatusChange: (id: number, status: StudentStatus) => void
): ColumnDef<StudentWithEnrollments>[] => [
    {
        id: 'name',
        accessorFn: (row) => `${row.first_name} ${row.last_name}`,
        header: 'Student',
        cell: ({ row }) => (
            <div className="flex items-center gap-3 min-w-[200px]">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-lg flex-shrink-0">
                    {row.original.avatar ? (
                        <img
                            src={row.original.avatar}
                            alt={row.original.first_name}
                            className="w-full h-full rounded-full object-cover"
                        />
                    ) : (
                        <span>
                            {row.original.first_name[0]}
                            {row.original.last_name[0]}
                        </span>
                    )}
                </div>
                <div className="min-w-0">
                    <div className="font-medium text-gray-900 truncate">
                        {row.original.first_name} {row.original.last_name}
                    </div>
                    <div className="text-sm text-gray-500 truncate">
                        {row.original.email}
                    </div>
                </div>
            </div>
        ),
    },
    {
        accessorKey: 'id',
        header: 'User ID',
        cell: ({ row }) => (
            <span className="text-sm text-gray-700 whitespace-nowrap">
                #{row.original.id}
            </span>
        ),
    },
    {
        accessorKey: 'state_id',
        header: 'State',
        cell: ({ row }) => (
            <span className="text-sm text-gray-700 whitespace-nowrap">
                {/* State name would ideally come from the API or a map */}
                State ID: {row.original.state_id}
            </span>
        ),
    },
    {
        accessorKey: 'enrolledCoursesCount',
        header: 'Enrolled Courses',
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">
                    {row.original.enrolledCoursesCount} Courses
                </span>
            </div>
        ),
    },
    {
        id: 'linked_employer',
        header: 'Linked Employer',
        cell: () => (
            <span className="text-sm text-gray-700">
                {/* Placeholder for now as it's not in the repository yet */}
                N/A
            </span>
        ),
    },
    {
        id: 'employer_of_course',
        header: 'Employer of Course',
        cell: () => (
            <span className="text-sm text-gray-700">
                {/* Placeholder for now */}
                N/A
            </span>
        ),
    },
    {
        id: 'status',
        accessorFn: (row) => row.user_auth.status,
        header: 'Status',
        cell: ({ row }) => (
            <Badge
                variant="outline"
                className={`rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap inline-block border-none ${getStatusColor(
                    row.original.user_auth.status
                )}`}
            >
                {row.original.user_auth.status}
            </Badge>
        ),
    },
    {
        id: 'actions',
        header: '',
        cell: ({ row }) => {
            return (
                <div className="flex justify-end pr-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                            >
                                <MoreVertical className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                className="gap-2"
                                onClick={() => onView(row.original.id)}
                            >
                                <Eye className="w-4 h-4" />
                                View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="gap-2"
                                onClick={() => onEdit(row.original.id)}
                            >
                                <Edit2 className="w-4 h-4" />
                                Edit Student
                            </DropdownMenuItem>
                            {row.original.user_auth.status ===
                            StudentStatus.ACTIVE ? (
                                <DropdownMenuItem
                                    className="gap-2 text-yellow-600"
                                    onClick={() =>
                                        onStatusChange(
                                            row.original.id,
                                            StudentStatus.SUSPENDED
                                        )
                                    }
                                >
                                    <Ban className="w-4 h-4" />
                                    Suspend Student
                                </DropdownMenuItem>
                            ) : (
                                <DropdownMenuItem
                                    className="gap-2 text-green-600"
                                    onClick={() =>
                                        onStatusChange(
                                            row.original.id,
                                            StudentStatus.ACTIVE
                                        )
                                    }
                                >
                                    <CheckCircle className="w-4 h-4" />
                                    Activate Student
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                                className="text-red-600 gap-2"
                                onClick={() => onDelete(row.original.id)}
                            >
                                <Trash2 className="w-4 h-4" />
                                Delete Student
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            );
        },
    },
];
