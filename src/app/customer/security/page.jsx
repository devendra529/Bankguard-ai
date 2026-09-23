import { CheckCircle2, Laptop, ShieldCheck, XCircle } from "lucide-react";
import DashboardShell from "@/components/common/DashboardShell";
import ChangePasswordForm from "@/components/customer/ChangePasswordForm";
import { requireRole } from "@/lib/auth/guards";
import * as userService from "@/services/userService";
import * as transactionService from "@/services/transactionService";
import { ROLE_LABELS } from "@/lib/utils/constants";
import { formatDateTime, timeAgo } from "@/lib/utils/format";

export const metadata = { title: "Security" };

export default async function CustomerSecurityPage() {
  const sessionUser = await requireRole("CUSTOMER");
  const loginHistory = userService.getLoginHistory(sessionUser.id, 8);
  const devices = userService.getDevices(sessionUser.id);
  const transactions = transactionService.listForUser(sessionUser.id);
  const hasFlagged = transactions.some((t) => t.status === "FLAGGED");

  return (
    <DashboardShell
      role="CUSTOMER"
      user={{ name: sessionUser.name, roleLabel: ROLE_LABELS.CUSTOMER }}
      breadcrumbs={[{ label: "Dashboard", href: "/customer/dashboard" }, { label: "Security" }]}
    >
      <h1 className="text-2xl font-bold tracking-tight">Security</h1>
      <p className="mt-1 text-sm text-muted">Your password, recent sign-ins and recognised devices.</p>

      <div className={`card mt-6 flex items-center gap-3 p-4 ${hasFlagged ? "border-risk-high/30" : "border-risk-low/30"}`}>
        <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${hasFlagged ? "bg-risk-high/10 text-risk-high" : "bg-risk-low/10 text-risk-low"}`}>
          <ShieldCheck className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <p className="font-semibold">{hasFlagged ? "Some activity needs your attention" : "Your account is protected"}</p>
          <p className="text-sm text-muted">
            {hasFlagged ? "One or more transactions were flagged for review. Check your transactions for details." : "No suspicious activity detected on your account."}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <h2 className="font-semibold">Change Password</h2>
          <p className="mt-1 text-sm text-muted">Use a strong password you don&apos;t use anywhere else.</p>
          <div className="mt-4">
            <ChangePasswordForm />
          </div>
        </div>

        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="font-semibold">Recognised Devices</h2>
            {devices.length === 0 ? (
              <p className="mt-3 text-sm text-muted">No devices recorded yet.</p>
            ) : (
              <ul className="mt-3 space-y-3">
                {devices.map((device) => (
                  <li key={device.id} className="flex items-center gap-3 rounded-lg border border-border p-3">
                    <Laptop className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{device.deviceName}</p>
                      <p className="text-xs text-muted">Last used {timeAgo(device.lastSeenAt)}</p>
                    </div>
                    {device.isTrusted && <span className="badge-low">Trusted</span>}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="card p-6">
            <h2 className="font-semibold">Recent Sign-ins</h2>
            {loginHistory.length === 0 ? (
              <p className="mt-3 text-sm text-muted">No login history yet.</p>
            ) : (
              <ul className="mt-3 space-y-3">
                {loginHistory.map((entry) => (
                  <li key={entry.id} className="flex items-start gap-2.5 text-sm">
                    {entry.status === "SUCCESS" ? (
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-risk-low" aria-hidden="true" />
                    ) : (
                      <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-risk-high" aria-hidden="true" />
                    )}
                    <div>
                      <p>
                        {entry.status === "SUCCESS" ? "Successful sign-in" : "Failed sign-in attempt"} &middot; {entry.device}
                      </p>
                      <p className="text-xs text-muted">{formatDateTime(entry.createdAt)}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
