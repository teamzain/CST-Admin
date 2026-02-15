import { courseApi } from '@/api';
import type {
    Certificate,
    GenerateCertificateResponse,
} from './types';

interface ApiResponse<T> {
    data?: T;
    certificate?: Certificate;
    certificates?: Certificate[];
}

export class CertificatesRepository {
    private static extractData<T>(response: ApiResponse<T> | T[] | T): T {
        if (!response) return [] as unknown as T;
        if (Array.isArray(response)) return response as unknown as T;

        const data = response as ApiResponse<T>;
        if (data.data !== undefined) {
            const nested = data.data as ApiResponse<T> | T[] | T;
            if (Array.isArray(nested)) return nested as unknown as T;
            const nestedObj = nested as ApiResponse<T>;
            if (nestedObj.certificates !== undefined)
                return nestedObj.certificates as unknown as T;
            if (nestedObj.certificate !== undefined)
                return nestedObj.certificate as unknown as T;
            return nested as T;
        }
        if (data.certificates !== undefined)
            return data.certificates as unknown as T;
        if (data.certificate !== undefined)
            return data.certificate as unknown as T;

        return response as T;
    }

    /**
     * Generate certificate by enrollment ID
     * POST /api/course/certificate/{enrollmentId}/certificates/generate
     */
    static async generateByEnrollment(
        enrollmentId: number
    ): Promise<GenerateCertificateResponse> {
        const { data } = await courseApi.post(
            `/certificate/${enrollmentId}/certificates/generate`
        );
        return data;
    }

    /**
     * Generate certificate by course ID + user ID
     * POST /api/course/certificate/{courseId}/users/{userId}/certificates/generate
     */
    static async generateByCourseAndUser(
        courseId: number,
        userId: number
    ): Promise<GenerateCertificateResponse> {
        const { data } = await courseApi.post(
            `/certificate/${courseId}/users/${userId}/certificates/generate`
        );
        return data;
    }

    /**
     * Get all certificates for a course
     * GET /api/course/certificate/{courseId}/certificates
     */
    static async getByCourse(courseId: number): Promise<Certificate[]> {
        const { data } = await courseApi.get(`/certificate/${courseId}/certificates`);
        const result = this.extractData<Certificate[]>(data);
        return Array.isArray(result) ? result : [];
    }

    /**
     * Get certificate by ID
     * GET /api/course/certificate/{certificateId}
     */
    static async getById(certificateId: string): Promise<Certificate> {
        const { data } = await courseApi.get(`/certificate/${certificateId}`);
        return this.extractData<Certificate>(data);
    }

    /**
     * Get all certificates for a user
     * GET /api/course/certificate/user/{userId}/certificates
     */
    static async getByUser(userId: number): Promise<Certificate[]> {
        const { data } = await courseApi.get(`/certificate/user/${userId}/certificates`);
        const result = this.extractData<Certificate[]>(data);
        return Array.isArray(result) ? result : [];
    }
}
