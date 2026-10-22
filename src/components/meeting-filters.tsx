"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";

import type { MeetingType } from "@/types/meeting";

export type MeetingStatusFilter = "all" | "upcoming" | "past" | "completed";

export type MeetingSortOption = "date-asc" | "date-desc" | "title-asc";

interface MeetingFiltersProps {
  search: string;
  type: MeetingType | "all";
  status: MeetingStatusFilter;
  sort: MeetingSortOption;
  onSearchChange: (value: string) => void;
  onTypeChange: (value: MeetingType | "all") => void;
  onStatusChange: (value: MeetingStatusFilter) => void;
  onSortChange: (value: MeetingSortOption) => void;
  onClear: () => void;
}

const meetingTypes: {
  value: MeetingType | "all";
  label: string;
}[] = [
  { value: "all", label: "All types" },
  { value: "work", label: "Work" },
  { value: "personal", label: "Personal" },
  { value: "interview", label: "Interview" },
  { value: "education", label: "Education" },
  { value: "other", label: "Other" },
];

const statusFilters: {
  value: MeetingStatusFilter;
  label: string;
}[] = [
  { value: "all", label: "All meetings" },
  { value: "upcoming", label: "Upcoming" },
  { value: "past", label: "Past meetings" },
  { value: "completed", label: "Completed" },
];

const sortOptions: {
  value: MeetingSortOption;
  label: string;
}[] = [
  { value: "date-asc", label: "Date: earliest first" },
  { value: "date-desc", label: "Date: latest first" },
  { value: "title-asc", label: "Title: A–Z" },
];

export function MeetingFilters({
  search,
  type,
  status,
  sort,
  onSearchChange,
  onTypeChange,
  onStatusChange,
  onSortChange,
  onClear,
}: MeetingFiltersProps) {
  const hasActiveFilters =
    search.trim() !== "" ||
    type !== "all" ||
    status !== "all" ||
    sort !== "date-asc";

  return (
    <section
      aria-label="Meeting search and filters"
      className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
    >
      <div className="mb-4 flex items-center gap-2">
        <SlidersHorizontal size={18} className="text-slate-500" />
        <h2 className="text-sm font-semibold text-slate-900">
          Search and filters
        </h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="sm:col-span-2 xl:col-span-1">
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
              placeholder="Search by title, details, attendees..."
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition-shadow placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="meeting-type-filter"
            className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400"
          >
            Meeting type
          </label>

          <select
            id="meeting-type-filter"
            value={type}
            onChange={(event) =>
              onTypeChange(event.target.value as MeetingType | "all")
            }
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
          >
            {meetingTypes.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        <div>
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
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
          >
            {statusFilters.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="meeting-sort"
            className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400"
          >
            Sort by
          </label>

          <select
            id="meeting-sort"
            value={sort}
            onChange={(event) =>
              onSortChange(event.target.value as MeetingSortOption)
            }
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
          >
            {sortOptions.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
          <p className="text-xs text-slate-500">
            Your meeting list reflects the selected search, filters, and
            sorting.
          </p>

          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950"
          >
            <X size={15} />
            Reset all
          </button>
        </div>
      )}
    </section>
  );
}
