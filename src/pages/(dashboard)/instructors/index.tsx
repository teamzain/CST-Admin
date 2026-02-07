'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { InstructorsFilters } from '@/components/instructors/instructors-filters';
import { DateRangePicker } from '@/components/shared/date-range-picker';
import InstructorCard from '@/components/instructors/InstructorCard';
import type { InstructorFilters as InstructorFiltersType } from '@/repositories/instructors';
import { InstructorsRepository } from '@/repositories/instructors';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';

export default function InstructorsPage() {
    const router = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [stateFilter, setStateFilter] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<string>('All Status');
    const [dateModalOpen, setDateModalOpen] = useState(false);
    const [joinDateFrom, setJoinDateFrom] = useState<string>('');
    const [joinDateTo, setJoinDateTo] = useState<string>('');

    // Build filters object
    const filters: InstructorFiltersType = useMemo(() => {
        const f: InstructorFiltersType = {};
        if (searchTerm) f.search = searchTerm;
        if (stateFilter !== 'all') f.state_id = parseInt(stateFilter);
        if (statusFilter !== 'All Status') f.status = statusFilter.toUpperCase();
        if (joinDateFrom) f.join_date_from = joinDateFrom;
        if (joinDateTo) f.join_date_to = joinDateTo;
        return f;
    }, [searchTerm, stateFilter, statusFilter, joinDateFrom, joinDateTo]);

    // Fetch instructors with TanStack Query
    const { data: instructors = [], isLoading } = useQuery({
        queryKey: ['instructors', filters],
        queryFn: async () => {
            const data = await InstructorsRepository.getAllInstructors(filters);
            console.log('[InstructorsPage] Fetched instructors:', data);
            return data;
        },
    });

    // Date filter handler
    const handleDateApply = (startDate: string, endDate: string) => {
        console.log('Date filter applied:', { startDate, endDate });
        setJoinDateFrom(startDate);
        setJoinDateTo(endDate);
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
                            {isLoading ? '...' : `${instructors.length} Instructors Found`}
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

                {/* Loading State */}
                {isLoading && (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        <span className="ml-2 text-gray-600">Loading instructors...</span>
                    </div>
                )}

                {/* Instructor Cards Grid */}
                {!isLoading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                        {instructors.map((instructor) => (
                            <InstructorCard
                                key={instructor.id}
                                instructor={instructor}
                                onViewProfile={handleViewProfile}
                            />
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && instructors.length === 0 && (
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
