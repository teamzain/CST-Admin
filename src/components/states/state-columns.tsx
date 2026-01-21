import { type ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';

interface State {
    id: number | string;
    name: string;
    code: string;
    unarmed_hours: number;
    armed_hours: number;
    requires_range_training: boolean;
    is_active: boolean;
}

export const getStateColumns = (): ColumnDef<State>[] => [
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
        accessorKey: 'is_active',
        header: 'Status',
        cell: ({ row }) => {
            const value = row.getValue<boolean>('is_active');
            return (
                <Badge variant={value ? 'default' : 'secondary'}>
                    {value ? 'Published' : 'Unpublished'}
                </Badge>
            );
        },
    },
];
