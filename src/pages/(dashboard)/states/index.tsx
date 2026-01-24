'use client';

import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { useStatesStore } from '@/stores/states-store';
import { Plus } from 'lucide-react';
import { DeleteConfirmationDialog } from '@/components/shared/delete-confirmation-dialog';
import { StatesRepository } from '@/repositories/states';
import { toast } from 'sonner';
import type { StateFilters } from '@/api/states';

export default function StatesPage() {
    const navigate = useNavigate();
    const { states, fetchStates, deleteState, unpublishState, setFilters } = useStatesStore();

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [stateToDelete, setStateToDelete] = useState<any>(null);

    // Fetch states on mount and when filters change
    useEffect(() => {
        const loadStates = async () => {
            try {
                const filters: StateFilters = {};
                
                if (searchTerm) {
                    filters.search = searchTerm;
                }
                
                if (statusFilter !== 'all') {
                    filters.is_active = statusFilter === 'true';
                }

                await fetchStates(filters);
                setFilters(filters);
            } catch (error) {
                console.error('Error loading states:', error);
            }
        };
        
        loadStates();
    }, [searchTerm, statusFilter, fetchStates, setFilters]);

    const filteredStates = useMemo(() => {
        // If we have search or status filter, backend already filtered
        // But we still apply local search/filter for immediate UI feedback
        return states.filter((state) => {
            const matchesSearch = !searchTerm || state.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'all' || String(state.is_active) === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [states, searchTerm, statusFilter]);

    const handleView = (state: any) => {
        navigate(`/states/${state.id}`);
    };

    const handleDeleteClick = (state: any) => {
        setStateToDelete(state);
        setIsDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (stateToDelete) {
            try {
                await StatesRepository.delete(stateToDelete.id);
                deleteState(stateToDelete.id);
                setStateToDelete(null);
                setIsDeleteDialogOpen(false);
            } catch (error) {
                console.error('Error deleting state:', error);
            }
        }
    };

    const handleUnpublish = async (state: any) => {
        try {
            await StatesRepository.unpublish(state.id);
            unpublishState(state.id);
            toast.success(`${state.name} unpublished successfully`);
        } catch (error) {
            console.error('Error unpublishing state:', error);
        }
    };

    const handleCreateClick = () => {
        navigate('/states/create');
    };

    const columns = getStateColumns(handleView, handleDeleteClick, handleUnpublish);

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
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
                            Summary of active states and their training requirements
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                                <div className="text-2xl font-bold">{states.length}</div>
                                <div className="text-gray-600 text-sm">Total Configured States</div>
                            </div>
                            <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                                <div className="text-2xl font-bold text-primary">
                                    {states.filter(s => s.is_active).length}
                                </div>
                                <div className="text-gray-600 text-sm">Active & Published</div>
                            </div>
                            <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                                <div className="text-2xl font-bold">
                                    {(states.reduce((avg, s) => avg + (s.unarmed_hours || 0), 0) / (states.length || 1)).toFixed(1)}h
                                </div>
                                <div className="text-gray-600 text-sm">Avg. Unarmed Duration</div>
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
