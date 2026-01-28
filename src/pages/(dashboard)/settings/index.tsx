import { useState } from 'react';
import SettingsTabs from '@/components/settings/SettingsTabs';
import GeneralBranding from '@/components/settings/GeneralBranding';
import StateCompliance from '@/components/settings/StateCompliance';
import PaymentsTaxes from '@/components/settings/PaymentsTaxes';
import CertificateDesign from '@/components/settings/CertificateDesign';

const tabs = [
    { id: 'general', label: 'General & Branding' },
    { id: 'compliance', label: 'State & Compliance' },
    { id: 'payments', label: 'Payments & Taxes' },
    { id: 'certificate', label: 'Certificate Design' },
];

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('general');

    const renderContent = () => {
        switch (activeTab) {
            case 'general':
                return <GeneralBranding />;
            case 'compliance':
                return <StateCompliance />;
            case 'payments':
                return <PaymentsTaxes />;
            case 'certificate':
                return <CertificateDesign />;
            default:
                return <GeneralBranding />;
        }
    };

    return (
        <div className="flex min-h-screen p-8">
            <SettingsTabs
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={setActiveTab}
            />
            {renderContent()}
        </div>
    );
}
