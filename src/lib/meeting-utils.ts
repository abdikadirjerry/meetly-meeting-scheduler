import type { Meeting, MeetingType } from "@/types/meeting";

export function getMeetingDateTime(date: string, time: string): Date {
  return new Date(`${date}T${time}:00`);
}

export function isMeetingToday(meeting: Meeting): boolean {
  const today = new Date();
  const meetingDate = getMeetingDateTime(meeting.date, meeting.startTime);

  return (
    meetingDate.getFullYear() === today.getFullYear() &&
    meetingDate.getMonth() === today.getMonth() &&
    meetingDate.getDate() === today.getDate()
  );
}

export function isMeetingUpcoming(meeting: Meeting): boolean {
  if (meeting.completed) {
    return false;
  }

  return getMeetingDateTime(meeting.date, meeting.startTime) > new Date();
}

export function isMeetingPast(meeting: Meeting): boolean {
  return getMeetingDateTime(meeting.date, meeting.endTime) < new Date();
}

export function getMeetingTypeLabel(type: MeetingType): string {
  const labels: Record<MeetingType, string> = {
    work: "Work",
    personal: "Personal",
    interview: "Interview",
    education: "Education",
    other: "Other",
  };

  return labels[type];
}

export function formatMeetingDate(date: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(getMeetingDateTime(date, "12:00"));
}

export function formatMeetingTime(time: string): string {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(getMeetingDateTime("2000-01-01", time));
}
