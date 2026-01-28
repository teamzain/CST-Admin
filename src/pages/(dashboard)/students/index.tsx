import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/shared/DataTable';
import { type ColumnDef } from '@/components/shared/DataTable';
import { UsersFilters } from '@/components/users/users-filters';
import { DateRangePicker } from '@/components/shared/date-range-picker';
import { getUserColumns } from '@/components/users/user-columns';
import { dummyUsers } from '@/components/users/dummy-users';
import type { User } from '@/repositories/users/types';

export default function UsersPage() {
    const [users] = useState<User[]>(dummyUsers);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
    const [roleFilter, setRoleFilter] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<string>('All Users');
    const [dateModalOpen, setDateModalOpen] = useState(false);

    // Filter users based on role and status
    const filteredUsers = useMemo(() => {
        return users.filter((user) => {
            const matchesRole =
                roleFilter === 'all' || user.role === roleFilter;
            const matchesStatus =
                statusFilter === 'All Users' ||
                user.status.toLowerCase() === statusFilter.toLowerCase();

            return matchesRole && matchesStatus;
        });
    }, [users, roleFilter, statusFilter]);

    // Bulk actions handler
    const handleBulkAction = (action: string) => {
        console.log(`Bulk action: ${action}`, selectedUsers);
        alert(`${action} will be performed on ${selectedUsers.length} user(s)`);
    };

    // Date filter handler
    const handleDateApply = (startDate: string, endDate: string) => {
        console.log('Date filter applied:', { startDate, endDate });
        // Implement date filtering logic here
    };

    const columns: ColumnDef<User>[] = getUserColumns();

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6 pt-2 md:pt-4">
            <div className="mx-auto max-w-[1600px]">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
                            All Users
                        </h1>
                        <p className="text-sm text-gray-600 mt-1">
                            {filteredUsers.length} Users Found
                        </p>
                    </div>
                    <Button className="bg-primary hover:bg-primary/90 text-secondary font-medium w-full sm:w-auto">
                        + Add User
                    </Button>
                </div>

                {/* Filters */}
                <UsersFilters
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    roleFilter={roleFilter}
                    onRoleChange={setRoleFilter}
                    statusFilter={statusFilter}
                    onStatusChange={setStatusFilter}
                    onDateFilterClick={() => setDateModalOpen(true)}
                    selectedCount={selectedUsers.length}
                    onBulkAction={handleBulkAction}
                />

                {/* Data Table */}
                <div className="overflow-x-auto">
                    <DataTable
                        columns={columns}
                        data={filteredUsers}
                        pageSize={10}
                        enableRowSelection={true}
                        onRowSelectionChange={setSelectedUsers}
                        searchColumn="name"
                        searchValue={searchTerm}
                    />
                </div>

                {/* Date Range Picker Modal */}
                <DateRangePicker
                    open={dateModalOpen}
                    onOpenChange={setDateModalOpen}
                    onApply={handleDateApply}
                />
            </div>
        </div>
    );
}
