"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import AppSidebar from "@/components/common/AppSidebar";
import TopNavbar from "@/components/common/TopNavbar";
import Breadcrumbs from "@/components/common/Breadcrumbs";

/** Layout for every authenticated page: sidebar + top navbar + content. */
export default function DashboardShell({ role = "CUSTOMER", user, breadcrumbs = [], children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="min-h-screen">
      <AppSidebar role={role} open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="lg:pl-64">
        <TopNavbar user={user} breadcrumbs={breadcrumbs} onMenuClick={() => setMenuOpen(true)} />
        <main className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 lg:py-8">
          <div className="mb-4 md:hidden">
            <Breadcrumbs items={breadcrumbs} />
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
