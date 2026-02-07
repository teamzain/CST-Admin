import type { Instructor } from '@/repositories/instructors/types';
import { BookOpen, Star, Activity } from 'lucide-react';

interface OverviewTabProps {
    instructor?: Instructor;
    instructorId: string;
}

const OverviewTab: React.FC<OverviewTabProps> = ({
    instructor,
    instructorId: _instructorId,
}) => {
    return (
        <div className="space-y-4">
            {/* Stats Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1 flex flex-col justify-between">
                    {/* Total Courses Card */}
                    <div className="bg-white rounded-lg p-5 border border-gray-200">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs text-gray-500 mb-1 font-medium">
                                    Total Courses
                                </p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {instructor?.assigned_courses?.length || 0}
                                </p>
                            </div>
                            <div className="p-2 bg-gray-50 rounded-lg">
                                <BookOpen className="w-5 h-5 text-gray-600" />
                            </div>
                        </div>
                    </div>

                    {/* Average Rating Card */}
                    <div className="bg-white rounded-lg p-5 border border-gray-200">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs text-gray-500 mb-1 font-medium">
                                    Average Rating
                                </p>
                                <p className="text-2xl font-bold text-gray-900">
                                    4.5
                                </p>
                            </div>
                            <div className="p-2 bg-gray-50 rounded-lg">
                                <Star className="w-5 h-5 text-gray-600" />
                            </div>
                        </div>
                    </div>

                    {/* Last Activity Card */}
                    <div className="bg-white rounded-lg p-5 border border-gray-200">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs text-gray-500 mb-1 font-medium">
                                    Last Activity
                                </p>
                                <p className="text-base font-semibold text-gray-900">
                                    Nov 5, 2025
                                </p>
                            </div>
                            <div className="p-2 bg-gray-50 rounded-lg">
                                <Activity className="w-5 h-5 text-gray-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Charts Row */}
                <div className="bg-white rounded-lg p-6 border border-gray-200 md:col-span-2">
                    <div className="mb-6">
                        <h3 className="text-base font-semibold text-gray-900 mb-3">
                            Total Students
                        </h3>
                        <div className="flex items-center gap-4 text-xs">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-black rounded-full"></div>
                                <span className="text-gray-600">This year</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                                <span className="text-gray-600">Last year</span>
                            </div>
                        </div>
                    </div>

                    {/* Chart */}
                    <div className="relative h-56">
                        <svg
                            className="w-full h-full"
                            viewBox="0 0 600 200"
                            preserveAspectRatio="none"
                        >
                            {/* Y-axis grid lines */}
                            <line
                                x1="40"
                                y1="20"
                                x2="600"
                                y2="20"
                                stroke="#f3f4f6"
                                strokeWidth="1"
                            />
                            <line
                                x1="40"
                                y1="60"
                                x2="600"
                                y2="60"
                                stroke="#f3f4f6"
                                strokeWidth="1"
                            />
                            <line
                                x1="40"
                                y1="100"
                                x2="600"
                                y2="100"
                                stroke="#f3f4f6"
                                strokeWidth="1"
                            />
                            <line
                                x1="40"
                                y1="140"
                                x2="600"
                                y2="140"
                                stroke="#f3f4f6"
                                strokeWidth="1"
                            />
                            <line
                                x1="40"
                                y1="180"
                                x2="600"
                                y2="180"
                                stroke="#f3f4f6"
                                strokeWidth="1"
                            />

                            {/* Y-axis labels */}
                            <text
                                x="5"
                                y="25"
                                fontSize="10"
                                fill="#9ca3af"
                                fontFamily="system-ui"
                            >
                                1500
                            </text>
                            <text
                                x="5"
                                y="65"
                                fontSize="10"
                                fill="#9ca3af"
                                fontFamily="system-ui"
                            >
                                1000
                            </text>
                            <text
                                x="10"
                                y="105"
                                fontSize="10"
                                fill="#9ca3af"
                                fontFamily="system-ui"
                            >
                                500
                            </text>
                            <text
                                x="20"
                                y="185"
                                fontSize="10"
                                fill="#9ca3af"
                                fontFamily="system-ui"
                            >
                                0
                            </text>

                            {/* This year line (smooth curve) */}
                            <path
                                d="M 60,140 C 100,120 120,100 140,90 C 160,80 180,70 220,60 C 260,50 300,55 340,65 C 380,75 420,70 460,55 C 500,40 540,35 580,30"
                                fill="none"
                                stroke="#000000"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />

                            {/* Last year line (dashed) */}
                            <path
                                d="M 60,150 C 100,140 120,130 140,125 C 160,120 180,115 220,110 C 260,105 300,100 340,95 C 380,90 420,85 460,75 C 500,65 540,60 580,50"
                                fill="none"
                                stroke="#d1d5db"
                                strokeWidth="2"
                                strokeDasharray="5,3"
                                strokeLinecap="round"
                            />

                            {/* X-axis labels */}
                            <text
                                x="55"
                                y="195"
                                fontSize="10"
                                fill="#9ca3af"
                                fontFamily="system-ui"
                            >
                                Jan
                            </text>
                            <text
                                x="130"
                                y="195"
                                fontSize="10"
                                fill="#9ca3af"
                                fontFamily="system-ui"
                            >
                                Feb
                            </text>
                            <text
                                x="210"
                                y="195"
                                fontSize="10"
                                fill="#9ca3af"
                                fontFamily="system-ui"
                            >
                                Mar
                            </text>
                            <text
                                x="285"
                                y="195"
                                fontSize="10"
                                fill="#9ca3af"
                                fontFamily="system-ui"
                            >
                                Apr
                            </text>
                            <text
                                x="365"
                                y="195"
                                fontSize="10"
                                fill="#9ca3af"
                                fontFamily="system-ui"
                            >
                                May
                            </text>
                            <text
                                x="440"
                                y="195"
                                fontSize="10"
                                fill="#9ca3af"
                                fontFamily="system-ui"
                            >
                                Jun
                            </text>
                            <text
                                x="520"
                                y="195"
                                fontSize="10"
                                fill="#9ca3af"
                                fontFamily="system-ui"
                            >
                                Jul
                            </text>
                        </svg>
                    </div>
                </div>
            </div>

            <div className="w-full">
                {/* Total Students Chart */}

                {/* Total Earnings Chart */}
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-base font-semibold text-gray-900">
                            Total Earnings
                        </h3>
                        <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
                            2025
                        </span>
                    </div>

                    {/* Chart */}
                    <div className="relative h-56">
                        <svg
                            className="w-full h-full"
                            viewBox="0 0 600 200"
                            preserveAspectRatio="none"
                        >
                            {/* Y-axis grid lines */}
                            <line
                                x1="40"
                                y1="20"
                                x2="600"
                                y2="20"
                                stroke="#f3f4f6"
                                strokeWidth="1"
                            />
                            <line
                                x1="40"
                                y1="60"
                                x2="600"
                                y2="60"
                                stroke="#f3f4f6"
                                strokeWidth="1"
                            />
                            <line
                                x1="40"
                                y1="100"
                                x2="600"
                                y2="100"
                                stroke="#f3f4f6"
                                strokeWidth="1"
                            />
                            <line
                                x1="40"
                                y1="140"
                                x2="600"
                                y2="140"
                                stroke="#f3f4f6"
                                strokeWidth="1"
                            />
                            <line
                                x1="40"
                                y1="180"
                                x2="600"
                                y2="180"
                                stroke="#f3f4f6"
                                strokeWidth="1"
                            />

                            {/* Y-axis labels */}
                            <text
                                x="8"
                                y="25"
                                fontSize="10"
                                fill="#9ca3af"
                                fontFamily="system-ui"
                            >
                                12k
                            </text>
                            <text
                                x="8"
                                y="65"
                                fontSize="10"
                                fill="#9ca3af"
                                fontFamily="system-ui"
                            >
                                10k
                            </text>
                            <text
                                x="13"
                                y="105"
                                fontSize="10"
                                fill="#9ca3af"
                                fontFamily="system-ui"
                            >
                                8k
                            </text>
                            <text
                                x="13"
                                y="145"
                                fontSize="10"
                                fill="#9ca3af"
                                fontFamily="system-ui"
                            >
                                6k
                            </text>
                            <text
                                x="13"
                                y="185"
                                fontSize="10"
                                fill="#9ca3af"
                                fontFamily="system-ui"
                            >
                                4k
                            </text>

                            {/* Earnings line with points */}
                            <path
                                d="M 50,150 L 90,120 L 130,135 L 170,60 L 210,155 L 250,95 L 290,120 L 330,40 L 370,115 L 410,90 L 450,105 L 490,100"
                                fill="none"
                                stroke="#6b7280"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />

                            {/* Data points */}
                            <circle cx="50" cy="150" r="3" fill="#6b7280" />
                            <circle cx="90" cy="120" r="3" fill="#6b7280" />
                            <circle cx="130" cy="135" r="3" fill="#6b7280" />
                            <circle cx="170" cy="60" r="3" fill="#6b7280" />
                            <circle cx="210" cy="155" r="3" fill="#6b7280" />
                            <circle cx="250" cy="95" r="3" fill="#6b7280" />
                            <circle cx="290" cy="120" r="3" fill="#6b7280" />
                            <circle cx="330" cy="40" r="3" fill="#6b7280" />
                            <circle cx="370" cy="115" r="3" fill="#6b7280" />
                            <circle cx="410" cy="90" r="3" fill="#6b7280" />
                            <circle cx="450" cy="105" r="3" fill="#6b7280" />
                            <circle cx="490" cy="100" r="3" fill="#6b7280" />

                            {/* X-axis labels */}
                            <text
                                x="45"
                                y="195"
                                fontSize="9"
                                fill="#9ca3af"
                                fontFamily="system-ui"
                            >
                                Jan
                            </text>
                            <text
                                x="85"
                                y="195"
                                fontSize="9"
                                fill="#9ca3af"
                                fontFamily="system-ui"
                            >
                                Feb
                            </text>
                            <text
                                x="123"
                                y="195"
                                fontSize="9"
                                fill="#9ca3af"
                                fontFamily="system-ui"
                            >
                                Mar
                            </text>
                            <text
                                x="165"
                                y="195"
                                fontSize="9"
                                fill="#9ca3af"
                                fontFamily="system-ui"
                            >
                                Apr
                            </text>
                            <text
                                x="203"
                                y="195"
                                fontSize="9"
                                fill="#9ca3af"
                                fontFamily="system-ui"
                            >
                                May
                            </text>
                            <text
                                x="245"
                                y="195"
                                fontSize="9"
                                fill="#9ca3af"
                                fontFamily="system-ui"
                            >
                                Jun
                            </text>
                            <text
                                x="287"
                                y="195"
                                fontSize="9"
                                fill="#9ca3af"
                                fontFamily="system-ui"
                            >
                                Jul
                            </text>
                            <text
                                x="325"
                                y="195"
                                fontSize="9"
                                fill="#9ca3af"
                                fontFamily="system-ui"
                            >
                                Aug
                            </text>
                            <text
                                x="365"
                                y="195"
                                fontSize="9"
                                fill="#9ca3af"
                                fontFamily="system-ui"
                            >
                                Sep
                            </text>
                            <text
                                x="405"
                                y="195"
                                fontSize="9"
                                fill="#9ca3af"
                                fontFamily="system-ui"
                            >
                                Oct
                            </text>
                            <text
                                x="443"
                                y="195"
                                fontSize="9"
                                fill="#9ca3af"
                                fontFamily="system-ui"
                            >
                                Nov
                            </text>
                            <text
                                x="483"
                                y="195"
                                fontSize="9"
                                fill="#9ca3af"
                                fontFamily="system-ui"
                            >
                                Dec
                            </text>
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OverviewTab;
