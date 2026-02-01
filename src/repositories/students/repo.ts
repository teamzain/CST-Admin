import { userApi } from '@/api';
import { toast } from 'sonner';
import { USER_ROUTES, buildUrl } from '@/config/routes';
import {
    type Student,
    type CreateStudentInput,
    type UpdateStudentInput,
    type StudentFilters,
    type StudentWithEnrollments,
    StudentStatus,
} from './types';

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Extract error message from unknown error
 */
function getErrorMessage(error: unknown, defaultMessage: string): string {
    if (error instanceof Object && 'response' in error) {
        const response = error.response as Record<string, unknown>;
        if (response.data instanceof Object && 'message' in response.data) {
            return (response.data as Record<string, unknown>).message as string;
        }
    }
    return defaultMessage;
}

// ============================================================================
// STUDENTS REPOSITORY
// ============================================================================

/**
 * Students Repository
 * Handles all student-related API calls using userApi from @/api/index.ts
 */
export class StudentsRepository {
    /**
     * Fetch all students with optional filters
     */
    static async getAllStudents(filters?: StudentFilters): Promise<Student[]> {
        try {
            const params = new URLSearchParams();

            if (filters?.search) {
                params.append('search', filters.search);
            }
            if (filters?.state_id) {
                params.append('state_id', String(filters.state_id));
            }
            if (filters?.status) {
                params.append('status', filters.status);
            }
            if (filters?.enrollment_date_from) {
                params.append(
                    'enrollment_date_from',
                    filters.enrollment_date_from
                );
            }
            if (filters?.enrollment_date_to) {
                params.append('enrollment_date_to', filters.enrollment_date_to);
            }

            const queryString = params.toString();
            const path = USER_ROUTES.STUDENTS.GET_ALL.url;
            const url = queryString ? `${path}?${queryString}` : path;

            const response = await userApi.get(url);
            return response.data.data;
        } catch (error: unknown) {
            console.error('Error fetching students:', error);
            toast.error('Failed to fetch students');
            throw error;
        }
    }

    /**
     * Fetch single student by ID
     */
    static async getStudentById(id: number): Promise<Student> {
        try {
            const url = buildUrl(USER_ROUTES.STUDENTS.GET_BY_ID, { id });
            const response = await userApi.get(url);
            return response.data.data || response.data;
        } catch (error: unknown) {
            console.error('Error fetching student:', error);
            toast.error('Failed to fetch student');
            throw error;
        }
    }

    /**
     * Fetch student with enrollments
     */
    static async getStudentWithEnrollments(
        id: number
    ): Promise<StudentWithEnrollments> {
        try {
            const url = buildUrl(USER_ROUTES.STUDENTS.GET_ENROLLMENTS, { id });
            const response = await userApi.get(url);
            return response.data.data || response.data;
        } catch (error: unknown) {
            console.error('Error fetching student enrollments:', error);
            toast.error('Failed to fetch student enrollments');
            throw error;
        }
    }

    /**
     * Create a new student
     */
    static async createStudent(data: CreateStudentInput): Promise<Student> {
        try {
            const response = await userApi.post(
                USER_ROUTES.STUDENTS.CREATE.url,
                data
            );
            toast.success('Student created successfully');
            return response.data.data || response.data;
        } catch (error: unknown) {
            console.error('Error creating student:', error);
            const errorMessage = getErrorMessage(
                error,
                'Failed to create student'
            );
            toast.error(errorMessage);
            throw error;
        }
    }

    /**
     * Update an existing student (partial update)
     */
    static async updateStudent(
        id: number,
        data: UpdateStudentInput
    ): Promise<Student> {
        try {
            const url = buildUrl(USER_ROUTES.STUDENTS.UPDATE, { id });
            const response = await userApi.patch(url, data);
            toast.success('Student updated successfully');
            return response.data.data || response.data;
        } catch (error: unknown) {
            console.error('Error updating student:', error);
            const errorMessage = getErrorMessage(
                error,
                'Failed to update student'
            );
            toast.error(errorMessage);
            throw error;
        }
    }

    /**
     * Delete a student
     */
    static async deleteStudent(id: number): Promise<void> {
        try {
            const url = buildUrl(USER_ROUTES.STUDENTS.DELETE, { id });
            await userApi.delete(url);
            toast.success('Student deleted successfully');
        } catch (error: unknown) {
            console.error('Error deleting student:', error);
            const errorMessage = getErrorMessage(
                error,
                'Failed to delete student'
            );
            toast.error(errorMessage);
            throw error;
        }
    }

    /**
     * Suspend a student
     */
    static async suspendStudent(id: number): Promise<Student> {
        try {
            const url = buildUrl(USER_ROUTES.STUDENTS.SUSPEND, { id });
            const response = await userApi.patch(url);
            toast.success('Student suspended successfully');
            return response.data.data || response.data;
        } catch (error: unknown) {
            console.error('Error suspending student:', error);
            const errorMessage = getErrorMessage(
                error,
                'Failed to suspend student'
            );
            toast.error(errorMessage);
            throw error;
        }
    }

    /**
     * Activate a student
     */
    static async activateStudent(id: number): Promise<Student> {
        try {
            const url = buildUrl(USER_ROUTES.STUDENTS.ACTIVATE, { id });
            const response = await userApi.patch(url);
            toast.success('Student activated successfully');
            return response.data.data || response.data;
        } catch (error: unknown) {
            console.error('Error activating student:', error);
            const errorMessage = getErrorMessage(
                error,
                'Failed to activate student'
            );
            toast.error(errorMessage);
            throw error;
        }
    }

    /**
     * Get all active students
     */
    static async getActiveStudents(): Promise<Student[]> {
        return this.getAllStudents({ status: StudentStatus.ACTIVE });
    }

    /**
     * Get all suspended students
     */
    static async getSuspendedStudents(): Promise<Student[]> {
        return this.getAllStudents({ status: StudentStatus.SUSPENDED });
    }

    /**
     * Search students by name or email
     */
    static async searchStudents(searchTerm: string): Promise<Student[]> {
        return this.getAllStudents({ search: searchTerm });
    }

    /**
     * Get students by state
     */
    static async getStudentsByState(stateId: number): Promise<Student[]> {
        return this.getAllStudents({ state_id: stateId });
    }
}
