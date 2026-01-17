import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, ChevronLeft, MapPin, Link as LinkIcon } from 'lucide-react';
import { useCoursesStore } from '@/stores/courses-store';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Session } from '@/components/course/module-item';

export default function SessionDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { courses, updateCourse } = useCoursesStore();

    const [sessionData, setSessionData] = useState<Partial<Session>>({
        title: '',
        session_type: 'LIVE',
        start_time: '',
        end_time: '',
        location: '',
        meeting_url: '',
        description: '',
    });

    useEffect(() => {
        let foundSession: any = null;
        courses.forEach(course => {
            course.modules?.forEach(module => {
                const s = module.sessions?.find((s: any) => String(s.id) === id);
                if (s) foundSession = { ...s, courseId: course.id, moduleId: module.id };
            });
        });

        if (foundSession) {
            setSessionData(foundSession);
        }
    }, [id, courses]);

    const handleSave = () => {
        const { courseId, moduleId, ...data } = sessionData as any;

        if (!courseId || !moduleId) {
            toast.error('Could not find course or module context');
            return;
        }

        const course = courses.find(c => c.id === courseId);
        if (!course) return;

        const updatedModules = course.modules?.map(m => {
            if (m.id === moduleId) {
                return {
                    ...m,
                    sessions: m.sessions?.map((s: any) => String(s.id) === id ? { ...s, ...data } : s)
                };
            }
            return m;
        });

        updateCourse(courseId, { modules: updatedModules });
        toast.success('Session saved successfully');
        navigate(-1);
    };

    return (
        <div className="flex flex-col h-screen bg-background">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                        <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-xl font-bold">Session Details: {sessionData.title}</h1>
                        <p className="text-sm text-muted-foreground">Manage session schedule and location</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
                    <Button onClick={handleSave} className="gap-2">
                        <Save className="w-4 h-4" /> Save Session
                    </Button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto p-8 bg-muted/30">
                <div className="max-w-4xl mx-auto space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>General Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2 col-span-2">
                                    <Label>Session Title</Label>
                                    <Input
                                        value={sessionData.title}
                                        onChange={(e) => setSessionData({ ...sessionData, title: e.target.value })}
                                        placeholder="e.g., Live Q&A Session"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Session Type</Label>
                                    <Select
                                        value={sessionData.session_type}
                                        onValueChange={(v) => setSessionData({ ...sessionData, session_type: v as any })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="LIVE">Live Online</SelectItem>
                                            <SelectItem value="PHYSICAL">In-Person (Physical)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Description</Label>
                                <Textarea
                                    value={sessionData.description}
                                    onChange={(e) => setSessionData({ ...sessionData, description: e.target.value })}
                                    placeholder="Briefly describe what this session covers..."
                                    className="min-h-[100px]"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Schedule & Location</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Start Time</Label>
                                    <Input
                                        type="datetime-local"
                                        value={sessionData.start_time ? new Date(sessionData.start_time).toISOString().slice(0, 16) : ''}
                                        onChange={(e) => setSessionData({ ...sessionData, start_time: new Date(e.target.value).toISOString() })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>End Time</Label>
                                    <Input
                                        type="datetime-local"
                                        value={sessionData.end_time ? new Date(sessionData.end_time).toISOString().slice(0, 16) : ''}
                                        onChange={(e) => setSessionData({ ...sessionData, end_time: new Date(e.target.value).toISOString() })}
                                    />
                                </div>
                            </div>

                            {sessionData.session_type === 'LIVE' ? (
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2">
                                        <LinkIcon className="w-4 h-4" /> Meeting URL
                                    </Label>
                                    <Input
                                        value={sessionData.meeting_url}
                                        onChange={(e) => setSessionData({ ...sessionData, meeting_url: e.target.value })}
                                        placeholder="https://zoom.us/j/..."
                                    />
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4" /> Location Address
                                    </Label>
                                    <Input
                                        value={sessionData.location}
                                        onChange={(e) => setSessionData({ ...sessionData, location: e.target.value })}
                                        placeholder="123 Security St, Chicago, IL"
                                    />
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
