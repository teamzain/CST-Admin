import { useState } from 'react';
import {
    type Session,
    getSessionColor,
} from '@/pages/(dashboard)/scheduling/data';
import {
    format,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    isSameMonth,
    getDay,
} from 'date-fns';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { MapPin, Video, Users, Clock, BookOpen } from 'lucide-react';

interface CalendarViewProps {
    sessions: Session[];
    currentMonth: Date;
}

export const CalendarView = ({ sessions, currentMonth }: CalendarViewProps) => {
    const [selectedSession, setSelectedSession] = useState<Session | null>(null);

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

    const firstDayOfMonth = getDay(monthStart);
    const calendarDays = [...Array(firstDayOfMonth).fill(null), ...daysInMonth];

    while (calendarDays.length % 7 !== 0) {
        calendarDays.push(null);
    }

    const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

    const getSessionsForDay = (day: Date | null) => {
        if (!day) return [];
        return sessions.filter(
            (s) => format(s.date, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
        );
    };

    const formatTime = (timeStr?: string) => {
        if (!timeStr) return '—';
        try {
            const normalised = timeStr.replace(' ', 'T');
            if (normalised.includes('T')) {
                return format(new Date(normalised), 'hh:mm a');
            }
            return timeStr;
        } catch {
            return timeStr;
        }
    };

    return (
        <>
            <div className="bg-white rounded-lg border border-border">
                {/* Weekday headers */}
                <div className="grid grid-cols-7 gap-0 border-b border-border">
                    {weekDays.map((day) => (
                        <div
                            key={day}
                            className="p-4 text-center font-semibold text-sm text-muted-foreground bg-muted"
                        >
                            {day}
                        </div>
                    ))}
                </div>

                {/* Calendar grid */}
                <div className="grid grid-cols-7 gap-0">
                    {calendarDays.map((day, idx) => {
                        const daySessions = day ? getSessionsForDay(day) : [];
                        const isCurrentMonth = day
                            ? isSameMonth(day, currentMonth)
                            : false;
                        const dayNumber = day ? Number(format(day, 'd')) : null;

                        return (
                            <div
                                key={idx}
                                className={`aspect-square border-r border-b border-border p-2 min-h-24  ${
                                    !isCurrentMonth ? 'bg-muted/30' : 'bg-white'
                                }`}
                            >
                                {dayNumber && (
                                    <>
                                        <div
                                            className={`text-lg font-semibold mb-1 ${isCurrentMonth ? 'text-foreground' : 'text-muted-foreground'}`}
                                        >
                                            {dayNumber}
                                        </div>
                                        <div className="space-y-1 mb-auto">
                                            {daySessions
                                                .slice(0, 3)
                                                .map((session, sessionIdx) => (
                                                    <button
                                                        key={session.id}
                                                        onClick={() => setSelectedSession(session)}
                                                        className={`w-full text-xs px-2 py-1 rounded text-center truncate font-medium cursor-pointer hover:opacity-80 transition-opacity ${getSessionColor(sessionIdx)}`}
                                                    >
                                                        {session.time}{' '}
                                                        {session.name}
                                                    </button>
                                                ))}
                                            {daySessions.length > 3 && (
                                                <div className="text-xs text-muted-foreground text-center">
                                                    +{daySessions.length - 3} more
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Session Detail Dialog */}
            <Dialog open={!!selectedSession} onOpenChange={() => setSelectedSession(null)}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-xl">{selectedSession?.name}</DialogTitle>
                    </DialogHeader>
                    {selectedSession && (
                        <div className="space-y-4 pt-2">
                            {/* Type Badge */}
                            <div className="flex items-center gap-2">
                                <Badge variant={selectedSession.session_type === 'PHYSICAL' ? 'default' : 'secondary'}>
                                    {selectedSession.session_type === 'PHYSICAL' ? (
                                        <><MapPin className="w-3 h-3 mr-1" /> In-Person</>
                                    ) : (
                                        <><Video className="w-3 h-3 mr-1" /> Live Online</>
                                    )}
                                </Badge>
                                {selectedSession.duration && (
                                    <Badge variant="outline">
                                        <Clock className="w-3 h-3 mr-1" />{selectedSession.duration}
                                    </Badge>
                                )}
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-1 gap-3 text-sm">
                                {/* Date & Time */}
                                <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                                    <Clock className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                                    <div>
                                        <p className="font-medium">Schedule</p>
                                        <p className="text-muted-foreground">
                                            {format(selectedSession.date, 'EEEE, MMMM d, yyyy')}
                                        </p>
                                        <p className="text-muted-foreground">
                                            {formatTime(selectedSession.start_time)} — {formatTime(selectedSession.end_time)}
                                        </p>
                                    </div>
                                </div>

                                {/* Course */}
                                {selectedSession.course_title && (
                                    <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                                        <BookOpen className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                                        <div>
                                            <p className="font-medium">Course</p>
                                            <p className="text-muted-foreground">{selectedSession.course_title}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Capacity */}
                                {selectedSession.capacity != null && (
                                    <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                                        <Users className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                                        <div>
                                            <p className="font-medium">Capacity</p>
                                            <p className="text-muted-foreground">{selectedSession.capacity} students</p>
                                        </div>
                                    </div>
                                )}

                                {/* Location / Meeting URL */}
                                {selectedSession.session_type === 'PHYSICAL' && selectedSession.location && (
                                    <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                                        <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                                        <div>
                                            <p className="font-medium">Location</p>
                                            <p className="text-muted-foreground">{selectedSession.location}</p>
                                        </div>
                                    </div>
                                )}

                                {selectedSession.session_type === 'LIVE' && selectedSession.meeting_url && (
                                    <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                                        <Video className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                                        <div>
                                            <p className="font-medium">Meeting Link</p>
                                            <a
                                                href={selectedSession.meeting_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-primary hover:underline break-all"
                                            >
                                                {selectedSession.meeting_url}
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
};
