'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin } from 'lucide-react';
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
                start_time: session.start_time,
                end_time: session.end_time,
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Ensure dates are in ISO format if needed, but datetime-local values are usually fine for now
        // The backend expects ISO strings like "2025-11-03T09:00:00Z"
        // We might need to convert them before saving if the parent component expects that.
        // For now, we pass the raw values.
        onSave(formData);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
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
                                className="bg-background border-input"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="session-type">Session Type *</Label>
                                <Select
                                    value={formData.session_type}
                                    onValueChange={(value) => setFormData({ ...formData, session_type: value as 'LIVE' | 'PHYSICAL' })}
                                >
                                    <SelectTrigger id="session-type" className="bg-background border-input">
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
                                    className="bg-background border-input"
                                />
                            </div>
                        </div>

                        {formData.session_type === 'PHYSICAL' ? (
                            <div className="space-y-2">
                                <Label htmlFor="location">Location *</Label>
                                <div className="relative">
                                    <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="location"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        placeholder="e.g., Main Training Hall, Building A"
                                        required
                                        className="bg-background border-input pl-9"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <Label htmlFor="meeting-url">Meeting URL</Label>
                                <Input
                                    id="meeting-url"
                                    value={formData.meeting_url || (session ? '' : 'Will be generated automatically')}
                                    readOnly
                                    disabled
                                    className="bg-muted text-muted-foreground border-input"
                                />
                                <p className="text-xs text-muted-foreground">
                                    System automatically generates Google Meet link upon creation.
                                </p>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="start-time">Start Time *</Label>
                                <Input
                                    id="start-time"
                                    type="datetime-local"
                                    value={formData.start_time}
                                    onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                                    required
                                    className="bg-background border-input"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="end-time">End Time *</Label>
                                <Input
                                    id="end-time"
                                    type="datetime-local"
                                    value={formData.end_time}
                                    onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                                    required
                                    className="bg-background border-input"
                                />
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
