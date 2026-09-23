import DashboardShell from "@/components/common/DashboardShell";
import UsersTable from "@/components/admin/UsersTable";
import CreateAnalystDialog from "@/components/admin/CreateAnalystDialog";
import { requireRole } from "@/lib/auth/guards";
import * as userService from "@/services/userService";
import { ROLE_LABELS } from "@/lib/utils/constants";

export const metadata = { title: "Analysts" };

export default async function AdminAnalystsPage() {
  const user = await requireRole("ADMIN");
  const analysts = userService.listAnalysts();

  return (
    <DashboardShell
      role="ADMIN"
      user={{ name: user.name, roleLabel: ROLE_LABELS.ADMIN }}
      breadcrumbs={[{ label: "Dashboard", href: "/admin/dashboard" }, { label: "Analysts" }]}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Analysts</h1>
          <p className="mt-1 text-sm text-muted">Fraud analysts with access to the investigation workspace.</p>
        </div>
        <CreateAnalystDialog />
      </div>

      <div className="mt-6">
        <UsersTable users={analysts} role="ANALYST" />
      </div>
    </DashboardShell>
  );
}
