import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { CalendarDays, Plus, Search } from "lucide-react";

import { organizerService } from "../../services/organizerService";
import OrganizerEventCard from "../../components/organizer/OrganizerEventCard";
import OrganizerEventModal from "../../components/organizer/OrganizerEventModal";
import DashboardSection from "../../components/student-dashboard/DashboardSection";
import { DashboardPageSkeleton, EmptyState } from "../../components/student-dashboard/DashboardStates";
import { Button } from "../../components/ui/Button";
import { Card, CardContent } from "../../components/ui/Card";
import { useNavigate } from "react-router-dom";

export default function OrganizerEvents() {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [modeFilter, setModeFilter] = useState("ALL");

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
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            list = list.filter((e) => e.title && e.title.toLowerCase().includes(q));
        }
        if (modeFilter !== "ALL") {
            list = list.filter((e) => (e.eventMode || "").toUpperCase() === modeFilter);
        }
        return list;
    }, [events, searchQuery, modeFilter]);

    if (loading) {
        return <DashboardPageSkeleton />;
    }

    return (
        <div className="space-y-8 pb-16">
            {/* Header Hero */}
            <Card className="overflow-hidden border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
                <CardContent className="p-6 sm:p-8">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                        <div className="space-y-1">
                            <span className="rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-purple-600 dark:bg-purple-950 dark:text-purple-400">
                                Event Management
                            </span>
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
                                Manage Created Events
                            </h1>
                            <p className="max-w-2xl text-xs text-slate-500 dark:text-slate-400 leading-5">
                                View all hackathons created by your organization. Update event details, view registrations, or publish new events.
                            </p>
                        </div>

                        <Button
                            type="button"
                            onClick={handleCreate}
                            className="rounded-xl bg-purple-600 font-bold text-xs text-white hover:bg-purple-500"
                        >
                            <Plus className="mr-1.5 size-4" /> Create New Event
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Filter Bar */}
            <Card className="border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
                <CardContent className="p-4 sm:p-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="group relative flex-1 max-w-md">
                            <Search className="pointer-events-none absolute left-3.5 top-3 size-4 text-slate-400 group-focus-within:text-purple-600" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by event title..."
                                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-xs text-slate-900 outline-none focus:border-purple-500 focus:bg-white dark:border-slate-800 dark:bg-slate-800 dark:text-slate-100"
                            />
                        </div>

                        <div className="flex items-center gap-2 text-xs">
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
                    </div>
                </CardContent>
            </Card>

            {/* Events Grid */}
            <DashboardSection
                id="organizer-events"
                eyebrow="Portfolio"
                title="Your Hackathons"
                description={`Displaying ${filteredEvents.length} events created by your account.`}
            >
                {filteredEvents.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
                    <Card className="border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
                        <CardContent className="p-8">
                            <EmptyState
                                icon={<CalendarDays className="size-6" />}
                                title="No events created yet"
                                description="Start hosting by creating your first hackathon event using our multi-step wizard."
                                action={
                                    <Button
                                        type="button"
                                        onClick={handleCreate}
                                        className="rounded-xl bg-purple-600 font-semibold text-xs text-white"
                                    >
                                        Create First Event
                                    </Button>
                                }
                            />
                        </CardContent>
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
