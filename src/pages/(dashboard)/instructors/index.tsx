'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/shared/DataTable';
import { type ColumnDef } from '@/components/shared/DataTable';
import { InstructorsFilters } from '@/components/instructors/instructors-filters';
import { DateRangePicker } from '@/components/shared/date-range-picker';
import { getInstructorColumns } from '@/components/instructors/instructor-columns';
import { dummyInstructors } from '@/components/instructors/dummy-instructors';
import type { Instructor } from '@/repositories/instructors';
import { useNavigate } from 'react-router-dom';

export default function InstructorsPage() {
    const router = useNavigate();
    const [instructors] = useState<Instructor[]>(dummyInstructors);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedInstructors, setSelectedInstructors] = useState<
        Instructor[]
    >([]);
    const [stateFilter, setStateFilter] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<string>('All Status');
    const [dateModalOpen, setDateModalOpen] = useState(false);

    // Filter instructors based on state and status
    const filteredInstructors = useMemo(() => {
        return instructors.filter((instructor) => {
            const matchesState =
                stateFilter === 'all' || instructor.state === stateFilter;
            const matchesStatus =
                statusFilter === 'All Status' ||
                instructor.status.toLowerCase() === statusFilter.toLowerCase();

            return matchesState && matchesStatus;
        });
    }, [instructors, stateFilter, statusFilter]);

    // Bulk actions handler
    const handleBulkAction = (action: string) => {
        console.log(`Bulk action: ${action}`, selectedInstructors);
        alert(
            `${action} will be performed on ${selectedInstructors.length} instructor(s)`
        );
    };

    // Date filter handler
    const handleDateApply = (startDate: string, endDate: string) => {
        console.log('Date filter applied:', { startDate, endDate });
        // Implement date filtering logic here
    };

    const columns: ColumnDef<Instructor>[] = getInstructorColumns();

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6 pt-2 md:pt-4">
            <div className="mx-auto max-w-400">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
                            All Instructors
                        </h1>
                        <p className="text-sm text-gray-600 mt-1">
                            {filteredInstructors.length} Instructors Found
                        </p>
                    </div>
                    <Button
                        className="bg-primary hover:bg-primary/90 text-secondary font-medium w-full sm:w-auto"
                        onClick={() => router('/instructors/create')}
                    >
                        + Add Instructor
                    </Button>
                </div>

                {/* Filters */}
                <InstructorsFilters
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    stateFilter={stateFilter}
                    onStateChange={setStateFilter}
                    statusFilter={statusFilter}
                    onStatusChange={setStatusFilter}
                    onDateFilterClick={() => setDateModalOpen(true)}
                    selectedCount={selectedInstructors.length}
                    onBulkAction={handleBulkAction}
                />

                {/* Data Table */}
                <div className="overflow-x-auto">
                    <DataTable
                        columns={columns}
                        data={filteredInstructors}
                        pageSize={10}
                        enableRowSelection={true}
                        onRowSelectionChange={setSelectedInstructors}
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
