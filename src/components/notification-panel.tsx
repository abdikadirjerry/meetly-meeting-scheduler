"use client";

import { Bell, CheckCheck, Clock, Trash2, X } from "lucide-react";

import type { AppNotification } from "@/types/notification";

interface NotificationPanelProps {
  notifications: AppNotification[];
  unreadCount: number;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
  onClose: () => void;
}

export function NotificationPanel({
  notifications,
  unreadCount,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
  onClearAll,
  onClose,
}: NotificationPanelProps) {
  return (
    <div
      role="dialog"
      aria-label="Notifications"
      className="absolute right-0 top-full z-50 mt-3 w-[min(24rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl"
    >
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4">
        <div>
          <h2 className="font-bold text-slate-900">Notifications</h2>
          <p className="mt-0.5 text-xs text-slate-500">
            {unreadCount === 0
              ? "You are all caught up."
              : `${unreadCount} unread notification${unreadCount === 1 ? "" : "s"}`}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close notifications"
          className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
        >
          <X size={18} />
        </button>
      </div>

      {notifications.length > 0 && (
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
          <button
            type="button"
            onClick={onMarkAllAsRead}
            disabled={unreadCount === 0}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <CheckCheck size={15} />
            Mark all as read
          </button>

          <button
            type="button"
            onClick={onClearAll}
            className="text-xs font-semibold text-red-600 hover:text-red-700"
          >
            Clear all
          </button>
        </div>
      )}

      <div className="max-h-[min(65vh,26rem)] overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center px-6 py-10 text-center">
            <span className="mb-3 flex size-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
              <Bell size={22} />
            </span>
            <p className="text-sm font-semibold text-slate-800">
              No notifications yet
            </p>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              Meeting reminders will appear here when they are available.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {notifications.map((notification) => (
              <li
                key={notification.id}
                className={`px-4 py-4 transition-colors ${
                  notification.read ? "bg-white" : "bg-slate-50"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl ${
                      notification.read
                        ? "bg-slate-100 text-slate-500"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    <Bell size={17} />
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold text-slate-900">
                        {notification.title}
                      </p>

                      {!notification.read && (
                        <span
                          aria-label="Unread"
                          className="mt-1.5 size-2 shrink-0 rounded-full bg-blue-600"
                        />
                      )}
                    </div>

                    <p className="mt-1 text-sm leading-5 text-slate-600">
                      {notification.message}
                    </p>

                    <p className="mt-2 flex items-center gap-1 text-xs text-slate-400">
                      <Clock size={12} />
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      {!notification.read && (
                        <button
                          type="button"
                          onClick={() => onMarkAsRead(notification.id)}
                          className="text-xs font-semibold text-blue-700 hover:text-blue-900"
                        >
                          Mark as read
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => onDelete(notification.id)}
                        aria-label={`Delete notification: ${notification.title}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-red-600"
                      >
                        <Trash2 size={13} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
