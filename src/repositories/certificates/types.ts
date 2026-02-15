export interface Certificate {
    id: number;
    uid: string;
    user_id: number;
    course_id: number;
    enrollment_id: number;
    certificate_uid: string;
    certificate_number: string;
    certificate_url: string | null;
    issued_at: string;
    expires_at: string | null;
    is_expired?: boolean;
    created_at: string;
    updated_at: string;

    // Snapshot fields for template rendering
    student_name: string;
    course_title: string;
    training_type: string;
    duration_hours: number;
    instructor_name?: string;
    instructor_signature?: string;
    instructor_license?: string;
    platform_name: string;
    platform_signature?: string;
    platform_logo?: string;
    administrator_name?: string;
    state_name: string;
    issued_state_code: string;
    completed_at?: string;
    seat_time_hours: number;

    user?: {
        id: number;
        first_name: string;
        last_name: string;
        email: string;
    };
    course?: {
        id: number;
        title: string;
    };
}

/**
 * Props for the CertificateTemplate rendering component.
 * Uses the snapshot fields from the Certificate model.
 */
export interface CertificateTemplateProps {
    student_name: string;
    course_title: string;
    training_type: string;
    duration_hours: number;
    instructor_name?: string;
    instructor_signature?: string;
    instructor_license?: string;
    platform_name: string;
    platform_signature?: string;
    platform_logo?: string;
    administrator_name?: string;
    state_name: string;
    issued_state_code: string;
    issued_at: string;
    completed_at?: string;
    certificate_number?: string;
    certificate_uid?: string;
}

export interface GenerateCertificateResponse {
    certificate: Certificate;
    message?: string;
}

export interface VerifyCertificateResponse {
    certificate: Certificate;
    valid: boolean;
    message?: string;
}
