export interface Certificate {
    id: number;
    uid: string;
    user_id: number;
    course_id: number;
    enrollment_id: number;
    certificate_url: string | null;
    issued_at: string;
    expires_at: string | null;
    created_at: string;
    updated_at: string;
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

export interface GenerateCertificateResponse {
    certificate: Certificate;
    message?: string;
}

export interface VerifyCertificateResponse {
    certificate: Certificate;
    valid: boolean;
    message?: string;
}
