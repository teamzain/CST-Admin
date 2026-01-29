import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ChevronDown } from 'lucide-react';

interface PersonalTabProps {
    instructorId: string;
}

const PersonalTab: React.FC<PersonalTabProps> = ({ instructorId }) => {
    const personalInfo = {
        fullName: 'Name',
        email: 'name@gmail.com',
        nationality: 'United States',
        joiningDate: '00/00/0000',
        dateOfBirth: '00/00/0000',
        contactNo: '017145487791',
        state: 'State Name',
    };

    const areasOfExpertise = [
        'Advance Protection',
        'Tactical Skills',
        'Planning',
        'Advance Protection',
        'Defensive skills',
    ];

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
                            Date of birth:
                        </label>
                        <p className="text-sm text-gray-900">
                            {personalInfo.dateOfBirth}
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
                            Nationality:
                        </label>
                        <p className="text-sm text-gray-900">
                            {personalInfo.nationality}
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
                        {areasOfExpertise.map((skill, index) => (
                            <span
                                key={index}
                                className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-full border border-gray-200"
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default PersonalTab;
