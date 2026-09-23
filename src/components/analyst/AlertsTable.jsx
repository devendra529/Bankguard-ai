"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import FilterBar from "@/components/tables/FilterBar";
import DataTable from "@/components/tables/DataTable";
import StatusBadge from "@/components/tables/StatusBadge";
import RiskBadge from "@/components/fraud/RiskBadge";
import { formatCurrency, formatDateTime, formatPercent } from "@/lib/utils/format";

const STATUS_OPTIONS = ["OPEN", "INVESTIGATING", "APPROVED", "BLOCKED", "RESOLVED"].map((v) => ({
  value: v,
  label: v.charAt(0) + v.slice(1).toLowerCase(),
}));
const RISK_OPTIONS = ["LOW", "MEDIUM", "HIGH"].map((v) => ({ value: v, label: v }));

export default function AlertsTable({ alerts }) {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ status: "", riskLevel: "" });

  const rows = useMemo(() => {
    const term = search.trim().toLowerCase();
    return alerts.filter((alert) => {
      if (filters.status && alert.status !== filters.status) return false;
      if (filters.riskLevel && alert.riskLevel !== filters.riskLevel) return false;
      if (term) {
        const haystack = `${alert.id} ${alert.transactionId} ${alert.customerName}`.toLowerCase();
        if (!haystack.includes(term)) return false;
      }
      return true;
    });
  }, [alerts, search, filters]);

  const columns = [
    { key: "id", label: "Alert ID", render: (a) => <span className="font-mono text-xs">{a.id}</span> },
    { key: "transactionId", label: "Transaction ID", render: (a) => <span className="font-mono text-xs">{a.transactionId}</span> },
    { key: "customerName", label: "Customer", render: (a) => <span className="font-medium">{a.customerName}</span> },
    { key: "amount", label: "Amount", render: (a) => formatCurrency(a.amount) },
    { key: "fraudProbability", label: "Fraud Probability", render: (a) => formatPercent(a.fraudProbability) },
    { key: "riskLevel", label: "Risk Level", render: (a) => <RiskBadge level={a.riskLevel} /> },
    { key: "status", label: "Status", render: (a) => <StatusBadge status={a.status} /> },
    { key: "createdAt", label: "Created At", render: (a) => formatDateTime(a.createdAt) },
    { key: "analystName", label: "Assigned Analyst", render: (a) => a.analystName ?? <span className="text-muted">Unassigned</span> },
    {
      key: "action",
      label: "",
      render: (a) => (
        <Link href={`/analyst/alerts/${a.id}`} className="text-xs font-semibold text-brand hover:underline">
          Investigate
        </Link>
      ),
    },
  ];

  return (
    <div>
      <FilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by alert, transaction, customer..."
        filters={[
          { key: "status", label: "All statuses", options: STATUS_OPTIONS },
          { key: "riskLevel", label: "All risk levels", options: RISK_OPTIONS },
        ]}
        values={filters}
        onFilterChange={(key, value) => setFilters((f) => ({ ...f, [key]: value }))}
      />
      <div className="mt-4">
        <DataTable columns={columns} rows={rows} getRowKey={(a) => a.id} emptyTitle="No matching alerts" pageSize={12} />
      </div>
    </div>
  );
}
