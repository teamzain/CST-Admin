import { type ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { MoreVertical, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Employer {
    id: number;
    name: string;
    email: string;
    contact: string;
    industry: string;
    seats: number;
    usedSeats: number;
    status: 'active' | 'inactive' | 'pending';
}

export const getEmployerColumns = (
    onEdit: (employer: Employer) => void,
    onDelete: (employer: Employer) => void
): ColumnDef<Employer>[] => [
    {
        accessorKey: 'name',
        header: 'Company',
        cell: ({ row }) => {
            const employer = row.original;
            return (
                <div className="flex flex-col">
                    <span className="font-medium text-gray-900">{employer.name}</span>
                    <span className="text-sm text-gray-500">{employer.email}</span>
                </div>
            );
        },
    },
    {
        accessorKey: 'contact',
        header: 'Contact',
        cell: ({ row }) => (
            <span className="text-gray-600">{row.getValue<string>('contact')}</span>
        ),
    },
    {
        accessorKey: 'industry',
        header: 'Industry',
        cell: ({ row }) => (
            <span className="text-gray-600">{row.getValue<string>('industry')}</span>
        ),
    },
    {
        accessorKey: 'seats',
        header: 'Seats Used',
        cell: ({ row }) => {
            const employer = row.original;
            const utilization = employer.usedSeats > 0 ? (employer.usedSeats / employer.seats) * 100 : 0;
            
            return (
                <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary"
                            style={{
                                width: `${utilization}%`,
                            }}
                        />
                    </div>
                    <span className="text-sm font-medium w-16">
                        {employer.usedSeats}/{employer.seats}
                    </span>
                </div>
            );
        },
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
            const status = row.getValue<'active' | 'inactive' | 'pending'>('status');
            return (
                <Badge
                    variant={
                        status === 'active'
                            ? 'default'
                            : status === 'inactive'
                            ? 'secondary'
                            : 'outline'
                    }
                >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                </Badge>
            );
        },
    },
    {
        id: 'actions',
        header: '',
        cell: ({ row }) => {
            const employer = row.original;
            
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => onEdit(employer)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                            onClick={() => onDelete(employer)}
                            className="text-red-600"
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];