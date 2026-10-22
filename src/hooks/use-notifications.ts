"use client";

import { useCallback, useEffect, useState } from "react";

import type { AppNotification } from "@/types/notification";

const STORAGE_KEY = "meetly-notifications";

function isAppNotification(value: unknown): value is AppNotification {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const notification = value as Record<string, unknown>;

  return (
    typeof notification.id === "string" &&
    typeof notification.type === "string" &&
    typeof notification.title === "string" &&
    typeof notification.message === "string" &&
    typeof notification.createdAt === "string" &&
    typeof notification.read === "boolean"
  );
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    queueMicrotask(() => {
      if (cancelled) {
        return;
      }

      try {
        const storedValue = window.localStorage.getItem(STORAGE_KEY);

        if (storedValue !== null) {
          const parsedValue: unknown = JSON.parse(storedValue);

          if (
            Array.isArray(parsedValue) &&
            parsedValue.every(isAppNotification)
          ) {
            setNotifications(parsedValue);
          } else {
            console.warn("Meetly found invalid saved notification data.");
          }
        }
      } catch {
        console.warn("Meetly could not read saved notifications.");
      } finally {
        setIsLoaded(true);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    } catch {
      console.error("Meetly could not save notifications.");
    }
  }, [notifications, isLoaded]);

  const addNotification = useCallback(
    (notification: Omit<AppNotification, "read">) => {
      setNotifications((current) => {
        if (current.some((item) => item.id === notification.id)) {
          return current;
        }

        return [{ ...notification, read: false }, ...current].slice(0, 50);
      });
    },
    [],
  );

  const markAsRead = useCallback((id: string) => {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification,
      ),
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((current) =>
      current.map((notification) => ({
        ...notification,
        read: true,
      })),
    );
  }, []);

  const deleteNotification = useCallback((id: string) => {
    setNotifications((current) =>
      current.filter((notification) => notification.id !== id),
    );
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const unreadCount = notifications.filter(
    (notification) => !notification.read,
  ).length;

  return {
    notifications,
    isLoaded,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearNotifications,
  };
}
