import { type ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { MoreVertical, Eye, XCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface State {
    id: number | string;
    name: string;
    code: string;
    unarmed_hours: number;
    armed_hours: number;
    requires_range_training: boolean;
    is_active: boolean;
    is_seat_time_enabled: boolean;
    id_check_frequency: number;
}

export const getStateColumns = (onView: (state: State) => void, onDelete: (state: State) => void, onUnpublish: (state: State) => void): ColumnDef<State>[] => [
    {
        accessorKey: 'name',
        header: 'State Name',
        cell: ({ row }) => (
            <span className="font-medium text-gray-900">{row.getValue<string>('name')}</span>
        ),
    },
    {
        accessorKey: 'code',
        header: 'Code',
        cell: ({ row }) => (
            <Badge variant="outline">{row.getValue<string>('code')}</Badge>
        ),
    },
    {
        accessorKey: 'unarmed_hours',
        header: 'Unarmed Hours',
        cell: ({ row }) => (
            <span className="text-gray-600">{row.getValue<number>('unarmed_hours')}</span>
        ),
    },
    {
        accessorKey: 'armed_hours',
        header: 'Armed Hours',
        cell: ({ row }) => (
            <span className="text-gray-600">{row.getValue<number>('armed_hours')}</span>
        ),
    },
    {
        accessorKey: 'requires_range_training',
        header: 'Range Required',
        cell: ({ row }) => {
            const value = row.getValue<boolean>('requires_range_training');
            return (
                <span className={value ? 'text-green-600 font-medium' : 'text-gray-500'}>
                    {value ? 'Yes' : 'No'}
                </span>
            );
        },
    },
    {
        accessorKey: 'is_seat_time_enabled',
        header: 'Seat Time',
        cell: ({ row }) => {
            const value = row.getValue<boolean>('is_seat_time_enabled');
            return (
                <Badge variant={value ? 'default' : 'secondary'}>
                    {value ? 'Enabled' : 'Disabled'}
                </Badge>
            );
        },
    },
    {
        accessorKey: 'id_check_frequency',
        header: 'ID Check',
        cell: ({ row }) => (
            <span className="text-gray-600">{row.getValue<number>('id_check_frequency')}</span>
        ),
    },
    {
        accessorKey: 'is_active',
        header: 'Status',
        cell: ({ row }) => {
            const value = row.getValue<boolean>('is_active');
            return (
                <Badge
                    variant="secondary"
                    className={value
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "bg-gray-100 text-gray-700 border-gray-200"
                    }
                >
                    {value ? 'Published' : 'Unpublished'}
                </Badge>
            );
        },
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const state = row.original;
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
                            <DropdownMenuItem onClick={() => onView(state)} className="gap-2">
                                <Eye className="w-4 h-4" />
                                View State
                            </DropdownMenuItem>
                            {state.is_active && (
                                <DropdownMenuItem onClick={() => onUnpublish(state)} className="gap-2">
                                    <XCircle className="w-4 h-4" />
                                    Unpublish State
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                                onClick={() => onDelete(state)}
                                className="text-red-600 gap-2"
                            >
                                <Trash2 className="w-4 h-4" />
                                Delete State
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            );
        },
    },
];
