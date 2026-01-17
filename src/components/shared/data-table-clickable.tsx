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
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Column<T> {
    key: keyof T;
    label: string;
    sortable?: boolean;
    render?: (value: any, row: T) => React.ReactNode;
}

interface DataTableClickableProps<T extends { id: number | string }> {
    data: T[];
    columns: Column<T>[];
    onRowClick?: (row: T) => void;
    searchPlaceholder?: string;
    pageSize?: number;
    extraFilters?: React.ReactNode;
    emptyState?: React.ReactNode;
    emptyStateImage?: string;
}

export function DataTableClickable<T extends { id: number | string }>({
    data,
    columns,
    onRowClick,
    searchPlaceholder = 'Search...',
    pageSize = 10,
    extraFilters,
    emptyState,
    emptyStateImage,
}: DataTableClickableProps<T>) {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<{
        key: keyof T;
        direction: 'asc' | 'desc';
    } | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    // Filter data
    const filteredData = useMemo(() => {
        return data.filter((item) => {
            return columns.some((col) => {
                const value = String(item[col.key]).toLowerCase();
                return value.includes(searchTerm.toLowerCase());
            });
        });
    }, [data, searchTerm, columns]);

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
            <div className="flex flex-col gap-4">
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                    <div className="relative flex-1 w-full">
                        <Input
                            placeholder={searchPlaceholder}
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full bg-input border-border pl-4 h-10"
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                        {extraFilters}
                    </div>
                </div>
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
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedData.length > 0 ? (
                                paginatedData.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        className="border-border hover:bg-accent/50 cursor-pointer transition-colors"
                                        onClick={() => onRowClick?.(row)}
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
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className="text-center text-muted-foreground py-12"
                                    >
                                        {extraFilters || searchTerm ? (
                                            'No matching results'
                                        ) : (
                                            <div className="flex flex-col items-center justify-center">
                                                {emptyStateImage && (
                                                    <img
                                                        src={emptyStateImage}
                                                        alt="No data"
                                                        className="w-64 h-auto mb-4 opacity-80"
                                                    />
                                                )}
                                                <div className="text-lg font-medium text-muted-foreground">
                                                    {emptyState || 'No data found'}
                                                </div>
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    {searchTerm ? 'Try adjusting your search or filters' : 'Create items to see them here.'}
                                                </p>
                                            </div>
                                        )}
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
