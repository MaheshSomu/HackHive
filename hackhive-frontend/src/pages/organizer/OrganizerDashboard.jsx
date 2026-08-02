import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Activity,
    BarChart3,
    Calendar,
    CalendarDays,
    CheckCircle2,
    Clock,
    Plus,
    Sparkles,
    UserCheck,
    Users,
} from "lucide-react";

import useAuth from "../../hooks/useAuth";
import { organizerService } from "../../services/organizerService";
import { Button } from "../../components/ui/Button";
import { Card, CardContent } from "../../components/ui/Card";
import DashboardSection from "../../components/student-dashboard/DashboardSection";
import { DashboardPageSkeleton, EmptyState } from "../../components/student-dashboard/DashboardStates";
import OrganizerEventModal from "../../components/organizer/OrganizerEventModal";
import { toast } from "sonner";

export default function OrganizerDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    const loadDashboard = useCallback(async () => {
        try {
            setLoading(true);
            const eventsRes = await organizerService.getMyEvents();
            setEvents(Array.isArray(eventsRes) ? eventsRes : []);
        } catch {
            setEvents([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadDashboard();
    }, [loadDashboard]);

    // Metrics calculations
    const stats = useMemo(() => {
        const totalEvents = events.length;
        const now = Date.now();

        const activeEvents = events.filter((e) => {
            const start = e.startDate ? new Date(e.startDate).getTime() : 0;
            const end = e.endDate ? new Date(e.endDate).getTime() : 0;
            return start > 0 && now >= start && (end === 0 || now <= end);
        }).length;

        const upcomingEvents = events.filter((e) => {
            const start = e.startDate ? new Date(e.startDate).getTime() : 0;
            return start > 0 && now < start;
        }).length;

        return {
            totalEvents,
            activeEvents,
            upcomingEvents,
        };
    }, [events]);

    const handleCreateSubmit = async (payload) => {
        try {
            setActionLoading(true);
            const created = await organizerService.createEvent(payload);
            setEvents((prev) => [created, ...prev]);
            toast.success("Hackathon event published successfully!");
            setIsCreateOpen(false);
        } catch (err) {
            const msg = err?.response?.data?.message || "Failed to create event.";
            toast.error(msg);
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return <DashboardPageSkeleton />;
    }

    const organizerName = user?.fullName || "Organizer";

    return (
        <div className="space-y-8 pb-16">
            {/* Welcome Banner */}
            <Card className="overflow-hidden border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
                <CardContent className="p-6 sm:p-8">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                        <div className="space-y-1">
                            <span className="rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-purple-600 dark:bg-purple-950 dark:text-purple-400">
                                Host Management Console
                            </span>
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
                                Welcome back, {organizerName}
                            </h1>
                            <p className="max-w-2xl text-xs text-slate-500 dark:text-slate-400 leading-5">
                                Manage your hackathons, review student registrations, and monitor event performance.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <Button
                                type="button"
                                onClick={() => setIsCreateOpen(true)}
                                className="rounded-xl bg-purple-600 font-bold text-xs text-white hover:bg-purple-500"
                            >
                                <Plus className="mr-1.5 size-4" /> Create Event
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Stat Cards Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Card className="border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Events</span>
                        <div className="flex size-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400">
                            <CalendarDays className="size-4.5" />
                        </div>
                    </div>
                    <p className="mt-3 text-3xl font-extrabold text-slate-900 dark:text-slate-100">{stats.totalEvents}</p>
                    <p className="mt-1 text-[11px] text-slate-500">Events published by your account</p>
                </Card>

                <Card className="border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Live Events</span>
                        <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                            <Sparkles className="size-4.5" />
                        </div>
                    </div>
                    <p className="mt-3 text-3xl font-extrabold text-slate-900 dark:text-slate-100">{stats.activeEvents}</p>
                    <p className="mt-1 text-[11px] text-slate-500">Currently ongoing hackathons</p>
                </Card>

                <Card className="border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Upcoming Events</span>
                        <div className="flex size-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                            <Clock className="size-4.5" />
                        </div>
                    </div>
                    <p className="mt-3 text-3xl font-extrabold text-slate-900 dark:text-slate-100">{stats.upcomingEvents}</p>
                    <p className="mt-1 text-[11px] text-slate-500">Scheduled for upcoming dates</p>
                </Card>
            </div>

            {/* Quick Actions */}
            <DashboardSection
                id="quick-actions"
                eyebrow="Shortcuts"
                title="Organizer Quick Actions"
                description="Shortcuts to manage your event portfolio."
            >
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card
                        onClick={() => setIsCreateOpen(true)}
                        className="cursor-pointer border-slate-200/80 bg-white p-5 shadow-xs transition hover:border-purple-300 dark:border-slate-800 dark:bg-slate-900"
                    >
                        <div className="flex size-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-950">
                            <Plus className="size-4" />
                        </div>
                        <h4 className="mt-3 text-xs font-bold text-slate-900 dark:text-slate-100">Create Event</h4>
                        <p className="mt-0.5 text-[11px] text-slate-500">Publish a new hackathon with multi-step wizard.</p>
                    </Card>

                    <Card
                        onClick={() => navigate("/organizer/events")}
                        className="cursor-pointer border-slate-200/80 bg-white p-5 shadow-xs transition hover:border-purple-300 dark:border-slate-800 dark:bg-slate-900"
                    >
                        <div className="flex size-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950">
                            <CalendarDays className="size-4" />
                        </div>
                        <h4 className="mt-3 text-xs font-bold text-slate-900 dark:text-slate-100">Manage Events</h4>
                        <p className="mt-0.5 text-[11px] text-slate-500">View, edit, or delete existing events.</p>
                    </Card>

                    <Card
                        onClick={() => navigate("/organizer/registrations")}
                        className="cursor-pointer border-slate-200/80 bg-white p-5 shadow-xs transition hover:border-purple-300 dark:border-slate-800 dark:bg-slate-900"
                    >
                        <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950">
                            <UserCheck className="size-4" />
                        </div>
                        <h4 className="mt-3 text-xs font-bold text-slate-900 dark:text-slate-100">View Registrations</h4>
                        <p className="mt-0.5 text-[11px] text-slate-500">Check registered students and team entries.</p>
                    </Card>

                    <Card
                        onClick={() => navigate("/organizer/analytics")}
                        className="cursor-pointer border-slate-200/80 bg-white p-5 shadow-xs transition hover:border-purple-300 dark:border-slate-800 dark:bg-slate-900"
                    >
                        <div className="flex size-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950">
                            <BarChart3 className="size-4" />
                        </div>
                        <h4 className="mt-3 text-xs font-bold text-slate-900 dark:text-slate-100">Event Analytics</h4>
                        <p className="mt-0.5 text-[11px] text-slate-500">Monitor engagement and event metrics.</p>
                    </Card>
                </div>
            </DashboardSection>

            {/* Create Modal */}
            <OrganizerEventModal
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                onSubmit={handleCreateSubmit}
                isLoading={actionLoading}
            />
        </div>
    );
}