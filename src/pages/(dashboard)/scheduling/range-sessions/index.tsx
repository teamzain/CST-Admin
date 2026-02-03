'use client';

import { useState } from 'react';
import {
    format,
    addDays,
    subDays,
    startOfWeek,
    endOfWeek,
    addMonths,
    subMonths,
} from 'date-fns';
import { generateSessionsData } from '../data';
import { Button } from '@/components/ui/button';
import { ListView } from '@/components/sessions/list-view';
import { CalendarView } from '@/components/sessions/calendar-view';
import { ChevronLeft, ChevronRight, Plus, List, Calendar } from 'lucide-react';

export default function App() {
    const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
    const [currentDate, setCurrentDate] = useState(new Date(2025, 0, 10)); // Jan 10, 2025
    const [sessions] = useState(() => generateSessionsData());

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
                            {sessionsInPeriod.length} Sessions Found
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
                        {viewMode === 'list' ? (
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
