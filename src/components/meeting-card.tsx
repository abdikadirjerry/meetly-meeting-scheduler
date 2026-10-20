"use client";

import {
  CalendarDays,
  Check,
  Clock3,
  Eye,
  MapPin,
  Pencil,
  Trash2,
  Users,
} from "lucide-react";

import type { Meeting } from "@/types/meeting";
import {
  formatMeetingDate,
  formatMeetingTime,
  getMeetingTypeLabel,
} from "@/lib/meeting-utils";

interface MeetingCardProps {
  meeting: Meeting;
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onToggleComplete?: () => void;
}

const typeStyles: Record<Meeting["type"], string> = {
  work: "bg-blue-50 text-blue-700",
  personal: "bg-emerald-50 text-emerald-700",
  interview: "bg-violet-50 text-violet-700",
  education: "bg-amber-50 text-amber-700",
  other: "bg-slate-100 text-slate-700",
};

export function MeetingCard({
  meeting,
  onView,
  onEdit,
  onDelete,
  onToggleComplete,
}: MeetingCardProps) {
  return (
    <article
      className={`rounded-2xl border bg-white p-5 shadow-sm transition-shadow hover:shadow-md ${
        meeting.completed ? "border-slate-200 opacity-75" : "border-slate-200"
      }`}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${typeStyles[meeting.type]}`}
            >
              {getMeetingTypeLabel(meeting.type)}
            </span>

            {meeting.completed && (
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                Completed
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={onView}
            className="text-left text-base font-semibold text-slate-900 transition-colors hover:text-slate-600"
          >
            {meeting.title}
          </button>

          {meeting.description && (
            <p className="mt-1 line-clamp-2 text-sm leading-5 text-slate-500">
              {meeting.description}
            </p>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-1">
          {onView && (
            <button
              type="button"
              onClick={onView}
              aria-label={`View ${meeting.title}`}
              className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-900"
            >
              <Eye size={17} />
            </button>
          )}

          {onEdit && (
            <button
              type="button"
              onClick={onEdit}
              aria-label={`Edit ${meeting.title}`}
              className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-900"
            >
              <Pencil size={17} />
            </button>
          )}

          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              aria-label={`Delete ${meeting.title}`}
              className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 size={17} />
            </button>
          )}
        </div>
      </div>

      <div className="mt-5 grid gap-3 border-t border-slate-100 pt-4 sm:grid-cols-2">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <CalendarDays size={16} className="shrink-0 text-slate-400" />
          <span>{formatMeetingDate(meeting.date)}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Clock3 size={16} className="shrink-0 text-slate-400" />
          <span>
            {formatMeetingTime(meeting.startTime)} —{" "}
            {formatMeetingTime(meeting.endTime)}
          </span>
        </div>

        {meeting.location && (
          <div className="flex min-w-0 items-center gap-2 text-sm text-slate-500">
            <MapPin size={16} className="shrink-0 text-slate-400" />
            <span className="truncate">{meeting.location}</span>
          </div>
        )}

        {meeting.attendees.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Users size={16} className="shrink-0 text-slate-400" />
            <span>
              {meeting.attendees.length}{" "}
              {meeting.attendees.length === 1 ? "attendee" : "attendees"}
            </span>
          </div>
        )}
      </div>

      {onToggleComplete && !meeting.completed && (
        <div className="mt-4 border-t border-slate-100 pt-4">
          <button
            type="button"
            onClick={onToggleComplete}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 transition-colors hover:text-slate-900"
          >
            <Check size={15} />
            Mark as completed
          </button>
        </div>
      )}
    </article>
  );
}
