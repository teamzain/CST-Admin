import { userApi } from '@/api';
import { toast } from 'sonner';
import { USER_ROUTES, buildUrl } from '@/config/routes';
import {
    type Employer,
    type CreateEmployerInput,
    type UpdateEmployerInput,
    type EmployerFilters,
    type PurchaseSeatsInput,
    type EmployerSeat,
    EmployerStatus,
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
 * Handles both single employer (with nested employer) and list (with nested employerProfile)
 */
function transformEmployer(employer: any): Employer {
    // Handle nested employer profile (from getAllEmployers response)
    const profile = employer.employerProfile || {};
    
    // Handle nested employer user object (from getEmployerById response)
    const userDetails = employer.employer || {};
    
    // Handle user_auth for status
    const userAuth = employer.user_auth || {};
    
    // For getAllEmployers: user data is at top level, profile is nested
    // For getEmployerById: employer data is nested under 'employer' key
    const firstName = employer.first_name || userDetails.first_name || '';
    const lastName = employer.last_name || userDetails.last_name || '';
    const email = employer.email || userDetails.email || '';
    const phone = employer.phone || userDetails.phone || '';
    const username = employer.username || userDetails.username || '';
    const avatar = employer.avatar || userDetails.avatar || '';
    
    // Extract status from user_auth or default to ACTIVE
    const statusValue = userAuth.status || employer.status || 'ACTIVE';
    const status = statusValue === 'ACTIVE' ? 'active' : statusValue === 'INACTIVE' ? 'inactive' : 'pending';
    
    // Handle seats array from both response structures
    const seatsArray = profile.seats || employer.seats || [];
    
    // Handle invoices array
    const invoicesArray = employer.invoices || profile.invoices || [];
    
    // Handle employees array
    const employeesArray = employer.employees || [];
    
    // Calculate seat usage from seats array
    let totalSeats = 0;
    let usedSeats = 0;
    if (Array.isArray(seatsArray)) {
        totalSeats = seatsArray.reduce((sum: number, seat: any) => sum + (seat.total_seats || 0), 0);
        usedSeats = seatsArray.reduce((sum: number, seat: any) => sum + (seat.used_seats || 0), 0);
    }

    const transformed: Employer = {
        // Core ID and relation fields
        id: employer.id,
        user_id: employer.user_id || employer.auth_id,
        
        // User details (top level or from nested employer)
        first_name: firstName,
        last_name: lastName,
        email: email,
        phone: phone,
        username: username,
        avatar: avatar,
        
        // Employer profile details (from nested employerProfile)
        company_name: profile.company_name || employer.company_name || '',
        contact_email: profile.contact_email || employer.contact_email || '',
        contact_phone: profile.contact_phone || employer.contact_phone || '',
        address: profile.address || employer.address || '',
        website: profile.website || employer.website || '',
        industry: profile.industry || employer.industry || '',
        state_id: profile.state_id || employer.state_id,
        
        // State and timestamps
        state: employer.state,
        status: status,
        created_at: employer.created_at,
        updated_at: employer.updated_at,
        
        // Relationships
        seat_records: seatsArray,
        invoice_records: invoicesArray,
        invoices: invoicesArray,
        employees: employeesArray,
        
        // Backward compatibility fields for components
        name: profile.company_name || employer.company_name || '',
        contact: `${firstName} ${lastName}`.trim(),
        seats: totalSeats,
        usedSeats: usedSeats,
    };
    
    console.log('[transformEmployer] Transformed employer:', {
        id: transformed.id,
        company_name: transformed.company_name,
        first_name: transformed.first_name,
        email: transformed.email,
        status: transformed.status,
        seats_count: seatsArray.length,
        total_seats: totalSeats,
        used_seats: usedSeats,
    });
    
    return transformed;
}

// ============================================================================
// EMPLOYERS REPOSITORY
// ============================================================================

/**
 * Employers Repository
 * Handles all employer-related API calls using userApi from @/api/index.ts
 */
export class EmployersRepository {
    /**
     * Fetch all employers with optional filters
     */
    static async getAllEmployers(filters?: EmployerFilters): Promise<Employer[]> {
        try {
            const params = new URLSearchParams();

            // Add role filter (always EMPLOYER for this endpoint)
            params.append('role', 'EMPLOYER');

            if (filters?.search) {
                params.append('search', filters.search);
            }
            if (filters?.state_id) {
                params.append('state_id', String(filters.state_id));
            }
            if (filters?.status) {
                params.append('status', filters.status);
            }
            if (filters?.industry) {
                params.append('industry', filters.industry);
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
            if (filters?.min_seat_utilization !== undefined) {
                params.append('min_seat_utilization', String(filters.min_seat_utilization));
            }
            if (filters?.max_seat_utilization !== undefined) {
                params.append('max_seat_utilization', String(filters.max_seat_utilization));
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

            console.log('[EmployersRepository] Fetching employers from:', url);
            const response = await userApi.get(url);
            
            // Handle different response formats
            const data = response.data?.data || response.data || [];
            console.log('[EmployersRepository] Fetched employers:', data);
            
            const employers = Array.isArray(data) ? data : [];
            return employers.map(transformEmployer);
        } catch (error: unknown) {
            console.error('[EmployersRepository] Error fetching employers:', error);
            toast.error('Failed to fetch employers');
            throw error;
        }
    }

    /**
     * Fetch single employer by ID
     */
    static async getEmployerById(id: number): Promise<Employer> {
        try {
            const url = buildUrl(USER_ROUTES.EMPLOYER.GET_BY_ID, { id });
            console.log('[EmployersRepository] Fetching employer by ID from:', url);
            const response = await userApi.get(url);
            
            const data = response.data?.data || response.data;
            console.log('[EmployersRepository] Fetched employer:', data);
            
            return transformEmployer(data);
        } catch (error: unknown) {
            console.error('[EmployersRepository] Error fetching employer:', error);
            toast.error('Failed to fetch employer');
            throw error;
        }
    }

    /**
     * Create a new employer
     */
    static async createEmployer(data: CreateEmployerInput): Promise<Employer> {
        try {
            console.log('[EmployersRepository] Creating employer with data:', data);
            const response = await userApi.post(
                USER_ROUTES.EMPLOYER.CREATE.url,
                data
            );
            
            const result = response.data?.data || response.data;
            console.log('[EmployersRepository] Employer created:', result);
            
            toast.success('Employer created successfully');
            return transformEmployer(result);
        } catch (error: unknown) {
            console.error('[EmployersRepository] Error creating employer:', error);
            const errorMessage = getErrorMessage(
                error,
                'Failed to create employer'
            );
            toast.error(errorMessage);
            throw error;
        }
    }

    /**
     * Update an existing employer (partial update)
     */
    static async updateEmployer(
        id: number,
        data: UpdateEmployerInput
    ): Promise<Employer> {
        try {
            const url = buildUrl(USER_ROUTES.EMPLOYER.UPDATE, { id });
            console.log('[EmployersRepository] Updating employer:', url, data);
            const response = await userApi.patch(url, data);
            
            const result = response.data?.data || response.data;
            console.log('[EmployersRepository] Employer updated:', result);
            
            toast.success('Employer updated successfully');
            return transformEmployer(result);
        } catch (error: unknown) {
            console.error('[EmployersRepository] Error updating employer:', error);
            const errorMessage = getErrorMessage(
                error,
                'Failed to update employer'
            );
            toast.error(errorMessage);
            throw error;
        }
    }

    /**
     * Delete an employer
     */
    static async deleteEmployer(id: number): Promise<void> {
        try {
            const url = buildUrl(USER_ROUTES.DELETE, { id });
            console.log('[EmployersRepository] Deleting employer:', url);
            await userApi.delete(url);
            
            console.log('[EmployersRepository] Employer deleted');
            toast.success('Employer deleted successfully');
        } catch (error: unknown) {
            console.error('[EmployersRepository] Error deleting employer:', error);
            const errorMessage = getErrorMessage(
                error,
                'Failed to delete employer'
            );
            toast.error(errorMessage);
            throw error;
        }
    }

    /**
     * Get all active employers
     */
    static async getActiveEmployers(): Promise<Employer[]> {
        return this.getAllEmployers({ status: EmployerStatus.ACTIVE });
    }

    /**
     * Search employers by name or email
     */
    static async searchEmployers(searchTerm: string): Promise<Employer[]> {
        return this.getAllEmployers({ search: searchTerm });
    }

    /**
     * Get employers by industry
     */
    static async getEmployersByIndustry(industry: string): Promise<Employer[]> {
        return this.getAllEmployers({ industry });
    }

    /**
     * Get employers by state
     */
    static async getEmployersByState(stateId: number): Promise<Employer[]> {
        return this.getAllEmployers({ state_id: stateId });
    }

    /**
     * Get employers by seat utilization range
     */
    static async getEmployersBySeatUtilization(
        min: number,
        max: number
    ): Promise<Employer[]> {
        return this.getAllEmployers({
            min_seat_utilization: min,
            max_seat_utilization: max,
        });
    }

    /**
     * Purchase seats for a course
     */
    static async purchaseSeats(data: PurchaseSeatsInput): Promise<EmployerSeat> {
        try {
            console.log(
                '[EmployersRepository] Purchasing seats with data:',
                data
            );
            const response = await userApi.post(
                USER_ROUTES.EMPLOYER.PURCHASE_SEATS.url,
                data
            );

            const result = response.data?.data || response.data;
            console.log('[EmployersRepository] Seats purchased:', result);

            toast.success('Seats purchased successfully');
            return result as EmployerSeat;
        } catch (error: unknown) {
            console.error('[EmployersRepository] Error purchasing seats:', error);
            const errorMessage = getErrorMessage(
                error,
                'Failed to purchase seats'
            );
            toast.error(errorMessage);
            throw error;
        }
    }
}
