import { CreditCard, Landmark } from "lucide-react";
import DashboardShell from "@/components/common/DashboardShell";
import EmptyState from "@/components/common/EmptyState";
import { requireRole } from "@/lib/auth/guards";
import * as accountService from "@/services/accountService";
import { ROLE_LABELS } from "@/lib/utils/constants";
import { formatCurrency, maskAccountNumber } from "@/lib/utils/format";

export const metadata = { title: "Accounts" };

const TYPE_GRADIENT = {
  SAVINGS: "from-navy-900 to-navy-700",
  CURRENT: "from-brand to-blue-500",
};

export default async function CustomerAccountsPage() {
  const user = await requireRole("CUSTOMER");
  const accounts = accountService.listForUser(user.id);

  return (
    <DashboardShell
      role="CUSTOMER"
      user={{ name: user.name, roleLabel: ROLE_LABELS.CUSTOMER }}
      breadcrumbs={[{ label: "Dashboard", href: "/customer/dashboard" }, { label: "Accounts" }]}
    >
      <h1 className="text-2xl font-bold tracking-tight">Accounts</h1>
      <p className="mt-1 text-sm text-muted">Every account linked to your BankGuard AI profile.</p>

      {accounts.length === 0 ? (
        <EmptyState className="mt-6" icon={Landmark} title="No accounts yet" description="Contact support to open an account." />
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {accounts.map((account) => (
            <div key={account.id} className="overflow-hidden rounded-2xl shadow-card">
              <div className={`bg-gradient-to-br ${TYPE_GRADIENT[account.type] ?? TYPE_GRADIENT.SAVINGS} p-5 text-white`}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-white/60">{account.type} Account</p>
                    <p className="mt-4 font-mono text-lg tracking-widest">{maskAccountNumber(account.accountNumber)}</p>
                  </div>
                  <CreditCard className="h-6 w-6 text-white/50" aria-hidden="true" />
                </div>
                <p className="mt-6 text-xs text-white/60">Available balance</p>
                <p className="text-2xl font-bold">{formatCurrency(account.availableBalance)}</p>
              </div>

              <div className="grid grid-cols-2 divide-x divide-border border border-t-0 border-border bg-surface text-sm">
                <div className="p-4">
                  <p className="text-xs text-muted">Total Balance</p>
                  <p className="mt-1 font-semibold">{formatCurrency(account.balance)}</p>
                </div>
                <div className="p-4">
                  <p className="text-xs text-muted">Currency</p>
                  <p className="mt-1 font-semibold">{account.currency}</p>
                </div>
              </div>
              <div className="flex items-center justify-between border border-t-0 border-border bg-surface px-4 py-3 text-xs">
                <span className="text-muted">Account ID: {account.id}</span>
                <span className="badge-low">{account.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}
