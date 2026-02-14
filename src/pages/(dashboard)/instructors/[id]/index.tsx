'use client';

import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { InstructorsRepository } from '@/repositories/instructors/repo';
import {
    ArrowLeft,
    Eye,
    User,
    BookOpen,
    Wallet,
    Star,
    Grid3x3,
    Loader2,
    MoreVertical,
    Trash2,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Import tab components
import OverviewTab from '@/components/instructors/detail-tabs/OverviewTab';
import PersonalTab from '@/components/instructors/detail-tabs/PersonalTab';
import CoursesTab from '@/components/instructors/detail-tabs/CoursesTab';
import ReviewsTab from '@/components/instructors/detail-tabs/ReviewsTab';

export default function InstructorDetailPage() {
    const router = useNavigate();
    const params = useParams();
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState('overview');
    const [isDeleting, setIsDeleting] = useState(false);

    // Fetch instructor data from API
    const {
        data: instructor,
        isLoading,
        error,
    } = useQuery({
        queryKey: ['instructor', params.id],
        queryFn: () => InstructorsRepository.getInstructorById(Number(params.id)),
        enabled: !!params.id,
    });

    // Delete mutation
    const deleteInstructor = async () => {
        setIsDeleting(true);
        try {
            await InstructorsRepository.deleteInstructor(Number(instructor?.id));
            // Invalidate queries and redirect
            queryClient.invalidateQueries({ queryKey: ['instructors'] });
            router('/instructors');
        } catch (err) {
            console.error('Error deleting instructor:', err);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleDelete = () => {
        if (confirm(`Are you sure you want to delete ${instructor?.first_name} ${instructor?.last_name}?`)) {
            deleteInstructor();
        }
    };

    // Display loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    // Display error state
    if (error || !instructor) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="px-6 py-5">
                    <button
                        onClick={() => router('/instructors')}
                        className="p-1 hover:bg-gray-100 rounded-md transition-colors mb-4"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-700" />
                    </button>
                    <div className="text-center py-12">
                        <p className="text-gray-600 text-lg">
                            {error ? 'Failed to load instructor details' : 'Instructor not found'}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Section */}
            <div className="">
                <div className="px-6 py-5">
                    {/* Back button and Title */}
                    <div className="flex items-center gap-3 mb-3 justify-between">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => router('/instructors')}
                                className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5 text-gray-700" />
                            </button>
                            <h1 className="text-xl font-semibold text-gray-900">
                                {instructor.first_name} {instructor.last_name}
                            </h1>
                        </div>
                        {/* Three-dot menu */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem 
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                    className="text-red-600"
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    {isDeleting ? 'Deleting...' : 'Delete'}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {/* User Info */}
                    <div className="flex items-center gap-6 text-sm text-gray-500 ml-9">
                        <span className="flex items-center gap-1.5">
                            User ID:{' '}
                            <span className="text-gray-900">
                                {instructor.id}
                            </span>
                        </span>
                        <span className="flex items-center gap-1.5">
                            Email:{' '}
                            <span className="text-gray-900">
                                {instructor.email}
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
                                <OverviewTab instructor={instructor} instructorId={String(instructor.id)} />
                            </TabsContent>

                            <TabsContent value="personal" className="m-0 mt-0">
                                <PersonalTab instructor={instructor} instructorId={String(instructor.id)} />
                            </TabsContent>

                            <TabsContent value="courses" className="m-0 mt-0">
                                <CoursesTab instructor={instructor} instructorId={String(instructor.id)} />
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
                                <ReviewsTab instructor={instructor} instructorId={String(instructor.id)} />
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
