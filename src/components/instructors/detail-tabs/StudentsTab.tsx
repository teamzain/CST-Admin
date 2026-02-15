'use client';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { EnrollmentsRepository } from '@/repositories/enrollments';
import type { Instructor } from '@/repositories/instructors';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Loader2, Users } from 'lucide-react';

interface StudentsTabProps {
    instructor: Instructor;
    instructorId: string;
}

export default function StudentsTab({ instructor }: StudentsTabProps) {
    const navigate = useNavigate();

    // Get course IDs for this instructor
    const courseIds = useMemo(() => {
        return (instructor.assigned_courses || []).map((c: any) =>
            typeof c === 'object' ? c.id : c
        );
    }, [instructor.assigned_courses]);

    // Fetch enrollments for each course
    const { data: allEnrollments = [], isLoading } = useQuery({
        queryKey: ['instructor-students', instructor.id, courseIds],
        queryFn: async () => {
            if (courseIds.length === 0) return [];
            const results = await Promise.all(
                courseIds.map((courseId: number) =>
                    EnrollmentsRepository.getByCourse(courseId, { limit: 200 }).catch(() => ({ data: [] }))
                )
            );
            return results.flatMap((r) => r.data || []);
        },
        enabled: courseIds.length > 0,
    });

    // Deduplicate students by user_id
    const uniqueStudents = useMemo(() => {
        const studentMap = new Map<number, {
            user_id: number;
            first_name: string;
            last_name: string;
            email: string;
            avatar?: string | null;
            courses: { id: number; title: string; status: string; progress: number }[];
        }>();

        allEnrollments.forEach((enrollment) => {
            if (!enrollment.user) return;
            const userId = enrollment.user.id;

            if (!studentMap.has(userId)) {
                studentMap.set(userId, {
                    user_id: userId,
                    first_name: enrollment.user.first_name || '',
                    last_name: enrollment.user.last_name || '',
                    email: enrollment.user.email || '',
                    avatar: enrollment.user.avatar,
                    courses: [],
                });
            }

            studentMap.get(userId)!.courses.push({
                id: enrollment.course_id,
                title: enrollment.course?.title || `Course #${enrollment.course_id}`,
                status: enrollment.status,
                progress: enrollment.progress || 0,
            });
        });

        return Array.from(studentMap.values());
    }, [allEnrollments]);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'COMPLETE':
            case 'COMPLETED':
                return <Badge className="bg-green-100 text-green-700 border-green-200">Completed</Badge>;
            case 'IN_PROGRESS':
                return <Badge className="bg-blue-100 text-blue-700 border-blue-200">In Progress</Badge>;
            case 'DROPPED':
                return <Badge className="bg-red-100 text-red-700 border-red-200">Dropped</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
        );
    }

    if (uniqueStudents.length === 0) {
        return (
            <div className="bg-white rounded-lg p-8 text-center">
                <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">No students enrolled in this instructor's courses</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">
                    Students ({uniqueStudents.length})
                </h3>
                <p className="text-sm text-gray-500">
                    Students enrolled in courses taught by this instructor
                </p>
            </div>
            <Table>
                <TableHeader>
                    <TableRow className="border-gray-200">
                        <TableHead>Student</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Courses</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Avg Progress</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {uniqueStudents.map((student) => {
                        const avgProgress = student.courses.length > 0
                            ? Math.round(student.courses.reduce((sum, c) => sum + c.progress, 0) / student.courses.length)
                            : 0;

                        return (
                            <TableRow
                                key={student.user_id}
                                className="border-gray-200 cursor-pointer hover:bg-gray-50"
                                onClick={() => navigate(`/students/${student.user_id}`)}
                            >
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-medium">
                                            {student.first_name?.[0]?.toUpperCase() || ''}{student.last_name?.[0]?.toUpperCase() || ''}
                                        </div>
                                        <span className="font-medium text-gray-900">
                                            {student.first_name} {student.last_name}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-gray-600">{student.email}</TableCell>
                                <TableCell>
                                    <div className="flex flex-wrap gap-1">
                                        {student.courses.map((c) => (
                                            <Badge key={c.id} variant="outline" className="text-xs">
                                                {c.title}
                                            </Badge>
                                        ))}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-wrap gap-1">
                                        {student.courses.map((c) => (
                                            <span key={c.id}>{getStatusBadge(c.status)}</span>
                                        ))}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-yellow-400 rounded-full"
                                                style={{ width: `${avgProgress}%` }}
                                            />
                                        </div>
                                        <span className="text-sm text-gray-600">{avgProgress}%</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}
