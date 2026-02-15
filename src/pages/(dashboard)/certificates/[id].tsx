import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { CertificatesRepository } from '@/repositories/certificates';
import { CertificateTemplate } from '@/components/certificates';
import { ArrowLeft, Download, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CertificateViewPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const {
        data: certificate,
        isLoading,
        error,
    } = useQuery({
        queryKey: ['certificate', id],
        queryFn: () => CertificatesRepository.getById(id || ''),
        enabled: !!id,
    });

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error || !certificate) {
        return (
            <div className="flex h-screen items-center justify-center flex-col gap-4">
                <p className="text-gray-500">Failed to load certificate.</p>
                <button
                    onClick={() => navigate(-1)}
                    className="text-primary hover:underline"
                >
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-primary hover:text-primary/80 mb-4"
                    >
                        <ArrowLeft className="h-5 w-5" />
                        Back
                    </button>
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex items-start justify-between gap-4 mb-4">
                            <h1 className="text-2xl font-semibold">
                                Certificate of Completion
                            </h1>
                            {certificate.is_expired ? (
                                <div className="flex items-center gap-2 px-3 py-1 bg-red-50 border border-red-200 rounded-lg whitespace-nowrap">
                                    <AlertCircle className="h-5 w-5 text-red-600" />
                                    <span className="text-sm font-medium text-red-700">
                                        EXPIRED
                                    </span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 px-3 py-1 bg-green-50 border border-green-200 rounded-lg whitespace-nowrap">
                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                    <span className="text-sm font-medium text-green-700">
                                        VALID
                                    </span>
                                </div>
                            )}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                            <div>
                                <p className="text-xs text-gray-500 uppercase">
                                    Student
                                </p>
                                <p className="text-sm font-medium text-gray-900">
                                    {certificate.student_name}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase">
                                    Course
                                </p>
                                <p className="text-sm font-medium text-gray-900">
                                    {certificate.course_title}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase">
                                    Issue Date
                                </p>
                                <p className="text-sm font-medium text-gray-900">
                                    {new Date(certificate.issued_at).toLocaleDateString()}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase">
                                    Certificate #
                                </p>
                                <p className="text-sm font-medium text-gray-900 truncate">
                                    {certificate.certificate_number}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Certificate Preview */}
                <div className="bg-white rounded-lg border border-gray-200 p-8 flex justify-center">
                    <div className="flex flex-col items-center">
                        <CertificateTemplate
                            student_name={certificate.student_name}
                            course_title={certificate.course_title}
                            training_type={certificate.training_type}
                            duration_hours={certificate.duration_hours}
                            instructor_name={certificate.instructor_name}
                            instructor_signature={certificate.instructor_signature}
                            instructor_license={certificate.instructor_license}
                            platform_name={certificate.platform_name}
                            platform_signature={certificate.platform_signature}
                            platform_logo={certificate.platform_logo}
                            administrator_name={certificate.administrator_name}
                            state_name={certificate.state_name}
                            issued_state_code={certificate.issued_state_code}
                            issued_at={certificate.issued_at}
                            completed_at={certificate.completed_at}
                            certificate_number={certificate.certificate_number}
                            certificate_uid={certificate.certificate_uid}
                        />
                        {certificate.certificate_url && (
                            <Button
                                className="mt-8 gap-2"
                                onClick={() =>
                                    window.open(
                                        certificate.certificate_url!,
                                        '_blank'
                                    )
                                }
                            >
                                <Download className="h-4 w-4" />
                                Download PDF
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CertificateViewPage;
