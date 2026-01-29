import { Button } from '../ui/button';

const PaymentsTaxes: React.FC = () => {
    return (
        <div className="flex-1 bg-gray-50 p-8">
            <div className="max-w-3xl">
                <h1 className="text-2xl font-semibold mb-2">
                    Payments & Taxes
                </h1>
                <p className="text-sm text-gray-600 mb-8">
                    Configure payment methods, billing information, and tax
                    settings.
                </p>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold mb-2">
                        Payment Configuration
                    </h2>
                    <p className="text-sm text-gray-600 mb-6">
                        Manage your payment gateways and tax calculation
                        settings.
                    </p>

                    <div className="space-y-4">
                        <div className="p-4 bg-gray-50 rounded-md">
                            <p className="text-sm text-gray-600">
                                Payment and tax configuration options will be
                                available here.
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

export default PaymentsTaxes;
