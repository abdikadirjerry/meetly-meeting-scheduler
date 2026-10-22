export type NotificationType =
  | "meeting-reminder"
  | "meeting-started"
  | "meeting-updated"
  | "meeting-cancelled";

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  meetingId?: string;
  createdAt: string;
  read: boolean;
}
