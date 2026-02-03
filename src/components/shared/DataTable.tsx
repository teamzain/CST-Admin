import { useState, useEffect } from 'react';
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
    type ColumnFiltersState,
    type SortingState,
    type VisibilityState,
    type PaginationState,
    type RowSelectionState,
    type ColumnDef,
    type Table,
} from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    pageSize?: number;
    enableRowSelection?: boolean;
    onRowSelectionChange?: (selectedRows: TData[]) => void;
    searchColumn?: string;
    searchValue?: string;
}

export function DataTable<TData, TValue>({
    columns,
    data,
    pageSize = 10,
    enableRowSelection = false,
    onRowSelectionChange,
    searchColumn,
    searchValue = '',
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
        {}
    );
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize,
    });

    // Update column filters when search value changes
    useEffect(() => {
        if (searchColumn && searchValue) {
            setColumnFilters([{ id: searchColumn, value: searchValue }]);
        } else {
            setColumnFilters([]);
        }
    }, [searchColumn, searchValue]);

    // Add selection column if enabled
    const tableColumns = enableRowSelection
        ? [
              {
                  id: 'select',
                  header: ({ table }: { table: Table<TData> }) => (
                      <Checkbox
                          checked={table.getIsAllPageRowsSelected()}
                          onCheckedChange={(value) =>
                              table.toggleAllPageRowsSelected(!!value)
                          }
                          aria-label="Select all"
                      />
                  ),

                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  cell: ({ row }: { row: any }) => (
                      <Checkbox
                          checked={row.getIsSelected()}
                          onCheckedChange={(value) =>
                              row.toggleSelected(!!value)
                          }
                          aria-label="Select row"
                      />
                  ),
                  enableSorting: false,
                  enableHiding: false,
              },
              ...columns,
          ]
        : columns;

    const table = useReactTable({
        data,
        columns: tableColumns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        onPaginationChange: setPagination,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            pagination,
        },
    });

    // Notify parent of selection changes
    useEffect(() => {
        if (onRowSelectionChange && enableRowSelection) {
            const selectedRows = table
                .getFilteredSelectedRowModel()
                .rows.map((row) => row.original);
            onRowSelectionChange(selectedRows);
        }
    }, [rowSelection, onRowSelectionChange, table, enableRowSelection]);

    return (
        <div className="space-y-4">
            {/* Table */}
            <div className="rounded-lg border bg-white overflow-scroll">
                <table className="w-full">
                    <thead className="bg-white border-b">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        className="px-6 py-4 text-left text-sm font-semibold text-gray-900"
                                    >
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                  header.column.columnDef
                                                      .header,
                                                  header.getContext()
                                              )}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody className="divide-y">
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <tr
                                    key={row.id}
                                    className="hover:bg-gray-50 transition-colors"
                                    data-state={
                                        row.getIsSelected() && 'selected'
                                    }
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <td
                                            key={cell.id}
                                            className="px-6 py-4 text-sm text-gray-600"
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={tableColumns.length}
                                    className="h-24 text-center text-gray-500"
                                >
                                    No results found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
                <div className="text-sm text-gray-600">
                    <div className="text-sm text-gray-600">
                        Page <b>{table.getState().pagination.pageIndex + 1}</b>{' '}
                        of {table.getPageCount()}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Export types for easier usage
export type {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
} from '@tanstack/react-table';
