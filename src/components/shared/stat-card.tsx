import { Card, CardContent } from '@/components/ui/card';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
    icon: LucideIcon;
    label: string;
    value: string | number;
    change?: string;
    changeType?: 'positive' | 'negative';
}

export function StatCard({
    icon: Icon,
    label,
    value,
    change,
    changeType,
}: StatCardProps) {
    return (
        <Card className="bg-card border-border">
            <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-sm text-muted-foreground">{label}</p>
                        <p className="text-3xl font-bold text-foreground mt-2">
                            {value}
                        </p>
                        {change && (
                            <p
                                className={`text-sm mt-2 ${
                                    changeType === 'positive'
                                        ? 'text-green-400'
                                        : 'text-red-400'
                                }`}
                            >
                                {change}
                            </p>
                        )}
                    </div>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Icon className="w-6 h-6 text-primary" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
