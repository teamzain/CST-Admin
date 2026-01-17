import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, ClipboardCheck, Award, List } from 'lucide-react';

export function StudentTabs() {
    return (
        <Tabs defaultValue="courses" className="w-full">
            <TabsList className="justify-start gap-6">
                <TabsTrigger value="courses">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Course Progress
                </TabsTrigger>
                <TabsTrigger value="compliance">
                    <ClipboardCheck className="mr-2 h-4 w-4" />
                    Compliance
                </TabsTrigger>
                <TabsTrigger value="certificates">
                    <Award className="mr-2 h-4 w-4" />
                    Certificates
                </TabsTrigger>
                <TabsTrigger value="logs">
                    <List className="mr-2 h-4 w-4" />
                    Activity Logs
                </TabsTrigger>
            </TabsList>
        </Tabs>
    );
}
