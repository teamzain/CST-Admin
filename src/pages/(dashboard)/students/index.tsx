import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/shared/DataTable';
import { UsersFilters } from '@/components/users/users-filters';
import { DateRangePicker } from '@/components/shared/date-range-picker';
import { getStudentColumns } from '@/components/students/student-columns';
import { StudentsRepository } from '@/repositories/students/repo';
import {
    StudentStatus,
    type StudentFilters,
    type StudentWithEnrollments,
} from '@/repositories/students/types';
import { toast } from 'sonner';
import { Loader2, Plus } from 'lucide-react';
import { DeleteConfirmationDialog } from '@/components/shared/delete-confirmation-dialog';

export default function StudentsPage() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('All Users');
    const [roleFilter, setRoleFilter] = useState<string>('all');
    const [dateModalOpen, setDateModalOpen] = useState(false);

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [studentToDelete, setStudentToDelete] =
        useState<StudentWithEnrollments | null>(null);

    // Build filters object
    const filters: StudentFilters = useMemo(() => {
        const f: StudentFilters = {};
        if (searchTerm) f.search = searchTerm;
        if (statusFilter !== 'All Users') {
            f.status = statusFilter.toUpperCase() as StudentStatus;
        }
        return f;
    }, [searchTerm, statusFilter]);

    // Fetch students with TanStack Query
    const { data: students = [], isLoading } = useQuery({
        queryKey: ['students', filters],
        queryFn: async () => {
            const data = await StudentsRepository.getAllStudents(filters);
            // Assuming the API might return Student[] but columns expect StudentWithEnrollments[]
            return data as StudentWithEnrollments[];
        },
    });

    // Delete mutation
    const deleteMutation = useMutation({
        mutationFn: (id: number) => StudentsRepository.deleteStudent(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['students'] });
            toast.success('Student deleted successfully');
            setIsDeleteDialogOpen(false);
        },
    });

    // Status change mutation
    const statusMutation = useMutation({
        mutationFn: ({ id, status }: { id: number; status: StudentStatus }) => {
            if (status === StudentStatus.SUSPENDED) {
                return StudentsRepository.suspendStudent(id);
            } else {
                return StudentsRepository.activateStudent(id);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['students'] });
        },
    });

    const handleView = (id: number) => {
        navigate(`/students/${id}`);
    };

    const handleEdit = (id: number) => {
        navigate(`/students/${id}/edit`);
    };

    const handleDeleteClick = (student: StudentWithEnrollments) => {
        setStudentToDelete(student);
        setIsDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (studentToDelete) {
            deleteMutation.mutate(studentToDelete.id);
        }
    };

    const handleStatusChange = (id: number, status: StudentStatus) => {
        statusMutation.mutate({ id, status });
    };

    const handleBulkAction = (_action: string) => {
        // TODO: implement bulk actions
    };

    const handleDateApply = (_startDate: string, _endDate: string) => {
        // TODO: implement date filtering
    };

    const columns = getStudentColumns(
        handleView,
        handleEdit,
        handleDeleteClick,
        handleStatusChange
    );

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
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
                            Students
                        </h1>
                        <p className="text-sm text-gray-600 mt-1">
                            {students.length} Students Found
                        </p>
                    </div>
                    <Button
                        onClick={() => navigate('/students/create')}
                        className="bg-primary hover:bg-primary/90 text-black font-medium w-full sm:w-auto gap-2"
                        style={{ display: roleFilter === 'Instructor' ? 'none' : 'flex' }}
                    >
                        <Plus className="w-4 h-4" />
                        Add Student
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
                    selectedCount={0}
                    onBulkAction={handleBulkAction}
                />

                {/* Data Table */}
                <div className="overflow-x-auto">
                    <DataTable
                        columns={columns}
                        data={students}
                        pageSize={10}
                        enableRowSelection={true}
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

                <DeleteConfirmationDialog
                    isOpen={isDeleteDialogOpen}
                    onClose={() => setIsDeleteDialogOpen(false)}
                    onConfirm={handleConfirmDelete}
                    title="Delete Student"
                    description="Are you sure you want to delete this student? This action cannot be undone."
                    itemType="Student"
                    itemName={
                        studentToDelete
                            ? `${studentToDelete.first_name} ${studentToDelete.last_name}`
                            : ''
                    }
                />
            </div>
        </div>
    );
}
