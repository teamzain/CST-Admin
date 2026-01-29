import { useState } from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';

interface FormData {
    companyName: string;
    address: string;
    email: string;
    phoneNo: string;
}

const GeneralBranding: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        companyName: '',
        address: '',
        email: '',
        phoneNo: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        alert('Changes saved successfully!');
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

                        <div className="flex justify-end pt-4">
                            <Button type="submit">Save Changes</Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default GeneralBranding;
