import { useState } from 'react';
import {
    ArrowLeft,
    ChevronDown,
    ChevronUp,
    CheckCircle2,
    Circle,
    Eye,
} from 'lucide-react';

const StudentDetailsPage = () => {
    const [activeTab, setActiveTab] = useState('progress');
    const [expandedCourses, setExpandedCourses] = useState<{
        [key: string]: boolean;
    }>({ '1': true });

    const toggleCourse = (id: string) => {
        setExpandedCourses((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const courses = [
        {
            id: '1',
            title: 'Course Name',
            thumbnail:
                'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&h=100&fit=crop',
            status: 'IN PROGRESS',
            enrollmentDate: 'Aug 5, 2025',
            progress: 80,
            hoursText: '18/20 Hours',
            units: [
                {
                    id: 'u1',
                    title: 'Unit 1:',
                    status: 'done',
                    meta: 'Quiz Score 80%',
                },
                {
                    id: 'u2',
                    title: 'Unit 2:',
                    status: 'done',
                    meta: 'Quiz Score 95%',
                },
                {
                    id: 'u3',
                    title: 'Final Exam:',
                    status: 'pending',
                    meta: 'Pending',
                },
            ],
        },
        {
            id: '2',
            title: 'Course Name',
            thumbnail:
                'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=100&h=100&fit=crop',
            status: 'COMPLETED',
            enrollmentDate: 'Aug 5, 2025',
            progress: 100,
            hoursText: '20/20 Hours, Final Score: 97',
        },
        {
            id: '3',
            title: 'Course Name',
            thumbnail:
                'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=100&h=100&fit=crop',
            status: 'COMPLETED',
            enrollmentDate: 'Aug 5, 2025',
            progress: 100,
            hoursText: '20/20 Hours, Final Score: 97',
        },
    ];

    const auditTrail = [
        { milestone: 'Unit 4', timestamp: '2:00 PM', result: 'Verified' },
        { milestone: 'Unit 4', timestamp: '2:00 PM', result: 'Verified' },
        { milestone: 'Unit 5', timestamp: '5:00 PM', result: 'Failed' },
        { milestone: 'Unit 4', timestamp: '2:00 PM', result: 'Verified' },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="mx-auto px-6 py-6">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-center gap-3 mb-3">
                        <button className="p-1 hover:bg-gray-100 rounded">
                            <ArrowLeft className="h-5 w-5" />
                        </button>
                        <h1 className="text-2xl font-semibold">Student Name</h1>
                    </div>
                    <div className="flex gap-6 text-sm text-gray-600 ml-10">
                        <span>
                            User ID:{' '}
                            <span className="text-gray-900 font-medium">
                                STD-9901
                            </span>
                        </span>
                        <span>
                            Last Activity:{' '}
                            <span className="text-gray-900 font-medium">
                                Nov 5, 2025
                            </span>
                        </span>
                        <span>
                            Registered On:{' '}
                            <span className="text-gray-900 font-medium">
                                Aug 5, 2025
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
                        {courses.map((course) => (
                            <div
                                key={course.id}
                                className="bg-white rounded-lg border border-gray-200 p-5"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex gap-4 flex-1">
                                        <img
                                            src={course.thumbnail}
                                            alt={course.title}
                                            className="h-12 w-12 rounded-full object-cover"
                                        />
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-1">
                                                <h3 className="font-semibold">
                                                    {course.title}
                                                </h3>
                                                <span
                                                    className={`text-xs px-2 py-0.5 rounded font-medium ${
                                                        course.status ===
                                                        'COMPLETED'
                                                            ? 'bg-green-100 text-green-700'
                                                            : 'bg-orange-100 text-orange-700'
                                                    }`}
                                                >
                                                    {course.status}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-500">
                                                Enrollment Date:{' '}
                                                {course.enrollmentDate}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => toggleCourse(course.id)}
                                        className="p-1 hover:bg-gray-100 rounded"
                                    >
                                        {expandedCourses[course.id] ? (
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
                                                width: `${course.progress}%`,
                                            }}
                                        />
                                    </div>
                                    <span className="text-sm font-medium min-w-10">
                                        {course.progress}%
                                    </span>
                                    <span className="text-xs text-gray-500 ml-auto whitespace-nowrap">
                                        {course.hoursText}
                                    </span>
                                </div>

                                {expandedCourses[course.id] && course.units && (
                                    <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                                        {course.units.map((unit) => (
                                            <div
                                                key={unit.id}
                                                className="flex items-center gap-3 text-sm"
                                            >
                                                {unit.status === 'done' ? (
                                                    <CheckCircle2 className="h-5 w-5 text-yellow-400 shrink-0" />
                                                ) : (
                                                    <Circle className="h-5 w-5 text-gray-300 shrink-0" />
                                                )}
                                                <span className="font-medium">
                                                    {unit.title}
                                                </span>
                                                <span className="text-gray-500">
                                                    {unit.meta}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'compliance' && (
                    <div className="space-y-6">
                        {/* ID Verification */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold mb-2">
                                ID Verification
                            </h2>
                            <p className="text-sm text-gray-600 mb-6">
                                Verifies the student's identity using a
                                government-issued ID and a live selfie match
                                captured at the start of the course.
                            </p>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="bg-gray-50 rounded-lg p-8 flex items-center justify-center border-2 border-dashed border-gray-300">
                                    <div className="text-center">
                                        <div className="text-gray-400 mb-2">
                                            ✕
                                        </div>
                                        <p className="text-sm text-gray-500">
                                            Government-issued ID
                                        </p>
                                    </div>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-8 flex items-center justify-center border-2 border-dashed border-gray-300">
                                    <div className="text-center">
                                        <div className="text-gray-400 mb-2">
                                            ✕
                                        </div>
                                        <p className="text-sm text-gray-500">
                                            Image of Student
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Signatures */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold mb-2">
                                Signatures
                            </h2>
                            <p className="text-sm text-gray-600 mb-6">
                                Displays required signed policy documents.
                            </p>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                    <span className="font-medium">
                                        Code of Conduct
                                    </span>
                                    <button className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                                        <Eye className="h-4 w-4" />
                                        View
                                    </button>
                                </div>
                                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                    <span className="font-medium">
                                        Use-of-Force Policy
                                    </span>
                                    <button className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                                        <Eye className="h-4 w-4" />
                                        View
                                    </button>
                                </div>
                            </div>
                        </div>

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
                                                Milestone
                                            </th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                                                Timestamp
                                            </th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                                                Verification Result
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {auditTrail.map((item, index) => (
                                            <tr
                                                key={index}
                                                className="border-b border-gray-100"
                                            >
                                                <td className="py-3 px-4 text-sm">
                                                    {item.milestone}
                                                </td>
                                                <td className="py-3 px-4 text-sm text-gray-600">
                                                    {item.timestamp}
                                                </td>
                                                <td className="py-3 px-4">
                                                    <span
                                                        className={`text-xs px-2 py-1 rounded font-medium ${
                                                            item.result ===
                                                            'Verified'
                                                                ? 'bg-green-100 text-green-700'
                                                                : 'bg-yellow-100 text-yellow-700'
                                                        }`}
                                                    >
                                                        {item.result}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
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
                    <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                        <div className="text-6xl mb-4">📝</div>
                        <h3 className="text-xl font-semibold mb-2">
                            Activity Logs
                        </h3>
                        <p className="text-gray-500">
                            Detailed activity logs and timestamps will be
                            displayed here.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentDetailsPage;
