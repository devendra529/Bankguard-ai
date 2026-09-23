"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import EmptyState from "@/components/common/EmptyState";
import LoadingSkeleton from "@/components/common/LoadingSkeleton";

/**
 * Generic, client-side-paginated table.
 * columns: [{ key, label, render?(row), className? }]
 * rows: already filtered/sorted by the caller.
 */
export default function DataTable({ columns, rows, loading = false, pageSize = 10, emptyTitle = "Nothing here yet", emptyDescription, getRowKey }) {
  const [page, setPage] = useState(0);
  const pageCount = Math.max(Math.ceil(rows.length / pageSize), 1);
  const pageRows = useMemo(() => {
    const start = page * pageSize;
    return rows.slice(start, start + pageSize);
  }, [rows, page, pageSize]);

  const safePage = Math.min(page, pageCount - 1);
  if (safePage !== page) setPage(safePage);

  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <LoadingSkeleton key={i} className="h-11 w-full" />
        ))}
      </div>
    );
  }

  if (!rows.length) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div>
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full min-w-[720px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-border bg-surface-muted/60 text-left text-xs font-semibold uppercase tracking-wide text-muted">
              {columns.map((col) => (
                <th key={col.key} className="whitespace-nowrap px-4 py-3">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageRows.map((row, rowIndex) => (
              <tr
                key={getRowKey ? getRowKey(row) : rowIndex}
                className="border-b border-border last:border-0 hover:bg-surface-muted/40"
              >
                {columns.map((col) => (
                  <td key={col.key} className={`whitespace-nowrap px-4 py-3 ${col.className ?? ""}`}>
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pageCount > 1 && (
        <div className="mt-3 flex items-center justify-between text-sm text-muted">
          <p>
            Page {safePage + 1} of {pageCount} &middot; {rows.length} results
          </p>
          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(p - 1, 0))}
              disabled={safePage === 0}
              className="grid h-8 w-8 place-items-center rounded-lg border border-border disabled:opacity-40"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(p + 1, pageCount - 1))}
              disabled={safePage >= pageCount - 1}
              className="grid h-8 w-8 place-items-center rounded-lg border border-border disabled:opacity-40"
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
