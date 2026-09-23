"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { timeAgo } from "@/lib/utils/format";

/** Bell icon + dropdown, backed by GET/PATCH /api/notifications. */
export default function NotificationCenter() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    function onClickOutside(event) {
      if (rootRef.current && !rootRef.current.contains(event.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  async function loadNotifications() {
    try {
      const res = await fetch("/api/notifications");
      if (!res.ok) return;
      const data = await res.json();
      setNotifications(data.notifications ?? []);
    } finally {
      setLoaded(true);
    }
  }

  useEffect(() => {
    loadNotifications();
  }, []);

  async function handleToggle() {
    const next = !open;
    setOpen(next);
    if (next) {
      await fetch("/api/notifications", { method: "PATCH" }); // mark all read
      loadNotifications();
    }
  }

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        onClick={handleToggle}
        aria-label="Notifications"
        className="relative grid h-9 w-9 place-items-center rounded-lg text-muted hover:bg-surface-muted hover:text-foreground"
      >
        <Bell className="h-[18px] w-[18px]" />
        {unreadCount > 0 && (
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-risk-high ring-2 ring-surface" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-11 z-40 w-80 rounded-xl border border-border bg-surface p-2 shadow-float">
          <p className="px-2 py-1.5 text-xs font-semibold uppercase tracking-wide text-muted">Notifications</p>
          <div className="max-h-80 overflow-y-auto">
            {!loaded && <p className="px-2 py-4 text-sm text-muted">Loading...</p>}
            {loaded && notifications.length === 0 && (
              <p className="px-2 py-4 text-sm text-muted">You&apos;re all caught up.</p>
            )}
            {notifications.map((notification) => (
              <div key={notification.id} className={cn("flex gap-2.5 rounded-lg px-2 py-2.5", !notification.read && "bg-brand/5")}>
                <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
                <div className="min-w-0">
                  <p className="text-sm font-medium leading-snug">{notification.title}</p>
                  <p className="mt-0.5 text-xs leading-snug text-muted">{notification.message}</p>
                  <p className="mt-1 text-[11px] text-muted/70">{timeAgo(notification.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
