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

interface CalendarViewProps {
    sessions: Session[];
    currentMonth: Date;
}

export const CalendarView = ({ sessions, currentMonth }: CalendarViewProps) => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

    // Get the first day of the week for the month (0 = Sunday, 1 = Monday, etc.)
    const firstDayOfMonth = getDay(monthStart);

    // Create array of all calendar days including leading/trailing empty cells
    const calendarDays = [...Array(firstDayOfMonth).fill(null), ...daysInMonth];

    // Pad to multiple of 7
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

    return (
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
                                                <div
                                                    key={session.id}
                                                    className={`text-xs px-2 py-1 rounded text-center truncate font-medium ${getSessionColor(sessionIdx)}`}
                                                >
                                                    {session.time}{' '}
                                                    {session.name}
                                                </div>
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
    );
};
