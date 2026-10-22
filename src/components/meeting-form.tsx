"use client";

import { useState } from "react";
import type { FormEvent, KeyboardEvent } from "react";
import {
  CalendarDays,
  Clock3,
  Loader2,
  MapPin,
  Plus,
  UserPlus,
  Users,
  X,
} from "lucide-react";

import type { Meeting, MeetingType } from "@/types/meeting";
import { getScheduleValidationError } from "@/lib/meeting-scheduling";

interface MeetingFormProps {
  meeting?: Meeting;
  onCreateMeeting?: (meeting: Meeting) => boolean | void;
  onUpdateMeeting?: (meeting: Meeting) => boolean | void;
  onCancel: () => void;
}

interface FormErrors {
  title?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  location?: string;
}

const meetingTypes: { value: MeetingType; label: string }[] = [
  { value: "work", label: "Work" },
  { value: "personal", label: "Personal" },
  { value: "interview", label: "Interview" },
  { value: "education", label: "Education" },
  { value: "other", label: "Other" },
];

function getTodayDate() {
  const today = new Date();

  return [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");
}

export function MeetingForm({
  meeting,
  onCreateMeeting,
  onUpdateMeeting,
  onCancel,
}: MeetingFormProps) {
  const isEditing = Boolean(meeting);

  const [title, setTitle] = useState(meeting?.title ?? "");
  const [description, setDescription] = useState(meeting?.description ?? "");
  const [date, setDate] = useState(meeting?.date ?? getTodayDate());
  const [startTime, setStartTime] = useState(meeting?.startTime ?? "");
  const [endTime, setEndTime] = useState(meeting?.endTime ?? "");
  const [location, setLocation] = useState(meeting?.location ?? "");
  const [meetingType, setMeetingType] = useState<MeetingType>(
    meeting?.type ?? "work",
  );
  const [attendeeInput, setAttendeeInput] = useState("");
  const [attendees, setAttendees] = useState<string[]>(
    meeting?.attendees ?? [],
  );
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  function addAttendee() {
    const name = attendeeInput.trim();

    if (!name) {
      return;
    }

    if (
      attendees.some(
        (attendee) => attendee.toLowerCase() === name.toLowerCase(),
      )
    ) {
      setAttendeeInput("");
      return;
    }

    setAttendees((current) => [...current, name]);
    setAttendeeInput("");
  }

  function removeAttendee(name: string) {
    setAttendees((current) => current.filter((attendee) => attendee !== name));
  }

  function handleAttendeeKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      addAttendee();
    }
  }

  function validateForm(): FormErrors {
    const nextErrors: FormErrors = {};

    if (!title.trim()) {
      nextErrors.title = "Meeting title is required.";
    }

    if (!date) {
      nextErrors.date = "Meeting date is required.";
    } else {
      const parsedDate = new Date(`${date}T00:00:00`);

      if (Number.isNaN(parsedDate.getTime()) || date.length !== 10) {
        nextErrors.date = "Please enter a valid meeting date.";
      }
    }

    if (!startTime) {
      nextErrors.startTime = "Start time is required.";
    }

    if (!endTime) {
      nextErrors.endTime = "End time is required.";
    }

    if (startTime && endTime && endTime <= startTime) {
      nextErrors.endTime = "End time must be later than the start time.";
    }

    if (location.trim() && location.trim().length < 2) {
      nextErrors.location = "Location must contain at least 2 characters.";
    }

    return nextErrors;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    const nextErrors = validateForm();

    setErrors(nextErrors);
    setFormError("");

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const meetingData: Meeting = {
      id: meeting?.id ?? crypto.randomUUID(),
      title: title.trim(),
      description: description.trim() || undefined,
      date,
      startTime,
      endTime,
      location: location.trim() || undefined,
      type: meetingType,
      attendees,
      completed: meeting?.completed ?? false,
      ...(meeting?.meetingLink ? { meetingLink: meeting.meetingLink } : {}),
    };

    const scheduleError = getScheduleValidationError(meetingData, []);
    if (scheduleError) {
      setFormError(scheduleError);
      return;
    }

    setIsSubmitting(true);

    try {
      const result = meeting
        ? onUpdateMeeting?.(meetingData)
        : onCreateMeeting?.(meetingData);

      if (result === false) {
        setFormError(
          "This meeting could not be saved. Review the schedule and try again.",
        );
        setIsSubmitting(false);
        return;
      }

      onCancel();
    } catch {
      setFormError("Something went wrong while saving this meeting.");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/40 p-4 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="meeting-form-title"
        className="my-8 w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-5 sm:px-6">
          <div>
            <h2
              id="meeting-form-title"
              className="text-lg font-bold tracking-tight text-slate-950"
            >
              {isEditing ? "Edit meeting" : "Schedule a meeting"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {isEditing
                ? "Update the details for this appointment."
                : "Add the details for your new appointment."}
            </p>
          </div>

          <button
            type="button"
            onClick={onCancel}
            aria-label="Close meeting form"
            className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="max-h-[calc(100vh-12rem)] space-y-6 overflow-y-auto px-5 py-6 sm:px-6">
            {formError && (
              <p
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
              >
                {formError}
              </p>
            )}

            <div>
              <label
                htmlFor="meeting-title"
                className="mb-2 block text-sm font-semibold text-slate-800"
              >
                Meeting title <span className="text-red-500">*</span>
              </label>
              <input
                id="meeting-title"
                type="text"
                value={title}
                onChange={(event) => {
                  setTitle(event.target.value);
                  setErrors((current) => ({ ...current, title: undefined }));
                }}
                placeholder="e.g. Project planning session"
                className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:ring-2 ${
                  errors.title
                    ? "border-red-300 focus:ring-red-100"
                    : "border-slate-200 focus:ring-slate-100"
                }`}
              />
              {errors.title && (
                <p className="mt-1.5 text-xs font-medium text-red-600">
                  {errors.title}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="meeting-description"
                className="mb-2 block text-sm font-semibold text-slate-800"
              >
                Description
              </label>
              <textarea
                id="meeting-description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Add a short description or agenda..."
                rows={3}
                className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-100"
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-3">
              <div className="sm:col-span-3">
                <label
                  htmlFor="meeting-date"
                  className="mb-2 block text-sm font-semibold text-slate-800"
                >
                  Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <CalendarDays
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    id="meeting-date"
                    type="date"
                    value={date}
                    onChange={(event) => {
                      setDate(event.target.value);
                      setErrors((current) => ({ ...current, date: undefined }));
                    }}
                    className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-100"
                  />
                </div>
                {errors.date && (
                  <p className="mt-1.5 text-xs font-medium text-red-600">
                    {errors.date}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="meeting-start-time"
                  className="mb-2 block text-sm font-semibold text-slate-800"
                >
                  Start time <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Clock3
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    id="meeting-start-time"
                    type="time"
                    value={startTime}
                    onChange={(event) => {
                      setStartTime(event.target.value);
                      setErrors((current) => ({
                        ...current,
                        startTime: undefined,
                        endTime: undefined,
                      }));
                    }}
                    className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-100"
                  />
                </div>
                {errors.startTime && (
                  <p className="mt-1.5 text-xs font-medium text-red-600">
                    {errors.startTime}
                  </p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="meeting-end-time"
                  className="mb-2 block text-sm font-semibold text-slate-800"
                >
                  End time <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Clock3
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    id="meeting-end-time"
                    type="time"
                    value={endTime}
                    onChange={(event) => {
                      setEndTime(event.target.value);
                      setErrors((current) => ({
                        ...current,
                        endTime: undefined,
                      }));
                    }}
                    className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-100"
                  />
                </div>
                {errors.endTime && (
                  <p className="mt-1.5 text-xs font-medium text-red-600">
                    {errors.endTime}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="meeting-location"
                className="mb-2 block text-sm font-semibold text-slate-800"
              >
                Location or meeting link
              </label>
              <div className="relative">
                <MapPin
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  id="meeting-location"
                  type="text"
                  value={location}
                  onChange={(event) => {
                    setLocation(event.target.value);
                    setErrors((current) => ({
                      ...current,
                      location: undefined,
                    }));
                  }}
                  placeholder="e.g. Office, Google Meet, or meeting URL"
                  className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-100"
                />
              </div>
              {errors.location && (
                <p className="mt-1.5 text-xs font-medium text-red-600">
                  {errors.location}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="meeting-type"
                className="mb-2 block text-sm font-semibold text-slate-800"
              >
                Meeting type
              </label>
              <select
                id="meeting-type"
                value={meetingType}
                onChange={(event) =>
                  setMeetingType(event.target.value as MeetingType)
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-100"
              >
                {meetingTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="meeting-attendees"
                className="mb-2 block text-sm font-semibold text-slate-800"
              >
                Attendees
              </label>
              <div className="flex gap-2">
                <div className="relative min-w-0 flex-1">
                  <UserPlus
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    id="meeting-attendees"
                    type="text"
                    value={attendeeInput}
                    onChange={(event) => setAttendeeInput(event.target.value)}
                    onKeyDown={handleAttendeeKeyDown}
                    placeholder="Enter attendee name"
                    className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-100"
                  />
                </div>
                <button
                  type="button"
                  onClick={addAttendee}
                  className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <Plus size={17} />
                  <span className="hidden sm:inline">Add</span>
                </button>
              </div>

              {attendees.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {attendees.map((attendee) => (
                    <span
                      key={attendee}
                      className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700"
                    >
                      <Users size={13} />
                      {attendee}
                      <button
                        type="button"
                        onClick={() => removeAttendee(attendee)}
                        aria-label={`Remove ${attendee}`}
                        className="rounded-full p-0.5 text-slate-400 hover:bg-white hover:text-slate-900"
                      >
                        <X size={13} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={17} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <CalendarDays size={17} />
                  {isEditing ? "Save changes" : "Create meeting"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
