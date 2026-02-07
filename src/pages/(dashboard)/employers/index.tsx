'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import { DataTable } from '@/components/shared/DataTable';
import { EmployerModal } from './employer-modal';
import { AssignSeatsModal } from './assign-seats-modal';
import { EmployersFilters } from '@/components/employers/employers-filters';
import { getEmployerColumns } from '@/components/employers/employer-columns';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { EmployersRepository } from '@/repositories/employers';
import type { Employer, EmployerFilters as EmployerFiltersType } from '@/repositories/employers';
import { toast } from 'sonner';

export default function EmployersPage() {
    const queryClient = useQueryClient();
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedEmployer, setSelectedEmployer] = useState<Employer | undefined>();
    const [assignSeatsModalOpen, setAssignSeatsModalOpen] = useState(false);
    const [seatsEmployer, setSeatsEmployer] = useState<Employer | undefined>();
    
    // Filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [industryFilter, setIndustryFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [seatUtilizationFilter, setSeatUtilizationFilter] = useState('all');

    // Build filters object
    const filters: EmployerFiltersType = useMemo(() => {
        const f: EmployerFiltersType = {};
        if (searchTerm) f.search = searchTerm;
        if (industryFilter !== 'all') f.industry = industryFilter;
        if (statusFilter !== 'all') f.status = statusFilter.toUpperCase();
        
        // Handle seat utilization ranges
        if (seatUtilizationFilter === 'high') {
            f.min_seat_utilization = 80;
        } else if (seatUtilizationFilter === 'medium') {
            f.min_seat_utilization = 50;
            f.max_seat_utilization = 79;
        } else if (seatUtilizationFilter === 'low') {
            f.max_seat_utilization = 49;
        }
        
        return f;
    }, [searchTerm, industryFilter, statusFilter, seatUtilizationFilter]);

    // Fetch employers with TanStack Query
    const { data: employers = [], isLoading } = useQuery({
        queryKey: ['employers', filters],
        queryFn: async () => {
            const data = await EmployersRepository.getAllEmployers(filters);
            console.log('[EmployersPage] Fetched employers:', data);
            return data;
        },
    });

    // Delete mutation
    const deleteMutation = useMutation({
        mutationFn: (id: number) => EmployersRepository.deleteEmployer(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['employers'] });
            toast.success('Employer deleted successfully');
        },
    });

    // Update mutation
    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: any }) =>
            EmployersRepository.updateEmployer(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['employers'] });
            setModalOpen(false);
            setSelectedEmployer(undefined);
        },
    });

    // Create mutation
    const createMutation = useMutation({
        mutationFn: (data: any) => EmployersRepository.createEmployer(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['employers'] });
            setModalOpen(false);
            setSelectedEmployer(undefined);
        },
    });

    // Purchase seats mutation
    const purchaseSeatsMutation = useMutation({
        mutationFn: (data: any) => EmployersRepository.purchaseSeats(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['employers'] });
            setAssignSeatsModalOpen(false);
            setSeatsEmployer(undefined);
            toast.success('Seats assigned successfully');
        },
        onError: (error) => {
            console.error('Error purchasing seats:', error);
        },
    });

    const handleCreateClick = () => {
        setSelectedEmployer(undefined);
        setModalOpen(true);
    };

    const handleEditClick = (employer: Employer) => {
        setSelectedEmployer(employer);
        setModalOpen(true);
    };

    const handleSaveEmployer = (
        employerData: any
    ) => {
        if (employerData.id) {
            updateMutation.mutate({
                id: employerData.id,
                data: employerData,
            });
        } else {
            createMutation.mutate(employerData);
        }
    };

    const handleAssignSeats = (employer: Employer) => {
        setSeatsEmployer(employer);
        setAssignSeatsModalOpen(true);
    };

    const handleSubmitSeats = (data: any) => {
        purchaseSeatsMutation.mutate(data);
    };

    // Column definition with proper typing
    const columns = useMemo(() => getEmployerColumns(
        handleEditClick,
        (employer: any) => {
            deleteMutation.mutate(employer.id);
        },
        handleAssignSeats
    ), []);

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6 pt-2 md:pt-4">
            <div className="mx-auto max-w-[1600px]">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
                            Employers
                        </h1>
                        <p className="text-sm text-gray-600 mt-1">
                            {isLoading ? '...' : `${employers.length} Employers Found`}
                        </p>
                    </div>
                    <Button
                        onClick={handleCreateClick}
                        className="bg-primary hover:bg-primary/90 text-black font-medium gap-2 w-full sm:w-auto"
                    >
                        <Plus className="w-4 h-4" />
                        New Account
                    </Button>
                </div>

                {/* Filters */}
                <EmployersFilters
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    industryFilter={industryFilter}
                    onIndustryChange={setIndustryFilter}
                    statusFilter={statusFilter}
                    onStatusChange={setStatusFilter}
                    seatUtilizationFilter={seatUtilizationFilter}
                    onSeatUtilizationChange={setSeatUtilizationFilter}
                />

                {/* Loading State */}
                {isLoading && (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        <span className="ml-2 text-gray-600">Loading employers...</span>
                    </div>
                )}

                {/* Data Table */}
                {!isLoading && (
                    <div className="overflow-x-auto">
                        <DataTable
                            columns={columns}
                            data={employers}
                            pageSize={10}
                            enableRowSelection={true}
                            searchColumn="company_name"
                            searchValue={searchTerm}
                        />
                    </div>
                )}
            </div>

            <EmployerModal
                open={modalOpen}
                onOpenChange={setModalOpen}
                employer={selectedEmployer}
                onSave={handleSaveEmployer}
            />

            {seatsEmployer && (
                <AssignSeatsModal
                    open={assignSeatsModalOpen}
                    onOpenChange={setAssignSeatsModalOpen}
                    employerId={seatsEmployer.id}
                    employerName={seatsEmployer.company_name || seatsEmployer.name || 'Employer'}
                    onSubmit={handleSubmitSeats}
                    isLoading={purchaseSeatsMutation.isPending}
                />
            )}
        </div>
    );
}
