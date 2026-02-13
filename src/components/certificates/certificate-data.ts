import type { CertificateTemplateProps } from '@/repositories/certificates/types';

/**
 * Dummy certificate data for admin preview in Settings > Certificate Design
 */
export const dummyCertificateData: CertificateTemplateProps = {
    student_name: 'Adeline Palmerston',
    course_title: 'California BSIS Unarmed Training',
    training_type: 'Unarmed Security Training',
    duration_hours: 40,
    instructor_name: 'Abe Khan',
    instructor_signature: '', // Will use placeholder cursive text when empty
    instructor_license: 'LIC-2024-001',
    platform_name: 'Complete Security Training USA',
    platform_signature: '', // Will use placeholder cursive text when empty
    platform_logo: '/logo.png',
    administrator_name: 'Caitlin Bruns',
    state_name: 'California',
    issued_state_code: 'CA',
    issued_at: new Date().toISOString(),
    completed_at: new Date().toISOString(),
    certificate_number: 'CST-2026-00001',
    certificate_uid: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
};
