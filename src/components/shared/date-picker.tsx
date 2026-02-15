import { useState, useEffect } from 'react';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock } from 'lucide-react';

// ─── Core calendar popover ─────────────────────────────────────────────────

interface DatePickerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onApply: (date: string) => void;
    initialDate?: string;
    title?: string;
    showTime?: boolean;
    triggerRef?: React.RefObject<HTMLButtonElement | null>;
}

export function DatePicker({
    open,
    onOpenChange,
    onApply,
    initialDate,
    showTime = false,
}: DatePickerProps) {
    const [selectedDate, setSelectedDate] = useState<string | null>(initialDate?.split('T')[0] || null);
    const [hours, setHours] = useState('12');
    const [minutes, setMinutes] = useState('00');
    const [period, setPeriod] = useState<'AM' | 'PM'>('AM');
    const [currentMonth, setCurrentMonth] = useState<Date>(
        initialDate ? new Date(initialDate) : new Date()
    );

    useEffect(() => {
        if (open) {
            const datePart = initialDate?.split('T')[0] || null;
            setSelectedDate(datePart);
            setCurrentMonth(initialDate ? new Date(initialDate) : new Date());

            // Parse time from initialDate (could be "YYYY-MM-DDTHH:mm" or ISO)
            if (showTime && initialDate) {
                const timePart = initialDate.includes('T') ? initialDate.split('T')[1] : null;
                if (timePart) {
                    const [h, m] = timePart.split(':').map(Number);
                    const hr = h % 12 || 12;
                    setHours(String(hr).padStart(2, '0'));
                    setMinutes(String(m || 0).padStart(2, '0'));
                    setPeriod(h >= 12 ? 'PM' : 'AM');
                }
            }
        }
    }, [open, initialDate, showTime]);

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
        const days: { day: number; isCurrentMonth: boolean; date: Date }[] = [];
        const totalDays = daysInMonth(currentMonth);
        const firstDay = firstDayOfMonth(currentMonth);
        // Monday-first: shift Sun(0) to 6, Mon(1) to 0, etc.
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

    const handleDone = () => {
        if (selectedDate) {
            if (showTime) {
                let h = parseInt(hours) || 12;
                const m = parseInt(minutes) || 0;
                if (period === 'AM' && h === 12) h = 0;
                if (period === 'PM' && h !== 12) h += 12;
                const timeStr = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
                onApply(`${selectedDate}T${timeStr}`);
            } else {
                onApply(selectedDate);
            }
            onOpenChange(false);
        }
    };

    const handleClear = () => {
        setSelectedDate(null);
        setHours('12');
        setMinutes('00');
        setPeriod('AM');
    };

    return (
        <div className="p-4 pb-3">
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-3">
                <button
                    type="button"
                    onClick={previousMonth}
                    className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <ChevronLeft className="w-4 h-4 text-gray-600" />
                </button>
                <span className="text-sm font-semibold text-gray-900">
                    {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </span>
                <button
                    type="button"
                    onClick={nextMonth}
                    className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <ChevronRight className="w-4 h-4 text-gray-600" />
                </button>
            </div>

            {/* Day Headers */}
            <div className="grid grid-cols-7 mb-1">
                {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((day) => (
                    <div key={day} className="text-center text-xs font-medium text-gray-400 py-1">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7">
                {generateCalendarDays().map((item, index) => {
                    const selected = isSelected(item.date);
                    const today = isToday(item.date) && item.isCurrentMonth;
                    return (
                        <button
                            key={index}
                            type="button"
                            onClick={() => handleDateClick(item.date, item.isCurrentMonth)}
                            disabled={!item.isCurrentMonth}
                            className={`
                                w-8 h-8 mx-auto flex items-center justify-center rounded-full text-sm transition-all
                                ${!item.isCurrentMonth
                                    ? 'text-gray-300 cursor-default'
                                    : 'text-gray-700 hover:bg-gray-100 cursor-pointer'}
                                ${selected
                                    ? 'bg-yellow-400 text-black font-bold hover:bg-yellow-500 shadow-sm'
                                    : ''}
                                ${today && !selected
                                    ? 'font-bold text-yellow-600'
                                    : ''}
                            `}
                        >
                            {item.day}
                        </button>
                    );
                })}
            </div>

            {/* Time Picker */}
            {showTime && (
                <>
                    <div className="border-t border-gray-200 mt-3 pt-3">
                        <div className="flex items-center gap-2 justify-center">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1">
                                <input
                                    type="text"
                                    value={hours}
                                    onChange={(e) => {
                                        const v = e.target.value.replace(/\D/g, '').slice(0, 2);
                                        if (Number(v) <= 12) setHours(v);
                                    }}
                                    onBlur={() => setHours(String(parseInt(hours) || 12).padStart(2, '0'))}
                                    className="w-7 text-center text-sm font-medium bg-transparent outline-none"
                                    maxLength={2}
                                />
                                <span className="text-sm font-medium text-gray-400">:</span>
                                <input
                                    type="text"
                                    value={minutes}
                                    onChange={(e) => {
                                        const v = e.target.value.replace(/\D/g, '').slice(0, 2);
                                        if (Number(v) <= 59) setMinutes(v);
                                    }}
                                    onBlur={() => setMinutes(String(parseInt(minutes) || 0).padStart(2, '0'))}
                                    className="w-7 text-center text-sm font-medium bg-transparent outline-none"
                                    maxLength={2}
                                />
                            </div>
                            <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                                <button
                                    type="button"
                                    onClick={() => setPeriod('AM')}
                                    className={`px-2.5 py-1 text-xs font-medium transition-colors ${
                                        period === 'AM'
                                            ? 'bg-yellow-400 text-black'
                                            : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                    }`}
                                >
                                    AM
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setPeriod('PM')}
                                    className={`px-2.5 py-1 text-xs font-medium transition-colors ${
                                        period === 'PM'
                                            ? 'bg-yellow-400 text-black'
                                            : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                    }`}
                                >
                                    PM
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Divider */}
            <div className="border-t border-gray-200 mt-3" />

            {/* Footer Buttons */}
            <div className="flex pt-3 gap-3">
                <button
                    type="button"
                    onClick={handleClear}
                    className="flex-1 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    Clear
                </button>
                <button
                    type="button"
                    onClick={handleDone}
                    disabled={!selectedDate}
                    className="flex-1 py-2 text-sm font-semibold text-black bg-yellow-400 rounded-lg hover:bg-yellow-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    Done
                </button>
            </div>
        </div>
    );
}

// ─── DatePickerInput — date only, dropdown style ───────────────────────────

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
    disabled = false,
    className = '',
}: DatePickerInputProps) {
    const [open, setOpen] = useState(false);

    const displayValue = value
        ? new Date(value + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        : placeholder;

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <button
                    type="button"
                    disabled={disabled}
                    className={`flex h-9 w-full items-center gap-2 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
                >
                    <CalendarIcon className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className={value ? 'text-foreground' : 'text-muted-foreground'}>{displayValue}</span>
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-[280px] p-0 z-[200]" align="start">
                <DatePicker
                    open={open}
                    onOpenChange={setOpen}
                    onApply={onChange}
                    initialDate={value}
                />
            </PopoverContent>
        </Popover>
    );
}

// ─── DateTimePickerInput — date + time, dropdown style ─────────────────────

interface DateTimePickerInputProps {
    value?: string;
    onChange: (datetime: string) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
}

export function DateTimePickerInput({
    value,
    onChange,
    placeholder = 'Select date & time',
    disabled = false,
    className = '',
}: DateTimePickerInputProps) {
    const [open, setOpen] = useState(false);

    const formatDisplay = () => {
        if (!value) return placeholder;
        try {
            const d = new Date(value);
            if (isNaN(d.getTime())) return placeholder;
            return d.toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
            });
        } catch {
            return placeholder;
        }
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <button
                    type="button"
                    disabled={disabled}
                    className={`flex h-9 w-full items-center gap-2 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
                >
                    <CalendarIcon className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className={value ? 'text-foreground' : 'text-muted-foreground'}>{formatDisplay()}</span>
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-[280px] p-0 z-[200]" align="start">
                <DatePicker
                    open={open}
                    onOpenChange={setOpen}
                    onApply={onChange}
                    initialDate={value}
                    showTime
                />
            </PopoverContent>
        </Popover>
    );
}
