"use client";

import { useMemo, useState } from "react";
import FilterBar from "@/components/tables/FilterBar";
import DataTable from "@/components/tables/DataTable";
import { formatDateTime } from "@/lib/utils/format";

const ACTION_STYLE = {
  LOGIN: "text-risk-low",
  FAILED_LOGIN: "text-risk-high",
  LOGOUT: "text-muted",
  TRANSACTION_CREATED: "text-brand",
  TRANSACTION_APPROVED: "text-risk-low",
  TRANSACTION_BLOCKED: "text-risk-high",
  FRAUD_ALERT_CREATED: "text-risk-high",
  ALERT_ASSIGNED: "text-brand",
  ALERT_INVESTIGATING: "text-brand",
  ALERT_RESOLVED: "text-risk-low",
  ALERT_NOTE_ADDED: "text-muted",
  RULE_UPDATED: "text-risk-medium",
  USER_CREATED: "text-brand",
  USER_UPDATED: "text-risk-medium",
  USER_REGISTERED: "text-brand",
  PASSWORD_CHANGED: "text-muted",
  PASSWORD_RESET_REQUESTED: "text-muted",
};

function actionLabel(action) {
  return action
    .split("_")
    .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
    .join(" ");
}

export default function AuditLogsTable({ logs }) {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ resourceType: "" });

  const resourceOptions = useMemo(
    () => [...new Set(logs.map((l) => l.resourceType))].map((v) => ({ value: v, label: v })),
    [logs]
  );

  const rows = useMemo(() => {
    const term = search.trim().toLowerCase();
    return logs.filter((log) => {
      if (filters.resourceType && log.resourceType !== filters.resourceType) return false;
      if (term) {
        const haystack = `${log.userName} ${log.action} ${log.resourceId}`.toLowerCase();
        if (!haystack.includes(term)) return false;
      }
      return true;
    });
  }, [logs, search, filters]);

  const columns = [
    { key: "timestamp", label: "Time", render: (l) => formatDateTime(l.timestamp) },
    { key: "userName", label: "User" },
    {
      key: "action",
      label: "Action",
      render: (l) => <span className={`font-medium ${ACTION_STYLE[l.action] ?? ""}`}>{actionLabel(l.action)}</span>,
    },
    { key: "resourceType", label: "Resource" },
    { key: "resourceId", label: "Resource ID", render: (l) => <span className="font-mono text-xs">{l.resourceId}</span> },
  ];

  return (
    <div>
      <FilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by user, action, resource..."
        filters={[{ key: "resourceType", label: "All resources", options: resourceOptions }]}
        values={filters}
        onFilterChange={(key, value) => setFilters((f) => ({ ...f, [key]: value }))}
      />
      <div className="mt-4">
        <DataTable columns={columns} rows={rows} getRowKey={(l) => l.id} emptyTitle="No matching logs" pageSize={15} />
      </div>
    </div>
  );
}
