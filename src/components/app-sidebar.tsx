"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  ChevronLeft,
  LayoutDashboard,
  ListTodo,
  Settings,
  Users,
  Video,
} from "lucide-react";

const navigationItems = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Calendar", href: "/calendar", icon: CalendarDays },
  { label: "Meetings", href: "/meetings", icon: ListTodo },
  { label: "Attendees", href: "/attendees", icon: Users },
];

const linkBaseStyles =
  "flex min-h-11 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2";

function isNavigationItemActive(pathname: string, href: string) {
  return href === "/"
    ? pathname === "/"
    : pathname === href || pathname.startsWith(`${href}/`);
}

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white lg:flex lg:flex-col">
      <div className="flex h-20 shrink-0 items-center border-b border-slate-200 px-6">
        <Link
          href="/"
          aria-label="Meetly home"
          className="flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-4"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm">
            <Video size={20} strokeWidth={2.2} aria-hidden="true" />
          </div>

          <div>
            <p className="text-lg font-bold tracking-tight text-slate-900">
              Meetly
            </p>
            <p className="text-xs text-slate-500">Meeting Scheduler</p>
          </div>
        </Link>
      </div>

      <nav
        aria-label="Main navigation"
        className="flex-1 space-y-1 overflow-y-auto px-4 py-6"
      >
        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Workspace
        </p>

        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = isNavigationItemActive(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={`${linkBaseStyles} ${
                isActive
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <Icon
                size={18}
                strokeWidth={2}
                aria-hidden="true"
                className="shrink-0"
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="shrink-0 border-t border-slate-200 p-4">
        <Link
          href="/settings"
          aria-current={
            isNavigationItemActive(pathname, "/settings") ? "page" : undefined
          }
          className={`${linkBaseStyles} ${
            isNavigationItemActive(pathname, "/settings")
              ? "bg-slate-900 text-white"
              : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          }`}
        >
          <Settings size={18} strokeWidth={2} aria-hidden="true" />
          <span>Settings</span>
        </Link>

        <div className="mt-4 rounded-xl bg-slate-50 p-3">
          <div className="flex items-center gap-3">
            <div
              aria-hidden="true"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-700"
            >
              AY
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900">
                Abdi Yare
              </p>
              <p className="truncate text-xs text-slate-500">
                Personal workspace
              </p>
            </div>

            <ChevronLeft
              aria-hidden="true"
              className="ml-auto rotate-180 text-slate-400"
              size={16}
            />
          </div>
        </div>
      </div>
    </aside>
  );
}
