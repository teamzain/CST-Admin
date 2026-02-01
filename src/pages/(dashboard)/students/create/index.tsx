import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
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

export default function CreateStudentPage() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (data: any) => StudentsRepository.createStudent(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['students'] });
            toast.success('Student created successfully');
            navigate('/students');
        },
        onError: (error: any) => {
            console.error('Error creating student:', error);
            toast.error(error.message || 'Failed to create student');
        },
    });

    const handleSubmit = (data: any) => {
        mutation.mutate(data);
    };

    return (
        <div className="p-4 md:p-6 pt-2 md:pt-4">
            <div className="mx-auto">
                <div className="mb-6">
                    <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
                        Add New Student
                    </h1>
                    <p className="text-sm text-gray-600 mt-1">
                        Create a new student record and login credentials.
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Student Information</CardTitle>
                        <CardDescription>
                            All fields are required unless marked otherwise.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <StudentForm
                            onSubmit={handleSubmit}
                            isLoading={mutation.isPending}
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
