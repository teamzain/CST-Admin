import { Button } from '../ui/button';
import CertificateTemplate from '../certificates/CertificateTemplate';
import { dummyCertificateData } from '../certificates/certificate-data';

const CertificateDesign: React.FC = () => {
    return (
        <div className="flex-1 bg-gray-50 p-8">
            <div className="max-w-5xl">
                <h1 className="text-2xl font-semibold mb-2">
                    Certificate Design
                </h1>
                <p className="text-sm text-gray-600 mb-8">
                    Customize the design and layout of certificates issued by
                    your organization.
                </p>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold mb-2">
                        Certificate Preview
                    </h2>
                    <p className="text-sm text-gray-600 mb-6">
                        This is how issued certificates will appear to students.
                        The template automatically uses your platform's branding,
                        instructor, and administrator details.
                    </p>

                    {/* Certificate Preview */}
                    <div className="flex justify-center overflow-auto py-4">
                        <div className="transform scale-[0.85] origin-top">
                            <CertificateTemplate {...dummyCertificateData} />
                        </div>
                    </div>

                    <div className="flex justify-end pt-4 border-t mt-4">
                        <Button disabled>Save Changes</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CertificateDesign;
