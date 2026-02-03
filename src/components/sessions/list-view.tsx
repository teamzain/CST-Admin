import {
    type Session,
    getSessionColor,
} from '@/pages/(dashboard)/scheduling/data';
import { format } from 'date-fns';

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

                        <div className="space-y-1">
                            {daySessions.map((session, idx) => (
                                <div
                                    key={session.id}
                                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-primary transition-colors bg-muted"
                                >
                                    <div className="text-sm font-medium text-muted-foreground min-w-12">
                                        {session.time}
                                    </div>
                                    <div
                                        className={`px-3 py-1 rounded text-sm font-medium ${getSessionColor(idx)}`}
                                    >
                                        {session.name}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )
            )}
        </div>
    );
};
