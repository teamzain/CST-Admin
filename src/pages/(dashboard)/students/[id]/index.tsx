import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { StudentsRepository } from '@/repositories/students/repo';
import { CertificatesRepository } from '@/repositories/certificates';
import type { Certificate } from '@/repositories/certificates/types';
import { format } from 'date-fns';
import {
    ArrowLeft,
    ChevronDown,
    ChevronUp,
    CheckCircle2,
    Circle,
    Eye,
    Loader2,
    Download,
    FileText,
    Award,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const StudentDetailsPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState('progress');
    const [expandedCourses, setExpandedCourses] = useState<{
        [key: string]: boolean;
    }>({});

    const {
        data: student,
        isLoading,
        error,
    } = useQuery({
        queryKey: ['student', id],
        queryFn: () => StudentsRepository.getStudentById(Number(id)),
        enabled: !!id,
    });

    // Fetch certificates for this student
    const { data: certificates = [], isLoading: isLoadingCerts } = useQuery({
        queryKey: ['student-certificates', id],
        queryFn: () => CertificatesRepository.getByUser(Number(id)),
        enabled: !!id,
    });

    // Generate certificate mutation
    const generateCertMutation = useMutation({
        mutationFn: (enrollmentId: number) =>
            CertificatesRepository.generateByEnrollment(enrollmentId),
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({ queryKey: ['student-certificates', id] });
            toast.success('Certificate generated successfully');
            // Auto-navigate to the certificate after a short delay
            if (data?.certificate?.certificate_uid) {
                setTimeout(() => {
                    navigate(`/certificates/${data.certificate.certificate_uid}`);
                }, 500);
            }
        },
        onError: (error: any) => {
            const msg = error?.response?.data?.message || error?.message || 'Failed to generate certificate';
            toast.error(msg);
        },
    });

    const toggleCourse = (courseId: number) => {
        setExpandedCourses((prev) => ({
            ...prev,
            [courseId]: !prev[courseId],
        }));
    };

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error || !student) {
        return (
            <div className="flex h-screen items-center justify-center flex-col gap-4">
                <p className="text-gray-500">Failed to load student details.</p>
                <button
                    onClick={() => navigate('/students')}
                    className="text-primary hover:underline"
                >
                    Back to Students
                </button>
            </div>
        );
    }

    const enrollments = student.CourseEnrollment || [];
    const auditLogs = student.AuditLog || [];

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="mx-auto px-6 py-6">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-center gap-3 mb-3">
                        <button
                            onClick={() => navigate('/students')}
                            className="p-1 hover:bg-gray-100 rounded transition-colors"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </button>
                        <h1 className="text-2xl font-semibold">
                            {student.first_name} {student.last_name}
                        </h1>
                    </div>
                    <div className="flex gap-6 text-sm text-gray-600 ml-10">
                        <span>
                            User ID:{' '}
                            <span className="text-gray-900 font-medium">
                                {student.id}
                            </span>
                        </span>
                        <span>
                            State:{' '}
                            <span className="text-gray-900 font-medium">
                                {student.state?.name || 'N/A'}
                            </span>
                        </span>
                        <span>
                            Last Activity:{' '}
                            <span className="text-gray-900 font-medium">
                                {student.lastActivity
                                    ? format(
                                          new Date(student.lastActivity),
                                          'MMM d, yyyy'
                                      )
                                    : 'None'}
                            </span>
                        </span>
                        <span>
                            Registered On:{' '}
                            <span className="text-gray-900 font-medium">
                                {format(
                                    new Date(student.created_at),
                                    'MMM d, yyyy'
                                )}
                            </span>
                        </span>
                    </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200 mb-6">
                    <div className="flex gap-8">
                        <button
                            onClick={() => setActiveTab('progress')}
                            className={`pb-3 px-1 border-b-2 transition-colors ${
                                activeTab === 'progress'
                                    ? 'border-yellow-400 text-gray-900'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            <span className="flex items-center gap-2">
                                <span className="text-sm">📚</span>
                                Course Progress
                            </span>
                        </button>
                        <button
                            onClick={() => setActiveTab('compliance')}
                            className={`pb-3 px-1 border-b-2 transition-colors ${
                                activeTab === 'compliance'
                                    ? 'border-yellow-400 text-gray-900'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            <span className="flex items-center gap-2">
                                <span className="text-sm">📋</span>
                                Compliance
                            </span>
                        </button>
                        <button
                            onClick={() => setActiveTab('certificates')}
                            className={`pb-3 px-1 border-b-2 transition-colors ${
                                activeTab === 'certificates'
                                    ? 'border-yellow-400 text-gray-900'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            <span className="flex items-center gap-2">
                                <span className="text-sm">🏆</span>
                                Certificates
                            </span>
                        </button>
                        <button
                            onClick={() => setActiveTab('logs')}
                            className={`pb-3 px-1 border-b-2 transition-colors ${
                                activeTab === 'logs'
                                    ? 'border-yellow-400 text-gray-900'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            <span className="flex items-center gap-2">
                                <span className="text-sm">📝</span>
                                Activity Logs
                            </span>
                        </button>
                    </div>
                </div>

                {/* Content */}
                {activeTab === 'progress' && (
                    <div className="space-y-4">
                        {enrollments.length > 0 ? (
                            enrollments.map((enrollment) => (
                                <div
                                    key={enrollment.id}
                                    className="bg-white rounded-lg border border-gray-200 p-5"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex gap-4 flex-1">
                                            {enrollment.course.thumbnail && (
                                                <img
                                                    src={
                                                        enrollment.course
                                                            .thumbnail
                                                    }
                                                    alt={
                                                        enrollment.course.title
                                                    }
                                                    className="h-12 w-12 rounded-full object-cover"
                                                />
                                            )}
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-1">
                                                    <h3 className="font-semibold">
                                                        {
                                                            enrollment.course
                                                                .title
                                                        }
                                                    </h3>
                                                    <span
                                                        className={`text-xs px-2 py-0.5 rounded font-medium ${
                                                            enrollment.status ===
                                                            'COMPLETED'
                                                                ? 'bg-green-100 text-green-700'
                                                                : 'bg-orange-100 text-orange-700'
                                                        }`}
                                                    >
                                                        {enrollment.status.replace(
                                                            '_',
                                                            ' '
                                                        )}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-500">
                                                    Enrollment Date:{' '}
                                                    {enrollment.started_at
                                                        ? format(
                                                              new Date(
                                                                  enrollment.started_at
                                                              ),
                                                              'MMM d, yyyy'
                                                          )
                                                        : 'N/A'}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() =>
                                                toggleCourse(enrollment.id)
                                            }
                                            className="p-1 hover:bg-gray-100 rounded"
                                        >
                                            {expandedCourses[enrollment.id] ? (
                                                <ChevronUp className="h-5 w-5 text-gray-400" />
                                            ) : (
                                                <ChevronDown className="h-5 w-5 text-gray-400" />
                                            )}
                                        </button>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-yellow-400 h-2 rounded-full transition-all"
                                                style={{
                                                    width: `${enrollment.progress}%`,
                                                }}
                                            />
                                        </div>
                                        <span className="text-sm font-medium min-w-10">
                                            {Math.round(enrollment.progress)}%
                                        </span>
                                        <span className="text-xs text-gray-500 ml-auto whitespace-nowrap">
                                            {enrollment.seat_time_min} mins
                                            tracked
                                        </span>
                                    </div>

                                    {expandedCourses[enrollment.id] &&
                                        enrollment.lessonProgress && (
                                            <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                                                {enrollment.lessonProgress
                                                    .length > 0 ? (
                                                    enrollment.lessonProgress.map(
                                                        (lesson) => (
                                                            <div
                                                                key={lesson.id}
                                                                className="flex items-center gap-3 text-sm"
                                                            >
                                                                {lesson.is_completed ? (
                                                                    <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                                                                ) : (
                                                                    <Circle className="h-5 w-5 text-gray-300 shrink-0" />
                                                                )}
                                                                <span className="font-medium">
                                                                    Lesson{' '}
                                                                    {
                                                                        lesson.lesson_id
                                                                    }
                                                                    :
                                                                </span>
                                                                <span className="text-gray-500">
                                                                    {
                                                                        lesson.progress_percent
                                                                    }
                                                                    % watched
                                                                </span>
                                                            </div>
                                                        )
                                                    )
                                                ) : (
                                                    <p className="text-xs text-gray-400">
                                                        No detailed lesson
                                                        progress available.
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                </div>
                            ))
                        ) : (
                            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                                <p className="text-gray-500">
                                    No courses enrolled.
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'compliance' && (
                    <div className="space-y-6">
                        {(() => {
                            const compliance = student.ComplianceCheck?.[0];
                            const signatures = student.ESignature || [];
                            return (
                                <>
                                    {/* ID Verification */}
                                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                                        <h2 className="text-lg font-semibold mb-2">
                                            ID Verification
                                        </h2>
                                        <p className="text-sm text-gray-600 mb-6">
                                            Verifies the student's identity
                                            using a government-issued ID and a
                                            live selfie match captured at the
                                            start of the course.
                                        </p>
                                        <div className="grid grid-cols-2 gap-6">
                                            <div
                                                className={`rounded-lg p-8 flex flex-col items-center justify-center border-2 border-dashed ${compliance?.id_verified ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-300'}`}
                                            >
                                                <div
                                                    className={`text-2xl mb-2 ${compliance?.id_verified ? 'text-green-500' : 'text-gray-400'}`}
                                                >
                                                    {compliance?.id_verified
                                                        ? '✓'
                                                        : '✕'}
                                                </div>
                                                <p
                                                    className={`text-sm font-medium ${compliance?.id_verified ? 'text-green-700' : 'text-gray-500'}`}
                                                >
                                                    Government-issued ID{' '}
                                                    {compliance?.id_verified
                                                        ? '(Verified)'
                                                        : '(Not Verified)'}
                                                </p>
                                            </div>
                                            <div
                                                className={`rounded-lg p-8 flex flex-col items-center justify-center border-2 border-dashed ${compliance?.selfie_verified ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-300'}`}
                                            >
                                                <div
                                                    className={`text-2xl mb-2 ${compliance?.selfie_verified ? 'text-green-500' : 'text-gray-400'}`}
                                                >
                                                    {compliance?.selfie_verified
                                                        ? '✓'
                                                        : '✕'}
                                                </div>
                                                <p
                                                    className={`text-sm font-medium ${compliance?.selfie_verified ? 'text-green-700' : 'text-gray-500'}`}
                                                >
                                                    Selfie Match{' '}
                                                    {compliance?.selfie_verified
                                                        ? '(Verified)'
                                                        : '(Not Verified)'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Signatures */}
                                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                                        <h2 className="text-lg font-semibold mb-2">
                                            Signatures
                                        </h2>
                                        <p className="text-sm text-gray-600 mb-6">
                                            Displays required signed policy
                                            documents.
                                        </p>
                                        <div className="space-y-3">
                                            {signatures.length > 0 ? (
                                                signatures.map((sig) => (
                                                    <div
                                                        key={sig.id}
                                                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                                                    >
                                                        <div className="flex flex-col">
                                                            <span className="font-medium">
                                                                {sig.document_type
                                                                    .replace(
                                                                        '_',
                                                                        ' '
                                                                    )
                                                                    .toUpperCase()}
                                                            </span>
                                                            <span className="text-xs text-gray-500">
                                                                Signed on{' '}
                                                                {format(
                                                                    new Date(
                                                                        sig.signed_at
                                                                    ),
                                                                    'MMM d, yyyy'
                                                                )}{' '}
                                                                from{' '}
                                                                {sig.ip_address ||
                                                                    'unknown IP'}
                                                            </span>
                                                        </div>
                                                        <button className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                                                            <Eye className="h-4 w-4" />
                                                            View
                                                        </button>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-sm text-gray-500 italic p-4 border border-dashed border-gray-200 rounded-lg text-center">
                                                    No signed documents found.
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </>
                            );
                        })()}

                        {/* Audit Trail */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold mb-2">
                                Audit Trail
                            </h2>
                            <p className="text-sm text-gray-600 mb-6">
                                Records periodic identity verification
                                checkpoints throughout the course to confirm the
                                same user remains active.
                            </p>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-200">
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                                                Action
                                            </th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                                                Timestamp
                                            </th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                                                Context
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {auditLogs.length > 0 ? (
                                            auditLogs.map((item) => (
                                                <tr
                                                    key={item.id}
                                                    className="border-b border-gray-100"
                                                >
                                                    <td className="py-3 px-4 text-sm font-medium">
                                                        {item.action}
                                                    </td>
                                                    <td className="py-3 px-4 text-sm text-gray-600">
                                                        {format(
                                                            new Date(
                                                                item.created_at
                                                            ),
                                                            'MMM d, h:mm a'
                                                        )}
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <span className="text-xs text-gray-500 italic">
                                                            {typeof item.meta ===
                                                            'string'
                                                                ? item.meta
                                                                : JSON.stringify(
                                                                      item.meta
                                                                  ).substring(
                                                                      0,
                                                                      50
                                                                  ) + '...'}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan={3}
                                                    className="py-8 text-center text-gray-500"
                                                >
                                                    No audit trail data found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'certificates' && (
                    <div className="space-y-6">
                        {/* Existing Certificates */}
                        {isLoadingCerts ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                            </div>
                        ) : certificates.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {certificates.map((cert: Certificate) => (
                                        <div
                                            key={cert.id}
                                            className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow"
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className="w-12 h-12 rounded-lg bg-yellow-50 border border-yellow-200 flex items-center justify-center shrink-0">
                                                    <Award className="w-6 h-6 text-yellow-600" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-semibold text-gray-900 truncate">
                                                        {cert.course_title}
                                                    </h3>
                                                    <p className="text-sm text-gray-500 mt-0.5">
                                                        {cert.training_type?.replace('_', ' ')} • {cert.duration_hours}h
                                                    </p>
                                                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-gray-500">
                                                        <span>
                                                            Cert #: <span className="font-medium text-gray-700">{cert.certificate_number || cert.certificate_uid?.slice(0, 8)}</span>
                                                        </span>
                                                        <span>
                                                            Issued: <span className="font-medium text-gray-700">
                                                                {cert.issued_at ? format(new Date(cert.issued_at), 'MMM d, yyyy') : 'N/A'}
                                                            </span>
                                                        </span>
                                                        {cert.expires_at && (
                                                            <span>
                                                                Expires: <span className="font-medium text-gray-700">
                                                                    {format(new Date(cert.expires_at), 'MMM d, yyyy')}
                                                                </span>
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-xs text-gray-500">
                                                        {cert.instructor_name && (
                                                            <span>Instructor: <span className="font-medium text-gray-700">{cert.instructor_name}</span></span>
                                                        )}
                                                        <span>State: <span className="font-medium text-gray-700">{cert.state_name || cert.issued_state_code}</span></span>
                                                        {cert.seat_time_hours > 0 && (
                                                            <span>Seat Time: <span className="font-medium text-gray-700">{cert.seat_time_hours}h</span></span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-100">
                                                <Badge className="bg-green-100 text-green-700 border-green-200">
                                                    Issued
                                                </Badge>
                                                <div className="ml-auto flex gap-2">
                                                    {cert.certificate_url && (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="gap-1.5 text-xs"
                                                            onClick={() => window.open(cert.certificate_url!, '_blank')}
                                                        >
                                                            <Download className="w-3.5 h-3.5" />
                                                            Download
                                                        </Button>
                                                    )}
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="gap-1.5 text-xs"
                                                        onClick={() => navigate(`/certificates/${cert.certificate_uid || cert.id}`)}
                                                    >
                                                        <Eye className="w-3.5 h-3.5" />
                                                        View
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : null}

                        {/* Completed courses without certificates — offer generation */}
                        {(() => {
                            const certCourseIds = new Set(certificates.map((c: Certificate) => c.course_id));
                            const completedWithoutCert = enrollments.filter(
                                (e) =>
                                    (e.status as string === 'COMPLETE') &&
                                    !certCourseIds.has(e.course_id ?? e.course?.id)
                            );

                            if (completedWithoutCert.length > 0) {
                                return (
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-700 mb-3">
                                            Completed Courses — Certificate Available
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {completedWithoutCert.map((enrollment) => (
                                                <div
                                                    key={enrollment.id}
                                                    className="bg-white rounded-lg border border-dashed border-yellow-300 p-5"
                                                >
                                                    <div className="flex items-start gap-4">
                                                        <div className="w-12 h-12 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center shrink-0">
                                                            <FileText className="w-6 h-6 text-gray-400" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <h3 className="font-semibold text-gray-900">
                                                                {enrollment.course.title}
                                                            </h3>
                                                            <p className="text-sm text-gray-500 mt-0.5">
                                                                Completed {enrollment.completed_at
                                                                    ? format(new Date(enrollment.completed_at), 'MMM d, yyyy')
                                                                    : ''
                                                                }
                                                            </p>
                                                            <p className="text-xs text-gray-400 mt-1">
                                                                Progress: {Math.round(enrollment.progress)}% • {enrollment.seat_time_min || 0} mins tracked
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="mt-4 pt-3 border-t border-gray-100">
                                                        <Button
                                                            size="sm"
                                                            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-medium gap-2"
                                                            disabled={generateCertMutation.isPending}
                                                            onClick={() => generateCertMutation.mutate(enrollment.id)}
                                                        >
                                                            {generateCertMutation.isPending ? (
                                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                            ) : (
                                                                <Award className="w-4 h-4" />
                                                            )}
                                                            Generate Certificate
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            }
                            return null;
                        })()}

                        {/* If no certificates and no completed courses */}
                        {certificates.length === 0 &&
                            !enrollments.some(
                                (e) => e.status as string === 'COMPLETE'
                            ) && (
                                <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                                    <div className="text-6xl mb-4">🏆</div>
                                    <h3 className="text-xl font-semibold mb-2">
                                        No Certificates Yet
                                    </h3>
                                    <p className="text-gray-500">
                                        Certificates will appear here once the student
                                        completes their courses.
                                    </p>
                                </div>
                            )}
                    </div>
                )}

                {activeTab === 'logs' && (
                    <div className="space-y-4">
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold mb-4">
                                Detailed Activity Logs
                            </h2>
                            <div className="space-y-4">
                                {auditLogs.length > 0 ? (
                                    auditLogs.map((log) => (
                                        <div
                                            key={log.id}
                                            className="flex gap-4 p-3 border-l-2 border-primary bg-gray-50"
                                        >
                                            <div className="min-w-[120px] text-xs text-gray-500">
                                                {format(
                                                    new Date(log.created_at),
                                                    'MMM d, h:mm a'
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">
                                                    {log.action}
                                                </p>
                                                {log.meta && (
                                                    <pre className="mt-1 text-xs text-gray-500 overflow-x-auto">
                                                        {JSON.stringify(
                                                            log.meta,
                                                            null,
                                                            2
                                                        )}
                                                    </pre>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-8 text-center text-gray-500">
                                        No logs found.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentDetailsPage;
