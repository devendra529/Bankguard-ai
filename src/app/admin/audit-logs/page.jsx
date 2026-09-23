import DashboardShell from "@/components/common/DashboardShell";
import AuditLogsTable from "@/components/admin/AuditLogsTable";
import { requireRole } from "@/lib/auth/guards";
import * as auditService from "@/services/auditService";
import { ROLE_LABELS } from "@/lib/utils/constants";

export const metadata = { title: "Audit Logs" };

export default async function AdminAuditLogsPage() {
  const user = await requireRole("ADMIN");
  const logs = auditService.listAll();

  return (
    <DashboardShell
      role="ADMIN"
      user={{ name: user.name, roleLabel: ROLE_LABELS.ADMIN }}
      breadcrumbs={[{ label: "Dashboard", href: "/admin/dashboard" }, { label: "Audit Logs" }]}
    >
      <h1 className="text-2xl font-bold tracking-tight">Audit Logs</h1>
      <p className="mt-1 text-sm text-muted">A complete, append-only record of sensitive actions across the system.</p>

      <div className="mt-6">
        <AuditLogsTable logs={logs} />
      </div>
    </DashboardShell>
  );
}
