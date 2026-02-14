'use client';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
    startOfWeek,
    endOfWeek,
    parseISO,
    isWithinInterval,
    addDays,
    isBefore,
    isAfter,
    formatDistanceToNow,
} from 'date-fns';
import { StatCard } from '@/components/shared/stat-card';
import { StudentsRepository } from '@/repositories/students';
import { CoursesRepository } from '@/repositories/courses';
import { SessionsRepository } from '@/repositories/sessions';
import { InstructorsRepository } from '@/repositories/instructors';
import { EnrollmentsRepository } from '@/repositories/enrollments';
import { useAuthStore } from '@/stores';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
    Users,
    BookOpen,
    TrendingUp,
    AlertCircle,
    DollarSign,
} from 'lucide-react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';

// ─── helpers ────────────────────────────────────────────────────────────────

/** Safely parse a date string, returning null on failure */
function safeParse(value: string | Date | null | undefined): Date | null {
    if (!value) return null;
    try {
        const d = typeof value === 'string' ? parseISO(value) : value;
        return isNaN(d.getTime()) ? null : d;
    } catch {
        return null;
    }
}

export default function DashboardPage() {
    const { user } = useAuthStore();

    // ── API queries ─────────────────────────────────────────────────────────

    const { data: students = [] } = useQuery({
        queryKey: ['dashboard-students'],
        queryFn: () => StudentsRepository.getAllStudents(),
    });

    const { data: courses = [] } = useQuery({
        queryKey: ['dashboard-courses'],
        queryFn: () => CoursesRepository.getAll(),
    });

    const { data: sessions = [] } = useQuery({
        queryKey: ['dashboard-sessions'],
        queryFn: () => SessionsRepository.getAll(),
    });

    const { data: instructors = [] } = useQuery({
        queryKey: ['dashboard-instructors'],
        queryFn: () => InstructorsRepository.getAllInstructors(),
    });

    const { data: enrollmentsData } = useQuery({
        queryKey: ['dashboard-enrollments'],
        queryFn: () => EnrollmentsRepository.getAll({ limit: 200 }),
    });

    const enrollments = useMemo(() => enrollmentsData?.data ?? [], [enrollmentsData]);

    // ── computed stats ──────────────────────────────────────────────────────

    const totalStudents = students.length;
    const activeCourses = courses.filter((c) => c.is_active).length;

    const completionRate = useMemo(() => {
        if (enrollments.length === 0) return '—';
        const completed = enrollments.filter((e) => e.status === 'COMPLETE').length;
        return `${Math.round((completed / enrollments.length) * 100)}%`;
    }, [enrollments]);

    const now = useMemo(() => new Date(), []);
    const weekStart = useMemo(() => startOfWeek(now, { weekStartsOn: 1 }), [now]);
    const weekEnd = useMemo(() => endOfWeek(now, { weekStartsOn: 1 }), [now]);

    const sessionsThisWeek = useMemo(
        () =>
            sessions.filter((s) => {
                const d = safeParse(s.start_time);
                return d
                    ? isWithinInterval(d, { start: weekStart, end: weekEnd })
                    : false;
            }).length,
        [sessions, weekStart, weekEnd]
    );

    // Instructor license alerts — expiring within 30 days from today
    const licenseAlerts = useMemo(() => {
        const thirtyDaysOut = addDays(now, 30);
        return instructors.filter((i) => {
            const expiry = safeParse(i.license_expiry as string | null);
            if (!expiry) return false;
            return (
                (isBefore(expiry, thirtyDaysOut) || expiry.getTime() === thirtyDaysOut.getTime()) &&
                (isAfter(expiry, now) || expiry.getTime() === now.getTime())
            );
        });
    }, [instructors, now]);

    // Build "recent activity" from the most-recently-created students
    const recentActivity = useMemo(() => {
        const sorted = [...students]
            .sort((a, b) => {
                const da = safeParse(a.created_at)?.getTime() ?? 0;
                const db = safeParse(b.created_at)?.getTime() ?? 0;
                return db - da;
            })
            .slice(0, 5);

        return sorted.map((s) => {
            const status =
                s.user_auth?.status === 'ACTIVE'
                    ? 'completed'
                    : s.user_auth?.status === 'INACTIVE'
                    ? 'pending'
                    : 'in-progress';

            const createdDate = safeParse(s.created_at);
            const timeAgo = createdDate
                ? formatDistanceToNow(createdDate, { addSuffix: true })
                : '—';

            return {
                id: s.id,
                student: `${s.first_name} ${s.last_name}`,
                action: `Enrolled — ${s.enrolledCoursesCount ?? 0} course(s)`,
                time: timeAgo,
                status,
            };
        });
    }, [students]);

    // Enrollment trends chart — aggregate enrollments by month
    const chartData = useMemo(() => {
        const monthNames = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
        ];
        const monthMap = new Map<string, { enrollments: number; completions: number }>();

        // Seed last 6 months so the chart always has data points
        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const key = `${d.getFullYear()}-${d.getMonth()}`;
            monthMap.set(key, { enrollments: 0, completions: 0 });
        }

        const ensureBucket = (key: string) => {
            if (!monthMap.has(key)) {
                monthMap.set(key, { enrollments: 0, completions: 0 });
            }
        };

        enrollments.forEach((e) => {
            const startedDate = safeParse(e.started_at);
            if (startedDate) {
                const key = `${startedDate.getFullYear()}-${startedDate.getMonth()}`;
                ensureBucket(key);
                monthMap.get(key)!.enrollments += 1;
            }
            if (e.status === 'COMPLETE' && e.completed_at) {
                const completedDate = safeParse(e.completed_at);
                if (completedDate) {
                    const key = `${completedDate.getFullYear()}-${completedDate.getMonth()}`;
                    ensureBucket(key);
                    monthMap.get(key)!.completions += 1;
                }
            }
        });

        // Sort chronologically and build final array
        return Array.from(monthMap.entries())
            .sort(([a], [b]) => {
                const [ay, am] = a.split('-').map(Number);
                const [by, bm] = b.split('-').map(Number);
                return ay !== by ? ay - by : am - bm;
            })
            .map(([key, val]) => {
                const [, monthIdx] = key.split('-');
                return {
                    month: monthNames[Number(monthIdx)],
                    enrollments: val.enrollments,
                    completions: val.completions,
                };
            });
    }, [enrollments, now]);

    // ── render ───────────────────────────────────────────────────────────────

    return (
        <div className="flex">
            <div className="flex-1 bg-background">
                <div className="p-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-foreground">
                            Dashboard
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            Welcome back, {user?.name ?? 'Admin'}
                        </p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <StatCard
                            icon={Users}
                            label="Total Students"
                            value={totalStudents}
                        />
                        <StatCard
                            icon={BookOpen}
                            label="Active Courses"
                            value={activeCourses}
                        />
                        <StatCard
                            icon={TrendingUp}
                            label="Completion Rate"
                            value={completionRate}
                        />
                        <StatCard
                            icon={DollarSign}
                            label="Revenue (MTD)"
                            value="—"
                        />
                    </div>

                    {/* Alerts */}
                    {licenseAlerts.length > 0 && (
                        <Card className="mb-8 bg-card border-border bg-gradient-to-r from-destructive/5 to-transparent">
                            <CardContent className="pt-6 flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                                <div>
                                    <h3 className="font-semibold text-foreground">
                                        Instructor License Alert
                                    </h3>
                                    {licenseAlerts.map((inst) => {
                                        const expiry = safeParse(inst.license_expiry as string);
                                        const daysLeft = expiry
                                            ? Math.ceil(
                                                  (expiry.getTime() - now.getTime()) /
                                                      (1000 * 60 * 60 * 24)
                                              )
                                            : 0;
                                        return (
                                            <p
                                                key={inst.id}
                                                className="text-sm text-muted-foreground"
                                            >
                                                {inst.first_name} {inst.last_name}'s license
                                                expires in {daysLeft} day
                                                {daysLeft !== 1 ? 's' : ''}. Renewal required.
                                            </p>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Chart */}
                        <Card className="lg:col-span-2 bg-card border-border">
                            <CardHeader>
                                <CardTitle>Enrollment Trends</CardTitle>
                                <CardDescription>
                                    Student enrollments vs completions
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={chartData}>
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            stroke="oklch(0.2 0 0)"
                                        />
                                        <XAxis dataKey="month" stroke="#6b7280" />
                                        <YAxis stroke="#6b7280" allowDecimals={false} />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor:
                                                    'oklch(0.12 0 0)',
                                                border: '1px solid oklch(0.2 0 0)',
                                                borderRadius: '8px',
                                            }}
                                        />
                                        <Legend />
                                        <Line
                                            type="monotone"
                                            dataKey="enrollments"
                                            stroke="oklch(0.55 0.2 280)"
                                            strokeWidth={2}
                                            dot={{ r: 4 }}
                                            activeDot={{ r: 6 }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="completions"
                                            stroke="oklch(0.6 0.15 200)"
                                            strokeWidth={2}
                                            dot={{ r: 4 }}
                                            activeDot={{ r: 6 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Quick Stats */}
                        <Card className="bg-card border-border">
                            <CardHeader>
                                <CardTitle className="text-lg">
                                    Quick Stats
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Pending Approvals
                                    </p>
                                    <p className="text-2xl font-bold text-foreground">
                                        —
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Range Sessions This Week
                                    </p>
                                    <p className="text-2xl font-bold text-foreground">
                                        {sessionsThisWeek}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Awaiting ID Verification
                                    </p>
                                    <p className="text-2xl font-bold text-foreground">
                                        —
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Recent Activity */}
                    <Card className="mt-8 bg-card border-border">
                        <CardHeader>
                            <CardTitle>Recent Activity</CardTitle>
                            <CardDescription>
                                Latest student actions and events
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-border hover:bg-transparent">
                                        <TableHead>Student</TableHead>
                                        <TableHead>Action</TableHead>
                                        <TableHead>Time</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {recentActivity.length === 0 ? (
                                        <TableRow className="border-border">
                                            <TableCell
                                                colSpan={4}
                                                className="text-center text-muted-foreground py-6"
                                            >
                                                No recent activity
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        recentActivity.map((activity) => (
                                            <TableRow
                                                key={activity.id}
                                                className="border-border"
                                            >
                                                <TableCell className="font-medium">
                                                    {activity.student}
                                                </TableCell>
                                                <TableCell className="text-muted-foreground">
                                                    {activity.action}
                                                </TableCell>
                                                <TableCell className="text-muted-foreground text-sm">
                                                    {activity.time}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={
                                                            activity.status ===
                                                            'completed'
                                                                ? 'default'
                                                                : activity.status ===
                                                                  'in-progress'
                                                                ? 'secondary'
                                                                : activity.status ===
                                                                  'pending'
                                                                ? 'outline'
                                                                : 'destructive'
                                                        }
                                                    >
                                                        {activity.status
                                                            .charAt(0)
                                                            .toUpperCase() +
                                                            activity.status.slice(
                                                                1
                                                            )}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
