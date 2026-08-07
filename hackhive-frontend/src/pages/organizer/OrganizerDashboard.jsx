import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import useAuth from "../../hooks/useAuth";
import { organizerService } from "../../services/organizerService";
import OrganizerEventModal from "../../components/organizer/OrganizerEventModal";

import OrganizerHero from "../../components/organizer/dashboard/OrganizerHero";
import OrganizerStatsGrid from "../../components/organizer/dashboard/OrganizerStatsGrid";
import OrganizerQuickActions from "../../components/organizer/dashboard/OrganizerQuickActions";
import RecentActivityPanel from "../../components/organizer/dashboard/RecentActivityPanel";
import UpcomingEventsPanel from "../../components/organizer/dashboard/UpcomingEventsPanel";
import RecentEventsSection from "../../components/organizer/dashboard/RecentEventsSection";
import AnalyticsPreviewCard from "../../components/organizer/dashboard/AnalyticsPreviewCard";
import OrganizerProfileSummaryCard from "../../components/organizer/dashboard/OrganizerProfileSummaryCard";
import OrganizerDashboardSkeleton from "../../components/organizer/dashboard/OrganizerDashboardSkeleton";

export default function OrganizerDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [events, setEvents] = useState([]);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    const loadDashboardData = useCallback(async () => {
        try {
            setLoading(true);
            const [eventsResult, profileResult] = await Promise.allSettled([
                organizerService.getMyEvents(),
                organizerService.getProfile(),
            ]);

            if (eventsResult.status === "fulfilled") {
                setEvents(Array.isArray(eventsResult.value) ? eventsResult.value : []);
            } else {
                setEvents([]);
            }

            if (profileResult.status === "fulfilled") {
                setProfile(profileResult.value);
            } else {
                setProfile(null);
            }
        } catch (err) {
            console.error("Error loading organizer dashboard:", err);
            setEvents([]);
            setProfile(null);
        } fontFinally: {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        let isMounted = true;
        setLoading(true);

        const fetchData = async () => {
            try {
                const [eventsData, profileData] = await Promise.all([
                    organizerService.getMyEvents().catch(() => []),
                    organizerService.getProfile().catch(() => null),
                ]);

                if (isMounted) {
                    setEvents(Array.isArray(eventsData) ? eventsData : []);
                    setProfile(profileData);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchData();

        return () => {
            isMounted = false;
        };
    }, []);

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
            (acc, curr) => acc + (curr.registrationsCount || 0),
            0
        );

        const totalTeams = events.reduce(
            (acc, curr) => acc + (curr.teamsCount || 0),
            0
        );

        const projectsSubmitted = events.reduce(
            (acc, curr) => acc + (curr.projectsCount || 0),
            0
        );

        const pendingReviews = events.reduce(
            (acc, curr) => acc + (curr.pendingReviewsCount || 0),
            0
        );

        return {
            totalEvents,
            activeEvents,
            upcomingEvents,
            totalRegistrations,
            totalTeams,
            projectsSubmitted,
            pendingReviews,
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

    return (
        <div className="space-y-8 pb-20 w-full max-w-7xl mx-auto">
            {/* 1. Hero Section */}
            <OrganizerHero
                user={user}
                profile={profile}
                stats={stats}
                onCreateEvent={() => setIsCreateOpen(true)}
            />

            {/* 2. Statistics Grid (6 Cards) */}
            <OrganizerStatsGrid stats={stats} />

            {/* 3. Quick Actions Shortcuts */}
            <OrganizerQuickActions
                onCreateEvent={() => setIsCreateOpen(true)}
                onNavigate={(path) => navigate(path)}
            />

            {/* Main Content Layout Grid */}
            <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
                {/* Left Column: Recent Events & Analytics */}
                <div className="space-y-8 min-w-0">
                    {/* 6. Recent Events Section */}
                    <RecentEventsSection
                        events={events}
                        onNavigate={(path) => navigate(path)}
                        onCreateEvent={() => setIsCreateOpen(true)}
                    />

                    {/* 7. Analytics Preview Card */}
                    <AnalyticsPreviewCard
                        events={events}
                        onNavigate={(path) => navigate(path)}
                    />
                </div>

                {/* Right Column: Profile, Upcoming Events & Activity */}
                <div className="space-y-8 min-w-0">
                    {/* 8. Profile Summary Card */}
                    <OrganizerProfileSummaryCard
                        profileData={profile}
                        user={user}
                        onNavigate={(path) => navigate(path)}
                    />

                    {/* 5. Upcoming Events Panel */}
                    <UpcomingEventsPanel
                        events={events}
                        onNavigate={(path) => navigate(path)}
                        onCreateEvent={() => setIsCreateOpen(true)}
                    />

                    {/* 4. Recent Activity Panel */}
                    <RecentActivityPanel
                        events={events}
                        onCreateEvent={() => setIsCreateOpen(true)}
                    />
                </div>
            </div>

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