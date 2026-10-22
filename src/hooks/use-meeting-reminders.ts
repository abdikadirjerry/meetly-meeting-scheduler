"use client";

import { useEffect, useRef } from "react";

import { getMeetingDateTime } from "@/lib/meeting-utils";
import type { Meeting } from "@/types/meeting";
import type { AppNotification } from "@/types/notification";

const CHECK_INTERVAL_MS = 30_000;
const REMINDER_WINDOW_MS = 10 * 60 * 1000;
const MEETING_STARTED_WINDOW_MS = 5 * 60 * 1000;

interface UseMeetingRemindersOptions {
  meetings: Meeting[];
  notifications: AppNotification[];
  addNotification: (notification: Omit<AppNotification, "read">) => void;
}

export function useMeetingReminders({
  meetings,
  notifications,
  addNotification,
}: UseMeetingRemindersOptions) {
  const triggeredIds = useRef(new Set<string>());

  useEffect(() => {
    function checkMeetings() {
      const now = Date.now();

      for (const meeting of meetings) {
        if (meeting.completed) {
          continue;
        }

        const startTime = getMeetingDateTime(
          meeting.date,
          meeting.startTime,
        ).getTime();

        const timeUntilStart = startTime - now;

        let type: AppNotification["type"] | null = null;
        let title = "";
        let message = "";
        let notificationId = "";

        if (timeUntilStart > 0 && timeUntilStart <= REMINDER_WINDOW_MS) {
          type = "meeting-reminder";
          title = "Meeting coming up";
          message = `"${meeting.title}" starts in 10 minutes or less.`;
          notificationId = `reminder-${meeting.id}-${meeting.date}-${meeting.startTime}`;
        } else if (
          timeUntilStart <= 0 &&
          timeUntilStart >= -MEETING_STARTED_WINDOW_MS
        ) {
          type = "meeting-started";
          title = "Meeting time";
          message = `"${meeting.title}" is scheduled to start now.`;
          notificationId = `started-${meeting.id}-${meeting.date}-${meeting.startTime}`;
        }

        if (
          !type ||
          triggeredIds.current.has(notificationId) ||
          notifications.some(
            (notification) => notification.id === notificationId,
          )
        ) {
          continue;
        }

        triggeredIds.current.add(notificationId);

        addNotification({
          id: notificationId,
          type,
          title,
          message,
          meetingId: meeting.id,
          createdAt: new Date().toISOString(),
        });

        if (
          typeof window !== "undefined" &&
          "Notification" in window &&
          window.Notification.permission === "granted"
        ) {
          try {
            const browserNotification = new window.Notification(title, {
              body: message,
              tag: notificationId,
            });

            browserNotification.onclick = () => {
              window.focus();
              browserNotification.close();
            };
          } catch {
            console.warn("Meetly could not display a browser notification.");
          }
        }
      }
    }

    checkMeetings();

    const intervalId = window.setInterval(checkMeetings, CHECK_INTERVAL_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [meetings, notifications, addNotification]);
}
