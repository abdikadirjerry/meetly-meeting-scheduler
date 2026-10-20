import { CalendarDays, Clock3, MapPin, Users } from "lucide-react";

import type { Meeting } from "@/types/meeting";
import {
  formatMeetingDate,
  formatMeetingTime,
  getMeetingTypeLabel,
} from "@/lib/meeting-utils";

interface MeetingCardProps {
  meeting: Meeting;
}

const typeStyles: Record<Meeting["type"], string> = {
  work: "bg-blue-50 text-blue-700",
  personal: "bg-emerald-50 text-emerald-700",
  interview: "bg-violet-50 text-violet-700",
  education: "bg-amber-50 text-amber-700",
  other: "bg-slate-100 text-slate-700",
};

export function MeetingCard({ meeting }: MeetingCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${typeStyles[meeting.type]}`}
            >
              {getMeetingTypeLabel(meeting.type)}
            </span>

            {meeting.completed && (
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">
                Completed
              </span>
            )}
          </div>

          <h3 className="truncate text-base font-semibold text-slate-900">
            {meeting.title}
          </h3>

          {meeting.description && (
            <p className="mt-1 line-clamp-2 text-sm leading-5 text-slate-500">
              {meeting.description}
            </p>
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
    </article>
  );
}
