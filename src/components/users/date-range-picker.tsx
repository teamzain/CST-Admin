import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon } from 'lucide-react';

interface DateRangePickerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onApply: (startDate: string, endDate: string) => void;
}

export function DateRangePicker({
    open,
    onOpenChange,
    onApply,
}: DateRangePickerProps) {
    const [selectedDate, setSelectedDate] = useState<string>(
        new Date().toISOString().split('T')[0]
    );
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

        // Previous month days
        const prevMonthDays = daysInMonth(
            new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
        );
        for (let i = firstDay - 1; i >= 0; i--) {
            days.push({
                day: prevMonthDays - i,
                isCurrentMonth: false,
            });
        }

        // Current month days
        for (let i = 1; i <= totalDays; i++) {
            days.push({
                day: i,
                isCurrentMonth: true,
            });
        }

        // Next month days to fill the grid
        const remainingDays = 42 - days.length;
        for (let i = 1; i <= remainingDays; i++) {
            days.push({
                day: i,
                isCurrentMonth: false,
            });
        }

        return days;
    };

    const handleDateClick = (day: number, isCurrentMonth: boolean) => {
        if (!isCurrentMonth) return;

        const date = new Date(
            currentMonth.getFullYear(),
            currentMonth.getMonth(),
            day
        );
        setSelectedDate(date.toISOString().split('T')[0]);
    };

    const isSelectedDate = (day: number) => {
        const dateStr = new Date(
            currentMonth.getFullYear(),
            currentMonth.getMonth(),
            day
        )
            .toISOString()
            .split('T')[0];
        return dateStr === selectedDate;
    };

    const handleApply = () => {
        onApply(selectedDate, selectedDate);
        onOpenChange(false);
    };

    const handleReset = () => {
        const today = new Date().toISOString().split('T')[0];
        setSelectedDate(today);
        setCurrentMonth(new Date());
    };

    const calendarDays = generateCalendarDays();
    const today = new Date().getDate();

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-lg font-semibold">
                            Filter by Registration Date
                        </DialogTitle>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleReset}
                            className="text-sm"
                        >
                            Reset
                        </Button>
                    </div>
                </DialogHeader>

                <div className="py-4">
                    {/* Date Display */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="border rounded-lg p-3 flex items-center gap-2">
                            <CalendarIcon className="w-5 h-5 text-gray-400" />
                            <div>
                                <div className="text-xs text-gray-500">
                                    From Date
                                </div>
                                <div className="text-sm font-medium">
                                    {new Date(selectedDate).toLocaleDateString(
                                        'en-US',
                                        {
                                            month: 'long',
                                            day: 'numeric',
                                            year: 'numeric',
                                        }
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="border rounded-lg p-3 flex items-center gap-2">
                            <CalendarIcon className="w-5 h-5 text-gray-400" />
                            <div>
                                <div className="text-xs text-gray-500">
                                    From Date
                                </div>
                                <div className="text-sm font-medium">
                                    {new Date(selectedDate).toLocaleDateString(
                                        'en-US',
                                        {
                                            month: 'long',
                                            day: 'numeric',
                                            year: 'numeric',
                                        }
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Calendar */}
                    <div className="border rounded-lg p-4">
                        {/* Month Navigation */}
                        <div className="flex items-center justify-between mb-4">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={previousMonth}
                            >
                                ‹
                            </Button>
                            <div className="text-lg font-semibold">
                                {months[currentMonth.getMonth()]}{' '}
                                {currentMonth.getFullYear()}
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={nextMonth}
                            >
                                ›
                            </Button>
                        </div>

                        {/* Day Headers */}
                        <div className="grid grid-cols-7 gap-2 mb-2">
                            {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(
                                (day) => (
                                    <div
                                        key={day}
                                        className="text-center text-sm font-medium text-gray-500 py-2"
                                    >
                                        {day}
                                    </div>
                                )
                            )}
                        </div>

                        {/* Calendar Grid */}
                        <div className="grid grid-cols-7 gap-2">
                            {calendarDays.map((item, index) => (
                                <button
                                    key={index}
                                    onClick={() =>
                                        handleDateClick(
                                            item.day,
                                            item.isCurrentMonth
                                        )
                                    }
                                    className={`
                                        aspect-square flex items-center justify-center rounded-lg text-sm
                                        ${
                                            !item.isCurrentMonth
                                                ? 'text-gray-300'
                                                : 'text-gray-900 hover:bg-gray-100'
                                        }
                                        ${
                                            item.isCurrentMonth &&
                                            isSelectedDate(item.day)
                                                ? 'bg-yellow-400 text-black font-semibold hover:bg-yellow-500'
                                                : ''
                                        }
                                        ${
                                            item.isCurrentMonth &&
                                            item.day === today &&
                                            currentMonth.getMonth() ===
                                                new Date().getMonth() &&
                                            !isSelectedDate(item.day)
                                                ? 'border-2 border-gray-300'
                                                : ''
                                        }
                                    `}
                                    disabled={!item.isCurrentMonth}
                                >
                                    {item.day}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Action Button */}
                    <div className="mt-6 flex justify-end">
                        <Button
                            onClick={handleApply}
                            className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-8"
                        >
                            Done
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
