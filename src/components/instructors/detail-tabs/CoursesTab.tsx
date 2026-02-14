import type { Instructor } from '@/repositories/instructors/types';
import { Card } from '@/components/ui/card';
import { Trash2 } from 'lucide-react';

interface CoursesTabProps {
    instructor?: Instructor;
    instructorId: string;
}

const CoursesTab: React.FC<CoursesTabProps> = ({
    instructor,
    instructorId: _instructorId,
}) => {
    const courses = instructor?.assigned_courses && instructor.assigned_courses.length > 0 
        ? instructor.assigned_courses
        : [];

    return (
        <Card className="bg-white">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-200">
                            <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">
                                Sr.
                            </th>
                            <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">
                                Courses
                            </th>
                            <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">
                                Status
                            </th>
                            <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">
                                Students Enrolled
                            </th>
                            <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">
                                Last Update
                            </th>
                            <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">
                                {/* Actions column */}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {courses.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="py-8 px-6 text-center text-gray-500">
                                    No courses assigned
                                </td>
                            </tr>
                        ) : (
                            courses.map((course, index) => (
                                <tr
                                    key={course.id || index}
                                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                                >
                                    <td className="py-4 px-6 text-sm text-gray-900">
                                        {index + 1}.
                                    </td>
                                    <td className="py-4 px-6 text-sm text-gray-900">
                                        {course.title || course.name || `Course ${course.id}`}
                                    </td>
                                    <td className="py-4 px-6">
                                        <span
                                            className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                                                course.is_active === true || course.is_active === 1 || course.status === 'Active' || course.status === 'active'
                                                    ? 'bg-green-50 text-green-700 border border-green-200'
                                                    : 'bg-gray-100 text-gray-700 border border-gray-200'
                                            }`}
                                        >
                                            {course.is_active === true || course.is_active === 1 ? 'Active' : course.is_active === false || course.is_active === 0 ? 'Inactive' : course.status || 'Active'}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-sm text-gray-900">
                                        {course.counts?.enrollments ?? course.students_enrolled ?? course.studentsEnrolled ?? 0}
                                    </td>
                                    <td className="py-4 px-6 text-sm text-gray-900">
                                        {course.updated_at ? new Date(course.updated_at).toLocaleDateString() : course.published_at ? new Date(course.published_at).toLocaleDateString() : '-'}
                                    </td>
                                    <td className="py-4 px-6">
                                        <button className="text-gray-400 hover:text-red-600 transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

export default CoursesTab;
