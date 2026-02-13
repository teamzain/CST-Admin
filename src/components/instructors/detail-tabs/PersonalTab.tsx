import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ChevronDown } from 'lucide-react';
import type { Instructor } from '@/repositories/instructors/types';

interface PersonalTabProps {
    instructor?: Instructor;
    instructorId: string;
}

const PersonalTab: React.FC<PersonalTabProps> = ({
    instructor,
    instructorId: _instructorId,
}) => {
    // Resolve state name from multiple possible shapes
    const getStateName = (): string => {
        if (instructor?.stateName) return instructor.stateName;
        if (typeof instructor?.state === 'object' && instructor?.state?.name) return instructor.state.name;
        if (typeof instructor?.state === 'string') return instructor.state;
        // Fallback: check first license's state (API may return "licenses" or "instructorLicenses")
        const licenseState = instructor?.instructorLicenses?.[0]?.state || instructor?.licenses?.[0]?.state;
        if (licenseState?.name) return licenseState.name;
        return '—';
    };

    const formatDate = (value: string | Date | undefined | null): string => {
        if (!value) return '—';
        try {
            const d = typeof value === 'string' ? new Date(value) : value;
            return isNaN(d.getTime()) ? '—' : d.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
        } catch {
            return '—';
        }
    };

    const personalInfo = {
        fullName: instructor ? `${instructor.first_name || ''} ${instructor.last_name || ''}`.trim() || '—' : '—',
        email: instructor?.email || '—',
        contactNo: instructor?.phone || '—',
        state: getStateName(),
        joiningDate: formatDate(instructor?.created_at || instructor?.join_date),
        licenseNo: instructor?.license_no || instructor?.instructorLicenses?.[0]?.license_no || instructor?.licenses?.[0]?.license_no || '—',
        licenseExpiry: formatDate(instructor?.license_expiry || instructor?.instructorLicenses?.[0]?.license_expiry || instructor?.licenses?.[0]?.license_expiry),
    };

    return (
        <div className="space-y-6">
            {/* Personal Information */}
            <Card className="p-6 bg-white">
                <h2 className="text-xl font-semibold mb-6">
                    Personal Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                    <div>
                        <label className="text-sm text-gray-600 block mb-2">
                            Full Name:
                        </label>
                        <p className="text-sm text-gray-900">
                            {personalInfo.fullName}
                        </p>
                    </div>

                    <div>
                        <label className="text-sm text-gray-600 block mb-2">
                            Email Address:
                        </label>
                        <p className="text-sm text-gray-900">
                            {personalInfo.email}
                        </p>
                    </div>
                    <div>
                        <label className="text-sm text-gray-600 block mb-2">
                            Contact No:
                        </label>
                        <p className="text-sm text-gray-900">
                            {personalInfo.contactNo}
                        </p>
                    </div>
                    <div>
                        <label className="text-sm text-gray-600 block mb-2">
                            State:
                        </label>
                        <p className="text-sm text-gray-900">
                            {personalInfo.state}
                        </p>
                    </div>
                    <div>
                        <label className="text-sm text-gray-600 block mb-2">
                            License No:
                        </label>
                        <p className="text-sm text-gray-900">
                            {personalInfo.licenseNo}
                        </p>
                    </div>
                    <div>
                        <label className="text-sm text-gray-600 block mb-2">
                            License Expiry:
                        </label>
                        <p className="text-sm text-gray-900">
                            {personalInfo.licenseExpiry}
                        </p>
                    </div>
                    <div>
                        <label className="text-sm text-gray-600 block mb-2">
                            Joining Date:
                        </label>
                        <p className="text-sm text-gray-900">
                            {personalInfo.joiningDate}
                        </p>
                    </div>
                </div>
            </Card>

            {/* Instructors Bio */}
            <Card className="p-6 bg-white">
                <h2 className="text-xl font-semibold mb-6">Instructors Bio</h2>

                <div>
                    <label className="text-sm text-gray-600 block mb-2">
                        Bio
                    </label>
                    <div className="relative">
                        <Textarea
                            placeholder="About the instructor"
                            className="min-h-[100px] resize-none bg-gray-50 border-gray-200"
                            disabled
                            value={instructor?.bio || ''}
                        />
                        <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-600">
                            <ChevronDown className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </Card>

            {/* ID Verification */}
            <Card className="p-6 bg-white">
                <h2 className="text-xl font-semibold mb-6">ID Verification</h2>

                <div className="flex justify-center">
                    <div className="w-80 h-48 bg-gray-100 border-2 border-gray-200 rounded-lg flex items-center justify-center">
                        <div className="text-center text-gray-400">
                            <div className="text-6xl mb-2">✕</div>
                            <p className="text-sm">Government-issued ID</p>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Documents and Areas of Expertise */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Documents */}
                <Card className="p-6 bg-white">
                    <h2 className="text-xl font-semibold mb-6">Documents</h2>

                    <div className="border border-gray-200 rounded-lg p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                        <span className="text-sm font-medium">CV</span>
                        <Button
                            variant="link"
                            className="text-sm text-blue-600 hover:text-blue-700 p-0"
                        >
                            View
                        </Button>
                    </div>
                </Card>

                {/* Areas of Expertise */}
                <Card className="p-6 bg-white">
                    <h2 className="text-xl font-semibold mb-6">
                        Areas of Expertise
                    </h2>

                    <div className="flex flex-wrap gap-2">
                        <p className="text-sm text-gray-500">No data available</p>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default PersonalTab;
