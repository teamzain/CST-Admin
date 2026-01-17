import { CheckCircle2, Circle } from 'lucide-react';
import { type CourseUnit } from '@/pages/(dashboard)/students/types';

export function CourseUnits({ units }: { units: CourseUnit[] }) {
    return (
        <div className="space-y-3 border-t pt-4">
            {units.map((unit) => (
                <div
                    key={unit.id}
                    className="flex items-center gap-4 rounded-md border bg-card p-4"
                >
                    {unit.status === 'done' ? (
                        <CheckCircle2 className="text-primary h-5 w-5" />
                    ) : (
                        <Circle className="text-muted-foreground h-5 w-5" />
                    )}

                    <div className="text-sm font-medium">
                        {unit.title}
                        {unit.meta && (
                            <span className="ml-2 text-muted-foreground font-normal">
                                {unit.meta}
                            </span>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
