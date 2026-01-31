'use client';

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { DataTable } from '@/components/shared/DataTable';
import { StatesFilters } from '@/components/states/states-filters';
import { getStateColumns } from '@/components/states/state-columns';
import { Plus, Loader2 } from 'lucide-react';
import { DeleteConfirmationDialog } from '@/components/shared/delete-confirmation-dialog';
import {
    StatesRepository,
    type State,
    type StateFilters,
} from '@/repositories/states';
import { toast } from 'sonner';

export default function StatesPage() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [stateToDelete, setStateToDelete] = useState<State | null>(null);

    // Build filters object
    const filters: StateFilters = useMemo(() => {
        const f: StateFilters = {};
        if (searchTerm) f.search = searchTerm;
        if (statusFilter !== 'all') f.is_active = statusFilter === 'true';
        return f;
    }, [searchTerm, statusFilter]);

    // Fetch states with TanStack Query
    const { data: states = [], isLoading } = useQuery({
        queryKey: ['states', filters],
        queryFn: () => StatesRepository.getAll(filters),
    });

    // Delete mutation
    const deleteMutation = useMutation({
        mutationFn: (id: number) => StatesRepository.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['states'] });
            toast.success('State deleted successfully');
        },
        onError: (error) => {
            console.error('Error deleting state:', error);
            toast.error('Failed to delete state');
        },
    });

    // Unpublish mutation
    const unpublishMutation = useMutation({
        mutationFn: (id: number) => StatesRepository.unpublish(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['states'] });
            toast.success('State unpublished successfully');
        },
        onError: (error) => {
            console.error('Error unpublishing state:', error);
            toast.error('Failed to unpublish state');
        },
    });

    const filteredStates = useMemo(() => {
        // Apply local filtering for immediate UI feedback
        return states.filter((state) => {
            const matchesSearch =
                !searchTerm ||
                state.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus =
                statusFilter === 'all' ||
                String(state.is_active) === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [states, searchTerm, statusFilter]);

    const handleView = (state: State) => {
        navigate(`/states/${state.id}`);
    };

    const handleDeleteClick = (state: State) => {
        setStateToDelete(state);
        setIsDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (stateToDelete) {
            deleteMutation.mutate(stateToDelete.id);
            setStateToDelete(null);
            setIsDeleteDialogOpen(false);
        }
    };

    const handleUnpublish = async (state: State) => {
        unpublishMutation.mutate(state.id);
    };

    const handleCreateClick = () => {
        navigate('/states/create');
    };

    const columns = getStateColumns(
        handleView,
        handleDeleteClick,
        handleUnpublish
    );

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 p-4 md:p-6 pt-2 md:pt-4 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6 pt-2 md:pt-4">
            <div className="mx-auto max-w-[1600px]">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
                            States
                        </h1>
                        <p className="text-sm text-gray-600 mt-1">
                            {filteredStates.length} States Found
                        </p>
                    </div>
                    <Button
                        onClick={handleCreateClick}
                        className="bg-primary hover:bg-primary/90 text-black font-medium gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Add State
                    </Button>
                </div>

                {/* Filters */}
                <StatesFilters
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    statusFilter={statusFilter}
                    onStatusChange={setStatusFilter}
                />

                {/* Data Table */}
                <div className="overflow-x-auto">
                    <DataTable
                        columns={columns}
                        data={filteredStates}
                        pageSize={10}
                        enableRowSelection={true}
                        searchColumn="name"
                        searchValue={searchTerm}
                    />
                </div>

                {/* State Overview */}
                <Card className="mt-8 bg-white border-gray-200 shadow-sm">
                    <CardHeader>
                        <CardTitle>State Compliance Overview</CardTitle>
                        <CardDescription>
                            Summary of active states and their training
                            requirements
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                                <div className="text-2xl font-bold">
                                    {states.length}
                                </div>
                                <div className="text-gray-600 text-sm">
                                    Total Configured States
                                </div>
                            </div>
                            <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                                <div className="text-2xl font-bold text-primary">
                                    {states.filter((s) => s.is_active).length}
                                </div>
                                <div className="text-gray-600 text-sm">
                                    Active & Published
                                </div>
                            </div>
                            <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                                <div className="text-2xl font-bold">
                                    {(
                                        states.reduce(
                                            (avg, s) =>
                                                avg + (s.unarmed_hours || 0),
                                            0
                                        ) / (states.length || 1)
                                    ).toFixed(1)}
                                    h
                                </div>
                                <div className="text-gray-600 text-sm">
                                    Avg. Unarmed Duration
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <DeleteConfirmationDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Delete State"
                description="Are you sure you want to delete this state? This action cannot be undone and may affect associated courses and instructors."
                itemType="State"
                itemName={stateToDelete?.name || ''}
            />
        </div>
    );
}
