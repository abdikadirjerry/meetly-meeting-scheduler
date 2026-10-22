"use client";

import { useEffect, useRef } from "react";
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

const actionButtonStyles =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2";

export function MeetingDetails({
  meeting,
  onClose,
  onEdit,
  onDelete,
  onToggleComplete,
}: MeetingDetailsProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, meeting.id]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/50 p-3 backdrop-blur-sm sm:items-center sm:p-5"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="meeting-details-title"
        aria-describedby={
          meeting.description ? "meeting-details-description" : undefined
        }
        className="my-auto w-full max-w-xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-4 py-4 sm:px-6 sm:py-5">
          <div className="min-w-0 flex-1">
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
              className="break-words text-lg font-bold leading-7 tracking-tight text-slate-950 sm:text-xl"
            >
              {meeting.title}
            </h2>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close meeting details"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <div className="max-h-[calc(100dvh-13rem)] space-y-6 overflow-y-auto px-4 py-5 sm:max-h-[65dvh] sm:px-6 sm:py-6">
          {meeting.description && (
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Description
              </p>

              <p
                id="meeting-details-description"
                className="break-words text-sm leading-6 text-slate-700"
              >
                {meeting.description}
              </p>
            </div>
          )}

          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
            <div className="min-w-0 rounded-xl bg-slate-50 p-3.5 sm:p-4">
              <div className="mb-2 flex items-center gap-2 text-slate-500">
                <CalendarDays size={17} aria-hidden="true" />
                <span className="text-xs font-semibold uppercase tracking-wide">
                  Date
                </span>
              </div>

              <p className="break-words text-sm font-semibold text-slate-900">
                {formatMeetingDate(meeting.date)}
              </p>
            </div>

            <div className="min-w-0 rounded-xl bg-slate-50 p-3.5 sm:p-4">
              <div className="mb-2 flex items-center gap-2 text-slate-500">
                <Clock3 size={17} aria-hidden="true" />
                <span className="text-xs font-semibold uppercase tracking-wide">
                  Time
                </span>
              </div>

              <p className="break-words text-sm font-semibold text-slate-900">
                {formatMeetingTime(meeting.startTime)} —{" "}
                {formatMeetingTime(meeting.endTime)}
              </p>
            </div>

            {meeting.location && (
              <div className="min-w-0 rounded-xl bg-slate-50 p-3.5 sm:col-span-2 sm:p-4">
                <div className="mb-2 flex items-center gap-2 text-slate-500">
                  <MapPin size={17} aria-hidden="true" />
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
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-lg text-sm font-semibold text-slate-700 underline-offset-4 hover:text-slate-950 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2"
                  >
                    Open meeting link
                    <ExternalLink size={14} aria-hidden="true" />
                  </a>
                )}
              </div>
            )}
          </div>

          <section aria-labelledby="meeting-attendees-title">
            <div className="mb-3 flex items-center gap-2">
              <Users size={17} className="text-slate-500" aria-hidden="true" />

              <h3
                id="meeting-attendees-title"
                className="text-xs font-semibold uppercase tracking-wider text-slate-500"
              >
                Attendees
              </h3>
            </div>

            {meeting.attendees.length > 0 ? (
              <ul className="flex flex-wrap gap-2">
                {meeting.attendees.map((attendee, index) => (
                  <li
                    key={`${attendee}-${index}`}
                    className="max-w-full break-words rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700"
                  >
                    {attendee}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-600">No attendees added.</p>
            )}
          </section>
        </div>

        <div className="border-t border-slate-200 bg-slate-50 px-4 py-4 sm:px-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={onDelete}
              className={`${actionButtonStyles} text-red-600 hover:bg-red-50 focus-visible:ring-red-500`}
            >
              Delete meeting
            </button>

            <div className="grid grid-cols-1 gap-2 sm:flex sm:flex-row">
              <button
                type="button"
                onClick={onToggleComplete}
                className={`${actionButtonStyles} border border-slate-200 bg-white text-slate-700 hover:bg-slate-100`}
              >
                {meeting.completed ? "Mark as upcoming" : "Mark as completed"}
              </button>

              <button
                type="button"
                onClick={onEdit}
                className={`${actionButtonStyles} bg-slate-900 text-white hover:bg-slate-800 focus-visible:ring-slate-700`}
              >
                <Pencil size={16} aria-hidden="true" />
                Edit meeting
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
