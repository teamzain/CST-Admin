import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, Loader2, ExternalLink, Save, User } from 'lucide-react';
import { bunnyUploadService } from '@/api/bunny-upload';
import { InstructorsRepository } from '@/repositories/instructors/repo';
import type { Instructor } from '@/repositories/instructors/types';

interface PersonalTabProps {
    instructor?: Instructor;
    instructorId: string;
}

const PersonalTab: React.FC<PersonalTabProps> = ({
    instructor,
    instructorId,
}) => {
    const queryClient = useQueryClient();
    const [isDeletingSignature, setIsDeletingSignature] = useState(false);
    const [bio, setBio] = useState(instructor?.bio || '');
    const [isSavingBio, setIsSavingBio] = useState(false);
    const bioChanged = bio !== (instructor?.bio || '');

    const handleSaveBio = async () => {
        setIsSavingBio(true);
        try {
            await InstructorsRepository.updateInstructor(Number(instructorId), { bio } as any);
            queryClient.invalidateQueries({ queryKey: ['instructor', instructorId] });
        } catch (error) {
            console.error('Error saving bio:', error);
        } finally {
            setIsSavingBio(false);
        }
    };

    const handleDeleteSignature = async () => {
        if (!instructor?.signature) return;
        setIsDeletingSignature(true);
        try {
            // Extract the file path from the full URL for Bunny deletion
            try {
                const url = new URL(instructor.signature);
                const filePath = url.pathname.startsWith('/') ? url.pathname.slice(1) : url.pathname;
                await bunnyUploadService.deleteFile(filePath);
            } catch {
                // Continue even if Bunny delete fails (file may already be gone)
                console.warn('Bunny file delete failed, continuing with DB update');
            }

            // Clear signature in DB via instructor update
            await InstructorsRepository.updateInstructor(Number(instructorId), { signature: null });

            // Refresh instructor data
            queryClient.invalidateQueries({ queryKey: ['instructor', instructorId] });
        } catch (error) {
            console.error('Error deleting signature:', error);
        } finally {
            setIsDeletingSignature(false);
        }
    };

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

                {/* Avatar + Name header */}
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
                    {instructor?.avatar ? (
                        <img
                            src={instructor.avatar}
                            alt={personalInfo.fullName}
                            className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                        />
                    ) : (
                        <div className="w-16 h-16 rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center">
                            <User className="w-8 h-8 text-gray-400" />
                        </div>
                    )}
                    <div>
                        <p className="text-lg font-semibold text-gray-900">{personalInfo.fullName}</p>
                        <p className="text-sm text-gray-500">{personalInfo.email}</p>
                    </div>
                </div>

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
                    <div>
                        <label className="text-sm text-gray-600 block mb-2">
                            Website / Profile Link:
                        </label>
                        {instructor?.link ? (
                            <a
                                href={instructor.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                            >
                                {instructor.link}
                                <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                        ) : (
                            <p className="text-sm text-gray-900">—</p>
                        )}
                    </div>
                </div>
            </Card>

            {/* Instructors Bio */}
            <Card className="p-6 bg-white">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">Instructor Bio</h2>
                    {bioChanged && (
                        <Button
                            size="sm"
                            onClick={handleSaveBio}
                            disabled={isSavingBio}
                        >
                            {isSavingBio ? (
                                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                            ) : (
                                <Save className="w-4 h-4 mr-1" />
                            )}
                            Save
                        </Button>
                    )}
                </div>

                <div>
                    <label className="text-sm text-gray-600 block mb-2">
                        Bio
                    </label>
                    <Textarea
                        placeholder="About the instructor"
                        className="min-h-[100px] resize-none bg-gray-50 border-gray-200"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                    />
                </div>
            </Card>

            {/* Signature */}
            <Card className="p-6 bg-white">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">Signature</h2>
                    {instructor?.signature && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleDeleteSignature}
                            disabled={isDeletingSignature}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                            {isDeletingSignature ? (
                                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                            ) : (
                                <Trash2 className="w-4 h-4 mr-1" />
                            )}
                            {isDeletingSignature ? 'Deleting...' : 'Delete'}
                        </Button>
                    )}
                </div>
                <div className="flex justify-center">
                    {instructor?.signature ? (
                        <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
                            <img
                                src={instructor.signature}
                                alt="Instructor Signature"
                                className="max-h-32 object-contain"
                            />
                        </div>
                    ) : (
                        <div className="w-80 h-32 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                            <p className="text-sm text-gray-400">No signature uploaded</p>
                        </div>
                    )}
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
