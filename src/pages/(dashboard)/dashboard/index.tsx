'use client';

import { StatCard } from '@/components/shared/stat-card';
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

const chartData = [
    { month: 'Jan', enrollments: 120, completions: 85 },
    { month: 'Feb', enrollments: 150, completions: 110 },
    { month: 'Mar', enrollments: 180, completions: 140 },
    { month: 'Apr', enrollments: 200, completions: 165 },
    { month: 'May', enrollments: 220, completions: 190 },
    { month: 'Jun', enrollments: 250, completions: 220 },
];

const recentActivity = [
    {
        id: 1,
        student: 'John Smith',
        action: 'Completed Armed Course',
        time: '2 hours ago',
        status: 'completed',
    },
    {
        id: 2,
        student: 'Sarah Johnson',
        action: 'Started Unarmed Course',
        time: '4 hours ago',
        status: 'in-progress',
    },
    {
        id: 3,
        student: 'Mike Davis',
        action: 'Booked Range Session',
        time: '6 hours ago',
        status: 'pending',
    },
    {
        id: 4,
        student: 'Emily Wilson',
        action: 'Failed Exam - Retake Available',
        time: '1 day ago',
        status: 'failed',
    },
    {
        id: 5,
        student: 'Robert Brown',
        action: 'Completed Final Exam',
        time: '1 day ago',
        status: 'completed',
    },
];

export default function DashboardPage() {
    return (
        <div className="flex">
            <div className="flex-1 bg-background">
                <div className="p-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-foreground">
                            Dashboard
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            Welcome back, Admin
                        </p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <StatCard
                            icon={Users}
                            label="Total Students"
                            value={1243}
                            change="+12.5%"
                            changeType="positive"
                        />
                        <StatCard
                            icon={BookOpen}
                            label="Active Courses"
                            value={8}
                            change="+2 this month"
                            changeType="positive"
                        />
                        <StatCard
                            icon={TrendingUp}
                            label="Completion Rate"
                            value="84%"
                            change="+4.2%"
                            changeType="positive"
                        />
                        <StatCard
                            icon={DollarSign}
                            label="Revenue (MTD)"
                            value="$12,450"
                            change="+22%"
                            changeType="positive"
                        />
                    </div>

                    {/* Alerts */}
                    <Card className="mb-8 bg-card border-border bg-gradient-to-r from-destructive/5 to-transparent">
                        <CardContent className="pt-6 flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                            <div>
                                <h3 className="font-semibold text-foreground">
                                    Instructor License Alert
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    John Martinez's license expires in 7 days.
                                    Renewal required.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

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
                                        <XAxis stroke="oklch(0.65 0 0)" />
                                        <YAxis stroke="oklch(0.65 0 0)" />
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
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="completions"
                                            stroke="oklch(0.6 0.15 200)"
                                            strokeWidth={2}
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
                                        5
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Range Sessions This Week
                                    </p>
                                    <p className="text-2xl font-bold text-foreground">
                                        12
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Awaiting ID Verification
                                    </p>
                                    <p className="text-2xl font-bold text-foreground">
                                        8
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
                                    {recentActivity.map((activity) => (
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
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
