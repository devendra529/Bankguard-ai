"use client";

import { useMemo, useState } from "react";
import FilterBar from "@/components/tables/FilterBar";
import DataTable from "@/components/tables/DataTable";
import StatusBadge from "@/components/tables/StatusBadge";
import RiskBadge from "@/components/fraud/RiskBadge";
import Modal from "@/components/common/Modal";
import FraudRiskCard from "@/components/fraud/FraudRiskCard";
import { formatCurrency, formatDateTime, formatPercent, maskAccountNumber } from "@/lib/utils/format";

const RISK_OPTIONS = ["LOW", "MEDIUM", "HIGH"].map((v) => ({ value: v, label: v }));
const STATUS_OPTIONS = ["COMPLETED", "REVIEW", "FLAGGED", "BLOCKED"].map((v) => ({ value: v, label: v.charAt(0) + v.slice(1).toLowerCase() }));

/** transactions: pre-enriched with customerName (server-side) since the raw record only has a userId. */
export default function AnalystTransactionsTable({ transactions }) {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ riskLevel: "", status: "" });
  const [selected, setSelected] = useState(null);

  const rows = useMemo(() => {
    const term = search.trim().toLowerCase();
    return transactions.filter((txn) => {
      if (filters.riskLevel && txn.riskLevel !== filters.riskLevel) return false;
      if (filters.status && txn.status !== filters.status) return false;
      if (term) {
        const haystack = `${txn.id} ${txn.customerName} ${txn.location} ${txn.receiverAccount ?? ""}`.toLowerCase();
        if (!haystack.includes(term)) return false;
      }
      return true;
    });
  }, [transactions, search, filters]);

  const columns = [
    { key: "id", label: "Transaction ID", render: (t) => <span className="font-mono text-xs">{t.id}</span> },
    { key: "customerName", label: "Account", render: (t) => <span className="font-medium">{t.customerName}</span> },
    { key: "amount", label: "Amount", render: (t) => formatCurrency(t.amount) },
    { key: "type", label: "Type", render: (t) => t.type.replace("_", " ") },
    { key: "location", label: "Location" },
    { key: "fraudProbability", label: "Risk Score", render: (t) => formatPercent(t.fraudProbability) },
    { key: "riskLevel", label: "Risk Level", render: (t) => <RiskBadge level={t.riskLevel} /> },
    { key: "status", label: "Status", render: (t) => <StatusBadge status={t.status} /> },
    { key: "createdAt", label: "Timestamp", render: (t) => formatDateTime(t.createdAt) },
    {
      key: "action",
      label: "",
      render: (t) => (
        <button type="button" onClick={() => setSelected(t)} className="text-xs font-semibold text-brand hover:underline">
          Details
        </button>
      ),
    },
  ];

  return (
    <div>
      <FilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by ID, customer, location..."
        filters={[
          { key: "riskLevel", label: "All risk levels", options: RISK_OPTIONS },
          { key: "status", label: "All statuses", options: STATUS_OPTIONS },
        ]}
        values={filters}
        onFilterChange={(key, value) => setFilters((f) => ({ ...f, [key]: value }))}
      />

      <div className="mt-4">
        <DataTable columns={columns} rows={rows} getRowKey={(t) => t.id} emptyTitle="No matching transactions" pageSize={12} />
      </div>

      <Modal open={Boolean(selected)} onClose={() => setSelected(null)} title={selected ? `Transaction ${selected.id}` : ""} maxWidth="max-w-lg">
        {selected && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-muted">Customer</p>
                <p className="mt-0.5 font-semibold">{selected.customerName}</p>
              </div>
              <div>
                <p className="text-xs text-muted">Amount</p>
                <p className="mt-0.5 font-semibold">{formatCurrency(selected.amount)}</p>
              </div>
              <div>
                <p className="text-xs text-muted">Device</p>
                <p className="mt-0.5">{selected.device}</p>
              </div>
              <div>
                <p className="text-xs text-muted">Location</p>
                <p className="mt-0.5">{selected.location}</p>
              </div>
              <div>
                <p className="text-xs text-muted">Receiver</p>
                <p className="mt-0.5 font-mono">{selected.receiverAccount ? maskAccountNumber(selected.receiverAccount) : selected.receiverName}</p>
              </div>
              <div>
                <p className="text-xs text-muted">Timestamp</p>
                <p className="mt-0.5">{formatDateTime(selected.createdAt)}</p>
              </div>
            </div>
            <FraudRiskCard fraudProbability={selected.fraudProbability} riskLevel={selected.riskLevel} reasons={selected.reasons} />
          </div>
        )}
      </Modal>
    </div>
  );
}
