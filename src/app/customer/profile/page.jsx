import { Calendar, Landmark, Mail, MapPin, Phone, User } from "lucide-react";
import DashboardShell from "@/components/common/DashboardShell";
import { requireRole } from "@/lib/auth/guards";
import * as userService from "@/services/userService";
import { ROLE_LABELS } from "@/lib/utils/constants";
import { formatDate } from "@/lib/utils/format";

export const metadata = { title: "Profile" };

const FIELDS = [
  { key: "email", label: "Email", icon: Mail },
  { key: "phone", label: "Phone", icon: Phone },
  { key: "homeCity", label: "City", icon: MapPin },
];

export default async function CustomerProfilePage() {
  const sessionUser = await requireRole("CUSTOMER");
  const user = userService.getById(sessionUser.id);
  const { accountCount, totalBalance } = userService.accountSummaryForCustomer(sessionUser.id);

  return (
    <DashboardShell
      role="CUSTOMER"
      user={{ name: user.name, roleLabel: ROLE_LABELS.CUSTOMER }}
      breadcrumbs={[{ label: "Dashboard", href: "/customer/dashboard" }, { label: "Profile" }]}
    >
      <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
      <p className="mt-1 text-sm text-muted">Your BankGuard AI account details.</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <div className="card flex flex-col items-center p-8 text-center">
          <span className="grid h-20 w-20 place-items-center rounded-full bg-navy-900 text-2xl font-bold text-white dark:bg-brand">
            {user.name.charAt(0).toUpperCase()}
          </span>
          <h2 className="mt-4 text-lg font-semibold">{user.name}</h2>
          <p className="text-sm text-muted">{ROLE_LABELS.CUSTOMER}</p>
          <span className="badge-low mt-3">{user.status}</span>

          <div className="mt-6 grid w-full grid-cols-2 gap-3 border-t border-border pt-6 text-left">
            <div>
              <p className="text-xs text-muted">Accounts</p>
              <p className="mt-0.5 font-semibold">{accountCount}</p>
            </div>
            <div>
              <p className="text-xs text-muted">Customer since</p>
              <p className="mt-0.5 font-semibold">{formatDate(user.createdAt)}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="font-semibold">Personal information</h2>
          <dl className="mt-4 divide-y divide-border">
            {FIELDS.map(({ key, label, icon: Icon }) => (
              <div key={key} className="flex items-center gap-3 py-3">
                <Icon className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
                <dt className="w-24 shrink-0 text-sm text-muted">{label}</dt>
                <dd className="text-sm font-medium">{user[key] || "-"}</dd>
              </div>
            ))}
            <div className="flex items-center gap-3 py-3">
              <User className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
              <dt className="w-24 shrink-0 text-sm text-muted">User ID</dt>
              <dd className="font-mono text-sm font-medium">{user.id}</dd>
            </div>
            <div className="flex items-center gap-3 py-3">
              <Calendar className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
              <dt className="w-24 shrink-0 text-sm text-muted">Joined</dt>
              <dd className="text-sm font-medium">{formatDate(user.createdAt)}</dd>
            </div>
            <div className="flex items-center gap-3 py-3">
              <Landmark className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
              <dt className="w-24 shrink-0 text-sm text-muted">Total balance</dt>
              <dd className="text-sm font-medium">₹{totalBalance.toLocaleString("en-IN")}</dd>
            </div>
          </dl>
          <p className="mt-4 rounded-lg bg-surface-muted px-3.5 py-2.5 text-xs text-muted">
            Profile editing isn&apos;t available in this simulation. Contact an administrator to update your details.
          </p>
        </div>
      </div>
    </DashboardShell>
  );
}
