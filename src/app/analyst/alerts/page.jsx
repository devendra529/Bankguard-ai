import DashboardShell from "@/components/common/DashboardShell";
import AlertsTable from "@/components/analyst/AlertsTable";
import { requireRole } from "@/lib/auth/guards";
import * as alertService from "@/services/alertService";
import * as userService from "@/services/userService";
import { ROLE_LABELS } from "@/lib/utils/constants";

export const metadata = { title: "Fraud Alerts" };

export default async function AnalystAlertsPage() {
  const user = await requireRole("ANALYST");
  const alerts = alertService.listAll().map((alert) => ({
    ...alert,
    customerName: userService.getById(alert.userId)?.name ?? "Unknown",
    analystName: alert.assignedAnalystId ? userService.getById(alert.assignedAnalystId)?.name : null,
  }));

  return (
    <DashboardShell
      role="ANALYST"
      user={{ name: user.name, roleLabel: ROLE_LABELS.ANALYST }}
      breadcrumbs={[{ label: "Dashboard", href: "/analyst/dashboard" }, { label: "Fraud Alerts" }]}
    >
      <h1 className="text-2xl font-bold tracking-tight">Fraud Alerts</h1>
      <p className="mt-1 text-sm text-muted">Review suspicious transactions requiring attention.</p>

      <div className="mt-6">
        <AlertsTable alerts={alerts} />
      </div>
    </DashboardShell>
  );
}
