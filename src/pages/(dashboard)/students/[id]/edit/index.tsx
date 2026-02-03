import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { StudentsRepository } from '@/repositories/students/repo';
import { StudentForm } from '@/components/students/student-form';
import { toast } from 'sonner';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function EditStudentPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const studentId = parseInt(id || '0');

    const { data: student, isLoading } = useQuery({
        queryKey: ['students', studentId],
        queryFn: () => StudentsRepository.getStudentById(studentId),
        enabled: !!studentId,
    });

    const mutation = useMutation({
        mutationFn: (data: any) =>
            StudentsRepository.updateStudent(studentId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['students'] });
            toast.success('Student updated successfully');
            navigate('/students');
        },
        onError: (error: any) => {
            console.error('Error updating student:', error);
            toast.error(error.message || 'Failed to update student');
        },
    });

    const handleSubmit = (data: any) => {
        mutation.mutate(data);
    };

    if (isLoading) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!student) {
        return (
            <div className="p-6 text-center">
                <p className="text-gray-500">Student not found</p>
                <button
                    onClick={() => navigate('/students')}
                    className="text-primary hover:underline mt-2"
                >
                    Back to Students
                </button>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-6 pt-2 md:pt-4">
            <div className="mx-auto">
                <div className="mb-6">
                    <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
                        Edit Student
                    </h1>
                    <p className="text-sm text-gray-600 mt-1">
                        Update student details and account settings.
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Student Information</CardTitle>
                        <CardDescription>
                            Modification will take effect immediately.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <StudentForm
                            initialData={student}
                            onSubmit={handleSubmit}
                            isLoading={mutation.isPending}
                            isEdit
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
