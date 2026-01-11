/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import type React from 'react';

import { useState, useMemo } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Column<T> {
    key: keyof T;
    label: string;
    sortable?: boolean;
    filterable?: boolean;
    render?: (value: any, row: T) => React.ReactNode;
}

interface DataTableProps<T extends { id: number | string }> {
    data: T[];
    columns: Column<T>[];
    onEdit?: (row: T) => void;
    onDelete?: (row: T) => void;
    searchPlaceholder?: string;
    pageSize?: number;
}

export function DataTable<T extends { id: number | string }>({
    data,
    columns,
    onEdit,
    onDelete,
    searchPlaceholder = 'Search...',
    pageSize = 10,
}: DataTableProps<T>) {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<{
        key: keyof T;
        direction: 'asc' | 'desc';
    } | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [filteredColumn, setFilteredColumn] = useState<string>('all');

    // Filter data
    const filteredData = useMemo(() => {
        return data.filter((item) => {
            const matchesSearch = columns.some((col) => {
                const value = String(item[col.key]).toLowerCase();
                return value.includes(searchTerm.toLowerCase());
            });

            const matchesFilter =
                filteredColumn === 'all'
                    ? true
                    : String(item[filteredColumn as keyof T]).includes('');

            return matchesSearch && matchesFilter;
        });
    }, [data, searchTerm, filteredColumn, columns]);

    // Sort data
    const sortedData = useMemo(() => {
        if (!sortConfig) return filteredData;

        const sorted = [...filteredData].sort((a, b) => {
            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];

            if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });

        return sorted;
    }, [filteredData, sortConfig]);

    // Paginate data
    const totalPages = Math.ceil(sortedData.length / pageSize);
    const paginatedData = sortedData.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const handleSort = (key: keyof T) => {
        setSortConfig((prev) => {
            if (prev?.key === key) {
                return {
                    key,
                    direction: prev.direction === 'asc' ? 'desc' : 'asc',
                };
            }
            return { key, direction: 'asc' };
        });
    };

    return (
        <div className="space-y-4">
            {/* Search and Filter Controls */}
            <div className="flex gap-4 flex-wrap">
                <Input
                    placeholder={searchPlaceholder}
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                    }}
                    className="flex-1 min-w-64 bg-input border-border"
                />
                {columns.some((col) => col.filterable) && (
                    <Select
                        value={filteredColumn}
                        onValueChange={setFilteredColumn}
                    >
                        <SelectTrigger className="w-48 bg-input border-border">
                            <SelectValue placeholder="Filter by..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            {columns
                                .filter((col) => col.filterable)
                                .map((col) => (
                                    <SelectItem
                                        key={String(col.key)}
                                        value={String(col.key)}
                                    >
                                        {col.label}
                                    </SelectItem>
                                ))}
                        </SelectContent>
                    </Select>
                )}
            </div>

            {/* Table */}
            <Card className="bg-card border-border">
                <CardContent className="pt-6">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-border hover:bg-transparent">
                                {columns.map((col) => (
                                    <TableHead
                                        key={String(col.key)}
                                        onClick={() =>
                                            col.sortable && handleSort(col.key)
                                        }
                                        className={
                                            col.sortable
                                                ? 'cursor-pointer hover:text-primary'
                                                : ''
                                        }
                                    >
                                        <div className="flex items-center gap-2">
                                            {col.label}
                                            {col.sortable &&
                                                sortConfig?.key === col.key && (
                                                    <span className="text-xs">
                                                        {sortConfig.direction ===
                                                        'asc'
                                                            ? '↑'
                                                            : '↓'}
                                                    </span>
                                                )}
                                        </div>
                                    </TableHead>
                                ))}
                                {(onEdit || onDelete) && (
                                    <TableHead className="text-right">
                                        Actions
                                    </TableHead>
                                )}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedData.length > 0 ? (
                                paginatedData.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        className="border-border"
                                    >
                                        {columns.map((col) => (
                                            <TableCell key={String(col.key)}>
                                                {col.render
                                                    ? col.render(
                                                          row[col.key],
                                                          row
                                                      )
                                                    : String(row[col.key])}
                                            </TableCell>
                                        ))}
                                        {(onEdit || onDelete) && (
                                            <TableCell className="text-right space-x-2">
                                                {onEdit && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            onEdit(row)
                                                        }
                                                    >
                                                        Edit
                                                    </Button>
                                                )}
                                                {onDelete && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-destructive"
                                                        onClick={() =>
                                                            onDelete(row)
                                                        }
                                                    >
                                                        Delete
                                                    </Button>
                                                )}
                                            </TableCell>
                                        )}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={
                                            columns.length +
                                            (onEdit || onDelete ? 1 : 0)
                                        }
                                        className="text-center text-muted-foreground py-8"
                                    >
                                        No data found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Pagination */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                    Showing{' '}
                    {paginatedData.length > 0
                        ? (currentPage - 1) * pageSize + 1
                        : 0}{' '}
                    to {Math.min(currentPage * pageSize, sortedData.length)} of{' '}
                    {sortedData.length} results
                </p>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                            setCurrentPage((p) => Math.max(1, p - 1))
                        }
                        disabled={currentPage === 1}
                        className="border-border"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <div className="flex items-center gap-1">
                        {Array.from(
                            { length: totalPages },
                            (_, i) => i + 1
                        ).map((page) => (
                            <Button
                                key={page}
                                variant={
                                    currentPage === page ? 'default' : 'outline'
                                }
                                size="sm"
                                onClick={() => setCurrentPage(page)}
                                className={
                                    currentPage === page ? '' : 'border-border'
                                }
                            >
                                {page}
                            </Button>
                        ))}
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                            setCurrentPage((p) => Math.min(totalPages, p + 1))
                        }
                        disabled={currentPage === totalPages}
                        className="border-border"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
