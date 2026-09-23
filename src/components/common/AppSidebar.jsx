"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Landmark,
  ArrowLeftRight,
  FolderSearch,
  LayoutDashboard,
  ScrollText,
  Send,
  Server,
  ShieldCheck,
  Siren,
  SlidersHorizontal,
  UserCog,
  UserRound,
  Users,
  ChartColumn,
  X,
} from "lucide-react";
import Logo from "@/components/common/Logo";
import { NAV_BY_ROLE, ROLE_LABELS } from "@/lib/utils/constants";
import { cn } from "@/lib/utils/cn";

const ICONS = {
  dashboard: LayoutDashboard,
  accounts: Landmark,
  transactions: ArrowLeftRight,
  transfer: Send,
  security: ShieldCheck,
  profile: UserRound,
  alerts: Siren,
  cases: FolderSearch,
  users: Users,
  reports: ChartColumn,
  analysts: UserCog,
  rules: SlidersHorizontal,
  audit: ScrollText,
  system: Server,
};

/**
 * Role-aware navigation sidebar.
 * Desktop: fixed 16rem column. Mobile: slide-in drawer controlled by `open`.
 */
export default function AppSidebar({ role = "CUSTOMER", open = false, onClose }) {
  const pathname = usePathname();
  const items = NAV_BY_ROLE[role] ?? NAV_BY_ROLE.CUSTOMER;

  return (
    <>
      {/* Mobile backdrop */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className={cn(
          "fixed inset-0 z-40 bg-navy-950/60 backdrop-blur-sm transition-opacity lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      />

      <aside
        aria-label="Primary navigation"
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-sidebar text-white transition-transform duration-200 ease-out",
          "lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between px-5">
          <Logo href="/" variant="light" />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="grid h-8 w-8 place-items-center rounded-md text-white/70 hover:bg-white/10 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="px-5 pb-2 pt-4 text-xs font-medium text-white/50">{ROLE_LABELS[role]} workspace</p>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-4">
          {items.map((item) => {
            const Icon = ICONS[item.icon] ?? LayoutDashboard;
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-white text-navy-900 shadow-sm"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                )}
              >
                <Icon className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="m-3 rounded-lg border border-white/10 bg-white/5 p-3.5">
          <p className="text-sm font-semibold">Simulation environment</p>
          <p className="mt-1 text-xs leading-relaxed text-white/60">
            Academic project. All customers, accounts and transactions are fictional.
          </p>
        </div>
      </aside>
    </>
  );
}
