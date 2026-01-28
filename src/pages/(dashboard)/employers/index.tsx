'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { DataTable } from '@/components/shared/DataTable';
import { EmployerModal } from './employer-modal';
import { EmployersFilters } from '@/components/employers/employers-filters';
import { getEmployerColumns } from '@/components/employers/employer-columns';

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
    
    // Filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [industryFilter, setIndustryFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [seatUtilizationFilter, setSeatUtilizationFilter] = useState('all');

    // Filter employers
    const filteredEmployers = useMemo(() => {
        return employers.filter((employer) => {
            // Search filter
            const matchesSearch = searchTerm === '' || 
                employer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                employer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                employer.contact.toLowerCase().includes(searchTerm.toLowerCase());

            // Industry filter
            const matchesIndustry = industryFilter === 'all' || employer.industry === industryFilter;

            // Status filter
            const matchesStatus = statusFilter === 'all' || employer.status === statusFilter;

            // Seat utilization filter
            const utilization = employer.usedSeats / employer.seats;
            const matchesUtilization = seatUtilizationFilter === 'all' ||
                (seatUtilizationFilter === 'high' && utilization >= 0.8) ||
                (seatUtilizationFilter === 'medium' && utilization >= 0.5 && utilization < 0.8) ||
                (seatUtilizationFilter === 'low' && utilization < 0.5);

            return matchesSearch && matchesIndustry && matchesStatus && matchesUtilization;
        });
    }, [employers, searchTerm, industryFilter, statusFilter, seatUtilizationFilter]);

    const handleCreateClick = () => {
        setSelectedEmployer(undefined);
        setModalOpen(true);
    };

    const handleEditClick = (employer: Employer) => {
        setSelectedEmployer(employer);
        setModalOpen(true);
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

    // Column definition with proper typing
    const columns = useMemo(() => getEmployerColumns(
        handleEditClick,
        (employer) => {
            if (window.confirm(`Delete employer "${employer.name}"?`)) {
                setEmployers(employers.filter((e) => e.id !== employer.id));
            }
        }
    ), [employers]);

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
                            {filteredEmployers.length} Employers Found
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

                {/* Data Table */}
                <div className="overflow-x-auto">
                    <DataTable
                        columns={columns}
                        data={filteredEmployers}
                        pageSize={10}
                        enableRowSelection={true}
                        searchColumn="name"
                        searchValue={searchTerm}
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
