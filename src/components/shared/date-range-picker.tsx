import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, X } from 'lucide-react';

interface DateRangePickerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onApply: (startDate: string, endDate: string) => void;
    initialStartDate?: string;
    initialEndDate?: string;
}

type SelectionMode = 'start' | 'end';

export function DateRangePicker({
    open,
    onOpenChange,
    onApply,
    initialStartDate,
    initialEndDate,
}: DateRangePickerProps) {
    const [startDate, setStartDate] = useState<string | null>(
        initialStartDate || null
    );
    const [endDate, setEndDate] = useState<string | null>(
        initialEndDate || null
    );
    const [selectionMode, setSelectionMode] = useState<SelectionMode>('start');
    const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

    const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];

    const daysInMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const firstDayOfMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const previousMonth = () => {
        setCurrentMonth(
            new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
        );
    };

    const nextMonth = () => {
        setCurrentMonth(
            new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
        );
    };

    const generateCalendarDays = () => {
        const days = [];
        const totalDays = daysInMonth(currentMonth);
        const firstDay = firstDayOfMonth(currentMonth);

        // Adjust for Monday start (0 = Sunday, 1 = Monday)
        const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;

        // Previous month days
        const prevMonthDays = daysInMonth(
            new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
        );
        for (let i = adjustedFirstDay - 1; i >= 0; i--) {
            days.push({
                day: prevMonthDays - i,
                isCurrentMonth: false,
                date: new Date(
                    currentMonth.getFullYear(),
                    currentMonth.getMonth() - 1,
                    prevMonthDays - i
                ),
            });
        }

        // Current month days
        for (let i = 1; i <= totalDays; i++) {
            days.push({
                day: i,
                isCurrentMonth: true,
                date: new Date(
                    currentMonth.getFullYear(),
                    currentMonth.getMonth(),
                    i
                ),
            });
        }

        // Next month days to fill the grid
        const remainingDays = 42 - days.length;
        for (let i = 1; i <= remainingDays; i++) {
            days.push({
                day: i,
                isCurrentMonth: false,
                date: new Date(
                    currentMonth.getFullYear(),
                    currentMonth.getMonth() + 1,
                    i
                ),
            });
        }

        return days;
    };

    const handleDateClick = (date: Date, isCurrentMonth: boolean) => {
        if (!isCurrentMonth) return;

        const dateStr = date.toISOString().split('T')[0];

        if (selectionMode === 'start') {
            setStartDate(dateStr);
            // If end date is before new start date, reset it
            if (endDate && new Date(endDate) < new Date(dateStr)) {
                setEndDate(null);
            }
            // Auto-switch to end date selection
            setSelectionMode('end');
        } else {
            // Only allow end date if it's after start date
            if (startDate && new Date(dateStr) >= new Date(startDate)) {
                setEndDate(dateStr);
            } else if (!startDate) {
                // If no start date, set as start date instead
                setStartDate(dateStr);
                setSelectionMode('end');
            }
        }
    };

    const getDateStatus = (date: Date) => {
        const dateStr = date.toISOString().split('T')[0];
        const dateObj = new Date(dateStr);
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;

        if (dateStr === startDate) return 'start';
        if (dateStr === endDate) return 'end';
        if (start && end && dateObj > start && dateObj < end) return 'between';
        return 'none';
    };

    const isToday = (date: Date) => {
        const today = new Date();
        return (
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
        );
    };

    const handleApply = () => {
        if (startDate && endDate) {
            onApply(startDate, endDate);
            onOpenChange(false);
        }
    };

    const handleReset = () => {
        setStartDate(null);
        setEndDate(null);
        setSelectionMode('start');
        setCurrentMonth(new Date());
    };

    const handleClearDate = (type: 'start' | 'end') => {
        if (type === 'start') {
            setStartDate(null);
            setEndDate(null);
            setSelectionMode('start');
        } else {
            setEndDate(null);
            setSelectionMode('end');
        }
    };

    const calendarDays = generateCalendarDays();

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return 'Select date';
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl">
                <DialogHeader>
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-lg font-semibold">
                            Select Date Range
                        </DialogTitle>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleReset}
                            className="text-sm text-gray-600 hover:text-gray-900"
                        >
                            Reset
                        </Button>
                    </div>
                </DialogHeader>

                <div className="py-4">
                    {/* Date Selection Cards */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        {/* Start Date */}
                        <button
                            onClick={() => setSelectionMode('start')}
                            className={`
                                border-2 rounded-lg p-4 flex items-center gap-3 text-left transition-all
                                ${
                                    selectionMode === 'start'
                                        ? 'border-yellow-400 bg-yellow-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                }
                            `}
                        >
                            <div
                                className={`
                                p-2 rounded-lg
                                ${
                                    selectionMode === 'start'
                                        ? 'bg-yellow-400'
                                        : 'bg-gray-100'
                                }
                            `}
                            >
                                <CalendarIcon
                                    className={`w-5 h-5 ${
                                        selectionMode === 'start'
                                            ? 'text-black'
                                            : 'text-gray-600'
                                    }`}
                                />
                            </div>
                            <div className="flex-1">
                                <div className="text-xs text-gray-500 font-medium mb-1">
                                    Start Date
                                </div>
                                <div
                                    className={`text-sm font-semibold ${
                                        startDate
                                            ? 'text-gray-900'
                                            : 'text-gray-400'
                                    }`}
                                >
                                    {formatDate(startDate)}
                                </div>
                            </div>
                            {startDate && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleClearDate('start');
                                    }}
                                    className="p-1 hover:bg-gray-200 rounded"
                                >
                                    <X className="w-4 h-4 text-gray-500" />
                                </button>
                            )}
                        </button>

                        {/* End Date */}
                        <button
                            onClick={() => setSelectionMode('end')}
                            className={`
                                border-2 rounded-lg p-4 flex items-center gap-3 text-left transition-all
                                ${
                                    selectionMode === 'end'
                                        ? 'border-yellow-400 bg-yellow-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                }
                            `}
                        >
                            <div
                                className={`
                                p-2 rounded-lg
                                ${
                                    selectionMode === 'end'
                                        ? 'bg-yellow-400'
                                        : 'bg-gray-100'
                                }
                            `}
                            >
                                <CalendarIcon
                                    className={`w-5 h-5 ${
                                        selectionMode === 'end'
                                            ? 'text-black'
                                            : 'text-gray-600'
                                    }`}
                                />
                            </div>
                            <div className="flex-1">
                                <div className="text-xs text-gray-500 font-medium mb-1">
                                    End Date
                                </div>
                                <div
                                    className={`text-sm font-semibold ${
                                        endDate
                                            ? 'text-gray-900'
                                            : 'text-gray-400'
                                    }`}
                                >
                                    {formatDate(endDate)}
                                </div>
                            </div>
                            {endDate && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleClearDate('end');
                                    }}
                                    className="p-1 hover:bg-gray-200 rounded"
                                >
                                    <X className="w-4 h-4 text-gray-500" />
                                </button>
                            )}
                        </button>
                    </div>

                    {/* Selection Mode Indicator */}
                    <div className="mb-4 text-center">
                        <span className="text-sm text-gray-600">
                            Selecting:{' '}
                            <span className="font-semibold text-gray-900">
                                {selectionMode === 'start'
                                    ? 'Start Date'
                                    : 'End Date'}
                            </span>
                        </span>
                    </div>

                    {/* Calendar */}
                    <div className="border rounded-lg p-6 bg-white">
                        {/* Month Navigation */}
                        <div className="flex items-center justify-between mb-6">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={previousMonth}
                                className="hover:bg-gray-100"
                            >
                                <span className="text-xl">‹</span>
                            </Button>
                            <div className="text-lg font-semibold">
                                {months[currentMonth.getMonth()]}{' '}
                                {currentMonth.getFullYear()}
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={nextMonth}
                                className="hover:bg-gray-100"
                            >
                                <span className="text-xl">›</span>
                            </Button>
                        </div>

                        {/* Day Headers */}
                        <div className="grid grid-cols-7 gap-2 mb-2">
                            {[
                                'Mon',
                                'Tue',
                                'Wed',
                                'Thu',
                                'Fri',
                                'Sat',
                                'Sun',
                            ].map((day) => (
                                <div
                                    key={day}
                                    className="text-center text-xs font-semibold text-gray-500 py-2"
                                >
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Calendar Grid */}
                        <div className="grid grid-cols-7 gap-2">
                            {calendarDays.map((item, index) => {
                                const status = getDateStatus(item.date);
                                const today = isToday(item.date);

                                return (
                                    <button
                                        key={index}
                                        onClick={() =>
                                            handleDateClick(
                                                item.date,
                                                item.isCurrentMonth
                                            )
                                        }
                                        className={`
                                            aspect-square flex items-center justify-center rounded-lg text-sm font-medium transition-all
                                            ${
                                                !item.isCurrentMonth
                                                    ? 'text-gray-300 cursor-default'
                                                    : 'text-gray-900 hover:bg-gray-100 cursor-pointer'
                                            }
                                            ${
                                                status === 'start'
                                                    ? 'bg-yellow-400 text-black font-bold hover:bg-yellow-500 rounded-r-none'
                                                    : ''
                                            }
                                            ${
                                                status === 'end'
                                                    ? 'bg-yellow-400 text-black font-bold hover:bg-yellow-500 rounded-l-none'
                                                    : ''
                                            }
                                            ${
                                                status === 'between'
                                                    ? 'bg-yellow-100 rounded-none'
                                                    : ''
                                            }
                                            ${
                                                today &&
                                                status === 'none' &&
                                                item.isCurrentMonth
                                                    ? 'ring-2 ring-blue-500 ring-inset'
                                                    : ''
                                            }
                                        `}
                                        disabled={!item.isCurrentMonth}
                                    >
                                        {item.day}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Quick Selection Options */}
                    <div className="mt-4 flex gap-2 flex-wrap">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                const today = new Date()
                                    .toISOString()
                                    .split('T')[0];
                                setStartDate(today);
                                setEndDate(today);
                                setSelectionMode('end');
                            }}
                            className="text-xs"
                        >
                            Today
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                const today = new Date();
                                const lastWeek = new Date(
                                    today.getTime() - 7 * 24 * 60 * 60 * 1000
                                );
                                setStartDate(
                                    lastWeek.toISOString().split('T')[0]
                                );
                                setEndDate(today.toISOString().split('T')[0]);
                                setSelectionMode('end');
                            }}
                            className="text-xs"
                        >
                            Last 7 Days
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                const today = new Date();
                                const lastMonth = new Date(
                                    today.getTime() - 30 * 24 * 60 * 60 * 1000
                                );
                                setStartDate(
                                    lastMonth.toISOString().split('T')[0]
                                );
                                setEndDate(today.toISOString().split('T')[0]);
                                setSelectionMode('end');
                            }}
                            className="text-xs"
                        >
                            Last 30 Days
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                const today = new Date();
                                const firstDay = new Date(
                                    today.getFullYear(),
                                    today.getMonth(),
                                    1
                                );
                                setStartDate(
                                    firstDay.toISOString().split('T')[0]
                                );
                                setEndDate(today.toISOString().split('T')[0]);
                                setSelectionMode('end');
                            }}
                            className="text-xs"
                        >
                            This Month
                        </Button>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-6 flex justify-end gap-3">
                        <Button
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleApply}
                            disabled={!startDate || !endDate}
                            className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-8 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Apply
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
