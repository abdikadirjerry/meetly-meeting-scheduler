"use client";

import {
  CalendarDays,
  Clock3,
  ExternalLink,
  MapPin,
  Pencil,
  Users,
  X,
} from "lucide-react";

import type { Meeting } from "@/types/meeting";
import {
  formatMeetingDate,
  formatMeetingTime,
  getMeetingTypeLabel,
} from "@/lib/meeting-utils";

interface MeetingDetailsProps {
  meeting: Meeting;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onToggleComplete: () => void;
}

const typeStyles: Record<Meeting["type"], string> = {
  work: "bg-blue-50 text-blue-700",
  personal: "bg-emerald-50 text-emerald-700",
  interview: "bg-violet-50 text-violet-700",
  education: "bg-amber-50 text-amber-700",
  other: "bg-slate-100 text-slate-700",
};

export function MeetingDetails({
  meeting,
  onClose,
  onEdit,
  onDelete,
  onToggleComplete,
}: MeetingDetailsProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/40 p-4 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="meeting-details-title"
        className="my-8 w-full max-w-xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
      >
        <div className="flex items-start justify-between border-b border-slate-200 px-5 py-5 sm:px-6">
          <div className="min-w-0 pr-4">
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

            <h2
              id="meeting-details-title"
              className="text-xl font-bold tracking-tight text-slate-950"
            >
              {meeting.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close meeting details"
            className="shrink-0 rounded-xl p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6 px-5 py-6 sm:px-6">
          {meeting.description && (
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Description
              </p>

              <p className="text-sm leading-6 text-slate-600">
                {meeting.description}
              </p>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-slate-50 p-4">
              <div className="mb-2 flex items-center gap-2 text-slate-400">
                <CalendarDays size={17} />
                <span className="text-xs font-semibold uppercase tracking-wide">
                  Date
                </span>
              </div>

              <p className="text-sm font-semibold text-slate-900">
                {formatMeetingDate(meeting.date)}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <div className="mb-2 flex items-center gap-2 text-slate-400">
                <Clock3 size={17} />
                <span className="text-xs font-semibold uppercase tracking-wide">
                  Time
                </span>
              </div>

              <p className="text-sm font-semibold text-slate-900">
                {formatMeetingTime(meeting.startTime)} —{" "}
                {formatMeetingTime(meeting.endTime)}
              </p>
            </div>

            {meeting.location && (
              <div className="rounded-xl bg-slate-50 p-4 sm:col-span-2">
                <div className="mb-2 flex items-center gap-2 text-slate-400">
                  <MapPin size={17} />
                  <span className="text-xs font-semibold uppercase tracking-wide">
                    Location
                  </span>
                </div>

                <p className="break-words text-sm font-semibold text-slate-900">
                  {meeting.location}
                </p>

                {meeting.meetingLink && (
                  <a
                    href={meeting.meetingLink}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-700 hover:text-slate-950"
                  >
                    Open meeting link
                    <ExternalLink size={14} />
                  </a>
                )}
              </div>
            )}
          </div>

          <div>
            <div className="mb-3 flex items-center gap-2">
              <Users size={17} className="text-slate-400" />

              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Attendees
              </p>
            </div>

            {meeting.attendees.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {meeting.attendees.map((attendee) => (
                  <span
                    key={attendee}
                    className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700"
                  >
                    {attendee}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">No attendees added.</p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-slate-200 bg-slate-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <button
            type="button"
            onClick={onDelete}
            className="rounded-xl px-4 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
          >
            Delete meeting
          </button>

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={onToggleComplete}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100"
            >
              {meeting.completed ? "Mark as upcoming" : "Mark as completed"}
            </button>

            <button
              type="button"
              onClick={onEdit}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
            >
              <Pencil size={16} />
              Edit meeting
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
