import { Button } from '../ui/button';

const StateCompliance: React.FC = () => {
    return (
        <div className="flex-1 bg-gray-50 p-8">
            <div className="max-w-3xl">
                <h1 className="text-2xl font-semibold mb-2">
                    State & Compliance
                </h1>
                <p className="text-sm text-gray-600 mb-8">
                    Manage state-specific regulations and compliance
                    requirements.
                </p>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold mb-2">
                        Compliance Settings
                    </h2>
                    <p className="text-sm text-gray-600 mb-6">
                        Configure compliance and regulatory requirements for
                        your organization.
                    </p>

                    <div className="space-y-4">
                        <div className="p-4 bg-gray-50 rounded-md">
                            <p className="text-sm text-gray-600">
                                State & compliance settings will be available
                                here.
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

export default StateCompliance;
