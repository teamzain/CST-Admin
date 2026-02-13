import { userApi } from '@/api';
import { toast } from 'sonner';
import { USER_ROUTES, buildUrl } from '@/config/routes';
import {
    type Instructor,
    type CreateInstructorInput,
    type UpdateInstructorInput,
    type InstructorFilters,
    InstructorStatus,
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

/**
 * Transform API response to add backward compatibility fields
 * Handles both getAllInstructors (with user_auth) and getInstructorById (with instructorLicenses)
 */
function transformInstructor(instructor: any): Instructor {
    // The API may return "licenses" (getById) or "instructorLicenses" (getAll)
    const allLicenses = instructor.licenses || instructor.instructorLicenses || [];
    const primaryLicense = allLicenses[0] || {};
    
    // Handle status from user_auth or default to ACTIVE
    const userAuth = instructor.user_auth || {};
    const statusValue = userAuth.status || 'ACTIVE';
    const status = statusValue === 'ACTIVE' ? 'active' : statusValue === 'INACTIVE' ? 'inactive' : 'pending';
    
    // Extract state info - can come from:
    // 1. primaryLicense.state (for getAllInstructors)
    // 2. instructor.state (for getAllInstructors)
    // 3. Fallback to creating from state_id
    const stateInfo = primaryLicense.state || instructor.state || (instructor.state_id ? { id: instructor.state_id } : undefined);
    
    // Format license expiry if it exists
    let licenseExpiry: string | undefined;
    if (primaryLicense.license_expiry) {
        const date = new Date(primaryLicense.license_expiry);
        licenseExpiry = date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    } else if (instructor.license_expiry) {
        const date = new Date(instructor.license_expiry);
        licenseExpiry = date.toISOString().split('T')[0];
    }

    const transformed: Instructor = {
        // Core user fields
        id: instructor.id,
        user_id: instructor.user_id || instructor.auth_id,
        username: instructor.username,
        first_name: instructor.first_name,
        last_name: instructor.last_name,
        email: instructor.email,
        phone: instructor.phone,
        avatar: instructor.avatar,
        bio: instructor.bio,
        link: instructor.link,
        signature: primaryLicense.signature || instructor.signature,
        role: instructor.role,
        
        // License fields (from primary license or top-level)
        license_no: primaryLicense.license_no || instructor.license_no,
        license_expiry: licenseExpiry || instructor.license_expiry,
        state_id: primaryLicense.state_id || instructor.state_id,
        
        // Related data
        state: stateInfo,
        instructorLicenses: allLicenses,
        licenses: allLicenses,
        assigned_courses: allLicenses.flatMap((l: any) => l.courses || l.assigned_courses || []),
        
        // Summary from getById response
        summary: instructor.summary,
        
        // Status and timestamps
        status: status,
        created_at: instructor.created_at,
        updated_at: instructor.updated_at,
        
        // Backward compatibility fields for components
        name: `${instructor.first_name} ${instructor.last_name}`,
        expiry: licenseExpiry,
        license: primaryLicense.license_no || instructor.license_no,
        stateName: stateInfo?.name,
        stateCode: stateInfo?.code,
    };
    
    return transformed;
}

// ============================================================================
// INSTRUCTORS REPOSITORY
// ============================================================================

/**
 * Instructors Repository
 * Handles all instructor-related API calls using userApi from @/api/index.ts
 */
export class InstructorsRepository {
    /**
     * Fetch all instructors with optional filters
     */
    static async getAllInstructors(filters?: InstructorFilters): Promise<Instructor[]> {
        try {
            const params = new URLSearchParams();

            // Add role filter (always INSTRUCTOR for this endpoint)
            params.append('role', 'INSTRUCTOR');

            if (filters?.search) {
                params.append('search', filters.search);
            }
            if (filters?.state_id) {
                params.append('state_id', String(filters.state_id));
            }
            if (filters?.status) {
                params.append('status', filters.status);
            }
            if (filters?.is_verified !== undefined) {
                params.append('is_verified', String(filters.is_verified));
            }
            if (filters?.join_date_from) {
                params.append('join_date_from', filters.join_date_from);
            }
            if (filters?.join_date_to) {
                params.append('join_date_to', filters.join_date_to);
            }
            if (filters?.page) {
                params.append('page', String(filters.page));
            }
            if (filters?.limit) {
                params.append('limit', String(filters.limit));
            }
            if (filters?.sortBy) {
                params.append('sortBy', filters.sortBy);
            }
            if (filters?.sortOrder) {
                params.append('sortOrder', filters.sortOrder);
            }

            const queryString = params.toString();
            const path = USER_ROUTES.GET_ALL.url;
            const url = queryString ? `${path}?${queryString}` : path;

            const response = await userApi.get(url);
            
            // Handle different response formats
            const data = response.data?.data || response.data || [];
            
            const instructors = Array.isArray(data) ? data : [];
            return instructors.map(transformInstructor);
        } catch (error: unknown) {
            console.error('[InstructorsRepository] Error fetching instructors:', error);
            toast.error('Failed to fetch instructors');
            throw error;
        }
    }

    /**
     * Fetch single instructor by ID
     */
    static async getInstructorById(id: number): Promise<Instructor> {
        try {
            const url = buildUrl(USER_ROUTES.INSTRUCTOR.GET_BY_ID, { id });
            const response = await userApi.get(url);
            
            const data = response.data?.data || response.data;
            
            return transformInstructor(data);
        } catch (error: unknown) {
            console.error('[InstructorsRepository] Error fetching instructor:', error);
            toast.error('Failed to fetch instructor');
            throw error;
        }
    }

    /**
     * Create a new instructor
     */
    static async createInstructor(data: CreateInstructorInput): Promise<Instructor> {
        try {
            const response = await userApi.post(
                USER_ROUTES.INSTRUCTOR.CREATE.url,
                data
            );
            
            const result = response.data?.data || response.data;
            
            toast.success('Instructor created successfully');
            return transformInstructor(result);
        } catch (error: unknown) {
            console.error('[InstructorsRepository] Error creating instructor:', error);
            const errorMessage = getErrorMessage(
                error,
                'Failed to create instructor'
            );
            toast.error(errorMessage);
            throw error;
        }
    }

    /**
     * Update an existing instructor (partial update)
     */
    static async updateInstructor(
        id: number,
        data: UpdateInstructorInput
    ): Promise<Instructor> {
        try {
            const url = buildUrl(USER_ROUTES.INSTRUCTOR.UPDATE, { id });
            const response = await userApi.patch(url, data);
            
            const result = response.data?.data || response.data;
            
            toast.success('Instructor updated successfully');
            return transformInstructor(result);
        } catch (error: unknown) {
            console.error('[InstructorsRepository] Error updating instructor:', error);
            const errorMessage = getErrorMessage(
                error,
                'Failed to update instructor'
            );
            toast.error(errorMessage);
            throw error;
        }
    }

    /**
     * Delete an instructor
     */
    static async deleteInstructor(id: number): Promise<void> {
        try {
            const url = buildUrl(USER_ROUTES.INSTRUCTOR.DELETE, { id });
            await userApi.delete(url);
            
            toast.success('Instructor deleted successfully');
        } catch (error: unknown) {
            console.error('[InstructorsRepository] Error deleting instructor:', error);
            const errorMessage = getErrorMessage(
                error,
                'Failed to delete instructor'
            );
            toast.error(errorMessage);
            throw error;
        }
    }

    /**
     * Get all active instructors
     */
    static async getActiveInstructors(): Promise<Instructor[]> {
        return this.getAllInstructors({ status: InstructorStatus.ACTIVE });
    }

    /**
     * Search instructors by name or email
     */
    static async searchInstructors(searchTerm: string): Promise<Instructor[]> {
        return this.getAllInstructors({ search: searchTerm });
    }

    /**
     * Get instructors by state
     */
    static async getInstructorsByState(stateId: number): Promise<Instructor[]> {
        return this.getAllInstructors({ state_id: stateId });
    }
}
