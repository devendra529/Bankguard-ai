"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldBan, ShieldCheck } from "lucide-react";
import FilterBar from "@/components/tables/FilterBar";
import DataTable from "@/components/tables/DataTable";
import StatusBadge from "@/components/tables/StatusBadge";
import { useToast } from "@/components/common/ToastProvider";
import { formatCurrency, formatDate } from "@/lib/utils/format";

/** Shared table for /admin/users (customers) and /admin/analysts, toggled by `role`. */
export default function UsersTable({ users, role }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [search, setSearch] = useState("");
  const [busyId, setBusyId] = useState(null);

  const rows = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return users;
    return users.filter((u) => `${u.name} ${u.email}`.toLowerCase().includes(term));
  }, [users, search]);

  async function toggleStatus(user) {
    const nextStatus = user.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    setBusyId(user.id);
    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        showToast(data.error ?? "Couldn't update this user.", "error");
        return;
      }
      showToast(`${user.name} is now ${nextStatus.toLowerCase()}.`, "success");
      router.refresh();
    } catch {
      showToast("Couldn't reach the server. Try again.", "error");
    } finally {
      setBusyId(null);
    }
  }

  const columns = [
    { key: "name", label: "Name", render: (u) => <span className="font-medium">{u.name}</span> },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    role === "CUSTOMER"
      ? { key: "totalBalance", label: "Total Balance", render: (u) => formatCurrency(u.totalBalance ?? 0) }
      : { key: "createdAt", label: "Joined", render: (u) => formatDate(u.createdAt) },
    { key: "status", label: "Status", render: (u) => <StatusBadge status={u.status} /> },
    {
      key: "action",
      label: "",
      render: (u) => (
        <button
          type="button"
          onClick={() => toggleStatus(u)}
          disabled={busyId === u.id}
          className={`inline-flex items-center gap-1.5 text-xs font-semibold hover:underline ${
            u.status === "ACTIVE" ? "text-risk-high" : "text-risk-low"
          }`}
        >
          {u.status === "ACTIVE" ? <ShieldBan className="h-3.5 w-3.5" /> : <ShieldCheck className="h-3.5 w-3.5" />}
          {u.status === "ACTIVE" ? "Suspend" : "Activate"}
        </button>
      ),
    },
  ];

  return (
    <div>
      <FilterBar search={search} onSearchChange={setSearch} searchPlaceholder="Search by name or email..." filters={[]} values={{}} onFilterChange={() => {}} />
      <div className="mt-4">
        <DataTable columns={columns} rows={rows} getRowKey={(u) => u.id} emptyTitle="No matching users" pageSize={10} />
      </div>
    </div>
  );
}
