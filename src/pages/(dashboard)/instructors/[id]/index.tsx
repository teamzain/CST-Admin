'use client';

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import {
    ArrowLeft,
    ChevronDown,
    ChevronUp,
    Mail,
    Phone,
    MapPin,
    Calendar,
    FileText,
    BookOpen,
    AlertCircle,
    CheckCircle,
    Clock,
    Edit,
    Download,
    Printer,
    ExternalLink,
    Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import type { Instructor } from '@/repositories/instructors';

// Mock data - replace with API calls
const mockInstructor: Instructor = {
    id: 1,
    name: 'John Martinez',
    email: 'john.m@example.com',
    license: 'IL-ARM-001',
    state: 'Illinois',
    expiry: '2025-07-15',
    status: 'active',
    user: {
        id: 101,
        firstName: 'John',
        lastName: 'Martinez',
        email: 'john.m@example.com',
        phone: '(555) 123-4567',
        avatar: 'JM',
    },
};

const mockLicenses = [
    {
        id: 1,
        state: 'Illinois',
        licenseNo: 'IL-ARM-001',
        expiryDate: '2025-07-15',
        status: 'active',
        verified: true,
        daysLeft: 238,
    },
    {
        id: 2,
        state: 'Indiana',
        licenseNo: 'IN-ARM-045',
        expiryDate: '2024-12-31',
        status: 'expired',
        verified: true,
        daysLeft: -15,
    },
    {
        id: 3,
        state: 'Wisconsin',
        licenseNo: 'WI-ARM-789',
        expiryDate: '2025-03-15',
        status: 'pending',
        verified: false,
        daysLeft: 85,
    },
];

const mockAssignedCourses = [
    {
        id: 1,
        title: 'Unarmed Security Officer - 20 Hour',
        code: 'USO-101',
        trainingType: 'Unarmed',
        deliveryMode: 'Online',
        duration: 20,
        studentsEnrolled: 24,
        status: 'Active',
        nextSession: '2024-01-15',
    },
    {
        id: 2,
        title: 'Armed Security Officer Certification',
        code: 'ASO-201',
        trainingType: 'Armed',
        deliveryMode: 'In-Person',
        duration: 40,
        studentsEnrolled: 18,
        status: 'Active',
        nextSession: '2024-01-20',
    },
    {
        id: 3,
        title: 'Firearms Refresher Course',
        code: 'FRC-301',
        trainingType: 'Armed',
        deliveryMode: 'Hybrid',
        duration: 8,
        studentsEnrolled: 12,
        status: 'Completed',
        nextSession: '2024-02-01',
    },
];

const mockActivityLogs = [
    {
        id: 1,
        action: 'Course Assigned',
        description: 'Assigned to Unarmed Security Officer course',
        timestamp: '2024-01-10 09:30 AM',
        user: 'Admin User',
    },
    {
        id: 2,
        action: 'License Updated',
        description: 'Illinois license renewed',
        timestamp: '2024-01-05 02:15 PM',
        user: 'John Martinez',
    },
    {
        id: 3,
        action: 'Student Graded',
        description: 'Graded final exams for ASO-201',
        timestamp: '2024-01-03 11:45 AM',
        user: 'System',
    },
    {
        id: 4,
        action: 'Profile Updated',
        description: 'Updated contact information',
        timestamp: '2024-01-02 04:20 PM',
        user: 'John Martinez',
    },
];

const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
        case 'active':
            return 'bg-green-100 text-green-700 border-green-200';
        case 'expired':
            return 'bg-red-100 text-red-700 border-red-200';
        case 'pending':
            return 'bg-yellow-100 text-yellow-700 border-yellow-200';
        default:
            return 'bg-gray-100 text-gray-700 border-gray-200';
    }
};

const getVerificationBadge = (verified: boolean) => (
    <Badge variant={verified ? 'default' : 'secondary'} className="gap-1">
        {verified ? (
            <>
                <CheckCircle className="w-3 h-3" />
                Verified
            </>
        ) : (
            <>
                <AlertCircle className="w-3 h-3" />
                Pending
            </>
        )}
    </Badge>
);

const getDaysLeftBadge = (daysLeft: number) => {
    if (daysLeft > 90) {
        return <Badge variant="default">{daysLeft} days</Badge>;
    } else if (daysLeft > 30) {
        return (
            <Badge
                variant="secondary"
                className="bg-yellow-100 text-yellow-700"
            >
                {daysLeft} days
            </Badge>
        );
    } else if (daysLeft > 0) {
        return (
            <Badge
                variant="destructive"
                className="bg-orange-100 text-orange-700"
            >
                {daysLeft} days
            </Badge>
        );
    } else {
        return <Badge variant="destructive">Expired</Badge>;
    }
};

export default function InstructorDetailsPage() {
    const router = useNavigate();
    const params = useParams();
    const [instructor, setInstructor] = useState<Instructor | null>(null);
    const [loading, setLoading] = useState(true);
    const [expandedLicense, setExpandedLicense] = useState<number | null>(1);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        // Fetch instructor data
        const fetchInstructor = async () => {
            setLoading(true);
            try {
                // Replace with actual API call
                // const response = await fetch(`/api/instructors/${params.id}`);
                // const data = await response.json();
                // setInstructor(data);
                setInstructor(mockInstructor);
            } catch (error) {
                console.error('Error fetching instructor:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchInstructor();
    }, [params.id]);

    const toggleLicense = (licenseId: number) => {
        setExpandedLicense(expandedLicense === licenseId ? null : licenseId);
    };

    const handleEdit = () => {
        router(`/instructors/${params.id}/edit`);
    };

    const handleAssignCourse = () => {
        router(`/instructors/${params.id}/assign-courses`);
    };

    const handleManageLicense = () => {
        router(`/instructors/${params.id}/licenses`);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-gray-600">
                        Loading instructor details...
                    </p>
                </div>
            </div>
        );
    }

    if (!instructor) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="h-12 w-12 text-gray-400 mx-auto" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900">
                        Instructor not found
                    </h3>
                    <p className="mt-2 text-gray-600">
                        The instructor you're looking for doesn't exist.
                    </p>
                    <Button
                        onClick={() => router('/instructors')}
                        className="mt-4"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Instructors
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="mx-auto px-4 py-6">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => router('/instructors')}
                                className="gap-2"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Back
                            </Button>
                            <div className="flex items-center gap-3">
                                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-lg font-semibold text-primary">
                                    {instructor.user?.avatar ||
                                        instructor.name.charAt(0)}
                                </div>
                                <div>
                                    <h1 className="text-2xl font-semibold text-gray-900">
                                        {instructor.name}
                                    </h1>
                                    <div className="flex items-center gap-4 mt-1">
                                        <span className="text-sm text-gray-600 flex items-center gap-1">
                                            <Mail className="w-4 h-4" />
                                            {instructor.email}
                                        </span>
                                        {instructor.user?.phone && (
                                            <span className="text-sm text-gray-600 flex items-center gap-1">
                                                <Phone className="w-4 h-4" />
                                                {instructor.user.phone}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                onClick={handleEdit}
                                className="gap-2"
                            >
                                <Edit className="w-4 h-4" />
                                Edit
                            </Button>
                            <Button
                                onClick={handleAssignCourse}
                                className="gap-2"
                            >
                                <BookOpen className="w-4 h-4" />
                                Assign Course
                            </Button>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <Card>
                            <CardContent className="pt-6">
                                <div className="text-center">
                                    <div className="text-2xl font-semibold text-gray-900">
                                        {mockAssignedCourses.length}
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        Active Courses
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-6">
                                <div className="text-center">
                                    <div className="text-2xl font-semibold text-gray-900">
                                        {mockAssignedCourses.reduce(
                                            (sum, course) =>
                                                sum + course.studentsEnrolled,
                                            0
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        Total Students
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-6">
                                <div className="text-center">
                                    <div className="text-2xl font-semibold text-gray-900">
                                        {
                                            mockLicenses.filter(
                                                (l) => l.status === 'active'
                                            ).length
                                        }
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        Active Licenses
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-6">
                                <div className="text-center">
                                    <Badge
                                        variant={
                                            instructor.status === 'active'
                                                ? 'default'
                                                : 'destructive'
                                        }
                                    >
                                        {instructor.status
                                            .charAt(0)
                                            .toUpperCase() +
                                            instructor.status.slice(1)}
                                    </Badge>
                                    <p className="text-sm text-gray-600 mt-2">
                                        Status
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Tabs */}
                <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="w-full"
                >
                    <TabsList className="grid w-full grid-cols-5 lg:w-auto">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="licenses">Licenses</TabsTrigger>
                        <TabsTrigger value="courses">Courses</TabsTrigger>
                        <TabsTrigger value="activity">Activity</TabsTrigger>
                        <TabsTrigger value="documents">Documents</TabsTrigger>
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview" className="space-y-6 mt-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Personal Information */}
                            <Card className="lg:col-span-2">
                                <CardContent className="pt-6">
                                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                        <FileText className="w-5 h-5" />
                                        Personal Information
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">
                                                Full Name
                                            </label>
                                            <p className="text-sm text-gray-900 mt-1">
                                                {instructor.name}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">
                                                Email
                                            </label>
                                            <p className="text-sm text-gray-900 mt-1">
                                                {instructor.email}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">
                                                Phone
                                            </label>
                                            <p className="text-sm text-gray-900 mt-1">
                                                {instructor.user?.phone ||
                                                    'N/A'}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">
                                                Primary State
                                            </label>
                                            <p className="text-sm text-gray-900 mt-1">
                                                {instructor.state}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">
                                                User ID
                                            </label>
                                            <p className="text-sm text-gray-900 mt-1">
                                                INST-
                                                {instructor.id
                                                    .toString()
                                                    .padStart(4, '0')}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">
                                                Member Since
                                            </label>
                                            <p className="text-sm text-gray-900 mt-1">
                                                Jan 15, 2023
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Quick Actions */}
                            <Card>
                                <CardContent className="pt-6">
                                    <h3 className="text-lg font-semibold mb-4">
                                        Quick Actions
                                    </h3>
                                    <div className="space-y-3">
                                        <Button
                                            variant="outline"
                                            className="w-full justify-start gap-2"
                                            onClick={handleManageLicense}
                                        >
                                            <FileText className="w-4 h-4" />
                                            Manage Licenses
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="w-full justify-start gap-2"
                                            onClick={handleAssignCourse}
                                        >
                                            <BookOpen className="w-4 h-4" />
                                            Assign Courses
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="w-full justify-start gap-2"
                                        >
                                            <Mail className="w-4 h-4" />
                                            Send Email
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="w-full justify-start gap-2"
                                        >
                                            <Printer className="w-4 h-4" />
                                            Print Credentials
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="w-full justify-start gap-2 text-red-600 hover:text-red-700"
                                        >
                                            <AlertCircle className="w-4 h-4" />
                                            Deactivate Account
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Recent Activity */}
                            <Card className="lg:col-span-3">
                                <CardContent className="pt-6">
                                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                        <Clock className="w-5 h-5" />
                                        Recent Activity
                                    </h3>
                                    <div className="space-y-3">
                                        {mockActivityLogs
                                            .slice(0, 3)
                                            .map((log) => (
                                                <div
                                                    key={log.id}
                                                    className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50"
                                                >
                                                    <div>
                                                        <p className="font-medium">
                                                            {log.action}
                                                        </p>
                                                        <p className="text-sm text-gray-600">
                                                            {log.description}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sm text-gray-600">
                                                            {log.timestamp}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            by {log.user}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        <Button
                                            variant="ghost"
                                            className="w-full"
                                            onClick={() =>
                                                setActiveTab('activity')
                                            }
                                        >
                                            View All Activity
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Licenses Tab */}
                    <TabsContent value="licenses" className="mt-6">
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-lg font-semibold">
                                        Licenses & Certifications
                                    </h3>
                                    <Button
                                        onClick={handleManageLicense}
                                        className="gap-2"
                                    >
                                        <FileText className="w-4 h-4" />
                                        Manage Licenses
                                    </Button>
                                </div>

                                <div className="space-y-4">
                                    {mockLicenses.map((license) => (
                                        <div
                                            key={license.id}
                                            className="border border-gray-200 rounded-lg overflow-hidden"
                                        >
                                            <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className={`p-2 rounded-lg border ${getStatusColor(license.status)}`}
                                                    >
                                                        <MapPin className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold">
                                                            {license.state}
                                                        </h4>
                                                        <p className="text-sm text-gray-600">
                                                            License #
                                                            {license.licenseNo}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    {getVerificationBadge(
                                                        license.verified
                                                    )}
                                                    {getDaysLeftBadge(
                                                        license.daysLeft
                                                    )}
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            toggleLicense(
                                                                license.id
                                                            )
                                                        }
                                                    >
                                                        {expandedLicense ===
                                                        license.id ? (
                                                            <ChevronUp className="w-4 h-4" />
                                                        ) : (
                                                            <ChevronDown className="w-4 h-4" />
                                                        )}
                                                    </Button>
                                                </div>
                                            </div>

                                            {expandedLicense === license.id && (
                                                <div className="p-4 bg-white">
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                                        <div>
                                                            <label className="text-sm font-medium text-gray-500">
                                                                License Number
                                                            </label>
                                                            <p className="text-sm text-gray-900">
                                                                {
                                                                    license.licenseNo
                                                                }
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <label className="text-sm font-medium text-gray-500">
                                                                Expiry Date
                                                            </label>
                                                            <p className="text-sm text-gray-900 flex items-center gap-1">
                                                                <Calendar className="w-4 h-4" />
                                                                {new Date(
                                                                    license.expiryDate
                                                                ).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <label className="text-sm font-medium text-gray-500">
                                                                Status
                                                            </label>
                                                            <Badge
                                                                className={getStatusColor(
                                                                    license.status
                                                                )}
                                                            >
                                                                {license.status
                                                                    .charAt(0)
                                                                    .toUpperCase() +
                                                                    license.status.slice(
                                                                        1
                                                                    )}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="gap-1"
                                                        >
                                                            <Download className="w-4 h-4" />
                                                            Download
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="gap-1"
                                                        >
                                                            <Printer className="w-4 h-4" />
                                                            Print
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="gap-1"
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                            Renew
                                                        </Button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {/* Add License Card */}
                                <div className="mt-6 p-6 border-2 border-dashed border-gray-300 rounded-lg text-center">
                                    <div className="text-gray-400 mb-3">
                                        <FileText className="h-12 w-12 mx-auto" />
                                    </div>
                                    <h4 className="font-medium mb-2">
                                        Add New License
                                    </h4>
                                    <p className="text-sm text-gray-600 mb-4">
                                        Add licenses from additional states
                                    </p>
                                    <Button
                                        variant="outline"
                                        onClick={handleManageLicense}
                                        className="gap-2"
                                    >
                                        <FileText className="w-4 h-4" />
                                        Add License
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Courses Tab */}
                    <TabsContent value="courses" className="mt-6">
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-lg font-semibold">
                                        Assigned Courses
                                    </h3>
                                    <Button
                                        onClick={handleAssignCourse}
                                        className="gap-2"
                                    >
                                        <BookOpen className="w-4 h-4" />
                                        Assign New Course
                                    </Button>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-gray-200">
                                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                                                    Course
                                                </th>
                                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                                                    Training Type
                                                </th>
                                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                                                    Delivery Mode
                                                </th>
                                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                                                    Students
                                                </th>
                                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                                                    Next Session
                                                </th>
                                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                                                    Status
                                                </th>
                                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {mockAssignedCourses.map(
                                                (course) => (
                                                    <tr
                                                        key={course.id}
                                                        className="border-b border-gray-100 hover:bg-gray-50"
                                                    >
                                                        <td className="py-3 px-4">
                                                            <div>
                                                                <p className="font-medium text-gray-900">
                                                                    {
                                                                        course.title
                                                                    }
                                                                </p>
                                                                <p className="text-sm text-gray-500">
                                                                    {
                                                                        course.code
                                                                    }
                                                                </p>
                                                            </div>
                                                        </td>
                                                        <td className="py-3 px-4">
                                                            <Badge variant="outline">
                                                                {
                                                                    course.trainingType
                                                                }
                                                            </Badge>
                                                        </td>
                                                        <td className="py-3 px-4">
                                                            <Badge variant="secondary">
                                                                {
                                                                    course.deliveryMode
                                                                }
                                                            </Badge>
                                                        </td>
                                                        <td className="py-3 px-4">
                                                            <div className="text-center">
                                                                <p className="font-medium">
                                                                    {
                                                                        course.studentsEnrolled
                                                                    }
                                                                </p>
                                                                <Progress
                                                                    value={
                                                                        (course.studentsEnrolled /
                                                                            25) *
                                                                        100
                                                                    }
                                                                    className="h-2 mt-1"
                                                                />
                                                            </div>
                                                        </td>
                                                        <td className="py-3 px-4">
                                                            <div className="flex items-center gap-1">
                                                                <Calendar className="w-4 h-4 text-gray-400" />
                                                                <span className="text-sm">
                                                                    {new Date(
                                                                        course.nextSession
                                                                    ).toLocaleDateString()}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="py-3 px-4">
                                                            <Badge
                                                                className={getStatusColor(
                                                                    course.status
                                                                )}
                                                            >
                                                                {course.status}
                                                            </Badge>
                                                        </td>
                                                        <td className="py-3 px-4">
                                                            <div className="flex gap-2">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="h-8 w-8 p-0"
                                                                >
                                                                    <ExternalLink className="w-4 h-4" />
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="h-8 w-8 p-0"
                                                                >
                                                                    <Edit className="w-4 h-4" />
                                                                </Button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                {/* No Courses State */}
                                {mockAssignedCourses.length === 0 && (
                                    <div className="text-center py-12">
                                        <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                        <h4 className="font-medium text-gray-900 mb-2">
                                            No Courses Assigned
                                        </h4>
                                        <p className="text-gray-600 mb-4">
                                            This instructor hasn't been assigned
                                            any courses yet.
                                        </p>
                                        <Button
                                            onClick={handleAssignCourse}
                                            className="gap-2"
                                        >
                                            <BookOpen className="w-4 h-4" />
                                            Assign First Course
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Activity Tab */}
                    <TabsContent value="activity" className="mt-6">
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-lg font-semibold">
                                        Activity Log
                                    </h3>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="gap-1"
                                        >
                                            <Download className="w-4 h-4" />
                                            Export Logs
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="gap-1"
                                        >
                                            <Printer className="w-4 h-4" />
                                            Print
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {mockActivityLogs.map((log) => (
                                        <div
                                            key={log.id}
                                            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                                        >
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <div className="h-2 w-2 rounded-full bg-primary"></div>
                                                        <h4 className="font-medium">
                                                            {log.action}
                                                        </h4>
                                                    </div>
                                                    <p className="text-sm text-gray-600">
                                                        {log.description}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm text-gray-600">
                                                        {log.timestamp}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        by {log.user}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Load More */}
                                <div className="mt-6 text-center">
                                    <Button variant="outline">
                                        Load More Activity
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Documents Tab */}
                    <TabsContent value="documents" className="mt-6">
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-lg font-semibold">
                                        Documents & Files
                                    </h3>
                                    <Button variant="outline" className="gap-2">
                                        <Upload className="w-4 h-4" />
                                        Upload Document
                                    </Button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {/* Document Cards */}
                                    {[
                                        {
                                            name: 'License Certificate.pdf',
                                            date: 'Jan 10, 2024',
                                            type: 'PDF',
                                            size: '2.4 MB',
                                        },
                                        {
                                            name: 'Background Check.pdf',
                                            date: 'Dec 15, 2023',
                                            type: 'PDF',
                                            size: '1.8 MB',
                                        },
                                        {
                                            name: 'Training Certificate.pdf',
                                            date: 'Nov 20, 2023',
                                            type: 'PDF',
                                            size: '3.2 MB',
                                        },
                                        {
                                            name: 'ID Verification.jpg',
                                            date: 'Oct 5, 2023',
                                            type: 'Image',
                                            size: '1.5 MB',
                                        },
                                        {
                                            name: 'Contract Agreement.docx',
                                            date: 'Sep 12, 2023',
                                            type: 'Document',
                                            size: '0.8 MB',
                                        },
                                        {
                                            name: 'CPR Certification.pdf',
                                            date: 'Aug 30, 2023',
                                            type: 'PDF',
                                            size: '2.1 MB',
                                        },
                                    ].map((doc, index) => (
                                        <div
                                            key={index}
                                            className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 hover:shadow-sm"
                                        >
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="p-2 bg-gray-100 rounded-lg">
                                                    <FileText className="w-6 h-6 text-gray-600" />
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0"
                                                >
                                                    <MoreVertical className="w-4 h-4" />
                                                </Button>
                                            </div>
                                            <h4 className="font-medium text-sm mb-1 truncate">
                                                {doc.name}
                                            </h4>
                                            <div className="flex items-center justify-between text-xs text-gray-500">
                                                <span>{doc.type}</span>
                                                <span>{doc.size}</span>
                                            </div>
                                            <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
                                                <span className="text-xs text-gray-500">
                                                    {doc.date}
                                                </span>
                                                <div className="flex gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-6 px-2"
                                                    >
                                                        <Eye className="w-3 h-3" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-6 px-2"
                                                    >
                                                        <Download className="w-3 h-3" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* No Documents State */}
                                <div className="text-center py-12">
                                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <h4 className="font-medium text-gray-900 mb-2">
                                        No Documents Uploaded
                                    </h4>
                                    <p className="text-gray-600 mb-4">
                                        Upload licenses, certificates, and other
                                        documents.
                                    </p>
                                    <Button variant="outline" className="gap-2">
                                        <Upload className="w-4 h-4" />
                                        Upload First Document
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}

// Add missing icon
const Upload = ({ className }: { className?: string }) => (
    <svg
        className={className}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
        />
    </svg>
);

const MoreVertical = ({ className }: { className?: string }) => (
    <svg
        className={className}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
        />
    </svg>
);
