import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function StudentHeader() {
    return (
        <header className="space-y-3">
            <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon">
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <h1 className="text-2xl font-semibold">Student Name</h1>
            </div>

            <div className="flex flex-wrap gap-6 text-sm text-muted-foreground pl-10">
                <span>
                    User ID:{' '}
                    <strong className="text-foreground">STD-9901</strong>
                </span>
                <span>
                    Last Activity:{' '}
                    <strong className="text-foreground">Nov 5, 2025</strong>
                </span>
                <span>
                    Registered On:{' '}
                    <strong className="text-foreground">Aug 5, 2025</strong>
                </span>
            </div>
        </header>
    );
}
