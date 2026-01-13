
import type { User } from '@/repositories/users/types';

export const dummyUsers: User[] = Array.from({ length: 120 }, (_, i) => ({
    id: i + 1,
    name: `User Name ${i + 1}`,
    email: `username${i + 1}@gmail.com`,
    userId: 9901 + i,
    role: (['Student', 'Instructor', 'Employer'] as const)[
        i % 3
    ] as User['role'],
    status: (['Active', 'Suspended', 'Invited'] as const)[
        i % 3
    ] as User['status'],
    registrationDate: 'Nov 5, 2025',
    lastActivity: 'Activity',
    avatar: '👤',
}));
