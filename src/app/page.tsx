"use client";

import { useMemo, useState } from "react";
import { ArrowRight, CalendarDays, Clock3, Plus, Sparkles } from "lucide-react";

import { AppSidebar } from "@/components/app-sidebar";
import { MeetingCard } from "@/components/meeting-card";
import { MobileSidebar } from "@/components/mobile-sidebar";
import { StatCard } from "@/components/stat-card";
import { TopHeader } from "@/components/top-header";
import type { Meeting } from "@/types/meeting";
import {
  getMeetingDateTime,
  isMeetingToday,
  isMeetingUpcoming,
} from "@/lib/meeting-utils";

const initialMeetings: Meeting[] = [
  {
    id: "meeting-1",
    title: "Frontend Project Review",
    description:
      "Review the current progress and discuss the next development tasks.",
    date: "2026-10-22",
    startTime: "10:00",
    endTime: "11:00",
    location: "Google Meet",
    meetingLink: "https://meet.google.com",
    type: "work",
    attendees: ["Ahmed", "Mohamed"],
    completed: false,
  },
  {
    id: "meeting-2",
    title: "TypeScript Study Session",
    description:
      "Continue learning TypeScript types, interfaces, and generics.",
    date: "2026-10-23",
    startTime: "15:00",
    endTime: "16:30",
    location: "Online",
    type: "education",
    attendees: ["Abdi"],
    completed: false,
  },
];

export default function Home() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [meetings] = useState<Meeting[]>(initialMeetings);

  const statistics = useMemo(() => {
    const today = meetings.filter(isMeetingToday).length;

    const upcoming = meetings.filter(isMeetingUpcoming).length;

    const completed = meetings.filter((meeting) => meeting.completed).length;

    return {
      total: meetings.length,
      today,
      upcoming,
      completed,
    };
  }, [meetings]);

  const upcomingMeetings = useMemo(() => {
    return meetings
      .filter(isMeetingUpcoming)
      .sort(
        (a, b) =>
          getMeetingDateTime(a.date, a.startTime).getTime() -
          getMeetingDateTime(b.date, b.startTime).getTime(),
      );
  }, [meetings]);

  const nextMeeting = upcomingMeetings[0];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex min-h-screen">
        <AppSidebar />

        <MobileSidebar
          isOpen={isMobileSidebarOpen}
          onClose={() => setIsMobileSidebarOpen(false)}
        />

        <div className="min-w-0 flex-1">
          <TopHeader onMenuClick={() => setIsMobileSidebarOpen(true)} />

          <main className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <section className="mb-8">
              <div className="flex flex-col justify-between gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:flex-row lg:items-center">
                <div className="max-w-2xl">
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700">
                    <Sparkles size={14} />
                    Stay organized
                  </div>

                  <h2 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                    Plan your day with confidence.
                  </h2>

                  <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
                    Keep your meetings organized, see what is coming next, and
                    make every appointment easy to manage.
                  </p>
                </div>

                <button
                  type="button"
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-slate-800"
                >
                  <Plus size={18} />
                  Schedule Meeting
                </button>
              </div>
            </section>

            <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                label="Total meetings"
                value={statistics.total}
                description="All scheduled meetings"
                icon={CalendarDays}
              />

              <StatCard
                label="Today"
                value={statistics.today}
                description="Meetings scheduled today"
                icon={Clock3}
              />

              <StatCard
                label="Upcoming"
                value={statistics.upcoming}
                description="Future meetings"
                icon={Sparkles}
              />

              <StatCard
                label="Completed"
                value={statistics.completed}
                description="Finished meetings"
                icon={ArrowRight}
              />
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
              <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-200 px-5 py-5 sm:px-6">
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      Upcoming meetings
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Your next scheduled appointments.
                    </p>
                  </div>

                  <button
                    type="button"
                    className="hidden items-center gap-1 text-sm font-semibold text-slate-700 transition-colors hover:text-slate-950 sm:flex"
                  >
                    View all
                    <ArrowRight size={15} />
                  </button>
                </div>

                <div className="space-y-4 p-5 sm:p-6">
                  {upcomingMeetings.length > 0 ? (
                    upcomingMeetings
                      .slice(0, 3)
                      .map((meeting) => (
                        <MeetingCard key={meeting.id} meeting={meeting} />
                      ))
                  ) : (
                    <div className="flex min-h-64 items-center justify-center px-4 py-10">
                      <div className="max-w-sm text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                          <CalendarDays size={25} />
                        </div>

                        <h4 className="mt-5 font-semibold text-slate-900">
                          No upcoming meetings
                        </h4>

                        <p className="mt-2 text-sm leading-6 text-slate-500">
                          Your schedule is clear. Create your first meeting to
                          start organizing your calendar.
                        </p>

                        <button
                          type="button"
                          className="mt-5 inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-950"
                        >
                          <Plus size={16} />
                          Create your first meeting
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
                  <h3 className="font-semibold text-slate-900">Next meeting</h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Your closest upcoming appointment.
                  </p>
                </div>

                <div className="p-5 sm:p-6">
                  {nextMeeting ? (
                    <MeetingCard meeting={nextMeeting} />
                  ) : (
                    <div className="flex min-h-64 items-center justify-center px-4 py-10">
                      <div className="text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                          <Clock3 size={25} />
                        </div>

                        <h4 className="mt-5 font-semibold text-slate-900">
                          Nothing scheduled
                        </h4>

                        <p className="mt-2 max-w-xs text-sm leading-6 text-slate-500">
                          Once you schedule a meeting, its details will appear
                          in this section.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
