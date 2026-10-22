"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";

import type { MeetingType } from "@/types/meeting";

export type MeetingStatusFilter = "all" | "upcoming" | "completed";

interface MeetingFiltersProps {
  search: string;
  type: MeetingType | "all";
  status: MeetingStatusFilter;
  onSearchChange: (value: string) => void;
  onTypeChange: (value: MeetingType | "all") => void;
  onStatusChange: (value: MeetingStatusFilter) => void;
  onClear: () => void;
}

const meetingTypes: {
  value: MeetingType | "all";
  label: string;
}[] = [
  {
    value: "all",
    label: "All types",
  },
  {
    value: "work",
    label: "Work",
  },
  {
    value: "personal",
    label: "Personal",
  },
  {
    value: "interview",
    label: "Interview",
  },
  {
    value: "education",
    label: "Education",
  },
  {
    value: "other",
    label: "Other",
  },
];

const statusFilters: {
  value: MeetingStatusFilter;
  label: string;
}[] = [
  {
    value: "all",
    label: "All meetings",
  },
  {
    value: "upcoming",
    label: "Upcoming",
  },
  {
    value: "completed",
    label: "Completed",
  },
];

export function MeetingFilters({
  search,
  type,
  status,
  onSearchChange,
  onTypeChange,
  onStatusChange,
  onClear,
}: MeetingFiltersProps) {
  const hasActiveFilters =
    search.trim() !== "" || type !== "all" || status !== "all";

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
        <div className="min-w-0 flex-1">
          <label
            htmlFor="meeting-search"
            className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400"
          >
            Search meetings
          </label>

          <div className="relative">
            <Search
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              id="meeting-search"
              type="search"
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search by title, description, location..."
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition-shadow placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
            />
          </div>
        </div>

        <div className="w-full lg:w-48">
          <label
            htmlFor="meeting-type-filter"
            className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400"
          >
            Type
          </label>

          <select
            id="meeting-type-filter"
            value={type}
            onChange={(event) =>
              onTypeChange(event.target.value as MeetingType | "all")
            }
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-shadow focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
          >
            {meetingTypes.map((meetingType) => (
              <option key={meetingType.value} value={meetingType.value}>
                {meetingType.label}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full lg:w-48">
          <label
            htmlFor="meeting-status-filter"
            className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400"
          >
            Status
          </label>

          <select
            id="meeting-status-filter"
            value={status}
            onChange={(event) =>
              onStatusChange(event.target.value as MeetingStatusFilter)
            }
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-shadow focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
          >
            {statusFilters.map((statusFilter) => (
              <option key={statusFilter.value} value={statusFilter.value}>
                {statusFilter.label}
              </option>
            ))}
          </select>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClear}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-950"
          >
            <X size={16} />
            Clear
          </button>
        )}
      </div>

      {hasActiveFilters && (
        <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-4 text-xs text-slate-500">
          <SlidersHorizontal size={14} />
          <span>Filters are active.</span>
        </div>
      )}
    </section>
  );
}
