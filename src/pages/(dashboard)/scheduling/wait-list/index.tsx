'use client';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { UserPlus, Users, ListFilter, ClipboardList } from 'lucide-react';

export default function WaitListPage() {
    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6 pt-2 md:pt-4">
            <div className="mx-auto max-w-[1600px]">
                <div className="mb-8">
                    <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
                        Wait List
                    </h1>
                    <p className="text-sm text-gray-600 mt-1">
                        Manage students waiting for upcoming range sessions and
                        courses.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card className="bg-white border-gray-200 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                Total Waiting
                            </CardTitle>
                            <Users className="h-4 w-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">45</div>
                            <p className="text-xs text-gray-500 mt-1">
                                Active wait list entries
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="bg-white border-gray-200 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                Priority Students
                            </CardTitle>
                            <UserPlus className="h-4 w-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">10</div>
                            <p className="text-xs text-gray-500 mt-1">
                                Requires immediate attention
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="bg-white border-gray-200 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                Average Wait Time
                            </CardTitle>
                            <ClipboardList className="h-4 w-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">1.5 Weeks</div>
                            <p className="text-xs text-gray-500 mt-1">
                                Estimated fulfillment
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <Card className="bg-white border-gray-200 shadow-sm">
                    <CardHeader>
                        <CardTitle>Wait List Queue</CardTitle>
                        <CardDescription>
                            Prioritized list of students waiting for enrollment.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
                            <div className="text-center">
                                <ListFilter className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-2 text-sm font-semibold text-gray-900">
                                    Wait list is empty
                                </h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    No students are currently waiting for
                                    sessions.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
