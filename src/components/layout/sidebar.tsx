'use client';

import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
    BarChart3,
    BookOpen,
    Calendar,
    FileText,
    LogOut,
    Settings,
    ChevronDown,
    Menu,
    MapPin,
    UserCog,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import clsx from 'clsx';

interface SidebarProps {
    open: boolean;
    toggleSidebar: () => void;
}

export function Sidebar({ open, toggleSidebar }: SidebarProps) {
    const { pathname } = useLocation();
    const [openMenu, setOpenMenu] = useState<string | null>(null);

    const toggleMenu = (label: string) => {
        setOpenMenu(openMenu === label ? null : label);
    };

    const menuItems = [
        { href: '/', icon: BarChart3, label: 'Dashboard' },
        {
            href: '/states',
            icon: MapPin,
            label: 'States',
            subItems: [
                { href: '/states', label: 'All States' },
                { href: '/states/create', label: 'Add State' },
            ],
        },
        {
            href: '/courses',
            icon: BookOpen,
            label: 'Courses',
            subItems: [
                { href: '/courses', label: 'All Courses' },
                { href: '/quizzes', label: 'All Quizzes' },
                { href: '/lessons', label: 'All Lessons' },
                { href: '/sessions', label: 'All Sessions' },
            ],
        },
        {
            href: '/user-management',
            icon: UserCog,
            label: 'User Management',
            subItems: [
                {
                    href: '/students',
                    label: 'Students',
                },
                {
                    href: '/instructors',
                    label: 'Instructors',
                },
                {
                    href: '/employers',
                    label: 'Employers',
                },
            ],
        },
        {
            href: '/scheduling',
            icon: Calendar,
            label: 'Scheduling',
            subItems: [
                { href: '/scheduling/range-sessions', label: 'Range Sessions' },
                { href: '/scheduling/locations', label: 'Locations' },
                { href: '/scheduling/wait-list', label: 'Wait list' },
            ],
        },
        { href: '/reports', icon: FileText, label: 'Reports' },
    ];

    // Helper function to check if a path is active (including nested routes)
    const isPathActive = (itemHref: string, currentPath: string) => {
        // Exact match for root dashboard
        if (itemHref === '/' && currentPath === '/') return true;
        // For other routes, check if current path starts with the item href
        if (itemHref !== '/' && currentPath.startsWith(itemHref)) return true;
        return false;
    };

    // Helper function to check if any subitem is active
    const isSubItemActive = (
        subItems: { href: string }[] | undefined,
        currentPath: string
    ) => {
        if (!subItems) return false;
        return subItems.some((sub) => isPathActive(sub.href, currentPath));
    };

    // Auto-open menu if a nested route is active
    useEffect(() => {
        const activeMenu = menuItems.find((item) => {
            if (item.subItems) {
                // Check if any subitem path matches current pathname
                return item.subItems.some((sub) =>
                    isPathActive(sub.href, pathname)
                );
            }
            return false;
        });

        if (activeMenu && open) {
            setOpenMenu(activeMenu.label);
        }
    }, [pathname, open]);

    return (
        <aside
            className={clsx(
                'h-screen fixed left-0 top-0 flex flex-col border-r border-sidebar-border bg-[#2C2C2C] text-sidebar-foreground transition-all duration-300 z-50',
                open ? 'w-64' : 'w-20'
            )}
        >
            {/* Header */}
            <div className="p-5 border-b border-sidebar-border h-17 flex items-center">
                <div
                    className={clsx(
                        'flex items-center w-full',
                        open ? 'justify-between' : 'justify-center'
                    )}
                >
                    {open && (
                        <div className="flex items-center gap-2">
                            <div className="w-20 h-14 rounded-lg flex items-center justify-center">
                                <img
                                    src="/logo.png"
                                    alt="Logo"
                                    className="w-full h-full object-contain"
                                    loading="eager"
                                />
                            </div>
                        </div>
                    )}
                    <Button
                        onClick={toggleSidebar}
                        className={clsx(
                            'text-sidebar-foreground hover:text-primary transition-colors hover:bg-transparent',
                            open && 'mr-1'
                        )}
                        variant={'ghost'}
                    >
                        <Menu className="w-6 h-6" />
                    </Button>
                </div>
            </div>

            {/* Menu */}
            <nav className="flex-1 p-4 space-y-3 overflow-y-auto scrollbar-thin scrollbar-thumb-sidebar-border">
                {menuItems.map((item) => {
                    const isActive =
                        isPathActive(item.href, pathname) ||
                        isSubItemActive(item.subItems, pathname);
                    const isOpen = openMenu === item.label;

                    if (item.subItems) {
                        return (
                            <div key={item.label}>
                                <Button
                                    variant={isActive ? 'default' : 'ghost'}
                                    className={clsx(
                                        'w-full gap-3 my-1 justify-between border-b border-transparent hover:border-sidebar-border',
                                        !isActive &&
                                            'hover:bg-[#1F1E1E] hover:text-sidebar-foreground',
                                        !open && 'justify-center px-2'
                                    )}
                                    onClick={() => toggleMenu(item.label)}
                                >
                                    <div className="flex items-center gap-3">
                                        <item.icon className="w-4 h-4 shrink-0" />
                                        {open && <span>{item.label}</span>}
                                    </div>
                                    {open && (
                                        <ChevronDown
                                            className={clsx(
                                                'w-4 h-4 transition-transform duration-200',
                                                isOpen && 'rotate-180'
                                            )}
                                        />
                                    )}
                                </Button>

                                {open && isOpen && (
                                    <div className="ml-4 pl-4 border-l border-sidebar-border space-y-1 mt-1">
                                        {item.subItems.map((subItem) => {
                                            const isSubActive = isPathActive(
                                                subItem.href,
                                                pathname
                                            );

                                            return (
                                                <Link
                                                    key={subItem.href}
                                                    to={subItem.href}
                                                >
                                                    <Button
                                                        variant="ghost"
                                                        className={clsx(
                                                            'w-full justify-start h-8 text-sm gap-2 my-1 hover:bg-[#1F1E1E] hover:text-sidebar-foreground',
                                                            isSubActive
                                                                ? 'text-primary font-medium'
                                                                : 'text-sidebar-foreground/70'
                                                        )}
                                                    >
                                                        <span>
                                                            {subItem.label}
                                                        </span>
                                                    </Button>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    }

                    return (
                        <Link key={item.href} to={item.href}>
                            <Button
                                variant={isActive ? 'default' : 'ghost'}
                                className={clsx(
                                    'w-full gap-3 my-1/2 border-b border-transparent hover:border-sidebar-border',
                                    !isActive &&
                                        'hover:bg-[#1F1E1E] hover:text-sidebar-foreground',
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
                            'w-full gap-3 hover:bg-[#1F1E1E] hover:text-sidebar-foreground',
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
                        'w-full gap-3 text-destructive hover:bg-[#1F1E1E] hover:text-destructive',
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
