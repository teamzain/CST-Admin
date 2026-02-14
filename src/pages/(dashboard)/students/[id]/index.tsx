import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { StudentsRepository } from '@/repositories/students/repo';
import { format } from 'date-fns';
import {
    ArrowLeft,
    ChevronDown,
    ChevronUp,
    CheckCircle2,
    Circle,
    Eye,
    Loader2,
} from 'lucide-react';
import { useState } from 'react';

const StudentDetailsPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
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
