import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Landmark, Mail, Phone } from "lucide-react";
import DashboardShell from "@/components/common/DashboardShell";
import RiskBadge from "@/components/fraud/RiskBadge";
import StatusBadge from "@/components/tables/StatusBadge";
import FraudRiskCard from "@/components/fraud/FraudRiskCard";
import AlertInvestigationPanel from "@/components/analyst/AlertInvestigationPanel";
import EmptyState from "@/components/common/EmptyState";
import { requireRole } from "@/lib/auth/guards";
import * as alertService from "@/services/alertService";
import * as transactionService from "@/services/transactionService";
import * as userService from "@/services/userService";
import * as accountService from "@/services/accountService";
import { ROLE_LABELS } from "@/lib/utils/constants";
import { formatCurrency, formatDateTime, maskAccountNumber } from "@/lib/utils/format";

export const metadata = { title: "Alert Investigation" };

export default async function AlertDetailPage({ params }) {
  const user = await requireRole("ANALYST");
  const alert = alertService.getById(params.id);
  if (!alert) notFound();

  const transaction = transactionService.getById(alert.transactionId);
  const customer = userService.getById(alert.userId);
  const account = accountService.getById(alert.accountId);
  const assignedAnalyst = alert.assignedAnalystId ? userService.getById(alert.assignedAnalystId) : null;
  const previousActivity = transaction
    ? transactionService.recentActivityForAccount(alert.accountId, transaction.id, 6)
    : [];

  return (
    <DashboardShell
      role="ANALYST"
      user={{ name: user.name, roleLabel: ROLE_LABELS.ANALYST }}
      breadcrumbs={[
        { label: "Dashboard", href: "/analyst/dashboard" },
        { label: "Fraud Alerts", href: "/analyst/alerts" },
        { label: alert.id },
      ]}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link href="/analyst/alerts" className="grid h-9 w-9 place-items-center rounded-lg border border-border hover:bg-surface-muted">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          </Link>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Alert {alert.id}</h1>
            <p className="text-sm text-muted">Transaction {alert.transactionId}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <RiskBadge level={alert.riskLevel} />
          <StatusBadge status={alert.status} />
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="font-semibold">Transaction Information</h2>
            <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-4 text-sm sm:grid-cols-3">
              <div>
                <dt className="text-xs text-muted">Transaction ID</dt>
                <dd className="mt-0.5 font-mono">{transaction?.id ?? "-"}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted">Amount</dt>
                <dd className="mt-0.5 font-semibold">{formatCurrency(alert.amount)}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted">Type</dt>
                <dd className="mt-0.5">{transaction?.type.replace("_", " ") ?? "-"}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted">Account</dt>
                <dd className="mt-0.5 font-mono">{account ? maskAccountNumber(account.accountNumber) : "-"}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted">Location</dt>
                <dd className="mt-0.5">{transaction?.location ?? "-"}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted">Device</dt>
                <dd className="mt-0.5">{transaction?.device ?? "-"}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted">Time</dt>
                <dd className="mt-0.5">{formatDateTime(alert.createdAt)}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted">Status</dt>
                <dd className="mt-1">
                  <StatusBadge status={transaction?.status ?? alert.status} />
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted">Assigned analyst</dt>
                <dd className="mt-0.5">{assignedAnalyst?.name ?? "Unassigned"}</dd>
              </div>
            </dl>
          </div>

          <FraudRiskCard title="Fraud Analysis" fraudProbability={alert.fraudProbability} riskLevel={alert.riskLevel} reasons={alert.reasons} />

          <div className="card p-6">
            <h2 className="font-semibold">Previous Activity</h2>
            <p className="mt-1 text-sm text-muted">Recent transactions from this account.</p>
            {previousActivity.length === 0 ? (
              <EmptyState className="mt-4" title="No prior activity" description="This is the account's first recorded transaction." />
            ) : (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[440px] text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted">
                      <th className="py-2 pr-3 font-medium">Date</th>
                      <th className="py-2 pr-3 font-medium">Type</th>
                      <th className="py-2 pr-3 font-medium">Amount</th>
                      <th className="py-2 pr-3 font-medium">Risk</th>
                      <th className="py-2 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {previousActivity.map((txn) => (
                      <tr key={txn.id} className="border-b border-border last:border-0">
                        <td className="whitespace-nowrap py-2.5 pr-3 text-muted">{formatDateTime(txn.createdAt)}</td>
                        <td className="py-2.5 pr-3">{txn.type.replace("_", " ")}</td>
                        <td className="py-2.5 pr-3 font-medium">{formatCurrency(txn.amount)}</td>
                        <td className="py-2.5 pr-3">
                          <RiskBadge level={txn.riskLevel} />
                        </td>
                        <td className="py-2.5">
                          <StatusBadge status={txn.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="font-semibold">Customer</h2>
            <div className="mt-4 flex items-center gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-navy-900 text-sm font-bold text-white dark:bg-brand">
                {customer?.name?.charAt(0).toUpperCase() ?? "?"}
              </span>
              <div>
                <p className="font-semibold">{customer?.name ?? "Unknown customer"}</p>
                <p className="text-xs text-muted">Customer since {customer ? new Date(customer.createdAt).getFullYear() : "-"}</p>
              </div>
            </div>
            <dl className="mt-4 space-y-2.5 text-sm">
              <div className="flex items-center gap-2.5">
                <Mail className="h-3.5 w-3.5 shrink-0 text-muted" aria-hidden="true" />
                <dd>{customer?.email ?? "-"}</dd>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="h-3.5 w-3.5 shrink-0 text-muted" aria-hidden="true" />
                <dd>{customer?.phone ?? "-"}</dd>
              </div>
              <div className="flex items-center gap-2.5">
                <Landmark className="h-3.5 w-3.5 shrink-0 text-muted" aria-hidden="true" />
                <dd className="font-mono">{account ? maskAccountNumber(account.accountNumber) : "-"}</dd>
              </div>
            </dl>
          </div>

          <AlertInvestigationPanel
            alertId={alert.id}
            status={alert.status}
            assignedAnalystId={alert.assignedAnalystId}
            currentAnalystId={user.id}
            notes={alert.notes}
          />
        </div>
      </div>
    </DashboardShell>
  );
}
