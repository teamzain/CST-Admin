import { Card } from '@/components/ui/card';
import { Trash2 } from 'lucide-react';

interface CoursesTabProps {
    instructorId: string;
}

const CoursesTab: React.FC<CoursesTabProps> = ({ instructorId: _instructorId }) => {
    const courses = [
        {
            id: 1,
            name: 'Course Name',
            status: 'Active',
            studentsEnrolled: 560,
            lastUpdate: 'Nov 5, 2025',
        },
        {
            id: 2,
            name: 'Course Name',
            status: 'Active',
            studentsEnrolled: 560,
            lastUpdate: 'Nov 5, 2025',
        },
        {
            id: 3,
            name: 'Course Name',
            status: 'Inactive',
            studentsEnrolled: 0,
            lastUpdate: 'Nov 5, 2025',
        },
        {
            id: 4,
            name: 'Course Name',
            status: 'Active',
            studentsEnrolled: 234,
            lastUpdate: 'Nov 5, 2025',
        },
        {
            id: 5,
            name: 'Course Name',
            status: 'Inactive',
            studentsEnrolled: 0,
            lastUpdate: 'Nov 5, 2025',
        },
        {
            id: 6,
            name: 'Course Name',
            status: 'Active',
            studentsEnrolled: 24,
            lastUpdate: 'Nov 5, 2025',
        },
    ];

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
                        {courses.map((course, index) => (
                            <tr
                                key={course.id}
                                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                            >
                                <td className="py-4 px-6 text-sm text-gray-900">
                                    {index + 1}.
                                </td>
                                <td className="py-4 px-6 text-sm text-gray-900">
                                    {course.name}
                                </td>
                                <td className="py-4 px-6">
                                    <span
                                        className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                                            course.status === 'Active'
                                                ? 'bg-green-50 text-green-700 border border-green-200'
                                                : 'bg-gray-100 text-gray-700 border border-gray-200'
                                        }`}
                                    >
                                        {course.status}
                                    </span>
                                </td>
                                <td className="py-4 px-6 text-sm text-gray-900">
                                    {course.studentsEnrolled}
                                </td>
                                <td className="py-4 px-6 text-sm text-gray-900">
                                    {course.lastUpdate}
                                </td>
                                <td className="py-4 px-6">
                                    <button className="text-gray-400 hover:text-red-600 transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

export default CoursesTab;
