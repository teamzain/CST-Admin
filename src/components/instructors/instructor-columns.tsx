import { type ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, AlertTriangle } from 'lucide-react';
import type { Instructor } from '@/repositories/instructors';
import { Link } from 'react-router-dom';


const getDaysLeft = (expiry: string) => {
    const expiryDate = new Date(expiry);
    const today = new Date();
    const daysLeft = Math.ceil(
        (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysLeft;
};

const getStatusBadge = (
    status: 'active' | 'expired' | 'pending',
    row: Instructor
) => {
    const daysLeft = getDaysLeft(row.expiry);

    return (
        <div className="flex items-center gap-2">
            {daysLeft > 0 && daysLeft <= 7 && (
                <AlertTriangle className="w-4 h-4 text-yellow-500" />
            )}
            <Badge
                variant={
                    status === 'active'
                        ? 'default'
                        : status === 'expired'
                          ? 'destructive'
                          : 'secondary'
                }
            >
                {status === 'expired'
                    ? 'Expired'
                    : status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
            {daysLeft > 0 && daysLeft <= 7 && (
                <span className="text-xs text-yellow-500">
                    {daysLeft} days left
                </span>
            )}
        </div>
    );
};

export const getInstructorColumns = (): ColumnDef<Instructor>[] => [
    {
        accessorKey: 'name',
        header: 'Instructor',
        cell: ({ row }) => (
            <div className="flex items-center gap-3 min-w-50">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-lg shrink-0">
                    {row.original.name.charAt(0)}
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
        accessorKey: 'license',
        header: 'License',
        cell: ({ row }) => (
            <span className="text-sm text-gray-700 whitespace-nowrap">
                {row.original.license}
            </span>
        ),
    },
    {
        accessorKey: 'state',
        header: 'State',
        cell: ({ row }) => (
            <span className="text-sm text-gray-700 whitespace-nowrap">
                {row.original.state}
            </span>
        ),
    },
    {
        accessorKey: 'expiry',
        header: 'License Expiry',
        cell: ({ row }) => (
            <div className="flex flex-col">
                <span className="text-sm text-gray-700 whitespace-nowrap">
                    {new Date(row.original.expiry).toLocaleDateString()}
                </span>
                <span className="text-xs text-gray-500">
                    {getDaysLeft(row.original.expiry)} days left
                </span>
            </div>
        ),
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => getStatusBadge(row.original.status, row.original),
    },
    {
        accessorKey: 'assignedCourses',
        header: 'Assigned Courses',
        cell: () => {
            // This would come from your actual data model
            const assignedCount = 0; // Placeholder
            return (
                <span className="text-sm text-gray-700 whitespace-nowrap">
                    {assignedCount} course{assignedCount === 0 || assignedCount > 1 ? 's' : ''}
                </span>
            );
        },
    },
    {
        id: 'actions',
        header: '',
        cell: ({ row }: { row: { original: Instructor } }) => {

            return (
                <DropdownMenu key={row.original.id}>
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
                            
                        >
                            <Link to={`/instructors/${row.original.id}`}>
                            View Details
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            
                        >
                            <Link to={`/instructors/${row.original.id}/edit`}>
                            Edit Instructor
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            
                        >
                            <Link to={`/instructors/${row.original.id}/licenses`}>
                            Manage Licenses
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                        >
                            <Link to={`/instructors/${row.original.id}/courses`}>
                            Assign Courses
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>Send Email</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                            Delete Instructor
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
