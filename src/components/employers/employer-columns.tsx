import { type ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { MoreVertical, Edit, Trash2, Ticket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Employer } from '@/repositories/employers';

export const getEmployerColumns = (
    onEdit: (employer: Employer) => void,
    onDelete: (employer: Employer) => void,
    onAssignSeats?: (employer: Employer) => void
): ColumnDef<Employer>[] => [
    {
        accessorKey: 'name',
        header: 'Company',
        cell: ({ row }) => {
            const employer = row.original;
            const name = employer.name || employer.company_name;
            return (
                <div className="flex flex-col gap-1">
                    <span className="font-medium text-gray-900">{name}</span>
                    <span className="text-xs text-gray-500">{employer.email}</span>
                    {employer.contact_email && employer.contact_email !== employer.email && (
                        <span className="text-xs text-gray-500">{employer.contact_email}</span>
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: 'contact',
        header: 'Contact',
        cell: ({ row }) => {
            const employer = row.original;
            const contact = employer.contact || `${employer.first_name} ${employer.last_name}`;
            const phone = employer.phone || employer.contact_phone;
            return (
                <div className="flex flex-col gap-1">
                    <span className="text-gray-600">{contact}</span>
                    {phone && <span className="text-xs text-gray-500">{phone}</span>}
                </div>
            );
        },
    },
    {
        accessorKey: 'address',
        header: 'Address',
        cell: ({ row }) => (
            <span className="text-gray-600 text-sm">{row.getValue<string>('address') || '-'}</span>
        ),
    },
    {
        accessorKey: 'industry',
        header: 'Industry',
        cell: ({ row }) => {
            const employer = row.original;
            const industry = row.getValue<string>('industry');
            const website = employer.website;
            return (
                <div className="flex flex-col gap-1">
                    <span className="text-gray-600">{industry || '-'}</span>
                    {website && (
                        <a 
                            href={website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:underline truncate"
                        >
                            {website.replace(/^https?:\/\/(www\.)?/, '')}
                        </a>
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: 'seats',
        header: 'Seats Used',
        cell: ({ row }) => {
            const employer = row.original;
            const usedSeats = employer.usedSeats || employer.used_seats || 0;
            const totalSeats = employer.seats || employer.total_seats || 0;
            const utilization = totalSeats > 0 ? (usedSeats / totalSeats) * 100 : 0;
            
            return (
                <div className="flex flex-col gap-2">
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
                            {usedSeats}/{totalSeats}
                        </span>
                    </div>
                    {Array.isArray(employer.seat_records) && employer.seat_records.length > 0 && (
                        <div className="text-xs text-gray-500">
                            {employer.seat_records.length} course{employer.seat_records.length > 1 ? 's' : ''}
                        </div>
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
            const status = String(row.getValue('status')).toLowerCase();
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
        id: 'courses',
        header: 'Courses',
        cell: ({ row }) => {
            const employer = row.original;
            const seatRecords = employer.seat_records || [];
            
            if (seatRecords.length === 0) {
                return <span className="text-gray-400 text-sm">No courses</span>;
            }
            
            return (
                <div className="flex flex-col gap-2">
                    {seatRecords.slice(0, 2).map((record: any) => (
                        <div key={record.id} className="text-xs">
                            <div className="font-medium text-gray-700">{record.course?.title || `Course ${record.course_id}`}</div>
                            <div className="text-gray-500">{record.used_seats}/{record.total_seats} seats</div>
                        </div>
                    ))}
                    {seatRecords.length > 2 && (
                        <span className="text-xs text-gray-500">+{seatRecords.length - 2} more</span>
                    )}
                </div>
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
                        {onAssignSeats && (
                            <DropdownMenuItem onClick={() => onAssignSeats(employer)}>
                                <Ticket className="mr-2 h-4 w-4" />
                                Assign Seats
                            </DropdownMenuItem>
                        )}
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