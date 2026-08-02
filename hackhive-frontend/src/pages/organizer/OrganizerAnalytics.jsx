import { useCallback, useEffect, useMemo, useState } from "react";
import { BarChart3, Calendar, Layers, ShieldCheck, Sparkles, Users } from "lucide-react";
import { organizerService } from "../../services/organizerService";
import DashboardSection from "../../components/student-dashboard/DashboardSection";
import { DashboardPageSkeleton, EmptyState } from "../../components/student-dashboard/DashboardStates";
import { Card, CardContent } from "../../components/ui/Card";

export default function OrganizerAnalytics() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadAnalytics = useCallback(async () => {
        try {
            setLoading(true);
            const res = await organizerService.getMyEvents();
            setEvents(Array.isArray(res) ? res : []);
        } catch {
            setEvents([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadAnalytics();
    }, [loadAnalytics]);

    const metrics = useMemo(() => {
        const totalEvents = events.length;
        let onlineCount = 0;
        let offlineCount = 0;
        let hybridCount = 0;

        events.forEach((e) => {
            const mode = (e.eventMode || "").toUpperCase();
            if (mode === "ONLINE") onlineCount++;
            else if (mode === "OFFLINE") offlineCount++;
            else hybridCount++;
        });

        return {
            totalEvents,
            onlineCount,
            offlineCount,
            hybridCount,
        };
    }, [events]);

    if (loading) {
        return <DashboardPageSkeleton />;
    }

    return (
        <div className="space-y-8 pb-16">
            {/* Hero Header */}
            <Card className="overflow-hidden border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
                <CardContent className="p-6 sm:p-8">
                    <div className="space-y-1">
                        <span className="rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-purple-600 dark:bg-purple-950 dark:text-purple-400">
                            Analytics & Insights
                        </span>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
                            Event Performance & Mode Distribution
                        </h1>
                        <p className="max-w-2xl text-xs text-slate-500 dark:text-slate-400 leading-5">
                            Insights and event metrics across your published hackathons.
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Metrics Breakdown Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card className="border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Published Events</span>
                    <p className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-slate-100">{metrics.totalEvents}</p>
                    <p className="mt-1 text-[11px] text-slate-500">Events hosted</p>
                </Card>

                <Card className="border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Online Events</span>
                    <p className="mt-2 text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">{metrics.onlineCount}</p>
                    <p className="mt-1 text-[11px] text-slate-500">Virtual format</p>
                </Card>

                <Card className="border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Offline Events</span>
                    <p className="mt-2 text-3xl font-extrabold text-purple-600 dark:text-purple-400">{metrics.offlineCount}</p>
                    <p className="mt-1 text-[11px] text-slate-500">In-person venues</p>
                </Card>

                <Card className="border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Hybrid Events</span>
                    <p className="mt-2 text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">{metrics.hybridCount}</p>
                    <p className="mt-1 text-[11px] text-slate-500">Combined format</p>
                </Card>
            </div>

            {/* Event Distribution Section */}
            <DashboardSection
                id="analytics-summary"
                eyebrow="Distribution"
                title="Event Mode Overview"
                description="Breakdown of event formats hosted by your organization."
            >
                {metrics.totalEvents > 0 ? (
                    <Card className="border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
                        <div className="space-y-3">
                            <div>
                                <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                    <span>Online Hackathons</span>
                                    <span>{metrics.onlineCount} / {metrics.totalEvents} ({Math.round((metrics.onlineCount / metrics.totalEvents) * 100)}%)</span>
                                </div>
                                <div className="h-2.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                                    <div
                                        className="h-full bg-indigo-600 rounded-full"
                                        style={{ width: `${(metrics.onlineCount / metrics.totalEvents) * 100}%` }}
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                    <span>Offline Hackathons</span>
                                    <span>{metrics.offlineCount} / {metrics.totalEvents} ({Math.round((metrics.offlineCount / metrics.totalEvents) * 100)}%)</span>
                                </div>
                                <div className="h-2.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                                    <div
                                        className="h-full bg-purple-600 rounded-full"
                                        style={{ width: `${(metrics.offlineCount / metrics.totalEvents) * 100}%` }}
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                    <span>Hybrid Hackathons</span>
                                    <span>{metrics.hybridCount} / {metrics.totalEvents} ({Math.round((metrics.hybridCount / metrics.totalEvents) * 100)}%)</span>
                                </div>
                                <div className="h-2.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                                    <div
                                        className="h-full bg-emerald-600 rounded-full"
                                        style={{ width: `${(metrics.hybridCount / metrics.totalEvents) * 100}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </Card>
                ) : (
                    <Card className="border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
                        <CardContent className="p-8">
                            <EmptyState
                                icon={<BarChart3 className="size-6" />}
                                title="No analytics data available"
                                description="Create and publish events to view analytics and metrics."
                            />
                        </CardContent>
                    </Card>
                )}
            </DashboardSection>
        </div>
    );
}
