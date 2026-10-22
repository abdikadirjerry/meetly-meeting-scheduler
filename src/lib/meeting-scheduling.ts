import type { Meeting } from "@/types/meeting";

export interface MeetingScheduleInput {
  id?: string;
  date: string;
  startTime: string;
  endTime: string;
}

export function findMeetingConflict(
  candidate: MeetingScheduleInput,
  meetings: Meeting[],
): Meeting | undefined {
  if (
    !candidate.date ||
    !candidate.startTime ||
    !candidate.endTime ||
    candidate.endTime <= candidate.startTime
  ) {
    return undefined;
  }

  return meetings.find((meeting) => {
    if (meeting.id === candidate.id) {
      return false;
    }

    if (meeting.date !== candidate.date || meeting.completed) {
      return false;
    }

    return (
      candidate.startTime < meeting.endTime &&
      candidate.endTime > meeting.startTime
    );
  });
}

export function getScheduleValidationError(
  candidate: MeetingScheduleInput,
  meetings: Meeting[],
): string | null {
  if (!candidate.date || !candidate.startTime || !candidate.endTime) {
    return "Please provide the meeting date, start time, and end time.";
  }

  if (candidate.endTime <= candidate.startTime) {
    return "End time must be later than the start time.";
  }

  const conflict = findMeetingConflict(candidate, meetings);

  if (conflict) {
    return `This meeting overlaps with "${conflict.title}" (${conflict.startTime}–${conflict.endTime}). Choose another time.`;
  }

  return null;
}
