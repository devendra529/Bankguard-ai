"use client";

import { useMemo, useState } from "react";
import FilterBar from "@/components/tables/FilterBar";
import DataTable from "@/components/tables/DataTable";
import StatusBadge from "@/components/tables/StatusBadge";
import { formatCurrency } from "@/lib/utils/format";

export default function CustomersDirectory({ customers }) {
  const [search, setSearch] = useState("");

  const rows = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return customers;
    return customers.filter((c) => `${c.name} ${c.email} ${c.phone}`.toLowerCase().includes(term));
  }, [customers, search]);

  const columns = [
    { key: "name", label: "Customer", render: (c) => <span className="font-medium">{c.name}</span> },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "homeCity", label: "City" },
    { key: "accountCount", label: "Accounts" },
    { key: "totalBalance", label: "Total Balance", render: (c) => formatCurrency(c.totalBalance) },
    { key: "status", label: "Status", render: (c) => <StatusBadge status={c.status} /> },
  ];

  return (
    <div>
      <FilterBar search={search} onSearchChange={setSearch} searchPlaceholder="Search by name, email, phone..." filters={[]} values={{}} onFilterChange={() => {}} />
      <div className="mt-4">
        <DataTable columns={columns} rows={rows} getRowKey={(c) => c.id} emptyTitle="No matching customers" pageSize={10} />
      </div>
    </div>
  );
}
