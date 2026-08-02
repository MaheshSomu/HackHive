import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
    CalendarDays,
    CheckCircle2,
    Clock,
    Filter,
    Layers,
    Search,
    SlidersHorizontal,
    Sparkles,
    Trophy,
} from "lucide-react";

import { eventService } from "../../services/eventService";
import EventCard from "../../components/events/EventCard";
import EventDetailsModal from "../../components/events/EventDetailsModal";
import DashboardSection from "../../components/student-dashboard/DashboardSection";
import { DashboardPageSkeleton, EmptyState } from "../../components/student-dashboard/DashboardStates";
import { Button } from "../../components/ui/Button";
import { Card, CardContent } from "../../components/ui/Card";

export default function StudentEvents() {
    const [events, setEvents] = useState([]);
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [registeringId, setRegisteringId] = useState(null);

    // Active View Tab
    const [activeTab, setActiveTab] = useState("all"); // 'all' | 'registrations'

    // Search & Filters
    const [searchQuery, setSearchQuery] = useState("");
    const [modeFilter, setModeFilter] = useState("ALL");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [teamSizeFilter, setTeamSizeFilter] = useState("ALL");
    const [openOnly, setOpenOnly] = useState(false);
    const [sortBy, setSortBy] = useState("deadline"); // 'deadline' | 'latest' | 'title'

    // Modal State
    const [selectedEvent, setSelectedEvent] = useState(null);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const [eventsRes, regsRes] = await Promise.allSettled([
                eventService.getAllEvents(),
                eventService.getMyRegistrations(),
            ]);

            setEvents(eventsRes.status === "fulfilled" && Array.isArray(eventsRes.value) ? eventsRes.value : []);
            setRegistrations(regsRes.status === "fulfilled" && Array.isArray(regsRes.value) ? regsRes.value : []);
        } catch {
            toast.error("Failed to load events.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Set of registered event IDs
    const registeredEventIds = useMemo(() => {
        return new Set(registrations.map((r) => r.eventId));
    }, [registrations]);

    // Register Handler
    const handleRegister = async (eventId) => {
        try {
            setRegisteringId(eventId);
            const res = await eventService.registerForEvent(eventId);
            setRegistrations((prev) => [...prev, res]);
            toast.success("Event registration successful!");
        } catch (err) {
            const msg = err?.response?.data?.message || "Could not complete event registration.";
            toast.error(msg);
        } finally {
            setRegisteringId(null);
        }
    };

    // Cancel Registration Handler
    const handleCancelRegistration = async (eventId) => {
        try {
            setRegisteringId(eventId);
            await eventService.cancelRegistration(eventId);
            setRegistrations((prev) => prev.filter((r) => r.eventId !== eventId));
            toast.success("Event registration cancelled.");
        } catch {
            toast.error("Failed to cancel registration.");
        } finally {
            setRegisteringId(null);
        }
    };

    // Filter & Sort Logic
    const filteredEvents = useMemo(() => {
        let list = activeTab === "registrations"
            ? events.filter((e) => registeredEventIds.has(e.id))
            : [...events];

        // Search Filter
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            list = list.filter((e) =>
                (e.title && e.title.toLowerCase().includes(q)) ||
                (e.description && e.description.toLowerCase().includes(q)) ||
                (e.collegeName && e.collegeName.toLowerCase().includes(q)) ||
                (e.organizerName && e.organizerName.toLowerCase().includes(q))
            );
        }

        // Mode Filter
        if (modeFilter !== "ALL") {
            list = list.filter((e) => (e.eventMode || "").toUpperCase() === modeFilter);
        }

        // Team Size Filter
        if (teamSizeFilter === "SOLO") {
            list = list.filter((e) => (e.maxTeamSize || 1) === 1);
        } else if (teamSizeFilter === "SMALL") {
            list = list.filter((e) => (e.maxTeamSize || 4) <= 3);
        } else if (teamSizeFilter === "LARGE") {
            list = list.filter((e) => (e.maxTeamSize || 4) >= 4);
        }

        // Registration Open Checkbox Toggle
        if (openOnly) {
            const now = new Date();
            list = list.filter((e) => {
                if (!e.registrationEndDate) return true;
                return new Date(e.registrationEndDate).getTime() >= now.getTime();
            });
        }

        // Sorting
        list.sort((a, b) => {
            if (sortBy === "deadline") {
                const dateA = a.registrationEndDate ? new Date(a.registrationEndDate).getTime() : 0;
                const dateB = b.registrationEndDate ? new Date(b.registrationEndDate).getTime() : 0;
                return dateA - dateB;
            }
            if (sortBy === "latest") {
                const dateA = a.startDate ? new Date(a.startDate).getTime() : 0;
                const dateB = b.startDate ? new Date(b.startDate).getTime() : 0;
                return dateB - dateA;
            }
            if (sortBy === "title") {
                return (a.title || "").localeCompare(b.title || "");
            }
            return 0;
        });

        return list;
    }, [activeTab, events, registeredEventIds, searchQuery, modeFilter, teamSizeFilter, openOnly, sortBy]);

    if (loading) {
        return <DashboardPageSkeleton />;
    }

    return (
        <div className="space-y-8 pb-16">
            {/* Header Hero */}
            <Card className="overflow-hidden border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
                <CardContent className="p-6 sm:p-8">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                                    Hackathon Portal
                                </span>
                            </div>
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
                                Browse Hackathons & Events
                            </h1>
                            <p className="max-w-2xl text-xs text-slate-500 dark:text-slate-400 leading-5">
                                Discover open hackathons, build innovative projects with your team, and track your active registrations.
                            </p>
                        </div>

                        {/* Navigation Tabs */}
                        <div className="flex items-center gap-2 rounded-2xl bg-slate-100 p-1.5 dark:bg-slate-800">
                            <button
                                type="button"
                                onClick={() => setActiveTab("all")}
                                className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                                    activeTab === "all"
                                        ? "bg-white text-slate-900 shadow-2xs dark:bg-slate-900 dark:text-slate-100"
                                        : "text-slate-600 hover:text-slate-900 dark:text-slate-400"
                                }`}
                            >
                                All Events ({events.length})
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab("registrations")}
                                className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                                    activeTab === "registrations"
                                        ? "bg-white text-indigo-600 shadow-2xs dark:bg-slate-900 dark:text-indigo-400"
                                        : "text-slate-600 hover:text-slate-900 dark:text-slate-400"
                                }`}
                            >
                                My Registrations ({registrations.length})
                            </button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Search & Filters Bar */}
            <Card className="border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
                <CardContent className="p-4 sm:p-6 space-y-4">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        {/* Search Input */}
                        <div className="group relative flex-1 max-w-md">
                            <Search className="pointer-events-none absolute left-3.5 top-3 size-4 text-slate-400 group-focus-within:text-indigo-600" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by event title, organizer, college..."
                                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-xs text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-800 dark:text-slate-100"
                            />
                        </div>

                        {/* Controls Group */}
                        <div className="flex flex-wrap items-center gap-3 text-xs">
                            {/* Mode Select */}
                            <div className="flex items-center gap-1.5">
                                <span className="text-slate-400 font-medium">Mode:</span>
                                <select
                                    value={modeFilter}
                                    onChange={(e) => setModeFilter(e.target.value)}
                                    className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-800 outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200"
                                >
                                    <option value="ALL">All Modes</option>
                                    <option value="ONLINE">Online</option>
                                    <option value="OFFLINE">Offline</option>
                                    <option value="HYBRID">Hybrid</option>
                                </select>
                            </div>

                            {/* Team Size Select */}
                            <div className="flex items-center gap-1.5">
                                <span className="text-slate-400 font-medium">Team:</span>
                                <select
                                    value={teamSizeFilter}
                                    onChange={(e) => setTeamSizeFilter(e.target.value)}
                                    className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-800 outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200"
                                >
                                    <option value="ALL">All Sizes</option>
                                    <option value="SOLO">Solo (1 Member)</option>
                                    <option value="SMALL">Small (1-3 Members)</option>
                                    <option value="LARGE">Large (4+ Members)</option>
                                </select>
                            </div>

                            {/* Sort Select */}
                            <div className="flex items-center gap-1.5">
                                <span className="text-slate-400 font-medium">Sort:</span>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-800 outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200"
                                >
                                    <option value="deadline">Closing Deadline</option>
                                    <option value="latest">Start Date</option>
                                    <option value="title">Event Title</option>
                                </select>
                            </div>

                            {/* Toggle Checkbox */}
                            <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700 dark:text-slate-300">
                                <input
                                    type="checkbox"
                                    checked={openOnly}
                                    onChange={(e) => setOpenOnly(e.target.checked)}
                                    className="size-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <span>Open Registrations Only</span>
                            </label>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Events Grid / Content */}
            <DashboardSection
                id="events-list"
                eyebrow={activeTab === "registrations" ? "My Workspace" : "Discover"}
                title={activeTab === "registrations" ? "My Registered Hackathons" : "Available Hackathons"}
                description={
                    activeTab === "registrations"
                        ? "Events you are actively registered for."
                        : `Showing ${filteredEvents.length} hackathons based on active filters.`
                }
            >
                {filteredEvents.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {filteredEvents.map((event) => (
                            <EventCard
                                key={event.id}
                                event={event}
                                isRegistered={registeredEventIds.has(event.id)}
                                onViewDetails={(ev) => setSelectedEvent(ev)}
                                onRegister={handleRegister}
                                onCancel={handleCancelRegistration}
                                isRegistering={registeringId === event.id}
                            />
                        ))}
                    </div>
                ) : (
                    <Card className="border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
                        <CardContent className="p-8">
                            <EmptyState
                                icon={<CalendarDays className="size-6" />}
                                title={
                                    activeTab === "registrations"
                                        ? "No registered events yet"
                                        : "No hackathons found matching filters"
                                }
                                description={
                                    activeTab === "registrations"
                                        ? "Explore open hackathons and click 'Register Now' to join an upcoming event."
                                        : "Try adjusting your search term, mode filter, or team size options."
                                }
                                action={
                                    activeTab === "registrations" ? (
                                        <Button
                                            type="button"
                                            onClick={() => setActiveTab("all")}
                                            className="rounded-xl bg-indigo-600 text-xs font-semibold text-white"
                                        >
                                            Browse Open Hackathons
                                        </Button>
                                    ) : (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => {
                                                setSearchQuery("");
                                                setModeFilter("ALL");
                                                setTeamSizeFilter("ALL");
                                                setOpenOnly(false);
                                            }}
                                            className="rounded-xl text-xs font-semibold"
                                        >
                                            Reset Filters
                                        </Button>
                                    )
                                }
                            />
                        </CardContent>
                    </Card>
                )}
            </DashboardSection>

            {/* Event Details Modal */}
            <EventDetailsModal
                event={selectedEvent}
                isOpen={Boolean(selectedEvent)}
                onClose={() => setSelectedEvent(null)}
                isRegistered={selectedEvent ? registeredEventIds.has(selectedEvent.id) : false}
                onRegister={handleRegister}
                onCancel={handleCancelRegistration}
                isRegistering={registeringId === selectedEvent?.id}
            />
        </div>
    );
}
