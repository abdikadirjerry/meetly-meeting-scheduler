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

const iconButtonStyles =
  "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2";

export function MeetingCard({
  meeting,
  onView,
  onEdit,
  onDelete,
  onToggleComplete,
}: MeetingCardProps) {
  return (
    <article
      aria-label={`Meeting: ${meeting.title}`}
      className={`min-w-0 rounded-2xl border bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5 ${
        meeting.completed ? "border-emerald-200" : "border-slate-200"
      }`}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${typeStyles[meeting.type]}`}
            >
              {getMeetingTypeLabel(meeting.type)}
            </span>

            {meeting.completed && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                <Check size={12} aria-hidden="true" />
                Completed
              </span>
            )}
          </div>

          {onView ? (
            <button
              type="button"
              onClick={onView}
              className="max-w-full rounded-sm text-left text-base font-semibold leading-6 text-slate-900 transition-colors hover:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2"
            >
              {meeting.title}
            </button>
          ) : (
            <h3 className="break-words text-base font-semibold leading-6 text-slate-900">
              {meeting.title}
            </h3>
          )}

          {meeting.description && (
            <p className="mt-1 line-clamp-2 break-words text-sm leading-5 text-slate-600">
              {meeting.description}
            </p>
          )}
        </div>

        {(onView || onEdit || onDelete) && (
          <div
            aria-label="Meeting actions"
            className="flex flex-wrap items-center gap-1 sm:justify-end"
          >
            {onView && (
              <button
                type="button"
                onClick={onView}
                aria-label={`View ${meeting.title}`}
                title="View meeting"
                className={iconButtonStyles}
              >
                <Eye size={18} aria-hidden="true" />
              </button>
            )}

            {onEdit && (
              <button
                type="button"
                onClick={onEdit}
                aria-label={`Edit ${meeting.title}`}
                title="Edit meeting"
                className={iconButtonStyles}
              >
                <Pencil size={18} aria-hidden="true" />
              </button>
            )}

            {onDelete && (
              <button
                type="button"
                onClick={onDelete}
                aria-label={`Delete ${meeting.title}`}
                title="Delete meeting"
                className={`${iconButtonStyles} hover:bg-red-50 hover:text-red-600 focus-visible:ring-red-500`}
              >
                <Trash2 size={18} aria-hidden="true" />
              </button>
            )}
          </div>
        )}
      </div>

      <div className="mt-5 grid min-w-0 gap-3 border-t border-slate-100 pt-4 sm:grid-cols-2">
        <div className="flex min-w-0 items-start gap-2 text-sm text-slate-600">
          <CalendarDays
            size={16}
            aria-hidden="true"
            className="mt-0.5 shrink-0 text-slate-400"
          />
          <span className="break-words">{formatMeetingDate(meeting.date)}</span>
        </div>

        <div className="flex min-w-0 items-start gap-2 text-sm text-slate-600">
          <Clock3
            size={16}
            aria-hidden="true"
            className="mt-0.5 shrink-0 text-slate-400"
          />
          <span className="break-words">
            {formatMeetingTime(meeting.startTime)} —{" "}
            {formatMeetingTime(meeting.endTime)}
          </span>
        </div>

        {meeting.location && (
          <div className="flex min-w-0 items-start gap-2 text-sm text-slate-600">
            <MapPin
              size={16}
              aria-hidden="true"
              className="mt-0.5 shrink-0 text-slate-400"
            />
            <span className="break-words">{meeting.location}</span>
          </div>
        )}

        {meeting.attendees.length > 0 && (
          <div className="flex min-w-0 items-start gap-2 text-sm text-slate-600">
            <Users
              size={16}
              aria-hidden="true"
              className="mt-0.5 shrink-0 text-slate-400"
            />
            <span>
              {meeting.attendees.length}{" "}
              {meeting.attendees.length === 1 ? "attendee" : "attendees"}
            </span>
          </div>
        )}
      </div>

      {onToggleComplete && (
        <div className="mt-4 border-t border-slate-100 pt-3">
          <button
            type="button"
            onClick={onToggleComplete}
            className="inline-flex min-h-11 items-center gap-2 rounded-lg px-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2"
          >
            <Check
              size={16}
              aria-hidden="true"
              className={meeting.completed ? "text-emerald-600" : ""}
            />
            {meeting.completed ? "Mark as upcoming" : "Mark as completed"}
          </button>
        </div>
      )}
    </article>
  );
}
