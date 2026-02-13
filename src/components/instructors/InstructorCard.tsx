import { Button } from '@/components/ui/button';
import type { Instructor } from '@/repositories/instructors';
import { MoreVertical, Trash2 } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface InstructorCardProps {
    instructor: Instructor;
    onViewProfile: (id: number) => void;
    onDelete?: (instructor: Instructor) => void;
}

const InstructorCard: React.FC<InstructorCardProps> = ({
    instructor,
    onViewProfile,
    onDelete,
}) => {
    // Get status badge styling
    const getStatusBadge = (status: string | undefined) => {
        const styles = {
            active: 'bg-green-50 text-green-700 border border-green-200',
            pending: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
            expired: 'bg-red-50 text-red-700 border border-red-200',
        };
        const normalizedStatus = String(status || 'active').toLowerCase();
        return styles[normalizedStatus as keyof typeof styles] || styles.active;
    };

    // Get initials from name
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    // Stats from instructor data
    const stats = {
        courses: instructor.assigned_courses?.length || 0,
        students: '—',
        rating: '—',
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow relative">
            {/* Status Badge - Top Left */}
            <div className="absolute top-4 left-4">
                <span
                    className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusBadge(instructor.status)}`}
                >
                    {instructor.status}
                </span>
            </div>

            {/* More Options - Top Right */}
            <div className="absolute top-4 right-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="text-gray-400 hover:text-gray-600">
                            <MoreVertical size={20} />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem
                            className="text-red-600 focus:text-red-600"
                            onClick={() => onDelete?.(instructor)}
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Avatar and Info */}
            <div className="flex flex-col items-center mt-8">
                {/* Avatar */}
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xl font-semibold mb-3 relative">
                    {instructor.avatar ? (
                        <img
                            src={instructor.avatar}
                            alt={instructor.name || instructor.first_name}
                            className="w-full h-full rounded-full object-cover"
                        />
                    ) : (
                        getInitials(instructor.name || `${instructor.first_name} ${instructor.last_name}`)
                    )}
                    {/* Online indicator */}
                    <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
                </div>

                {/* Name */}
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {instructor.name || `${instructor.first_name} ${instructor.last_name}`}
                </h3>

                {/* Email */}
                <p className="text-sm text-gray-600 mb-4">{instructor.email}</p>

                {/* Safety Compliance Badge */}
                <div className="mb-6">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                        Safety Compliance
                    </span>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between w-full mb-6 border-t border-b border-gray-200 py-4">
                    <div className="flex-1 text-center border-r border-gray-200">
                        <div className="text-xl font-bold text-gray-900">
                            {stats.courses}
                        </div>
                        <div className="text-xs text-gray-600">Courses</div>
                    </div>
                    <div className="flex-1 text-center border-r border-gray-200">
                        <div className="text-xl font-bold text-gray-900">
                            {stats.students}
                        </div>
                        <div className="text-xs text-gray-600">Students</div>
                    </div>
                    <div className="flex-1 text-center">
                        <div className="text-xl font-bold text-gray-900">
                            {stats.rating}
                        </div>
                        <div className="text-xs text-gray-600">Rating</div>
                    </div>
                </div>

                {/* View Profile Button */}
                <Button
                    onClick={() => onViewProfile(instructor.id)}
                    className="w-full bg-[#FFC107] hover:bg-[#FFB300] text-black font-medium"
                >
                    View Profile
                </Button>
            </div>
        </div>
    );
};

export default InstructorCard;
