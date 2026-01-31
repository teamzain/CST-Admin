import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, ChevronLeft, MapPin, Link as LinkIcon, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SessionsRepository, type Session } from '@/repositories/sessions';
import { convertFromISO8601, convertToISO8601 } from '@/lib/utils';

export default function SessionDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [sessionData, setSessionData] = useState<Partial<Session>>({
        title: '',
        session_type: 'LIVE',
        start_time: '',
        end_time: '',
        location: '',
        meeting_url: '',
    });

    useEffect(() => {
        const fetchSession = async () => {
            if (!id) return;
            try {
                setIsLoading(true);
                const data = await SessionsRepository.getById(Number(id));

                // Convert ISO dates to datetime-local format for inputs
                setSessionData({
                    ...data,
                    start_time: data.start_time ? convertFromISO8601(data.start_time) : '',
                    end_time: data.end_time ? convertFromISO8601(data.end_time) : '',
                });
            } catch (error) {
                console.error('Failed to fetch session:', error);
                toast.error('Failed to load session details');
                navigate('/sessions');
            } finally {
                setIsLoading(false);
            }
        };

        fetchSession();
    }, [id, navigate]);

    const handleSave = async () => {
        if (!id) return;

        try {
            setIsSaving(true);

            // Convert datetime-local back to ISO 8601
            const payload = {
                ...sessionData,
                start_time: convertToISO8601(sessionData.start_time || ''),
                end_time: convertToISO8601(sessionData.end_time || ''),
            };

            await SessionsRepository.update(Number(id), payload);
            toast.success('Session updated successfully');
            navigate(-1);
        } catch (error) {
            console.error('Failed to update session:', error);
            toast.error('Failed to update session');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-muted-foreground">Loading session details...</p>
                </div>
            </div>
        );
    }

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
                    <Button variant="outline" onClick={() => navigate(-1)} disabled={isSaving}>Cancel</Button>
                    <Button onClick={handleSave} className="gap-2" disabled={isSaving}>
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Save Session
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
                                <div className="space-y-2">
                                    <Label>Capacity</Label>
                                    <Input
                                        type="number"
                                        value={sessionData.capacity}
                                        onChange={(e) => setSessionData({ ...sessionData, capacity: Number(e.target.value) })}
                                    />
                                </div>
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
                                        value={sessionData.start_time}
                                        onChange={(e) => setSessionData({ ...sessionData, start_time: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>End Time</Label>
                                    <Input
                                        type="datetime-local"
                                        value={sessionData.end_time}
                                        onChange={(e) => setSessionData({ ...sessionData, end_time: e.target.value })}
                                    />
                                </div>
                            </div>

                            {sessionData.session_type === 'LIVE' ? (
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2">
                                        <LinkIcon className="w-4 h-4" /> Meeting URL
                                    </Label>
                                    <Input
                                        value={sessionData.meeting_url || ''}
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
                                        value={sessionData.location || ''}
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
