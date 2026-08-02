import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Building2, Calendar, Mail, Search, UserCheck, Users } from "lucide-react";

import { organizerService } from "../../services/organizerService";
import DashboardSection from "../../components/student-dashboard/DashboardSection";
import { DashboardPageSkeleton, EmptyState } from "../../components/student-dashboard/DashboardStates";
import { Card, CardContent } from "../../components/ui/Card";

export default function OrganizerRegistrations() {
    const [events, setEvents] = useState([]);
    const [selectedEventId, setSelectedEventId] = useState("");
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [registrationsLoading, setRegistrationsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // Load Organizer Events
    useEffect(() => {
        let isMounted = true;
        const loadEvents = async () => {
            try {
                setLoading(true);
                const res = await organizerService.getMyEvents();
                if (isMounted) {
                    const list = Array.isArray(res) ? res : [];
                    setEvents(list);
                    if (list[0]) {
                        setSelectedEventId(String(list[0].id));
                    }
                }
            } catch {
                if (isMounted) setEvents([]);
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        loadEvents();
        return () => {
            isMounted = false;
        };
    }, []);

    // Load registrations when selectedEventId changes
    const loadRegistrations = useCallback(async (eventId) => {
        if (!eventId) return;
        try {
            setRegistrationsLoading(true);
            const res = await organizerService.getEventRegistrations(eventId);
            setRegistrations(Array.isArray(res) ? res : []);
        } catch {
            setRegistrations([]);
        } finally {
            setRegistrationsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (selectedEventId) {
            loadRegistrations(selectedEventId);
        }
    }, [selectedEventId, loadRegistrations]);

    // Filter registrations
    const filteredRegistrations = useMemo(() => {
        let list = [...registrations];
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            list = list.filter(
                (r) =>
                    (r.studentName && r.studentName.toLowerCase().includes(q)) ||
                    (r.studentEmail && r.studentEmail.toLowerCase().includes(q)) ||
                    (r.college && r.college.toLowerCase().includes(q))
            );
        }
        return list;
    }, [registrations, searchQuery]);

    if (loading) {
        return <DashboardPageSkeleton />;
    }

    const currentEvent = events.find((e) => String(e.id) === String(selectedEventId));

    return (
        <div className="space-y-8 pb-16">
            {/* Hero Header */}
            <Card className="overflow-hidden border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
                <CardContent className="p-6 sm:p-8">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="space-y-1">
                            <span className="rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-purple-600 dark:bg-purple-950 dark:text-purple-400">
                                Student Registrations
                            </span>
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
                                Event Applicants & Registered Students
                            </h1>
                            <p className="max-w-2xl text-xs text-slate-500 dark:text-slate-400 leading-5">
                                Select an event to inspect student signups, email addresses, and college details.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Event Selector & Search Bar */}
            <Card className="border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
                <CardContent className="p-4 sm:p-5 space-y-4">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        {/* Event Selector */}
                        <div className="flex flex-col gap-1.5 flex-1 max-w-md">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                Select Event
                            </label>
                            {events.length > 0 ? (
                                <select
                                    value={selectedEventId}
                                    onChange={(e) => setSelectedEventId(e.target.value)}
                                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-slate-900 outline-none focus:border-purple-500 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-100"
                                >
                                    {events.map((evt) => (
                                        <option key={evt.id} value={evt.id}>
                                            {evt.title} ({evt.eventMode || "Hybrid"})
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <p className="text-xs text-slate-400">No events found.</p>
                            )}
                        </div>

                        {/* Search Input */}
                        <div className="flex flex-col gap-1.5 flex-1 max-w-md">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                Search Applicants
                            </label>
                            <div className="group relative">
                                <Search className="pointer-events-none absolute left-3.5 top-3 size-4 text-slate-400 group-focus-within:text-purple-600" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search student by name, email..."
                                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-xs text-slate-900 outline-none focus:border-purple-500 focus:bg-white dark:border-slate-800 dark:bg-slate-800 dark:text-slate-100"
                                />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Registrations List */}
            <DashboardSection
                id="registrations-list"
                eyebrow="Applicants"
                title={currentEvent ? `Registrations for ${currentEvent.title}` : "Student Registrations"}
                description={`Total ${filteredRegistrations.length} registered students.`}
            >
                {registrationsLoading ? (
                    <div className="space-y-3">
                        <div className="h-16 w-full animate-pulse rounded-2xl bg-slate-200/70" />
                        <div className="h-16 w-full animate-pulse rounded-2xl bg-slate-200/70" />
                        <div className="h-16 w-full animate-pulse rounded-2xl bg-slate-200/70" />
                    </div>
                ) : filteredRegistrations.length > 0 ? (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredRegistrations.map((reg, idx) => {
                            const initials = (reg.studentName || reg.studentEmail || "S")[0].toUpperCase();

                            return (
                                <Card
                                    key={reg.registrationId || idx}
                                    className="border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-purple-600 font-bold text-xs text-white">
                                            {initials}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h4 className="truncate text-xs font-bold text-slate-900 dark:text-slate-100">
                                                {reg.studentName || "Student Applicant"}
                                            </h4>
                                            <p className="truncate text-[11px] text-slate-500">
                                                {reg.studentEmail}
                                            </p>
                                        </div>
                                    </div>

                                    {reg.college && (
                                        <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-500 dark:border-slate-800">
                                            <span className="font-semibold text-slate-700 dark:text-slate-300">College:</span> {reg.college}
                                        </div>
                                    )}
                                </Card>
                            );
                        })}
                    </div>
                ) : (
                    <Card className="border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
                        <CardContent className="p-8">
                            <EmptyState
                                icon={<UserCheck className="size-6" />}
                                title="No student registrations yet"
                                description="Students who sign up for this event will appear here."
                            />
                        </CardContent>
                    </Card>
                )}
            </DashboardSection>
        </div>
    );
}
