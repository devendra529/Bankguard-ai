import DashboardShell from "@/components/common/DashboardShell";
import FraudRulesManager from "@/components/admin/FraudRulesManager";
import { requireRole } from "@/lib/auth/guards";
import * as fraudService from "@/services/fraudService";
import { ROLE_LABELS } from "@/lib/utils/constants";

export const metadata = { title: "Fraud Rules" };

export default async function AdminRulesPage() {
  const user = await requireRole("ADMIN");
  const rules = fraudService.listRules();

  return (
    <DashboardShell
      role="ADMIN"
      user={{ name: user.name, roleLabel: ROLE_LABELS.ADMIN }}
      breadcrumbs={[{ label: "Dashboard", href: "/admin/dashboard" }, { label: "Fraud Rules" }]}
    >
      <h1 className="text-2xl font-bold tracking-tight">Fraud Rules</h1>
      <p className="mt-1 text-sm text-muted">The fraud engine only uses rules that are enabled here.</p>

      <div className="card mt-6 p-5">
        <FraudRulesManager rules={rules} />
      </div>
    </DashboardShell>
  );
}
