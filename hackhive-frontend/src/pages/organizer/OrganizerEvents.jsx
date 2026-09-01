import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { CalendarDays, Plus, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { organizerService } from "../../services/organizerService";
import OrganizerEventCard from "../../components/organizer/OrganizerEventCard";
import OrganizerEventModal from "../../components/organizer/OrganizerEventModal";
import DashboardSection from "../../components/student-dashboard/DashboardSection";
import { DashboardPageSkeleton, EmptyState } from "../../components/student-dashboard/DashboardStates";
import HackHiveSelect from "../../components/ui/HackHiveSelect";
import { Button } from "../../components/ui/Button";
import { Card, CardContent } from "../../components/ui/Card";

export default function OrganizerEvents() {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [modeFilter, setModeFilter] = useState("ALL");
    const [statusFilter, setStatusFilter] = useState("ALL");

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editEvent, setEditEvent] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    const loadEvents = useCallback(async () => {
        try {
            setLoading(true);
            const res = await organizerService.getMyEvents();
            setEvents(Array.isArray(res) ? res : []);
        } catch {
            toast.error("Failed to load organizer events.");
            setEvents([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadEvents();
    }, [loadEvents]);

    const handleCreate = () => {
        setEditEvent(null);
        setIsModalOpen(true);
    };

    const handleEdit = (event) => {
        setEditEvent(event);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        try {
            await organizerService.deleteEvent(id);
            setEvents((prev) => prev.filter((e) => e.id !== id));
            toast.success("Event deleted successfully!");
        } catch {
            toast.error("Failed to delete event.");
        }
    };

    const handleSubmitModal = async (payload) => {
        try {
            setActionLoading(true);
            if (editEvent) {
                const updated = await organizerService.updateEvent(editEvent.id, payload);
                setEvents((prev) => prev.map((e) => (e.id === editEvent.id ? updated : e)));
                toast.success("Event updated successfully!");
            } else {
                const created = await organizerService.createEvent(payload);
                setEvents((prev) => [created, ...prev]);
                toast.success("Event published successfully!");
            }
            setIsModalOpen(false);
        } catch (err) {
            const msg = err?.response?.data?.message || "Failed to save event.";
            toast.error(msg);
        } finally {
            setActionLoading(false);
        }
    };

    const filteredEvents = useMemo(() => {
        let list = [...events];
        const now = Date.now();

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            list = list.filter((e) => e.title && e.title.toLowerCase().includes(q));
        }
        if (modeFilter !== "ALL") {
            list = list.filter((e) => (e.eventMode || "").toUpperCase() === modeFilter);
        }
        if (statusFilter !== "ALL") {
            list = list.filter((e) => {
                const start = e.startDate ? new Date(e.startDate).getTime() : 0;
                const end = e.endDate ? new Date(e.endDate).getTime() : 0;
                if (statusFilter === "ACTIVE") return start > 0 && now >= start && (end === 0 || now <= end);
                if (statusFilter === "UPCOMING") return start > 0 && now < start;
                if (statusFilter === "COMPLETED") return end > 0 && now > end;
                return true;
            });
        }
        return list;
    }, [events, searchQuery, modeFilter, statusFilter]);

    if (loading) {
        return <DashboardPageSkeleton />;
    }

    return (
        <div className="space-y-8 pb-20 w-full max-w-7xl mx-auto">
            {/* Top Page Header */}
            <Card className="border-slate-200/80 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="space-y-1">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-0.5 text-xs font-bold uppercase tracking-wider text-slate-800 dark:bg-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                            <CalendarDays className="size-3.5 text-blue-600 dark:text-blue-400" />
                            EVENT MANAGEMENT
                        </span>
                        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
                            Manage Events
                        </h1>
                        <p className="max-w-2xl text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-normal leading-relaxed">
                            Create, edit, publish, and manage your hackathons from one place.
                        </p>
                    </div>

                    <Button
                        type="button"
                        onClick={handleCreate}
                        className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs gap-1.5 px-4 py-2.5 rounded-xl shadow-xs dark:bg-blue-600 dark:hover:bg-blue-500 shrink-0"
                    >
                        <Plus className="size-4" /> Create Event
                    </Button>
                </div>
            </Card>

            {/* Search and Filter Bar */}
            <Card className="border-slate-200/80 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="relative flex-1">
                        <Search className="pointer-events-none absolute left-3.5 top-2.5 size-4 text-slate-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search events..."
                            className="w-full rounded-xl border border-slate-200 bg-slate-50/80 pl-10 pr-4 py-2 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:bg-white dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-200 dark:focus:border-blue-500"
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <div className="w-36">
                            <HackHiveSelect
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                options={[
                                    { value: "ALL", label: "All Statuses" },
                                    { value: "ACTIVE", label: "Active" },
                                    { value: "UPCOMING", label: "Upcoming" },
                                    { value: "COMPLETED", label: "Completed" },
                                ]}
                                size="sm"
                            />
                        </div>

                        <div className="w-32">
                            <HackHiveSelect
                                value={modeFilter}
                                onChange={(e) => setModeFilter(e.target.value)}
                                options={[
                                    { value: "ALL", label: "All Modes" },
                                    { value: "ONLINE", label: "Online" },
                                    { value: "OFFLINE", label: "Offline" },
                                    { value: "HYBRID", label: "Hybrid" },
                                ]}
                                size="sm"
                            />
                        </div>
                    </div>
                </div>
            </Card>

            {/* Event List Section */}
            <DashboardSection
                id="organizer-events"
                eyebrow="OVERVIEW"
                title="Your Events"
                description="Manage the hackathons created by your organization."
            >
                {filteredEvents.length > 0 ? (
                    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                        {filteredEvents.map((event) => (
                            <OrganizerEventCard
                                key={event.id}
                                event={event}
                                onView={() => navigate("/organizer/registrations")}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                ) : (
                    <Card className="border-slate-200/80 bg-white p-12 text-center shadow-2xs dark:border-slate-800 dark:bg-slate-900">
                        <EmptyState
                            icon={<CalendarDays className="size-8 text-slate-400" />}
                            title="No events yet"
                            description="Create your first hackathon to start managing registrations, teams, and submissions."
                            action={
                                <Button
                                    type="button"
                                    onClick={handleCreate}
                                    className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs gap-1.5 px-5 py-2.5 rounded-xl shadow-xs dark:bg-blue-600 dark:hover:bg-blue-500"
                                >
                                    <Plus className="size-4" /> Create Event
                                </Button>
                            }
                        />
                    </Card>
                )}
            </DashboardSection>

            {/* Create/Edit Modal */}
            <OrganizerEventModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                initialData={editEvent}
                onSubmit={handleSubmitModal}
                isLoading={actionLoading}
            />
        </div>
    );
}
