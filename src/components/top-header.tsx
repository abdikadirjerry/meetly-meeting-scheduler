"use client";

import { useEffect, useRef, useState } from "react";
import {
  Bell,
  CalendarPlus,
  Check,
  Menu,
  Search,
  ShieldCheck,
} from "lucide-react";

import { NotificationPanel } from "@/components/notification-panel";
import type { AppNotification } from "@/types/notification";

interface TopHeaderProps {
  onMenuClick: () => void;
  notifications: AppNotification[];
  unreadCount: number;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDeleteNotification: (id: string) => void;
  onClearNotifications: () => void;
  onScheduleMeeting: () => void;
}

export function TopHeader({
  onMenuClick,
  notifications,
  unreadCount,
  onMarkAsRead,
  onMarkAllAsRead,
  onDeleteNotification,
  onClearNotifications,
  onScheduleMeeting,
}: TopHeaderProps) {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [permission, setPermission] =
    useState<NotificationPermission>("default");

  const [isRequestingPermission, setIsRequestingPermission] = useState(false);

  const notificationContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!("Notification" in window)) {
      return;
    }

    const syncPermission = () => {
      setPermission(window.Notification.permission);
    };

    syncPermission();

    window.addEventListener("focus", syncPermission);

    return () => {
      window.removeEventListener("focus", syncPermission);
    };
  }, []);

  useEffect(() => {
    if (!isNotificationOpen) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      if (
        event.target instanceof Node &&
        !notificationContainerRef.current?.contains(event.target)
      ) {
        setIsNotificationOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsNotificationOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isNotificationOpen]);

  async function requestBrowserPermission() {
    if (!("Notification" in window)) {
      return;
    }

    if (window.Notification.permission !== "default") {
      setPermission(window.Notification.permission);
      return;
    }

    setIsRequestingPermission(true);

    try {
      const result = await window.Notification.requestPermission();
      setPermission(result);
    } catch {
      setPermission(window.Notification.permission);
    } finally {
      setIsRequestingPermission(false);
    }
  }

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="flex h-20 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Open navigation"
            className="rounded-xl p-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 lg:hidden"
          >
            <Menu size={22} />
          </button>

          <div className="min-w-0">
            <p className="truncate text-sm text-slate-500">Welcome back</p>
            <h1 className="truncate text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
              Your meetings
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            aria-label="Search meetings"
            className="hidden rounded-xl border border-slate-200 p-2.5 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 sm:flex"
          >
            <Search size={18} />
          </button>

          <div className="relative" ref={notificationContainerRef}>
            <button
              type="button"
              aria-label={
                unreadCount > 0
                  ? `Notifications, ${unreadCount} unread`
                  : "Notifications"
              }
              aria-expanded={isNotificationOpen}
              aria-haspopup="dialog"
              onClick={() => setIsNotificationOpen((isOpen) => !isOpen)}
              className="relative rounded-xl border border-slate-200 p-2.5 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
            >
              <Bell size={18} />

              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </button>

            {isNotificationOpen && (
              <NotificationPanel
                notifications={notifications}
                unreadCount={unreadCount}
                onMarkAsRead={onMarkAsRead}
                onMarkAllAsRead={onMarkAllAsRead}
                onDelete={onDeleteNotification}
                onClearAll={onClearNotifications}
                onClose={() => setIsNotificationOpen(false)}
              />
            )}
          </div>

          {permission === "granted" ? (
            <div
              title="Browser notifications enabled"
              aria-label="Browser notifications enabled"
              className="hidden items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm font-medium text-emerald-700 md:flex"
            >
              <ShieldCheck size={17} />
              <span>Enabled</span>
            </div>
          ) : typeof window !== "undefined" && !("Notification" in window) ? (
            <div
              title="This browser does not support notifications"
              className="hidden rounded-xl border border-slate-200 px-3 py-2.5 text-xs text-slate-500 lg:block"
            >
              Notifications unavailable
            </div>
          ) : permission === "denied" ? (
            <div
              title="Notifications are blocked. Change the permission in your browser settings."
              className="hidden rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs font-medium text-amber-700 lg:block"
            >
              Notifications blocked
            </div>
          ) : (
            <button
              type="button"
              onClick={requestBrowserPermission}
              disabled={isRequestingPermission}
              className="hidden items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-wait disabled:opacity-60 md:flex"
            >
              <Check size={15} />
              {isRequestingPermission ? "Requesting…" : "Enable alerts"}
            </button>
          )}

          <button
            type="button"
            onClick={onScheduleMeeting}
            className="hidden items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 sm:flex"
          >
            <CalendarPlus size={17} />
            <span>Schedule Meeting</span>
          </button>

          <button
            type="button"
            onClick={onScheduleMeeting}
            aria-label="Schedule meeting"
            className="flex rounded-xl bg-slate-900 p-2.5 text-white shadow-sm transition-colors hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 sm:hidden"
          >
            <CalendarPlus size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
