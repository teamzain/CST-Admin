'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin } from 'lucide-react';
import { DateTimePickerInput } from '@/components/shared/date-picker';
import { toast } from 'sonner';
import { convertFromISO8601 } from '@/lib/utils';
import type { Session } from './module-item';

interface SessionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (session: Partial<Session>) => void;
    session?: Session;
}

export function SessionModal({ isOpen, onClose, onSave, session }: SessionModalProps) {
    const [formData, setFormData] = useState<Partial<Session>>({
        title: '',
        start_time: '',
        end_time: '',
        session_type: 'LIVE',
        capacity: 20,
        location: '',
        meeting_url: '',
    });

    useEffect(() => {
        if (session) {
            setFormData({
                title: session.title,
                start_time: convertFromISO8601(session.start_time),
                end_time: convertFromISO8601(session.end_time),
                session_type: session.session_type,
                capacity: session.capacity || 20,
                location: session.location || '',
                meeting_url: session.meeting_url || '',
            });
        } else {
            setFormData({
                title: '',
                start_time: '',
                end_time: '',
                session_type: 'LIVE',
                capacity: 20,
                location: '',
                meeting_url: '',
            });
        }
    }, [session, isOpen]);

    // Force re-render when session_type changes to show/hide location or meeting_url
    useEffect(() => {
        // This effect ensures the conditional rendering updates when session_type changes
    }, [formData.session_type]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validate required fields
        if (!formData.title || !formData.start_time || !formData.end_time || !formData.capacity) {
            toast.error('Please fill in all required fields');
            return;
        }

        // Validate location for PHYSICAL sessions
        if (formData.session_type === 'PHYSICAL' && !formData.location?.trim()) {
            toast.error('Location is required for physical sessions');
            return;
        }

        onSave(formData);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto" showCloseButton={false}>
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>{session ? 'Edit Session' : 'Add Session'}</DialogTitle>
                        <DialogDescription>
                            {session ? 'Update the session details below.' : 'Schedule a new session for this module.'}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="session-title">Session Title *</Label>
                            <Input
                                id="session-title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="e.g., Live Range Training"
                                required
                                className="bg-background border-border mt-2"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="session-type">Session Type *</Label>
                                <Select value={formData.session_type || 'LIVE'} onValueChange={(value) => setFormData({ ...formData, session_type: value as 'LIVE' | 'PHYSICAL' })}>
                                    <SelectTrigger id="session-type" className="bg-background border-border mt-2">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="LIVE">Live (Virtual)</SelectItem>
                                        <SelectItem value="PHYSICAL">Physical (In-Person)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="capacity">Capacity</Label>
                                <Input
                                    id="capacity"
                                    type="number"
                                    value={formData.capacity}
                                    onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                                    placeholder="20"
                                    min="1"
                                    className="bg-background border-border mt-2"
                                />
                            </div>
                        </div>

                        {formData.session_type === 'PHYSICAL' && (
                            <div className="space-y-2">
                                <Label htmlFor="location">Location *</Label>
                                <div className="relative mt-2">
                                    <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="location"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        placeholder="e.g., Main Training Hall, Building A"
                                        required
                                        className="bg-background border-border pl-9"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="start-time">Start Time *</Label>
                                <div className="mt-2">
                                    <DateTimePickerInput
                                        value={formData.start_time}
                                        onChange={(val) => setFormData({ ...formData, start_time: val })}
                                        placeholder="Select start date & time"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="end-time">End Time *</Label>
                                <div className="mt-2">
                                    <DateTimePickerInput
                                        value={formData.end_time}
                                        onChange={(val) => setFormData({ ...formData, end_time: val })}
                                        placeholder="Select end date & time"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" className="bg-primary hover:bg-primary/90">
                            {session ? 'Update Session' : 'Add Session'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
