import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Star, Trash2, MoreVertical } from 'lucide-react';

interface ReviewsTabProps {
    instructorId: string;
}

const ReviewsTab: React.FC<ReviewsTabProps> = ({
    instructorId: _instructorId,
}) => {
    const reviews = [
        {
            id: 1,
            userName: 'User Name',
            userEmail: 'username@gmail.com',
            courseName: 'Course Name',
            rating: 5,
            review: 'Student Review',
            avatar: null,
        },
        {
            id: 2,
            userName: 'User Name',
            userEmail: 'username@gmail.com',
            courseName: 'Course Name',
            rating: 5,
            review: 'Student Review',
            avatar: null,
        },
        {
            id: 3,
            userName: 'User Name',
            userEmail: 'username@gmail.com',
            courseName: 'Course Name',
            rating: 5,
            review: 'Student Review',
            avatar: null,
        },
        {
            id: 4,
            userName: 'User Name',
            userEmail: 'username@gmail.com',
            courseName: 'Course Name',
            rating: 5,
            review: 'Student Review',
            avatar: null,
        },
        {
            id: 5,
            userName: 'User Name',
            userEmail: 'username@gmail.com',
            courseName: 'Course Name',
            rating: 5,
            review: 'Student Review',
            avatar: null,
        },
        {
            id: 6,
            userName: 'User Name',
            userEmail: 'username@gmail.com',
            courseName: 'Course Name',
            rating: 5,
            review: 'Student Review',
            avatar: null,
        },
    ];

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const renderStars = (rating: number) => {
        return (
            <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`w-4 h-4 ${
                            star <= rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'fill-gray-200 text-gray-200'
                        }`}
                    />
                ))}
            </div>
        );
    };

    return (
        <Card className="bg-white">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-200">
                            <th className="text-left py-4 px-6 w-12">
                                <Checkbox />
                            </th>
                            <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">
                                User
                            </th>
                            <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">
                                Course
                            </th>
                            <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">
                                Rating
                            </th>
                            <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">
                                Review
                            </th>
                            <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">
                                <MoreVertical className="w-4 h-4" />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {reviews.map((review) => (
                            <tr
                                key={review.id}
                                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                            >
                                <td className="py-4 px-6">
                                    <Checkbox />
                                </td>
                                <td className="py-4 px-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-sm font-semibold">
                                            {getInitials(review.userName)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">
                                                {review.userName}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {review.userEmail}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-4 px-6 text-sm text-gray-900">
                                    {review.courseName}
                                </td>
                                <td className="py-4 px-6">
                                    {renderStars(review.rating)}
                                </td>
                                <td className="py-4 px-6 text-sm text-gray-900">
                                    {review.review}
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

export default ReviewsTab;
