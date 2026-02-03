'use client';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { MapPin, Navigation, Building2, ShieldCheck } from 'lucide-react';

export default function LocationsPage() {
    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6 pt-2 md:pt-4">
            <div className="mx-auto max-w-[1600px]">
                <div className="mb-8">
                    <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
                        Locations
                    </h1>
                    <p className="text-sm text-gray-600 mt-1">
                        Manage training centers and range locations.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card className="bg-white border-gray-200 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                Total Locations
                            </CardTitle>
                            <MapPin className="h-4 w-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">8</div>
                            <p className="text-xs text-gray-500 mt-1">
                                Across 3 states
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="bg-white border-gray-200 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                Training Centers
                            </CardTitle>
                            <Building2 className="h-4 w-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">5</div>
                            <p className="text-xs text-gray-500 mt-1">
                                Classroom facilities
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="bg-white border-gray-200 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                Verified Ranges
                            </CardTitle>
                            <ShieldCheck className="h-4 w-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">3</div>
                            <p className="text-xs text-gray-500 mt-1">
                                Safety certified
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <Card className="bg-white border-gray-200 shadow-sm">
                    <CardHeader>
                        <CardTitle>Location Addresses</CardTitle>
                        <CardDescription>
                            Detailed list of all registered locations.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
                            <div className="text-center">
                                <Navigation className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-2 text-sm font-semibold text-gray-900">
                                    No locations listed
                                </h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    Add your first training or range location.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
