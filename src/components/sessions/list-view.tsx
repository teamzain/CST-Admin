import {
    type Session,
    getSessionColor,
} from '@/pages/(dashboard)/scheduling/data';
import { format } from 'date-fns';
import { MapPin, Video, Users, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ListViewProps {
    sessions: Session[];
    startDate: Date;
    endDate: Date;
}

export const ListView = ({ sessions, startDate, endDate }: ListViewProps) => {
    // Filter sessions for the current week
    const filteredSessions = sessions.filter(
        (s) => s.date >= startDate && s.date <= endDate
    );

    // Group sessions by day
    const groupedSessions = filteredSessions.reduce(
        (acc, session) => {
            const day = format(session.date, 'EEEE');
            const dateStr = format(session.date, 'MMM d, yyyy');
            const key = `${day}-${dateStr}`;

            if (!acc[key]) {
                acc[key] = { day, date: dateStr, sessions: [] };
            }
            acc[key].sessions.push(session);
            return acc;
        },
        {} as Record<string, { day: string; date: string; sessions: Session[] }>
    );

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
        <div className="space-y-6 ">
            {Object.entries(groupedSessions).map(
                ([key, { day, date, sessions: daySessions }]) => (
                    <div key={key} className="space-y-2">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-bold text-foreground">
                                {day}
                            </h3>
                            <span className="text-sm text-muted-foreground">
                                {date}
                            </span>
                        </div>

                        <div className="space-y-2">
                            {daySessions.map((session, idx) => (
                                <div
                                    key={session.id}
                                    className="flex items-start gap-4 p-4 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors"
                                >
                                    {/* Color strip */}
                                    <div className={`w-1 self-stretch rounded-full shrink-0 ${getSessionColor(idx).split(' ')[0]}`} />

                                    {/* Main content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-semibold text-foreground truncate">
                                                {session.name}
                                            </span>
                                            <Badge variant={session.session_type === 'PHYSICAL' ? 'default' : 'secondary'} className="shrink-0 text-xs">
                                                {session.session_type === 'PHYSICAL' ? (
                                                    <><MapPin className="w-3 h-3 mr-1" /> In-Person</>
                                                ) : (
                                                    <><Video className="w-3 h-3 mr-1" /> Online</>
                                                )}
                                            </Badge>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3.5 h-3.5" />
                                                {formatTime(session.start_time)} — {formatTime(session.end_time)}
                                                {session.duration && <span className="text-xs">({session.duration})</span>}
                                            </span>

                                            {session.capacity != null && (
                                                <span className="flex items-center gap-1">
                                                    <Users className="w-3.5 h-3.5" />
                                                    {session.capacity} seats
                                                </span>
                                            )}

                                            {session.session_type === 'PHYSICAL' && session.location && (
                                                <span className="flex items-center gap-1">
                                                    <MapPin className="w-3.5 h-3.5" />
                                                    {session.location}
                                                </span>
                                            )}

                                            {session.session_type === 'LIVE' && session.meeting_url && (
                                                <a
                                                    href={session.meeting_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-1 text-primary hover:underline"
                                                >
                                                    <Video className="w-3.5 h-3.5" />
                                                    Join Meeting
                                                </a>
                                            )}
                                        </div>

                                        {session.course_title && (
                                            <p className="text-xs text-muted-foreground mt-1.5">
                                                Course: <span className="font-medium">{session.course_title}</span>
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )
            )}

            {Object.keys(groupedSessions).length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                    <p className="text-lg font-medium">No sessions found</p>
                    <p className="text-sm mt-1">No sessions scheduled for this period.</p>
                </div>
            )}
        </div>
    );
};
