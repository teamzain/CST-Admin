import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, X } from 'lucide-react';

interface DatePickerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onApply: (date: string) => void;
    initialDate?: string;
    title?: string;
}

export function DatePicker({
    open,
    onOpenChange,
    onApply,
    initialDate,
    title = 'Select Date',
}: DatePickerProps) {
    const [selectedDate, setSelectedDate] = useState<string | null>(initialDate || null);
    const [currentMonth, setCurrentMonth] = useState<Date>(
        initialDate ? new Date(initialDate) : new Date()
    );

    useEffect(() => {
        if (open) {
            setSelectedDate(initialDate || null);
            setCurrentMonth(initialDate ? new Date(initialDate) : new Date());
        }
    }, [open, initialDate]);

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December',
    ];

    const daysInMonth = (date: Date) =>
        new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

    const firstDayOfMonth = (date: Date) =>
        new Date(date.getFullYear(), date.getMonth(), 1).getDay();

    const previousMonth = () =>
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));

    const nextMonth = () =>
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));

    const generateCalendarDays = () => {
        const days = [];
        const totalDays = daysInMonth(currentMonth);
        const firstDay = firstDayOfMonth(currentMonth);
        const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;

        const prevMonthDays = daysInMonth(
            new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
        );
        for (let i = adjustedFirstDay - 1; i >= 0; i--) {
            days.push({
                day: prevMonthDays - i,
                isCurrentMonth: false,
                date: new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, prevMonthDays - i),
            });
        }

        for (let i = 1; i <= totalDays; i++) {
            days.push({
                day: i,
                isCurrentMonth: true,
                date: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i),
            });
        }

        const remainingDays = 42 - days.length;
        for (let i = 1; i <= remainingDays; i++) {
            days.push({
                day: i,
                isCurrentMonth: false,
                date: new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, i),
            });
        }

        return days;
    };

    const handleDateClick = (date: Date, isCurrentMonth: boolean) => {
        if (!isCurrentMonth) return;
        setSelectedDate(date.toISOString().split('T')[0]);
    };

    const isSelected = (date: Date) =>
        date.toISOString().split('T')[0] === selectedDate;

    const isToday = (date: Date) => {
        const today = new Date();
        return (
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
        );
    };

    const handleApply = () => {
        if (selectedDate) {
            onApply(selectedDate);
            onOpenChange(false);
        }
    };

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return 'Select date';
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric',
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
                </DialogHeader>

                <div className="py-4">
                    {/* Selected Date Card */}
                    <div className="mb-6">
                        <div className="border-2 border-yellow-400 bg-yellow-50 rounded-lg p-4 flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-yellow-400">
                                <CalendarIcon className="w-5 h-5 text-black" />
                            </div>
                            <div className="flex-1">
                                <div className="text-xs text-gray-500 font-medium mb-1">Selected Date</div>
                                <div className={`text-sm font-semibold ${selectedDate ? 'text-gray-900' : 'text-gray-400'}`}>
                                    {formatDate(selectedDate)}
                                </div>
                            </div>
                            {selectedDate && (
                                <button
                                    onClick={() => setSelectedDate(null)}
                                    className="p-1 hover:bg-gray-200 rounded"
                                >
                                    <X className="w-4 h-4 text-gray-500" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Calendar */}
                    <div className="border rounded-lg p-6 bg-white">
                        <div className="flex items-center justify-between mb-6">
                            <Button variant="ghost" size="sm" onClick={previousMonth} className="hover:bg-gray-100">
                                <span className="text-xl">‹</span>
                            </Button>
                            <div className="text-lg font-semibold">
                                {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                            </div>
                            <Button variant="ghost" size="sm" onClick={nextMonth} className="hover:bg-gray-100">
                                <span className="text-xl">›</span>
                            </Button>
                        </div>

                        <div className="grid grid-cols-7 gap-2 mb-2">
                            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                                <div key={day} className="text-center text-xs font-semibold text-gray-500 py-2">
                                    {day}
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-7 gap-2">
                            {generateCalendarDays().map((item, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleDateClick(item.date, item.isCurrentMonth)}
                                    className={`
                                        aspect-square flex items-center justify-center rounded-lg text-sm font-medium transition-all
                                        ${!item.isCurrentMonth ? 'text-gray-300 cursor-default' : 'text-gray-900 hover:bg-gray-100 cursor-pointer'}
                                        ${isSelected(item.date) ? 'bg-yellow-400 text-black font-bold hover:bg-yellow-500' : ''}
                                        ${isToday(item.date) && !isSelected(item.date) && item.isCurrentMonth ? 'ring-2 ring-blue-500 ring-inset' : ''}
                                    `}
                                    disabled={!item.isCurrentMonth}
                                >
                                    {item.day}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-6 flex justify-end gap-3">
                        <Button variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleApply}
                            disabled={!selectedDate}
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

/**
 * Inline date trigger button — shows current value and opens the DatePicker dialog.
 * Drop-in replacement for <Input type="date" />.
 */
interface DatePickerInputProps {
    value?: string;
    onChange: (date: string) => void;
    placeholder?: string;
    title?: string;
    disabled?: boolean;
    className?: string;
}

export function DatePickerInput({
    value,
    onChange,
    placeholder = 'Select date',
    title = 'Select Date',
    disabled = false,
    className = '',
}: DatePickerInputProps) {
    const [open, setOpen] = useState(false);

    const displayValue = value
        ? new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        : placeholder;

    return (
        <>
            <button
                type="button"
                onClick={() => !disabled && setOpen(true)}
                disabled={disabled}
                className={`flex h-9 w-full items-center gap-2 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
            >
                <CalendarIcon className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className={value ? 'text-foreground' : 'text-muted-foreground'}>{displayValue}</span>
            </button>
            <DatePicker
                open={open}
                onOpenChange={setOpen}
                onApply={onChange}
                initialDate={value}
                title={title}
            />
        </>
    );
}
