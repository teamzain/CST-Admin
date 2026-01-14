'use client';

import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, MapPin } from 'lucide-react';
import { DataTableClickable } from '@/components/shared/data-table-clickable';
import { useStatesStore, type State } from '@/stores/states-store';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';

export default function StatesPage() {
    const navigate = useNavigate();
    const { states } = useStatesStore();

    // Filters
    const [statusFilter, setStatusFilter] = useState('all');

    const filteredStates = states.filter((state) => {
        if (statusFilter !== 'all' && String(state.is_active) !== statusFilter) return false;
        return true;
    });

    const handleCreateClick = () => {
        navigate('/states/create');
    };

    const handleRowClick = (state: State) => {
        navigate(`/states/${state.id}`);
    };

    const columns = [
        {
            key: 'name' as const,
            label: 'State Name',
            sortable: true,
            filterable: true,
            render: (value: string) => (
                <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">{value}</span>
                </div>
            )
        },
        {
            key: 'code' as const,
            label: 'Code',
            sortable: true,
            filterable: true,
            render: (value: string) => (
                <Badge variant="outline">{value}</Badge>
            )
        },
        {
            key: 'unarmed_hours' as const,
            label: 'Unarmed Hours',
            sortable: true,
        },
        {
            key: 'armed_hours' as const,
            label: 'Armed Hours',
            sortable: true,
        },
        {
            key: 'requires_range_training' as const,
            label: 'Range Required',
            sortable: true,
            render: (value: boolean) => (
                value ? <span className="text-green-600 font-medium">Yes</span> : <span className="text-muted-foreground">No</span>
            )
        },
        {
            key: 'is_active' as const,
            label: 'Status',
            sortable: true,
            render: (value: boolean) => (
                <Badge variant={value ? 'default' : 'secondary'}>
                    {value ? 'Published' : 'Unpublished'}
                </Badge>
            ),
        },
    ];

    const extraFilters = (
        <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-35 bg-background border-input">
                <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="true">Published</SelectItem>
                <SelectItem value="false">Unpublished</SelectItem>
            </SelectContent>
        </Select>
    );

    return (
        <div className="flex-1 bg-background">
            <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">
                            States
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            Manage licensing states and requirements
                        </p>
                    </div>
                    {/* Placeholder for create action - functionalities can be added later */}
                    <Button
                        onClick={handleCreateClick}
                        className="bg-primary hover:bg-primary/90 gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Add State
                    </Button>
                </div>

                {/* States Table */}
                <DataTableClickable
                    data={filteredStates}
                    columns={columns}
                    onRowClick={handleRowClick}
                    searchPlaceholder="Search states..."
                    pageSize={10}
                    extraFilters={extraFilters}
                />

                {/* State Overview */}
                <Card className="mt-8 bg-card border-border">
                    <CardHeader>
                        <CardTitle>State Compliance Overview</CardTitle>
                        <CardDescription>
                            Summary of active states and their training requirements
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="border border-border rounded-lg p-6 bg-card/50">
                                <div className="text-2xl font-bold">{states.length}</div>
                                <div className="text-muted-foreground text-sm">Total Configured States</div>
                            </div>
                            <div className="border border-border rounded-lg p-6 bg-card/50">
                                <div className="text-2xl font-bold text-primary">
                                    {states.filter(s => s.is_active).length}
                                </div>
                                <div className="text-muted-foreground text-sm">Active & Published</div>
                            </div>
                            <div className="border border-border rounded-lg p-6 bg-card/50">
                                <div className="text-2xl font-bold">
                                    {states.reduce((avg, s) => avg + (s.unarmed_hours || 0), 0) / states.length}h
                                </div>
                                <div className="text-muted-foreground text-sm">Avg. Unarmed Duration</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
