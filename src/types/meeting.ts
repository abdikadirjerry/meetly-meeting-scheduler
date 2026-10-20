export type MeetingType =
  | "work"
  | "personal"
  | "interview"
  | "education"
  | "other";

export interface Meeting {
  id: string;
  title: string;
  description?: string;
  date: string;
  startTime: string;
  endTime: string;
  location?: string;
  meetingLink?: string;
  type: MeetingType;
  attendees: string[];
  completed: boolean;
}
