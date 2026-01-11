'use client';

import { Link, useLocation } from 'react-router-dom';
import {
    BarChart3,
    BookOpen,
    Users,
    Briefcase,
    Calendar,
    FileText,
    LogOut,
    Settings,
    Shield,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import clsx from 'clsx';

interface SidebarProps {
    open: boolean;
}

export function Sidebar({ open }: SidebarProps) {
    const { pathname } = useLocation();

    const menuItems = [
        { href: '/', icon: BarChart3, label: 'Dashboard' },
        { href: '/courses', icon: BookOpen, label: 'Courses' },
        { href: '/students', icon: Users, label: 'Students' },
        { href: '/instructors', icon: Shield, label: 'Instructors' },
        { href: '/scheduling', icon: Calendar, label: 'Scheduling' },
        { href: '/employers', icon: Briefcase, label: 'Employers' },
        { href: '/reports', icon: FileText, label: 'Reports' },
    ];

    return (
        <aside
            className={clsx(
                'h-screen fixed left-0 top-0 flex flex-col border-r bg-sidebar transition-all duration-300',
                open ? 'w-64' : 'w-20'
            )}
        >
            {/* Header */}
            <div className="p-6 border-b border-sidebar-border">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center">
                        <Shield className="w-5 h-5 text-sidebar-primary-foreground" />
                    </div>

                    {open && (
                        <h1 className="font-bold text-lg text-sidebar-foreground">
                            TrainHub
                        </h1>
                    )}
                </div>
            </div>

            {/* Menu */}
            <nav className="flex-1 p-4 space-y-2">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link key={item.href} to={item.href}>
                            <Button
                                variant={isActive ? 'default' : 'ghost'}
                                className={clsx(
                                    'w-full gap-3',
                                    open ? 'justify-start' : 'justify-center'
                                )}
                            >
                                <item.icon className="w-4 h-4 shrink-0" />
                                {open && item.label}
                            </Button>
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-sidebar-border space-y-2">
                <Link to="/settings">
                    <Button
                        variant="ghost"
                        className={clsx(
                            'w-full gap-3',
                            open ? 'justify-start' : 'justify-center'
                        )}
                    >
                        <Settings className="w-4 h-4" />
                        {open && 'Settings'}
                    </Button>
                </Link>

                <Button
                    variant="ghost"
                    className={clsx(
                        'w-full gap-3 text-destructive hover:text-destructive',
                        open ? 'justify-start' : 'justify-center'
                    )}
                >
                    <LogOut className="w-4 h-4" />
                    {open && 'Logout'}
                </Button>
            </div>
        </aside>
    );
}
