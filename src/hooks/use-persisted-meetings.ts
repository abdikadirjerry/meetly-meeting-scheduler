"use client";

import { useEffect, useState } from "react";

import type { Meeting } from "@/types/meeting";

const STORAGE_KEY = "meetly-meetings";

function isMeeting(value: unknown): value is Meeting {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const meeting = value as Record<string, unknown>;

  return (
    typeof meeting.id === "string" &&
    typeof meeting.title === "string" &&
    typeof meeting.date === "string" &&
    typeof meeting.startTime === "string" &&
    typeof meeting.endTime === "string" &&
    typeof meeting.type === "string" &&
    typeof meeting.completed === "boolean" &&
    Array.isArray(meeting.attendees) &&
    meeting.attendees.every((attendee) => typeof attendee === "string")
  );
}

export function usePersistedMeetings(initialMeetings: Meeting[]) {
  const [meetings, setMeetings] = useState<Meeting[]>(initialMeetings);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedValue = window.localStorage.getItem(STORAGE_KEY);

      if (storedValue !== null) {
        const parsedValue: unknown = JSON.parse(storedValue);

        if (Array.isArray(parsedValue) && parsedValue.every(isMeeting)) {
          setMeetings(parsedValue);
        } else {
          console.warn(
            "Meetly found invalid saved meeting data. Using the initial meetings.",
          );
        }
      }
    } catch {
      console.warn(
        "Meetly could not read saved meetings. Using the initial meetings.",
      );
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(meetings));
    } catch {
      console.error(
        "Meetly could not save meetings. Check browser storage availability.",
      );
    }
  }, [meetings, isLoaded]);

  return { meetings, setMeetings, isLoaded };
}
