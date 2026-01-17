import { ChevronDown, ChevronUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { type Course } from '@/pages/(dashboard)/students/types';
import { CourseUnits } from './course-units';

export function CourseCard({ course }: { course: Course }) {
    return (
        <Card className="p-5 space-y-4">
            <div className="flex justify-between items-start">
                <div className="flex gap-4">
                    <img
                        src={course.thumbnail}
                        className="h-12 w-12 rounded-full object-cover"
                    />
                    <div>
                        <div className="flex items-center gap-3">
                            <h3 className="text-lg font-semibold">
                                {course.title}
                            </h3>
                            <Badge
                                variant={
                                    course.status === 'completed'
                                        ? 'secondary'
                                        : 'default'
                                }
                            >
                                {course.status}
                            </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Enrollment Date: {course.enrollmentDate}
                        </p>
                    </div>
                </div>

                {course.expanded ? (
                    <ChevronUp className="h-5 w-5" />
                ) : (
                    <ChevronDown className="h-5 w-5" />
                )}
            </div>

            <div className="flex items-center gap-4">
                <Progress value={course.progress} className="h-2" />
                <span className="text-sm font-medium">{course.progress}%</span>
                <span className="ml-auto text-xs text-muted-foreground">
                    {course.hoursText}
                </span>
            </div>

            {course.expanded && course.units && (
                <CourseUnits units={course.units} />
            )}
        </Card>
    );
}
