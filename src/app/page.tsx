"use client";

import { useMemo, useState } from "react";
import { ArrowRight, CalendarDays, Clock3, Plus, Sparkles } from "lucide-react";

import { AppSidebar } from "@/components/app-sidebar";
import { MeetingCard } from "@/components/meeting-card";
import { MeetingDetails } from "@/components/meeting-details";
import { MeetingFilters } from "@/components/meeting-filters";
import type { MeetingStatusFilter } from "@/components/meeting-filters";
import { MeetingForm } from "@/components/meeting-form";
import { MobileSidebar } from "@/components/mobile-sidebar";
import { StatCard } from "@/components/stat-card";
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

  const [isMeetingFormOpen, setIsMeetingFormOpen] = useState(false);

  const [editingMeeting, setEditingMeeting] = useState<Meeting | null>(null);

  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);

  const [meetings, setMeetings] = useState<Meeting[]>(initialMeetings);

  // Part 6: Search and filters
  const [search, setSearch] = useState("");

  const [typeFilter, setTypeFilter] = useState<Meeting["type"] | "all">("all");

  const [statusFilter, setStatusFilter] = useState<MeetingStatusFilter>("all");

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

  // All upcoming meetings, independent from search/filter UI.
  const upcomingMeetings = useMemo(() => {
    return meetings
      .filter(isMeetingUpcoming)
      .sort(
        (a, b) =>
          getMeetingDateTime(a.date, a.startTime).getTime() -
          getMeetingDateTime(b.date, b.startTime).getTime(),
      );
  }, [meetings]);

  // The closest upcoming meeting.
  const nextMeeting = upcomingMeetings[0] ?? null;

  // Part 6: filtered and sorted meetings
  const filteredMeetings = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return meetings
      .filter((meeting) => {
        // Type filter
        if (typeFilter !== "all" && meeting.type !== typeFilter) {
          return false;
        }

        // Status filter
        if (statusFilter === "completed" && !meeting.completed) {
          return false;
        }

        if (statusFilter === "upcoming" && meeting.completed) {
          return false;
        }

        // Search filter
        if (!normalizedSearch) {
          return true;
        }

        const searchableText = [
          meeting.title,
          meeting.description,
          meeting.location,
          ...meeting.attendees,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return searchableText.includes(normalizedSearch);
      })
      .sort(
        (a, b) =>
          getMeetingDateTime(a.date, a.startTime).getTime() -
          getMeetingDateTime(b.date, b.startTime).getTime(),
      );
  }, [meetings, search, typeFilter, statusFilter]);

  function clearFilters() {
    setSearch("");
    setTypeFilter("all");
    setStatusFilter("all");
  }

  function hasActiveFilters() {
    return (
      search.trim() !== "" || typeFilter !== "all" || statusFilter !== "all"
    );
  }

  function handleCreateMeeting(newMeeting: Meeting) {
    setMeetings((currentMeetings) => [...currentMeetings, newMeeting]);
  }

  function handleUpdateMeeting(updatedMeeting: Meeting) {
    setMeetings((currentMeetings) =>
      currentMeetings.map((meeting) =>
        meeting.id === updatedMeeting.id ? updatedMeeting : meeting,
      ),
    );

    setSelectedMeeting(updatedMeeting);
  }

  function handleDeleteMeeting(id: string) {
    const meetingToDelete = meetings.find((meeting) => meeting.id === id);

    if (!meetingToDelete) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${meetingToDelete.title}"?`,
    );

    if (!confirmed) {
      return;
    }

    setMeetings((currentMeetings) =>
      currentMeetings.filter((meeting) => meeting.id !== id),
    );

    setSelectedMeeting(null);
    setEditingMeeting(null);
    setIsMeetingFormOpen(false);
  }

  function handleToggleComplete(id: string) {
    setMeetings((currentMeetings) =>
      currentMeetings.map((meeting) =>
        meeting.id === id
          ? {
              ...meeting,
              completed: !meeting.completed,
            }
          : meeting,
      ),
    );

    setSelectedMeeting((currentMeeting) =>
      currentMeeting && currentMeeting.id === id
        ? {
            ...currentMeeting,
            completed: !currentMeeting.completed,
          }
        : currentMeeting,
    );
  }

  function openCreateForm() {
    setEditingMeeting(null);
    setIsMeetingFormOpen(true);
  }

  function openEditForm(meeting: Meeting) {
    setSelectedMeeting(null);
    setEditingMeeting(meeting);
    setIsMeetingFormOpen(true);
  }

  function closeMeetingForm() {
    setIsMeetingFormOpen(false);
    setEditingMeeting(null);
  }

  function openMeetingDetails(meeting: Meeting) {
    const currentMeeting =
      meetings.find((item) => item.id === meeting.id) ?? meeting;

    setSelectedMeeting(currentMeeting);
  }

  const filteredCount = filteredMeetings.length;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex min-h-screen">
        {/* Desktop sidebar */}
        <AppSidebar />

        {/* Mobile sidebar */}
        <MobileSidebar
          isOpen={isMobileSidebarOpen}
          onClose={() => setIsMobileSidebarOpen(false)}
        />

        <div className="min-w-0 flex-1">
          {/* Header */}
          <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
            <div className="flex h-20 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
              <div className="flex min-w-0 items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsMobileSidebarOpen(true)}
                  aria-label="Open navigation"
                  className="rounded-xl p-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 lg:hidden"
                >
                  <span className="text-xl">☰</span>
                </button>

                <div className="min-w-0">
                  <p className="truncate text-sm text-slate-500">
                    Welcome back
                  </p>

                  <h1 className="truncate text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
                    Your meetings
                  </h1>
                </div>
              </div>

              <button
                type="button"
                onClick={openCreateForm}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-slate-800"
              >
                <Plus size={17} />

                <span className="hidden sm:inline">Schedule Meeting</span>
              </button>
            </div>
          </header>

          {/* Main content */}
          <main className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            {/* Hero */}
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
                  onClick={openCreateForm}
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-slate-800"
                >
                  <Plus size={18} />
                  Schedule Meeting
                </button>
              </div>
            </section>

            {/* Statistics */}
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

            {/* Search and filters */}
            <section className="mb-6">
              <MeetingFilters
                search={search}
                type={typeFilter}
                status={statusFilter}
                onSearchChange={setSearch}
                onTypeChange={setTypeFilter}
                onStatusChange={setStatusFilter}
                onClear={clearFilters}
              />
            </section>

            {/* Meeting sections */}
            <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
              {/* Filtered meetings */}
              <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-200 px-5 py-5 sm:px-6">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-slate-900">
                        {statusFilter === "completed"
                          ? "Completed meetings"
                          : statusFilter === "upcoming"
                            ? "Upcoming meetings"
                            : "Meetings"}
                      </h3>

                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
                        {filteredCount}
                      </span>
                    </div>

                    <p className="mt-1 text-sm text-slate-500">
                      {statusFilter === "completed"
                        ? "Meetings you have already completed."
                        : statusFilter === "upcoming"
                          ? "Your next scheduled appointments."
                          : "Your meetings sorted by date and time."}
                    </p>
                  </div>

                  {hasActiveFilters() && (
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="hidden items-center gap-1 text-sm font-semibold text-slate-600 transition-colors hover:text-slate-950 sm:flex"
                    >
                      Clear
                      <ArrowRight size={15} />
                    </button>
                  )}
                </div>

                <div className="space-y-4 p-5 sm:p-6">
                  {filteredMeetings.length > 0 ? (
                    filteredMeetings
                      .slice(0, 3)
                      .map((meeting) => (
                        <MeetingCard
                          key={meeting.id}
                          meeting={meeting}
                          onView={() => openMeetingDetails(meeting)}
                          onEdit={() => openEditForm(meeting)}
                          onDelete={() => handleDeleteMeeting(meeting.id)}
                          onToggleComplete={() =>
                            handleToggleComplete(meeting.id)
                          }
                        />
                      ))
                  ) : (
                    <div className="flex min-h-64 items-center justify-center px-4 py-10">
                      <div className="max-w-sm text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                          <CalendarDays size={25} />
                        </div>

                        <h4 className="mt-5 font-semibold text-slate-900">
                          {hasActiveFilters()
                            ? "No meetings found"
                            : "No meetings yet"}
                        </h4>

                        <p className="mt-2 text-sm leading-6 text-slate-500">
                          {hasActiveFilters()
                            ? "Try changing your search or filters to find a meeting."
                            : "Your schedule is clear. Create your first meeting to start organizing your calendar."}
                        </p>

                        <button
                          type="button"
                          onClick={
                            hasActiveFilters() ? clearFilters : openCreateForm
                          }
                          className="mt-5 inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-950"
                        >
                          {hasActiveFilters() ? (
                            <>
                              <span className="text-base">×</span>
                              Clear filters
                            </>
                          ) : (
                            <>
                              <Plus size={16} />
                              Create your first meeting
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {filteredMeetings.length > 3 && (
                  <div className="border-t border-slate-100 px-5 py-4 sm:px-6">
                    <p className="text-center text-xs font-medium text-slate-400">
                      Showing 3 of {filteredMeetings.length} matching meetings
                    </p>
                  </div>
                )}
              </div>

              {/* Next meeting */}
              <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
                  <h3 className="font-semibold text-slate-900">Next meeting</h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Your closest upcoming appointment.
                  </p>
                </div>

                <div className="p-5 sm:p-6">
                  {nextMeeting ? (
                    <MeetingCard
                      meeting={nextMeeting}
                      onView={() => openMeetingDetails(nextMeeting)}
                      onEdit={() => openEditForm(nextMeeting)}
                      onDelete={() => handleDeleteMeeting(nextMeeting.id)}
                      onToggleComplete={() =>
                        handleToggleComplete(nextMeeting.id)
                      }
                    />
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

                        <button
                          type="button"
                          onClick={openCreateForm}
                          className="mt-5 inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-950"
                        >
                          <Plus size={16} />
                          Schedule meeting
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>

      {/* Create / Edit meeting modal */}
      {isMeetingFormOpen && (
        <MeetingForm
          meeting={editingMeeting ?? undefined}
          onCreateMeeting={handleCreateMeeting}
          onUpdateMeeting={handleUpdateMeeting}
          onCancel={closeMeetingForm}
        />
      )}

      {/* Meeting details modal */}
      {selectedMeeting && (
        <MeetingDetails
          meeting={selectedMeeting}
          onClose={() => setSelectedMeeting(null)}
          onEdit={() => openEditForm(selectedMeeting)}
          onDelete={() => handleDeleteMeeting(selectedMeeting.id)}
          onToggleComplete={() => handleToggleComplete(selectedMeeting.id)}
        />
      )}
    </div>
  );
}
