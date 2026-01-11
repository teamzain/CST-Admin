'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import { DataTable } from '@/components/shared/data-table';
import { EmployerModal } from './employer-modal';

interface Employer {
    id: number;
    name: string;
    email: string;
    contact: string;
    industry: string;
    seats: number;
    usedSeats: number;
    status: 'active' | 'inactive' | 'pending';
}

const initialEmployers: Employer[] = [
    {
        id: 1,
        name: 'SecureGuard Corp',
        email: 'contact@secureguard.com',
        contact: 'John Wilson',
        industry: 'Security Services',
        seats: 50,
        usedSeats: 50,
        status: 'active',
    },
    {
        id: 2,
        name: 'SafeHaven Inc',
        email: 'info@safehaven.com',
        contact: 'Maria Garcia',
        industry: 'Corporate',
        seats: 30,
        usedSeats: 25,
        status: 'active',
    },
    {
        id: 3,
        name: 'Elite Protection',
        email: 'admin@eliteprotection.com',
        contact: 'Robert Lee',
        industry: 'Security Services',
        seats: 40,
        usedSeats: 40,
        status: 'active',
    },
    {
        id: 4,
        name: 'Guardian Services',
        email: 'support@guardian.com',
        contact: 'Emily Davis',
        industry: 'Government',
        seats: 20,
        usedSeats: 10,
        status: 'active',
    },
    {
        id: 5,
        name: 'Shield Systems LLC',
        email: 'contact@shieldsystems.com',
        contact: 'Michael Chen',
        industry: 'Technology',
        seats: 15,
        usedSeats: 0,
        status: 'inactive',
    },
];

export default function EmployersPage() {
    const [employers, setEmployers] = useState<Employer[]>(initialEmployers);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedEmployer, setSelectedEmployer] = useState<
        Employer | undefined
    >();

    const handleCreateClick = () => {
        setSelectedEmployer(undefined);
        setModalOpen(true);
    };

    const handleEditClick = (employer: Employer) => {
        setSelectedEmployer(employer);
        setModalOpen(true);
    };

    const handleDeleteClick = (employer: Employer) => {
        if (window.confirm(`Delete employer "${employer.name}"?`)) {
            setEmployers(employers.filter((e) => e.id !== employer.id));
        }
    };

    const handleSaveEmployer = (
        employerData: Omit<Employer, 'id'> & { id?: number }
    ) => {
        if (employerData.id) {
            setEmployers(
                employers.map((e) =>
                    e.id === employerData.id
                        ? { ...employerData, id: employerData.id }
                        : e
                )
            );
        } else {
            const newId = Math.max(...employers.map((e) => e.id), 0) + 1;
            setEmployers([...employers, { ...employerData, id: newId }]);
        }
    };

    const columns = [
        {
            key: 'name' as const,
            label: 'Company',
            sortable: true,
            filterable: true,
        },
        {
            key: 'contact' as const,
            label: 'Contact',
            sortable: true,
        },
        {
            key: 'industry' as const,
            label: 'Industry',
            sortable: true,
            filterable: true,
        },
        {
            key: 'seats' as const,
            label: 'Seats Used',
            sortable: true,
            render: (value: number, row: Employer) => (
                <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary"
                            style={{
                                width: `${
                                    row.usedSeats > 0
                                        ? (row.usedSeats / value) * 100
                                        : 0
                                }%`,
                            }}
                        />
                    </div>
                    <span className="text-sm font-medium w-16">
                        {row.usedSeats}/{value}
                    </span>
                </div>
            ),
        },
        {
            key: 'status' as const,
            label: 'Status',
            sortable: true,
            render: (value: 'active' | 'inactive' | 'pending') => (
                <Badge
                    variant={
                        value === 'active'
                            ? 'default'
                            : value === 'inactive'
                            ? 'secondary'
                            : 'outline'
                    }
                >
                    {value.charAt(0).toUpperCase() + value.slice(1)}
                </Badge>
            ),
        },
    ];

    return (
        <div className="flex">
            <div className="flex-1 bg-background">
                <div className="p-8">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-foreground">
                                Employers
                            </h1>
                            <p className="text-muted-foreground mt-2">
                                Manage B2B accounts and seat allocation
                            </p>
                        </div>
                        <Button
                            onClick={handleCreateClick}
                            className="bg-primary hover:bg-primary/90 gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            New Account
                        </Button>
                    </div>

                    {/* Employers Table */}
                    <DataTable
                        data={employers}
                        columns={columns}
                        onEdit={handleEditClick}
                        onDelete={handleDeleteClick}
                        searchPlaceholder="Search employers..."
                        pageSize={10}
                    />
                </div>
            </div>

            <EmployerModal
                open={modalOpen}
                onOpenChange={setModalOpen}
                employer={selectedEmployer}
                onSave={handleSaveEmployer}
            />
        </div>
    );
}
