"use client";

import { useMemo, useState } from "react";
import FilterBar from "@/components/tables/FilterBar";
import DataTable from "@/components/tables/DataTable";
import StatusBadge from "@/components/tables/StatusBadge";
import RiskBadge from "@/components/fraud/RiskBadge";
import Modal from "@/components/common/Modal";
import FraudRiskCard from "@/components/fraud/FraudRiskCard";
import { formatCurrency, formatDateTime, maskAccountNumber } from "@/lib/utils/format";

const STATUS_OPTIONS = ["COMPLETED", "REVIEW", "FLAGGED", "BLOCKED"].map((v) => ({ value: v, label: v.charAt(0) + v.slice(1).toLowerCase() }));
const TYPE_OPTIONS = ["TRANSFER", "UPI", "BILL_PAYMENT", "CARD"].map((v) => ({ value: v, label: v.replace("_", " ") }));
const RANGE_OPTIONS = [
  { value: "7", label: "Last 7 days" },
  { value: "30", label: "Last 30 days" },
  { value: "90", label: "Last 90 days" },
];

export default function TransactionsTable({ transactions }) {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ status: "", type: "", range: "" });
  const [selected, setSelected] = useState(null);

  const rows = useMemo(() => {
    const term = search.trim().toLowerCase();
    const cutoff = filters.range ? Date.now() - Number(filters.range) * 24 * 60 * 60 * 1000 : null;

    return transactions.filter((txn) => {
      if (filters.status && txn.status !== filters.status) return false;
      if (filters.type && txn.type !== filters.type) return false;
      if (cutoff && new Date(txn.createdAt).getTime() < cutoff) return false;
      if (term) {
        const haystack = `${txn.id} ${txn.description} ${txn.receiverAccount ?? ""}`.toLowerCase();
        if (!haystack.includes(term)) return false;
      }
      return true;
    });
  }, [transactions, search, filters]);

  const columns = [
    { key: "id", label: "Transaction ID", render: (t) => <span className="font-mono text-xs">{t.id}</span> },
    { key: "createdAt", label: "Date", render: (t) => formatDateTime(t.createdAt) },
    { key: "type", label: "Type", render: (t) => t.type.replace("_", " ") },
    { key: "amount", label: "Amount", render: (t) => <span className="font-semibold">{formatCurrency(t.amount)}</span> },
    { key: "receiver", label: "Recipient", render: (t) => (t.receiverAccount ? maskAccountNumber(t.receiverAccount) : t.receiverName) },
    { key: "status", label: "Status", render: (t) => <StatusBadge status={t.status} /> },
    { key: "riskLevel", label: "Risk Level", render: (t) => <RiskBadge level={t.riskLevel} /> },
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
        searchPlaceholder="Search by ID, description, account..."
        filters={[
          { key: "status", label: "All statuses", options: STATUS_OPTIONS },
          { key: "type", label: "All types", options: TYPE_OPTIONS },
          { key: "range", label: "All time", options: RANGE_OPTIONS },
        ]}
        values={filters}
        onFilterChange={(key, value) => setFilters((f) => ({ ...f, [key]: value }))}
      />

      <div className="mt-4">
        <DataTable
          columns={columns}
          rows={rows}
          getRowKey={(t) => t.id}
          emptyTitle="No matching transactions"
          emptyDescription="Try adjusting your search or filters."
        />
      </div>

      <Modal open={Boolean(selected)} onClose={() => setSelected(null)} title={selected ? `Transaction ${selected.id}` : ""} maxWidth="max-w-lg">
        {selected && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-muted">Amount</p>
                <p className="mt-0.5 font-semibold">{formatCurrency(selected.amount)}</p>
              </div>
              <div>
                <p className="text-xs text-muted">Type</p>
                <p className="mt-0.5 font-semibold">{selected.type.replace("_", " ")}</p>
              </div>
              <div>
                <p className="text-xs text-muted">Recipient</p>
                <p className="mt-0.5 font-mono">{selected.receiverAccount ? maskAccountNumber(selected.receiverAccount) : selected.receiverName}</p>
              </div>
              <div>
                <p className="text-xs text-muted">Date</p>
                <p className="mt-0.5">{formatDateTime(selected.createdAt)}</p>
              </div>
              <div>
                <p className="text-xs text-muted">Status</p>
                <p className="mt-1">
                  <StatusBadge status={selected.status} />
                </p>
              </div>
              <div>
                <p className="text-xs text-muted">Description</p>
                <p className="mt-0.5">{selected.description}</p>
              </div>
            </div>
            <FraudRiskCard fraudProbability={selected.fraudProbability} riskLevel={selected.riskLevel} reasons={selected.reasons} />
          </div>
        )}
      </Modal>
    </div>
  );
}
