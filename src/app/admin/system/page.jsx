import { Cpu, Database, GitBranch, ScrollText, ShieldCheck } from "lucide-react";
import DashboardShell from "@/components/common/DashboardShell";
import FraudRulesManager from "@/components/admin/FraudRulesManager";
import { requireRole } from "@/lib/auth/guards";
import * as fraudService from "@/services/fraudService";
import * as auditService from "@/services/auditService";
import { APP_NAME } from "@/lib/utils/constants";
import { ROLE_LABELS } from "@/lib/utils/constants";
import { formatDateTime } from "@/lib/utils/format";

export const metadata = { title: "System" };

const ENV_ITEMS = [
  { icon: Cpu, label: "Application", value: `${APP_NAME} - Phase 1` },
  { icon: Database, label: "Data storage", value: "JSON file-system (data/*.json)" },
  { icon: GitBranch, label: "Architecture", value: "Next.js UI -> Route Handlers -> Services -> Repositories" },
  { icon: ShieldCheck, label: "Fraud engine", value: "Rule-based simulation (Phase 2: ML model)" },
];

const ACTION_LABEL = (action) =>
  action
    .split("_")
    .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
    .join(" ");

export default async function AdminSystemPage() {
  const user = await requireRole("ADMIN");
  const rules = fraudService.listRules();
  const recentActivity = auditService.recentActivity(12);

  return (
    <DashboardShell
      role="ADMIN"
      user={{ name: user.name, roleLabel: ROLE_LABELS.ADMIN }}
      breadcrumbs={[{ label: "Dashboard", href: "/admin/dashboard" }, { label: "System" }]}
    >
      <h1 className="text-2xl font-bold tracking-tight">System</h1>
      <p className="mt-1 text-sm text-muted">Environment details, fraud rule status and recent activity.</p>

      <div className="card mt-6 p-5">
        <h2 className="text-sm font-semibold">Environment</h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          {ENV_ITEMS.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-start gap-3">
              <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
              <div>
                <dt className="text-xs text-muted">{label}</dt>
                <dd className="mt-0.5 text-sm font-medium">{value}</dd>
              </div>
            </div>
          ))}
        </dl>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="card p-5">
          <h2 className="text-sm font-semibold">Fraud Rule Status</h2>
          <p className="mt-1 text-xs text-muted">Toggle rules directly - changes apply immediately.</p>
          <div className="mt-4">
            <FraudRulesManager rules={rules} compact />
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Recent System Activity</h2>
            <ScrollText className="h-4 w-4 text-muted" aria-hidden="true" />
          </div>
          <ul className="mt-3 divide-y divide-border">
            {recentActivity.map((log) => (
              <li key={log.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                <div className="min-w-0">
                  <p className="truncate font-medium">{ACTION_LABEL(log.action)}</p>
                  <p className="text-xs text-muted">{log.userName}</p>
                </div>
                <span className="shrink-0 text-xs text-muted">{formatDateTime(log.timestamp)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </DashboardShell>
  );
}
