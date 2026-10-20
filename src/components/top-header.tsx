"use client";

import { Bell, CalendarPlus, Menu, Search } from "lucide-react";

interface TopHeaderProps {
  onMenuClick: () => void;
}

export function TopHeader({ onMenuClick }: TopHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="flex h-20 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Open navigation"
            className="rounded-xl p-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 lg:hidden"
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
            className="hidden rounded-xl border border-slate-200 p-2.5 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900 sm:flex"
          >
            <Search size={18} />
          </button>

          <button
            type="button"
            aria-label="Notifications"
            className="relative rounded-xl border border-slate-200 p-2.5 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900"
          >
            <Bell size={18} />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-slate-900" />
          </button>

          <button
            type="button"
            className="hidden items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-slate-800 sm:flex"
          >
            <CalendarPlus size={17} />
            <span>Schedule Meeting</span>
          </button>

          <button
            type="button"
            aria-label="Schedule meeting"
            className="flex rounded-xl bg-slate-900 p-2.5 text-white shadow-sm transition-colors hover:bg-slate-800 sm:hidden"
          >
            <CalendarPlus size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
