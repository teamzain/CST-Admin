import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { SignatureUpload } from '../shared/signature-upload';
import { platformSettingsRepository } from '@/repositories/platform-settings';
import type { UpdatePlatformSettingsInput } from '@/repositories/platform-settings/types';

interface FormData {
    companyName: string;
    administratorName: string;
    address: string;
    email: string;
    phoneNo: string;
    signature: string | null;
}

const GeneralBranding: React.FC = () => {
    const queryClient = useQueryClient();

    // Fetch current platform settings (or create if doesn't exist)
    const { data: settings, isLoading, error } = useQuery({
        queryKey: ['platformSettings', 'current'],
        queryFn: () => platformSettingsRepository.getOrCreateSettings(),
    });

    // Update mutation
    const updateMutation = useMutation({
        mutationFn: (data: UpdatePlatformSettingsInput) => {
            return platformSettingsRepository.createOrUpdateSettings(data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['platformSettings'],
            });
        },
    });

    const [formData, setFormData] = useState<FormData>({
        companyName: '',
        administratorName: '',
        address: '',
        email: '',
        phoneNo: '',
        signature: null,
    });

    // Sync form when settings change (replaces useEffect to avoid cascading renders)
    const [prevSettings, setPrevSettings] = useState(settings);
    if (settings !== prevSettings) {
        setPrevSettings(settings);
        if (settings) {
            setFormData({
                companyName: settings.company_name || '',
                administratorName: settings.administrator_name || '',
                address: settings.address || '',
                email: settings.support_email || '',
                phoneNo: settings.support_phone || '',
                signature: settings.signature || null,
            });
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const updateData: UpdatePlatformSettingsInput = {
            company_name: formData.companyName,
            administrator_name: formData.administratorName || undefined,
            support_email: formData.email,
            support_phone: formData.phoneNo,
            address: formData.address,
            signature: formData.signature || undefined,
        };

        updateMutation.mutate(updateData);
    };

    return (
        <div className="flex-1 bg-gray-50 p-8">
            <div className="max-w-3xl">
                <h1 className="text-2xl font-semibold mb-2">
                    General & Branding
                </h1>
                <p className="text-sm text-gray-600 mb-8">
                    This information appears in the website footer, system
                    emails, and official documents.
                </p>

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <p className="text-sm text-red-600">
                            {error instanceof Error
                                ? error.message
                                : 'Failed to load settings'}
                        </p>
                    </div>
                )}

                {isLoading ? (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 flex items-center justify-center">
                        <Loader2 className="w-6 h-6 animate-spin text-primary" />
                        <span className="ml-3 text-gray-600">Loading settings...</span>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold mb-2">
                            Company Profile
                        </h2>
                        <p className="text-sm text-gray-600 mb-6">
                            Official organization details used across the platform.
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <Label htmlFor="companyName" className="mb-2 block">
                                    Company Name{' '}
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="companyName"
                                    name="companyName"
                                    placeholder="Name"
                                    value={formData.companyName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="administratorName" className="mb-2 block">
                                    Administrator Name
                                </Label>
                                <Input
                                    id="administratorName"
                                    name="administratorName"
                                    placeholder="Administrator Name"
                                    value={formData.administratorName}
                                    onChange={handleChange}
                                />
                            </div>

                            <div>
                                <Label htmlFor="address" className="mb-2 block">
                                    Address <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="address"
                                    name="address"
                                    placeholder="Address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="email" className="mb-2 block">
                                    Email <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="name@gmail.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="phoneNo" className="mb-2 block">
                                    Phone No.{' '}
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="phoneNo"
                                    name="phoneNo"
                                    type="tel"
                                    placeholder="Phone No."
                                    value={formData.phoneNo}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div>
                                <SignatureUpload
                                    value={formData.signature || undefined}
                                    onChange={(url) =>
                                        setFormData({
                                            ...formData,
                                            signature: url,
                                        })
                                    }
                                    label="Company Signature"
                                    disabled={updateMutation.isPending}
                                />
                            </div>

                            <div className="flex justify-end pt-4 gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        if (settings) {
                                            setFormData({
                                                companyName: settings.company_name || '',
                                                administratorName: settings.administrator_name || '',
                                                address: settings.address || '',
                                                email: settings.support_email || '',
                                                phoneNo: settings.support_phone || '',
                                                signature: settings.signature || null,
                                            });
                                        }
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={updateMutation.isPending || isLoading}
                                >
                                    {updateMutation.isPending ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        'Save Changes'
                                    )}
                                </Button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GeneralBranding;
