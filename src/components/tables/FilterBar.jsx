"use client";

import { Search } from "lucide-react";

/**
 * Search input + up to a few <select> filters, shared by every table page
 * (customer transactions, analyst transactions/alerts, admin audit logs).
 * `filters`: [{ key, label, options: [{value,label}] }]
 */
export default function FilterBar({ search, onSearchChange, searchPlaceholder = "Search...", filters = [], values = {}, onFilterChange }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      <label className="relative flex-1 sm:max-w-xs">
        <span className="sr-only">{searchPlaceholder}</span>
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={searchPlaceholder}
          className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm placeholder:text-muted/70"
        />
      </label>

      {filters.map((filter) => (
        <select
          key={filter.key}
          value={values[filter.key] ?? ""}
          onChange={(event) => onFilterChange(filter.key, event.target.value)}
          className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground"
        >
          <option value="">{filter.label}</option>
          {filter.options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ))}
    </div>
  );
}
