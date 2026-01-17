import { type ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical } from 'lucide-react';
import type { User } from '@/repositories/users/types';
import { Link } from 'react-router-dom';

const getStatusColor = (status: string) => {
    switch (status) {
        case 'Active':
            return 'bg-green-100 text-green-700';
        case 'Suspended':
            return 'bg-yellow-100 text-yellow-700';
        case 'Invited':
            return 'bg-blue-100 text-blue-700';
        default:
            return 'bg-gray-100 text-gray-700';
    }
};

export const getUserColumns = (): ColumnDef<User>[] => [
    {
        accessorKey: 'name',
        header: 'User',
        cell: ({ row }) => (
            <div className="flex items-center gap-3 min-w-[200px]">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-lg flex-shrink-0">
                    {row.original.avatar}
                </div>
                <div className="min-w-0">
                    <div className="font-medium text-gray-900 truncate">
                        {row.original.name}
                    </div>
                    <div className="text-sm text-gray-500 truncate">
                        {row.original.email}
                    </div>
                </div>
            </div>
        ),
    },
    {
        accessorKey: 'userId',
        header: 'User ID',
        cell: ({ row }) => (
            <span className="text-sm text-gray-700 whitespace-nowrap">
                {row.original.userId}
            </span>
        ),
    },
    {
        accessorKey: 'role',
        header: 'Role',
        cell: ({ row }) => (
            <span className="text-sm text-gray-700 whitespace-nowrap">
                {row.original.role}
            </span>
        ),
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => (
            <span
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap inline-block ${getStatusColor(
                    row.original.status
                )}`}
            >
                {row.original.status}
            </span>
        ),
    },
    {
        accessorKey: 'registrationDate',
        header: 'Registration Date',
        cell: ({ row }) => (
            <span className="text-sm text-gray-700 whitespace-nowrap">
                {row.original.registrationDate}
            </span>
        ),
    },
    {
        accessorKey: 'lastActivity',
        header: 'Last activity',
        cell: ({ row }) => (
            <span className="text-sm text-gray-700 whitespace-nowrap">
                {row.original.lastActivity}
            </span>
        ),
    },
    {
        id: 'actions',
        header: '',
        cell: ({ row }: { row: { original: User } }) => (
            <DropdownMenu key={row.original.id}>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="w-4 h-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                        <Link to={`/students/${row.original.id}`}>
                        View Details
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>Edit User</DropdownMenuItem>
                    <DropdownMenuItem>Send Email</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                        Delete User
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        ),
    },
];
