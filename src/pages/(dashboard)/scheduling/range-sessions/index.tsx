'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
    format,
    addDays,
    subDays,
    startOfWeek,
    endOfWeek,
    addMonths,
    subMonths,
    parseISO,
} from 'date-fns';
import { SessionsRepository } from '@/repositories/sessions';
import { Button } from '@/components/ui/button';
import { ListView } from '@/components/sessions/list-view';
import { CalendarView } from '@/components/sessions/calendar-view';
import { ChevronLeft, ChevronRight, Plus, List, Calendar, Loader2 } from 'lucide-react';

interface SessionData {
    id: string;
    time: string;
    name: string;
    date: Date;
    duration?: string;
    session_type?: 'LIVE' | 'PHYSICAL';
    capacity?: number;
    location?: string;
    meeting_url?: string;
    start_time?: string;
    end_time?: string;
    course_title?: string;
    course_id?: number;
}

// Convert API session to calendar format
const convertSessionsForDisplay = (apiSessions: any[]): SessionData[] => {
    return apiSessions.map((session) => {
        // Parse start time - could be ISO string or time format
        let sessionDate = new Date();
        let sessionTime = '00:00';

        if (session.start_time) {
            // Normalise space-separated datetime (e.g. "2025-01-15 09:00:00") to ISO
            const normalised = session.start_time.replace(' ', 'T');

            if (normalised.includes('T')) {
                // ISO-like string: "2025-01-15T09:00:00"
                const parsed = parseISO(normalised);
                if (!isNaN(parsed.getTime())) {
                    sessionDate = parsed;
                    sessionTime = format(sessionDate, 'HH:mm');
                }
            } else if (session.start_time.includes(':')) {
                // Just time like "09:00"
                sessionTime = session.start_time;
            }
        }

        // Calculate duration if both start and end times exist
        let duration: string | undefined;
        if (session.start_time && session.end_time) {
            try {
                const startStr = session.start_time.includes('T') ? session.start_time : session.start_time.replace(' ', 'T');
                const endStr = session.end_time.includes('T') ? session.end_time : session.end_time.replace(' ', 'T');

                const startDate = startStr.includes('T')
                    ? parseISO(startStr)
                    : new Date(`2025-01-01T${session.start_time}`);
                const endDate = endStr.includes('T')
                    ? parseISO(endStr)
                    : new Date(`2025-01-01T${session.end_time}`);
                const diffMs = endDate.getTime() - startDate.getTime();
                const diffHours = Math.round(diffMs / (1000 * 60 * 60));
                if (diffHours > 0) {
                    duration = `${diffHours}h`;
                }
            } catch (e) {
                // Silently fail duration calculation
            }
        }

        return {
            id: String(session.id),
            time: sessionTime,
            name: session.title || 'Session',
            date: sessionDate,
            duration,
            session_type: session.session_type,
            capacity: session.capacity,
            location: session.location,
            meeting_url: session.meeting_url,
            start_time: session.start_time,
            end_time: session.end_time,
            course_title: session.course?.title || session.course_title,
            course_id: session.course_id,
        };
    });
};

export default function RangeSessionsPage() {
    const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
    const [currentDate, setCurrentDate] = useState(new Date());

    // Fetch sessions from API
    const { data: apiSessions = [], isLoading } = useQuery({
        queryKey: ['sessions'],
        queryFn: () => SessionsRepository.getAll(),
    });

    // Convert API sessions to display format
    const sessions = useMemo(() => {
        return convertSessionsForDisplay(apiSessions);
    }, [apiSessions]);

    // Calculate week range for list view
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 }); // Monday
    const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });

    // For calendar view, use month
    const currentMonth = currentDate;

    const handlePreviousPeriod = () => {
        if (viewMode === 'list') {
            setCurrentDate(subDays(currentDate, 7));
        } else {
            setCurrentDate(subMonths(currentDate, 1));
        }
    };

    const handleNextPeriod = () => {
        if (viewMode === 'list') {
            setCurrentDate(addDays(currentDate, 7));
        } else {
            setCurrentDate(addMonths(currentDate, 1));
        }
    };

    const periodLabel =
        viewMode === 'list'
            ? `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`
            : format(currentMonth, 'MMMM yyyy');

    // Count sessions in current period
    const sessionsInPeriod = sessions.filter((s) => {
        if (viewMode === 'list') {
            return s.date >= weekStart && s.date <= weekEnd;
        } else {
            return (
                s.date.getMonth() === currentMonth.getMonth() &&
                s.date.getFullYear() === currentMonth.getFullYear()
            );
        }
    });

    return (
        <div className="min-h-screen bg-background text-foreground">
            <div className="mx-auto p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">
                            Range Sessions
                        </h1>
                        <p className="text-muted-foreground">
                            {isLoading
                                ? 'Loading...'
                                : `${sessionsInPeriod.length} Sessions Found`}
                        </p>
                    </div>
                    <Button className="gap-2">
                        <Plus className="w-4 h-4" />
                        Add Session
                    </Button>
                </div>

                <div className="bg-white rounded-lg border border-border p-4">
                    {/* Controls */}
                    <div className="flex items-center justify-between mb-8 gap-4">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handlePreviousPeriod}
                                className="p-1 hover:bg-muted rounded-lg transition-colors"
                                aria-label="Previous period"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>

                            <span className="text-lg font-semibold min-w-48 text-center">
                                {periodLabel}
                            </span>

                            <button
                                onClick={handleNextPeriod}
                                className="p-1 hover:bg-muted rounded-lg transition-colors"
                                aria-label="Next period"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>

                        {/* View Toggle */}
                        <div className="flex gap-2 border border-border rounded-lg p-1 bg-muted">
                            <button
                                onClick={() => setViewMode('list')}
                                className={`flex items-center gap-2 px-4 py-2 rounded transition-colors ${
                                    viewMode === 'list'
                                        ? 'bg-background text-foreground shadow-sm'
                                        : 'text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                <List className="w-4 h-4" />
                                List
                            </button>
                            <button
                                onClick={() => setViewMode('calendar')}
                                className={`flex items-center gap-2 px-4 py-2 rounded transition-colors ${
                                    viewMode === 'calendar'
                                        ? 'bg-background text-foreground shadow-sm'
                                        : 'text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                <Calendar className="w-4 h-4" />
                                Calendar
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div>
                        {isLoading ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="w-6 h-6 animate-spin text-primary mr-3" />
                                <span className="text-muted-foreground">Loading sessions...</span>
                            </div>
                        ) : viewMode === 'list' ? (
                            <ListView
                                sessions={sessions}
                                startDate={weekStart}
                                endDate={weekEnd}
                            />
                        ) : (
                            <CalendarView
                                sessions={sessions}
                                currentMonth={currentMonth}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
