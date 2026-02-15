export interface Session {
    id: string;
    time: string;
    name: string;
    date: Date;
    duration?: string;
    // Full details from API
    session_type?: 'LIVE' | 'PHYSICAL';
    capacity?: number;
    location?: string;
    meeting_url?: string;
    start_time?: string;
    end_time?: string;
    course_title?: string;
    course_id?: number;
}

export const generateSessionsData = (): Session[] => {
    const sessions: Session[] = [];
    const sessionNames = [
        'Range session',
        'Precision drill',
        'Target practice',
        'Speed training',
    ];
    const times = ['07:00', '09:00', '11:00', '14:00', '16:00', '18:00'];

    // Generate sessions for January 2025

    // Monday sessions (Jan 6, 13, 20, 27)
    [6, 13, 20, 27].forEach((day) => {
        [0, 1, 2].forEach((idx) => {
            sessions.push({
                id: `session-mon-${day}-${idx}`,
                time: times[0],
                name: sessionNames[idx % sessionNames.length],
                date: new Date(2025, 0, day),
            });
        });
    });

    // Tuesday sessions (Jan 7, 14, 21, 28)
    [7, 14, 21, 28].forEach((day) => {
        [0, 1].forEach((idx) => {
            sessions.push({
                id: `session-tue-${day}-${idx}`,
                time: times[0],
                name: sessionNames[idx % sessionNames.length],
                date: new Date(2025, 0, day),
            });
        });
    });

    // Wednesday sessions (Jan 1, 8, 15, 22, 29)
    [1, 8, 15, 22, 29].forEach((day) => {
        [0, 1, 2, 3].forEach((idx) => {
            sessions.push({
                id: `session-wed-${day}-${idx}`,
                time: times[0],
                name: sessionNames[idx % sessionNames.length],
                date: new Date(2025, 0, day),
            });
        });
    });

    // December 2024 sessions for calendar view
    [31].forEach((day) => {
        sessions.push({
            id: `session-dec-${day}`,
            time: '14:00',
            name: 'Range session',
            date: new Date(2024, 11, day),
        });
    });

    // More sessions for calendar demo
    [4, 5].forEach((day) => {
        sessions.push({
            id: `session-dec-${day}`,
            time: '14:00',
            name: sessionNames[Math.floor(Math.random() * sessionNames.length)],
            date: new Date(2024, 11, day),
        });
    });

    [9, 10].forEach((day) => {
        sessions.push({
            id: `session-dec-cal-${day}`,
            time: '14:00',
            name: sessionNames[Math.floor(Math.random() * sessionNames.length)],
            date: new Date(2024, 11, day),
        });
    });

    [18, 19].forEach((day) => {
        sessions.push({
            id: `session-dec-cal-${day}`,
            time: '14:00',
            name: sessionNames[Math.floor(Math.random() * sessionNames.length)],
            date: new Date(2024, 11, day),
        });
    });

    return sessions;
};

export const sessionColors = [
    'bg-gray-400 text-black',
    'bg-green-500 text-white',
    'bg-orange-500 text-white',
    'bg-blue-500 text-white',
];

export const getSessionColor = (index: number): string => {
    return sessionColors[index % sessionColors.length];
};
