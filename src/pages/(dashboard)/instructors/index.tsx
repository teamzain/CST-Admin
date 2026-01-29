'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { InstructorsFilters } from '@/components/instructors/instructors-filters';
import { DateRangePicker } from '@/components/shared/date-range-picker';
import { dummyInstructors } from '@/components/instructors/dummy-instructors';
import InstructorCard from '@/components/instructors/InstructorCard';
import type { Instructor } from '@/repositories/instructors';
import { useNavigate } from 'react-router-dom';

export default function InstructorsPage() {
    const router = useNavigate();
    const [instructors] = useState<Instructor[]>(dummyInstructors);
    const [searchTerm, setSearchTerm] = useState('');

    const [stateFilter, setStateFilter] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<string>('All Status');
    const [dateModalOpen, setDateModalOpen] = useState(false);

    // Filter instructors based on state, status, and search term
    const filteredInstructors = useMemo(() => {
        return instructors.filter((instructor) => {
            const matchesState =
                stateFilter === 'all' || instructor.state === stateFilter;
            const matchesStatus =
                statusFilter === 'All Status' ||
                instructor.status.toLowerCase() === statusFilter.toLowerCase();
            const matchesSearch =
                searchTerm === '' ||
                instructor.name
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                instructor.email
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase());

            return matchesState && matchesStatus && matchesSearch;
        });
    }, [instructors, stateFilter, statusFilter, searchTerm]);

    // Date filter handler
    const handleDateApply = (startDate: string, endDate: string) => {
        console.log('Date filter applied:', { startDate, endDate });
        // Implement date filtering logic here
    };

    // View profile handler
    const handleViewProfile = (id: number) => {
        router(`/instructors/${id}`);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6 pt-2 md:pt-4">
            <div className="mx-auto max-w-400">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
                            Instructor
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
                />

                {/* Instructor Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                    {filteredInstructors.map((instructor) => (
                        <InstructorCard
                            key={instructor.id}
                            instructor={instructor}
                            onViewProfile={handleViewProfile}
                        />
                    ))}
                </div>

                {/* Empty State */}
                {filteredInstructors.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">
                            No instructors found
                        </p>
                        <p className="text-gray-400 text-sm mt-2">
                            Try adjusting your filters or search criteria
                        </p>
                    </div>
                )}

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
