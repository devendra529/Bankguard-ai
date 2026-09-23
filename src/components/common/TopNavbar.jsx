"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Menu } from "lucide-react";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import ThemeToggle from "@/components/common/ThemeToggle";
import NotificationCenter from "@/components/common/NotificationCenter";
import SignOutButton from "@/components/common/SignOutButton";

/** Top bar for authenticated layouts: breadcrumbs, theme toggle, notifications, account menu. */
export default function TopNavbar({ user, breadcrumbs = [], onMenuClick }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const initial = user?.name?.trim()?.[0]?.toUpperCase() ?? "?";

  useEffect(() => {
    function onClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) setMenuOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-surface/85 px-4 backdrop-blur-md sm:px-6">
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="Open menu"
        className="grid h-9 w-9 place-items-center rounded-lg text-muted hover:bg-surface-muted hover:text-foreground lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="hidden min-w-0 md:block">
        <Breadcrumbs items={breadcrumbs} />
      </div>

      <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
        <ThemeToggle />
        <NotificationCenter />

        <div className="relative ml-1 border-l border-border pl-3" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2.5 rounded-lg py-1 pr-1.5 hover:bg-surface-muted"
          >
            <span className="grid h-9 w-9 place-items-center rounded-full bg-navy-900 text-sm font-bold text-white dark:bg-brand">
              {initial}
            </span>
            <div className="hidden text-left leading-tight sm:block">
              <p className="text-sm font-semibold">{user?.name ?? "Guest"}</p>
              <p className="text-xs text-muted">{user?.roleLabel ?? ""}</p>
            </div>
            <ChevronDown className="hidden h-4 w-4 text-muted sm:block" aria-hidden="true" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-12 z-40 w-56 rounded-xl border border-border bg-surface p-2 shadow-float">
              <div className="px-2.5 py-2 sm:hidden">
                <p className="text-sm font-semibold">{user?.name ?? "Guest"}</p>
                <p className="text-xs text-muted">{user?.roleLabel ?? ""}</p>
              </div>
              <div className="my-1 border-t border-border sm:hidden" />
              <SignOutButton />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
