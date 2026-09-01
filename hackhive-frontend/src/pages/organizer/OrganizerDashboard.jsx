import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AlertCircle, RotateCw } from "lucide-react";

import useAuth from "../../hooks/useAuth";
import { organizerService } from "../../services/organizerService";
import OrganizerEventModal from "../../components/organizer/OrganizerEventModal";

import OrganizerHero from "../../components/organizer/dashboard/OrganizerHero";
import OrganizerStatsGrid from "../../components/organizer/dashboard/OrganizerStatsGrid";
import OrganizerQuickActions from "../../components/organizer/dashboard/OrganizerQuickActions";
import UpcomingEventsPanel from "../../components/organizer/dashboard/UpcomingEventsPanel";
import RecentActivityPanel from "../../components/organizer/dashboard/RecentActivityPanel";
import OrganizerDashboardSkeleton from "../../components/organizer/dashboard/OrganizerDashboardSkeleton";
import { Button } from "../../components/ui/Button";

export default function OrganizerDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [events, setEvents] = useState([]);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    const loadDashboardData = useCallback(async () => {
        try {
            setLoading(true);
            setError(false);
            const [eventsData, profileData] = await Promise.all([
                organizerService.getMyEvents(),
                organizerService.getProfile().catch(() => null),
            ]);

            setEvents(Array.isArray(eventsData) ? eventsData : []);
            setProfile(profileData);
        } catch (err) {
            console.error("Error loading organizer dashboard:", err);
            setError(true);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadDashboardData();
    }, [loadDashboardData]);

    // Aggregated metrics across events
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

        const totalRegistrations = events.reduce(
            (total, event) => total + (event.registrationCount ?? event.registrationsCount ?? 0),
            0
        );

        const totalTeams = events.reduce(
            (total, event) => total + (event.teamsCount ?? event.teamCount ?? 0),
            0
        );

        const projectsSubmitted = events.reduce(
            (total, event) =>
                total + (event.projectsCount ?? event.submissionsCount ?? event.submissionCount ?? 0),
            0
        );

        return {
            totalEvents,
            activeEvents,
            upcomingEvents,
            totalRegistrations,
            totalTeams,
            projectsSubmitted,
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
        return <OrganizerDashboardSkeleton />;
    }

    if (error) {
        return (
            <div className="w-full max-w-7xl mx-auto py-12">
                <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center shadow-xs dark:border-red-900/40 dark:bg-red-950/20">
                    <AlertCircle className="mx-auto size-9 text-red-500 mb-3" />
                    <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                        Unable to load dashboard data.
                    </h3>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 font-normal">
                        Please check your network connection or try again.
                    </p>
                    <Button
                        type="button"
                        onClick={loadDashboardData}
                        className="mt-4 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-xs font-medium text-white hover:bg-slate-800 transition-colors shadow-xs dark:bg-slate-800 dark:hover:bg-slate-700"
                    >
                        <RotateCw className="size-3.5" /> Retry
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-20 w-full max-w-7xl mx-auto">
            {/* 1. Hero / Welcome Section */}
            <OrganizerHero
                user={user}
                profile={profile}
                onCreateEvent={() => setIsCreateOpen(true)}
            />

            {/* 2. Overview Section */}
            <OrganizerStatsGrid stats={stats} />

            {/* 3. Quick Actions Section */}
            <OrganizerQuickActions
                onCreateEvent={() => setIsCreateOpen(true)}
                onNavigate={(path) => navigate(path)}
            />

            {/* 4. Upcoming Events Section */}
            <UpcomingEventsPanel
                events={events}
                onNavigate={(path) => navigate(path)}
                onCreateEvent={() => setIsCreateOpen(true)}
            />

            {/* 5. Recent Activity Section */}
            <RecentActivityPanel />

            {/* Create Event Modal */}
            <OrganizerEventModal
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                onSubmit={handleCreateSubmit}
                isLoading={actionLoading}
            />
        </div>
    );
}