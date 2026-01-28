'use client';

import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    ArrowLeft,
    Eye,
    User,
    BookOpen,
    Wallet,
    Star,
    Grid3x3,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Import tab components
import OverviewTab from '@/components/instructors/detail-tabs/OverviewTab';
import PersonalTab from '@/components/instructors/detail-tabs/PersonalTab';
import CoursesTab from '@/components/instructors/detail-tabs/CoursesTab';
import ReviewsTab from '@/components/instructors/detail-tabs/ReviewsTab';

export default function InstructorDetailPage() {
    const router = useNavigate();
    const params = useParams();
    const [activeTab, setActiveTab] = useState('overview');

    // Mock instructor data
    const instructor = {
        id: params.id || '1',
        userId: 'USR-9901',
        name: 'Instructor Name',
        email: 'instructor@example.com',
        phone: '017145487791',
        lastActivity: 'Nov 5, 2025',
        avatar: null,
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Section */}
            <div className="">
                <div className="px-6 py-5">
                    {/* Back button and Title */}
                    <div className="flex items-center gap-3 mb-3">
                        <button
                            onClick={() => router('/instructors')}
                            className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-700" />
                        </button>
                        <h1 className="text-xl font-semibold text-gray-900">
                            {instructor.name}
                        </h1>
                    </div>

                    {/* User Info */}
                    <div className="flex items-center gap-6 text-sm text-gray-500 ml-9">
                        <span className="flex items-center gap-1.5">
                            User ID:{' '}
                            <span className="text-gray-900">
                                {instructor.userId}
                            </span>
                        </span>
                        <span className="flex items-center gap-1.5">
                            Last Activity:{' '}
                            <span className="text-gray-900">
                                {instructor.lastActivity}
                            </span>
                        </span>
                    </div>
                </div>
                <div className="w-full bg-white">
                    {/* Tabs Navigation */}
                    <Tabs
                        value={activeTab}
                        onValueChange={setActiveTab}
                        className="w-full border-b border-gray-200 p-4"
                    >
                        <TabsList className="w-full bg-transparent border-0 h-auto p-0 gap-0 rounded-none justify-start px-6">
                            <TabsTrigger
                                value="overview"
                                className="relative rounded-none border-0 bg-transparent px-4 pb-3 pt-2 font-medium text-gray-600 transition-none data-[state=active]:bg-transparent data-[state=active]:text-gray-900 data-[state=active]:shadow-none hover:text-gray-900 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-transparent data-[state=active]:after:bg-yellow-400"
                            >
                                <Eye className="w-4 h-4 mr-2" />
                                Overview
                            </TabsTrigger>
                            <TabsTrigger
                                value="personal"
                                className="relative rounded-none border-0 bg-transparent px-4 pb-3 pt-2 font-medium text-gray-600 transition-none data-[state=active]:bg-transparent data-[state=active]:text-gray-900 data-[state=active]:shadow-none hover:text-gray-900 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-transparent data-[state=active]:after:bg-yellow-400"
                            >
                                <User className="w-4 h-4 mr-2" />
                                Personal
                            </TabsTrigger>
                            <TabsTrigger
                                value="courses"
                                className="relative rounded-none border-0 bg-transparent px-4 pb-3 pt-2 font-medium text-gray-600 transition-none data-[state=active]:bg-transparent data-[state=active]:text-gray-900 data-[state=active]:shadow-none hover:text-gray-900 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-transparent data-[state=active]:after:bg-yellow-400"
                            >
                                <BookOpen className="w-4 h-4 mr-2" />
                                Courses
                            </TabsTrigger>
                            <TabsTrigger
                                value="wallet"
                                className="relative rounded-none border-0 bg-transparent px-4 pb-3 pt-2 font-medium text-gray-600 transition-none data-[state=active]:bg-transparent data-[state=active]:text-gray-900 data-[state=active]:shadow-none hover:text-gray-900 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-transparent data-[state=active]:after:bg-yellow-400"
                            >
                                <Wallet className="w-4 h-4 mr-2" />
                                Wallet
                            </TabsTrigger>
                            <TabsTrigger
                                value="reviews"
                                className="relative rounded-none border-0 bg-transparent px-4 pb-3 pt-2 font-medium text-gray-600 transition-none data-[state=active]:bg-transparent data-[state=active]:text-gray-900 data-[state=active]:shadow-none hover:text-gray-900 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-transparent data-[state=active]:after:bg-yellow-400"
                            >
                                <Star className="w-4 h-4 mr-2" />
                                Reviews
                            </TabsTrigger>
                            <TabsTrigger
                                value="more"
                                className="relative rounded-none border-0 bg-transparent px-4 pb-3 pt-2 font-medium text-gray-600 transition-none data-[state=active]:bg-transparent data-[state=active]:text-gray-900 data-[state=active]:shadow-none hover:text-gray-900 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-transparent data-[state=active]:after:bg-yellow-400 ml-auto"
                            >
                                <Grid3x3 className="w-4 h-4" />
                            </TabsTrigger>
                        </TabsList>

                        {/* Tab Content */}
                        <div className="p-6">
                            <TabsContent value="overview" className="m-0 mt-0">
                                <OverviewTab instructorId={instructor.id} />
                            </TabsContent>

                            <TabsContent value="personal" className="m-0 mt-0">
                                <PersonalTab instructorId={instructor.id} />
                            </TabsContent>

                            <TabsContent value="courses" className="m-0 mt-0">
                                <CoursesTab instructorId={instructor.id} />
                            </TabsContent>

                            <TabsContent value="wallet" className="m-0 mt-0">
                                <div className="bg-white rounded-lg p-8 text-center">
                                    <Wallet className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                                    <p className="text-gray-600">
                                        Wallet information coming soon
                                    </p>
                                </div>
                            </TabsContent>

                            <TabsContent value="reviews" className="m-0 mt-0">
                                <ReviewsTab instructorId={instructor.id} />
                            </TabsContent>

                            <TabsContent value="more" className="m-0 mt-0">
                                <div className="bg-white rounded-lg p-8 text-center">
                                    <Grid3x3 className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                                    <p className="text-gray-600">
                                        Additional options coming soon
                                    </p>
                                </div>
                            </TabsContent>
                        </div>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}
