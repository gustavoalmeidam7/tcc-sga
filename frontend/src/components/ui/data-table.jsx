import { useState, Fragment, memo } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  getExpandedRowModel,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const MemoizedDesktopRow = memo(
  ({ row, renderExpandedRow, columns, index }) => (
    <Fragment>
      <TableRow
        data-state={row.getIsSelected() && "selected"}
        className={`
        transition-all duration-200 ease-in-out
        hover:bg-accent/80 hover:shadow-md hover:-translate-y-0.5
        ${index % 2 === 0 ? "bg-background" : "bg-muted/30"}
      `}
      >
        {renderExpandedRow && (
          <TableCell className="w-12 py-4 px-4 text-sm rounded-l-md">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => row.toggleExpanded()}
              className="h-8 w-8 p-0"
              aria-label={
                row.getIsExpanded() ? "Ocultar detalhes" : "Ver detalhes"
              }
            >
              {row.getIsExpanded() ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          </TableCell>
        )}
        {row.getVisibleCells().map((cell, cellIndex) => {
          const isFirst = cellIndex === 0 && !renderExpandedRow;
          const isLast = cellIndex === row.getVisibleCells().length - 1;
          return (
            <TableCell
              key={cell.id}
              className={`py-4 px-4 text-sm ${isFirst ? "rounded-l-md" : ""} ${
                isLast ? "rounded-r-md" : ""
              }`}
            >
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </TableCell>
          );
        })}
      </TableRow>
      {row.getIsExpanded() && renderExpandedRow && (
        <TableRow>
          <TableCell
            colSpan={columns.length + (renderExpandedRow ? 1 : 0)}
            className="p-0 rounded-md overflow-hidden"
          >
            <div className="px-6 py-4 bg-muted/50 border-t border-b">
              {renderExpandedRow(row.original)}
            </div>
          </TableCell>
        </TableRow>
      )}
    </Fragment>
  )
);

const MemoizedMobileCard = memo(({ row, renderExpandedRow, index }) => (
  <Card
    className={`
      transition-all duration-200 ease-in-out
      hover:shadow-md hover:-translate-y-0.5
      overflow-hidden
      ${index % 2 === 0 ? "bg-background" : "bg-muted/30"}
    `}
  >
    <CardContent className="p-4 sm:p-4 space-y-3 sm:space-y-3">
      {renderExpandedRow && (
        <div className="flex justify-end pb-3 border-b">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => row.toggleExpanded()}
            className="h-8 text-xs px-3"
            aria-expanded={row.getIsExpanded()}
          >
            {row.getIsExpanded() ? (
              <>
                <ChevronDown className="h-4 w-4 mr-1.5" aria-hidden="true" />
                Ocultar detalhes
              </>
            ) : (
              <>
                <ChevronRight className="h-4 w-4 mr-1.5" aria-hidden="true" />
                Ver detalhes
              </>
            )}
          </Button>
        </div>
      )}
      <div className="space-y-2.5">
        {row.getVisibleCells().map((cell) => {
          const header = cell.column.columnDef.header;
          const metaHeaderText = cell.column.columnDef.meta?.headerText;
          const headerText =
            metaHeaderText ||
            (typeof header === "string" ? header : cell.column.id);

          if (cell.column.id === "actions") {
            return (
              <div key={cell.id} className="pt-2 border-t flex justify-end">
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </div>
            );
          }

          return (
            <div
              key={cell.id}
              className="grid grid-cols-[minmax(65px,auto)_1fr] gap-6 sm:gap-8 items-start min-w-0"
            >
              <span className="text-xs font-semibold text-foreground whitespace-nowrap">
                {headerText}
              </span>
              <span className="text-sm text-foreground font-medium break-words overflow-hidden">
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </span>
            </div>
          );
        })}
      </div>
      {row.getIsExpanded() && renderExpandedRow && (
        <div className="pt-3 mt-3 border-t">
          {renderExpandedRow(row.original)}
        </div>
      )}
    </CardContent>
  </Card>
));

export function DataTable({
  columns,
  data,
  filterColumn,
  filterPlaceholder,
  renderExpandedRow,
  isLoading = false,
}) {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [expanded, setExpanded] = useState({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    onExpandedChange: setExpanded,
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
    state: {
      sorting,
      columnFilters,
      expanded,
    },
  });

  return (
    <div className="flex flex-col" style={{ minHeight: "500px" }}>
      {filterColumn && (
        <div className="flex items-center py-3 sm:py-4">
          <Input
            placeholder={filterPlaceholder || "Filtrar..."}
            value={table.getColumn(filterColumn)?.getFilterValue() ?? ""}
            onChange={(event) =>
              table.getColumn(filterColumn)?.setFilterValue(event.target.value)
            }
            className="w-full sm:max-w-sm text-xs sm:text-sm h-8 sm:h-10"
          />
        </div>
      )}
      {isLoading ? (
        <div className="hidden md:block rounded-lg border border-border/40 shadow-sm flex-1 bg-card px-4 pt-4">
          <Table
            className="border-separate w-full"
            style={{ borderSpacing: "0 0.4rem" }}
          >
            <TableHeader>
              <TableRow className="bg-muted">
                {columns.map((_, index) => (
                  <TableHead
                    key={index}
                    className={`font-bold py-3 ${
                      index === 0 ? "rounded-l-md" : ""
                    } ${index === columns.length - 1 ? "rounded-r-md" : ""}`}
                  >
                    <Skeleton className="h-5 w-24" />
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, rowIndex) => (
                <TableRow key={rowIndex}>
                  {columns.map((_, colIndex) => (
                    <TableCell
                      key={colIndex}
                      className={`py-4 ${
                        colIndex === 0 ? "rounded-l-md" : ""
                      } ${
                        colIndex === columns.length - 1 ? "rounded-r-md" : ""
                      }`}
                    >
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="hidden md:block rounded-lg border border-border/40 shadow-sm flex-1 bg-card px-4 pt-4">
          <Table
            className="border-separate w-full"
            style={{ borderSpacing: "0 0.4rem" }}
          >
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="bg-muted">
                  {headerGroup.headers.map((header, index) => {
                    const isFirst = index === 0;
                    const isLast = index === headerGroup.headers.length - 1;
                    return (
                      <TableHead
                        key={header.id}
                        className={`font-bold py-3 text-base ${
                          isFirst ? "rounded-l-md" : ""
                        } ${isLast ? "rounded-r-md" : ""}`}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                <>
                  {table.getRowModel().rows.map((row, index) => (
                    <MemoizedDesktopRow
                      key={row.id}
                      row={row}
                      renderExpandedRow={renderExpandedRow}
                      columns={columns}
                      index={index}
                    />
                  ))}
                  {Array.from({
                    length: Math.max(
                      0,
                      table.getState().pagination.pageSize -
                        table.getRowModel().rows.length
                    ),
                  }).map((_, i) => (
                    <TableRow key={`padding-${i}`} style={{ height: "53px" }}>
                      <TableCell
                        colSpan={columns.length + (renderExpandedRow ? 1 : 0)}
                      >
                        &nbsp;
                      </TableCell>
                    </TableRow>
                  ))}
                </>
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + (renderExpandedRow ? 1 : 0)}
                    className="h-24 text-center"
                  >
                    Nenhum resultado encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {isLoading ? (
        <div className="md:hidden space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index}>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
                <div className="flex gap-2 pt-2">
                  <Skeleton className="h-8 flex-1" />
                  <Skeleton className="h-8 w-20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="md:hidden flex-1 space-y-2 sm:space-y-3">
          {table.getRowModel().rows?.length ? (
            table
              .getRowModel()
              .rows.map((row, index) => (
                <MemoizedMobileCard
                  key={row.id}
                  row={row}
                  renderExpandedRow={renderExpandedRow}
                  index={index}
                />
              ))
          ) : (
            <Card>
              <CardContent className="p-4 sm:p-6 text-center">
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Nenhum resultado encontrado.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
      <div className="flex flex-row items-center justify-between gap-2 sm:gap-4 py-3 sm:py-4 flex-wrap">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <p className="text-[10px] sm:text-sm text-muted-foreground whitespace-nowrap">
            <span className="sm:hidden">Linhas:</span>
            <span className="hidden sm:inline">Linhas por página:</span>
          </p>
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
            className="h-7 sm:h-8 w-[50px] sm:w-[70px] rounded-md border border-input bg-background px-1 sm:px-2 text-xs sm:text-sm cursor-pointer"
          >
            {[5, 10, 25].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <span className="flex items-center gap-1 text-[10px] sm:text-sm text-muted-foreground whitespace-nowrap">
            <span className="hidden sm:inline">Página</span>
            <strong>
              {table.getState().pagination.pageIndex + 1} /{" "}
              {table.getPageCount()}
            </strong>
          </span>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="h-7 sm:h-8 text-[10px] sm:text-sm px-2 sm:px-3"
            >
              <span className="sm:hidden">Ant</span>
              <span className="hidden sm:inline">Anterior</span>
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="h-7 sm:h-8 text-[10px] sm:text-sm px-2 sm:px-3"
            >
              <span className="sm:hidden">Próx</span>
              <span className="hidden sm:inline">Próximo</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
