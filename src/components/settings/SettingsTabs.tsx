import { cn } from '@/lib/utils';

interface Tab {
    id: string;
    label: string;
}

interface SettingsTabsProps {
    tabs: Tab[];
    activeTab: string;
    onTabChange: (tabId: string) => void;
}

const SettingsTabs: React.FC<SettingsTabsProps> = ({
    tabs,
    activeTab,
    onTabChange,
}) => {
    return (
        <div className="w-64 bg-white border-r border-gray-200 p-4">
            <h2 className="text-2xl font-semibold mb-2">Settings</h2>
            <p className="text-sm text-gray-600 mb-6">
                Manage your organization's configuration, branding, and system
                preferences
            </p>
            <nav className="space-y-1">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className={cn(
                            'w-full text-left px-4 py-2 text-sm rounded-md transition-colors',
                            activeTab === tab.id
                                ? 'bg-[#FFC107] text-black font-medium'
                                : 'text-gray-700 hover:bg-gray-100'
                        )}
                    >
                        {tab.label}
                    </button>
                ))}
            </nav>
        </div>
    );
};

export default SettingsTabs;
