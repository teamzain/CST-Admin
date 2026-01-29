import { Button } from '../ui/button';

const CertificateDesign: React.FC = () => {
    return (
        <div className="flex-1 bg-gray-50 p-8">
            <div className="max-w-3xl">
                <h1 className="text-2xl font-semibold mb-2">
                    Certificate Design
                </h1>
                <p className="text-sm text-gray-600 mb-8">
                    Customize the design and layout of certificates issued by
                    your organization.
                </p>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold mb-2">
                        Certificate Templates
                    </h2>
                    <p className="text-sm text-gray-600 mb-6">
                        Design and manage certificate templates for different
                        programs.
                    </p>

                    <div className="space-y-4">
                        <div className="p-4 bg-gray-50 rounded-md">
                            <p className="text-sm text-gray-600">
                                Certificate design tools will be available here.
                            </p>
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button disabled>Save Changes</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CertificateDesign;
