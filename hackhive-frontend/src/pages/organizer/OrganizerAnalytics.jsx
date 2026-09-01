import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
    BarChart3,
    CalendarDays,
    UserCheck,
    FolderGit2,
    Users,
    RefreshCw,
    AlertCircle,
    Plus,
    RotateCw,
    TrendingUp,
    Search,
    ChevronLeft,
    ChevronRight,
    ArrowRight,
    IndianRupee,
    CheckCircle2,
    Clock,
    XCircle,
    Layers,
    FileCode2,
} from "lucide-react";

import { organizerService } from "../../services/organizerService";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import HackHiveSelect from "../../components/ui/HackHiveSelect";
import OrganizerEventModal from "../../components/organizer/OrganizerEventModal";
import { SkeletonBlock } from "../../components/student-dashboard/DashboardStates";

const formatDate = (dateStr) => {
    if (!dateStr) return "TBD";
    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) return "TBD";
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
};

export default function OrganizerAnalytics() {
    const navigate = useNavigate();
    const tableRef = useRef(null);

    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [selectedEventId, setSelectedEventId] = useState("ALL"); // ALL | <eventId>

    // Search, filter, and pagination state for the breakdown table in All Events mode
    const [tableSearchQuery, setTableSearchQuery] = useState("");
    const [tableStatusFilter, setTableStatusFilter] = useState("ALL"); // ALL | ACTIVE | UPCOMING | COMPLETED
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    const loadAnalyticsData = useCallback(async () => {
        try {
            setLoading(true);
            setError(false);
            const eventsData = await organizerService.getMyEvents();
            const eventsList = Array.isArray(eventsData) ? eventsData : [];

            // Fetch registration & submission metrics per event in parallel
            const eventsWithDetails = await Promise.all(
                eventsList.map(async (event) => {
                    try {
                        const [regs, subs] = await Promise.all([
                            organizerService.getEventRegistrations(event.id).catch(() => []),
                            organizerService.getEventProjectSubmissions(event.id).catch(() => []),
                        ]);

                        const regArray = Array.isArray(regs) ? regs : [];
                        const subArray = Array.isArray(subs) ? subs : [];

                        // Registration status breakdowns
                        const confirmedRegs = regArray.filter(
                            (r) => !r.registrationStatus || r.registrationStatus === "CONFIRMED"
                        ).length;
                        const pendingRegs = regArray.filter(
                            (r) => r.registrationStatus === "PENDING_PAYMENT" || r.paymentStatus === "PENDING"
                        ).length;
                        const cancelledRegs = regArray.filter(
                            (r) => r.registrationStatus === "CANCELLED"
                        ).length;

                        // Total participants & team size
                        const totalParticipants = regArray.reduce(
                            (sum, r) => sum + (r.participantCount || (Array.isArray(r.members) ? r.members.length : 1)),
                            0
                        );
                        const avgTeamSize = regArray.length > 0 ? (totalParticipants / regArray.length).toFixed(1) : "1.0";

                        // Financial revenue calculation from successful payments
                        const totalRevenue = regArray.reduce((sum, r) => {
                            if (r.paymentStatus === "PAID" && r.amountPaid) {
                                return sum + Number(r.amountPaid);
                            }
                            return sum;
                        }, 0);

                        // Submission breakdowns (Strictly separating DRAFT vs SUBMITTED)
                        const finalSubmissions = subArray.filter(
                            (s) => (s.status || s.submissionStatus) === "SUBMITTED"
                        ).length;
                        const draftSubmissions = subArray.filter(
                            (s) => (s.status || s.submissionStatus) === "DRAFT"
                        ).length;

                        const totalRegCount = event.registrationCount ?? regArray.length;
                        const submissionRate = totalRegCount > 0 ? Math.round((finalSubmissions / totalRegCount) * 100) : 0;

                        return {
                            ...event,
                            registrationsCount: totalRegCount,
                            confirmedRegsCount: confirmedRegs,
                            pendingRegsCount: pendingRegs,
                            cancelledRegsCount: cancelledRegs,
                            submissionsCount: finalSubmissions,
                            draftSubmissionsCount: draftSubmissions,
                            participantsCount: totalParticipants > 0 ? totalParticipants : totalRegCount,
                            avgTeamSize,
                            totalRevenue,
                            submissionRate,
                        };
                    } catch {
                        return {
                            ...event,
                            registrationsCount: event.registrationCount ?? 0,
                            confirmedRegsCount: 0,
                            pendingRegsCount: 0,
                            cancelledRegsCount: 0,
                            submissionsCount: 0,
                            draftSubmissionsCount: 0,
                            participantsCount: event.registrationCount ?? 0,
                            avgTeamSize: "1.0",
                            totalRevenue: 0,
                            submissionRate: 0,
                        };
                    }
                })
            );

            setEvents(eventsWithDetails);

            // Preserve currently selected event if it still exists
            setSelectedEventId((prev) => {
                if (prev === "ALL") return "ALL";
                const exists = eventsWithDetails.some((e) => String(e.id) === String(prev));
                return exists ? prev : "ALL";
            });
        } catch (err) {
            console.error("Failed to load organizer analytics:", err);
            setError(true);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadAnalyticsData();
    }, [loadAnalyticsData]);

    const handleCreateSubmit = async (payload) => {
        try {
            setActionLoading(true);
            await organizerService.createEvent(payload);
            toast.success("Hackathon event published successfully!");
            setIsCreateOpen(false);
            loadAnalyticsData();
        } catch (err) {
            const msg = err?.response?.data?.message || "Failed to create event.";
            toast.error(msg);
        } finally {
            setActionLoading(false);
        }
    };

    const getStatusBadge = (evt) => {
        const now = Date.now();
        const start = evt.startDate ? new Date(evt.startDate).getTime() : 0;
        const end = evt.endDate ? new Date(evt.endDate).getTime() : 0;

        if (start > 0 && now < start) {
            return { label: "Upcoming", variant: "navy" };
        }
        if (start > 0 && now >= start && (end === 0 || now <= end)) {
            return { label: "Active", variant: "success" };
        }
        if (end > 0 && now > end) {
            return { label: "Completed", variant: "secondary" };
        }
        return { label: "Published", variant: "outline" };
    };

    // Dropdown options for selecting "All Events" or a specific organizer event
    const eventSelectOptions = useMemo(() => {
        const baseOptions = [{ value: "ALL", label: `All Events (${events.length})` }];
        const eventOptions = events.map((e) => {
            const statusLabel = getStatusBadge(e).label;
            return {
                value: String(e.id),
                label: `${e.title} • ${statusLabel}`,
            };
        });
        return [...baseOptions, ...eventOptions];
    }, [events]);

    // Selected event object (if single event mode)
    const selectedEventObj = useMemo(() => {
        if (selectedEventId === "ALL") return null;
        return events.find((e) => String(e.id) === String(selectedEventId)) || null;
    }, [events, selectedEventId]);

    // Filter events by selected event ID
    const filteredEvents = useMemo(() => {
        if (selectedEventId === "ALL") return events;
        return selectedEventObj ? [selectedEventObj] : [];
    }, [events, selectedEventId, selectedEventObj]);

    // Top 5 Events for All Events comparison chart
    const top5Events = useMemo(() => {
        const list = [...events];
        list.sort((a, b) => (b.registrationsCount || 0) - (a.registrationsCount || 0));
        return list.slice(0, 5);
    }, [events]);

    // Filter breakdown table rows by search query and status filter in All Events mode
    const tableFilteredEvents = useMemo(() => {
        let list = [...events];
        const now = Date.now();

        if (tableStatusFilter !== "ALL") {
            list = list.filter((e) => {
                const start = e.startDate ? new Date(e.startDate).getTime() : 0;
                const end = e.endDate ? new Date(e.endDate).getTime() : 0;
                if (tableStatusFilter === "ACTIVE") return start > 0 && now >= start && (end === 0 || now <= end);
                if (tableStatusFilter === "UPCOMING") return start > 0 && now < start;
                if (tableStatusFilter === "COMPLETED") return end > 0 && now > end;
                return true;
            });
        }

        if (tableSearchQuery.trim()) {
            const term = tableSearchQuery.toLowerCase();
            list = list.filter((e) => e.title?.toLowerCase().includes(term));
        }

        return list;
    }, [events, tableStatusFilter, tableSearchQuery]);

    // Reset table pagination when search or status filter changes
    useEffect(() => {
        setCurrentPage(1);
    }, [tableSearchQuery, tableStatusFilter]);

    // Pagination calculations for All Events mode table
    const totalPages = Math.ceil(tableFilteredEvents.length / pageSize) || 1;
    const paginatedEvents = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return tableFilteredEvents.slice(start, start + pageSize);
    }, [tableFilteredEvents, currentPage, pageSize]);

    // KPI Metrics calculated for current scope
    const metrics = useMemo(() => {
        const targetEvents = filteredEvents;
        const totalEvents = targetEvents.length;
        const now = Date.now();

        let activeCount = 0;
        let upcomingCount = 0;
        let completedCount = 0;
        let totalRegistrations = 0;
        let totalSubmissions = 0;
        let totalParticipants = 0;

        targetEvents.forEach((e) => {
            const start = e.startDate ? new Date(e.startDate).getTime() : 0;
            const end = e.endDate ? new Date(e.endDate).getTime() : 0;

            if (start > 0 && now >= start && (end === 0 || now <= end)) {
                activeCount++;
            } else if (start > 0 && now < start) {
                upcomingCount++;
            } else if (end > 0 && now > end) {
                completedCount++;
            }

            totalRegistrations += e.registrationsCount || 0;
            totalSubmissions += e.submissionsCount || 0;
            totalParticipants += e.participantsCount || 0;
        });

        const overallSubmissionRate = totalRegistrations > 0 ? Math.round((totalSubmissions / totalRegistrations) * 100) : 0;

        return {
            totalEvents,
            activeCount,
            upcomingCount,
            completedCount,
            totalRegistrations,
            totalSubmissions,
            totalParticipants,
            overallSubmissionRate,
        };
    }, [filteredEvents]);

    // Chart scale maximum
    const chartMax = useMemo(() => {
        let max = 1;
        top5Events.forEach((e) => {
            if ((e.registrationsCount || 0) > max) max = e.registrationsCount;
            if ((e.submissionsCount || 0) > max) max = e.submissionsCount;
        });
        return Math.ceil(max * 1.15) || 10;
    }, [top5Events]);

    const scrollToTable = () => {
        if (tableRef.current) {
            tableRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    if (loading) {
        return (
            <div className="space-y-6 pb-20 w-full max-w-7xl mx-auto">
                <SkeletonBlock className="h-28 w-full" />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <SkeletonBlock className="h-28 w-full" />
                    <SkeletonBlock className="h-28 w-full" />
                    <SkeletonBlock className="h-28 w-full" />
                    <SkeletonBlock className="h-28 w-full" />
                </div>
                <SkeletonBlock className="h-72 w-full" />
                <SkeletonBlock className="h-80 w-full" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full max-w-7xl mx-auto py-12">
                <Card className="border-rose-200 bg-rose-50/50 p-8 text-center shadow-xs dark:border-rose-900/40 dark:bg-rose-950/20">
                    <AlertCircle className="mx-auto size-9 text-rose-500 mb-3" />
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                        Unable to load analytics data.
                    </h3>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 font-normal">
                        Please check your network connection or try again.
                    </p>
                    <Button
                        type="button"
                        onClick={loadAnalyticsData}
                        className="mt-4 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 transition-colors shadow-xs dark:bg-blue-600 dark:hover:bg-blue-500"
                    >
                        <RotateCw className="size-3.5" /> Retry
                    </Button>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-20 w-full max-w-7xl mx-auto text-slate-900 dark:text-slate-100">
            {/* Header Hero */}
            <Card className="border-slate-200/80 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-0.5 text-xs font-bold uppercase tracking-wider text-slate-800 dark:bg-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                                <BarChart3 className="size-3.5 text-blue-600 dark:text-blue-400" />
                                Organizer Analytics
                            </span>
                            {selectedEventObj && (
                                <Badge variant={getStatusBadge(selectedEventObj).variant} className="text-[10px] font-bold">
                                    {getStatusBadge(selectedEventObj).label}
                                </Badge>
                            )}
                        </div>
                        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
                            {selectedEventObj ? selectedEventObj.title : "Performance & Insights"}
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-normal leading-relaxed">
                            {selectedEventObj
                                ? `Focused event performance metrics and submission analytics for "${selectedEventObj.title}".`
                                : "High-level overview of event registrations, participant engagement, and project submission rates across your events."}
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 shrink-0">
                        {/* Searchable Event Selector Dropdown */}
                        <div className="w-64">
                            <HackHiveSelect
                                searchable={true}
                                searchPlaceholder="Search events..."
                                noOptionsText="No events found"
                                value={selectedEventId}
                                onChange={(e) => setSelectedEventId(e.target.value)}
                                options={eventSelectOptions}
                                size="sm"
                            />
                        </div>

                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={loadAnalyticsData}
                            className="rounded-xl border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
                        >
                            <RefreshCw className="size-3.5 mr-1.5" /> Refresh
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Empty State when 0 events exist */}
            {events.length === 0 ? (
                <Card className="border-dashed border-slate-200 bg-white p-12 text-center shadow-2xs dark:border-slate-800 dark:bg-slate-900 space-y-3">
                    <BarChart3 className="mx-auto size-10 text-slate-400 mb-2" />
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                        No events yet
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                        Create your first event to start seeing analytics.
                    </p>
                    <Button
                        type="button"
                        onClick={() => setIsCreateOpen(true)}
                        className="mt-3 bg-slate-900 text-white font-bold text-xs inline-flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-slate-800 transition dark:bg-blue-600 dark:hover:bg-blue-500"
                    >
                        <Plus className="size-4" /> Create First Event
                    </Button>
                </Card>
            ) : (
                <>
                    {/* Mode-Specific KPI Cards */}
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {selectedEventId === "ALL" ? (
                            /* ALL EVENTS MODE KPI CARDS */
                            <>
                                <Card className="border-slate-200/80 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Events</span>
                                        <div className="flex size-9 items-center justify-center rounded-xl bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200">
                                            <CalendarDays className="size-5" />
                                        </div>
                                    </div>
                                    <div className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-slate-100">
                                        {metrics.totalEvents}
                                    </div>
                                    <p className="mt-1 text-[11px] text-slate-500 font-medium truncate">
                                        {metrics.activeCount} active · {metrics.upcomingCount} upcoming
                                    </p>
                                </Card>

                                <Card className="border-slate-200/80 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Registrations</span>
                                        <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                                            <UserCheck className="size-5" />
                                        </div>
                                    </div>
                                    <div className="mt-2 text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
                                        {metrics.totalRegistrations}
                                    </div>
                                    <p className="mt-1 text-[11px] text-slate-500 font-medium truncate">
                                        Across all hosted events
                                    </p>
                                </Card>

                                <Card className="border-slate-200/80 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Participants</span>
                                        <div className="flex size-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
                                            <Users className="size-5" />
                                        </div>
                                    </div>
                                    <div className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-slate-100">
                                        {metrics.totalParticipants}
                                    </div>
                                    <p className="mt-1 text-[11px] text-slate-500 font-medium truncate">
                                        Total registered team members
                                    </p>
                                </Card>

                                <Card className="border-slate-200/80 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Project Submissions</span>
                                        <div className="flex size-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                                            <FolderGit2 className="size-5" />
                                        </div>
                                    </div>
                                    <div className="mt-2 text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">
                                        {metrics.totalSubmissions}
                                    </div>
                                    <p className="mt-1 text-[11px] text-slate-500 font-medium truncate">
                                        Finalized project entries ({metrics.overallSubmissionRate}% rate)
                                    </p>
                                </Card>
                            </>
                        ) : (
                            /* SPECIFIC EVENT MODE KPI CARDS */
                            selectedEventObj && (
                                <>
                                    <Card className="border-slate-200/80 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Registrations</span>
                                            <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                                                <UserCheck className="size-5" />
                                            </div>
                                        </div>
                                        <div className="mt-2 text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
                                            {selectedEventObj.registrationsCount}
                                        </div>
                                        <p className="mt-1 text-[11px] text-slate-500 font-medium truncate">
                                            {selectedEventObj.confirmedRegsCount} confirmed entries
                                        </p>
                                    </Card>

                                    <Card className="border-slate-200/80 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Participants</span>
                                            <div className="flex size-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
                                                <Users className="size-5" />
                                            </div>
                                        </div>
                                        <div className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-slate-100">
                                            {selectedEventObj.participantsCount}
                                        </div>
                                        <p className="mt-1 text-[11px] text-slate-500 font-medium truncate">
                                            Registered team members
                                        </p>
                                    </Card>

                                    <Card className="border-slate-200/80 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Project Submissions</span>
                                            <div className="flex size-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                                                <FolderGit2 className="size-5" />
                                            </div>
                                        </div>
                                        <div className="mt-2 text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">
                                            {selectedEventObj.submissionsCount}
                                        </div>
                                        <p className="mt-1 text-[11px] text-slate-500 font-medium truncate">
                                            {selectedEventObj.draftSubmissionsCount} drafts saved
                                        </p>
                                    </Card>

                                    <Card className="border-slate-200/80 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Submission Rate</span>
                                            <div className="flex size-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                                                <TrendingUp className="size-5" />
                                            </div>
                                        </div>
                                        <div className="mt-2 text-2xl font-extrabold text-blue-600 dark:text-blue-400">
                                            {selectedEventObj.submissionRate}%
                                        </div>
                                        <p className="mt-1 text-[11px] text-slate-500 font-medium truncate">
                                            Final project submission conversion
                                        </p>
                                    </Card>
                                </>
                            )
                        )}
                    </div>

                    {/* MAIN CONTENT AREA DEPENDING ON SCOPE */}
                    {selectedEventId === "ALL" ? (
                        /* ==================================================
                           1. ALL EVENTS MODE CONTENT
                           ================================================== */
                        <>
                            {/* Top 5 Events Comparison */}
                            <Card className="border-slate-200/80 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900 space-y-6">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <TrendingUp className="size-4 text-blue-600 dark:text-blue-400" />
                                            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                                                Registrations vs Project Submissions (Top 5 Events)
                                            </h2>
                                        </div>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            Comparing registration volume and project submissions for top events.
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-4 text-xs font-semibold shrink-0">
                                        <div className="flex items-center gap-1.5">
                                            <span className="size-3 rounded-md bg-blue-600" />
                                            <span className="text-slate-700 dark:text-slate-300">Registrations</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <span className="size-3 rounded-md bg-emerald-500" />
                                            <span className="text-slate-700 dark:text-slate-300">Submissions</span>
                                        </div>
                                        {events.length > 5 && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={scrollToTable}
                                                className="text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 p-0 h-auto gap-1 ml-2"
                                            >
                                                View All Events ({events.length}) <ArrowRight className="size-3.5" />
                                            </Button>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-4 pt-2">
                                    {top5Events.map((evt, index) => {
                                        const regCount = evt.registrationsCount || 0;
                                        const subCount = evt.submissionsCount || 0;
                                        const regPct = Math.round((regCount / chartMax) * 100);
                                        const subPct = Math.round((subCount / chartMax) * 100);

                                        return (
                                            <div
                                                key={evt.id}
                                                className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100 dark:bg-slate-800/40 dark:border-slate-800 space-y-2.5"
                                            >
                                                <div className="flex items-center justify-between text-xs font-bold gap-2">
                                                    <div className="flex items-center gap-2 truncate">
                                                        <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-[10px] font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                                                            {index + 1}
                                                        </span>
                                                        <span className="text-slate-900 dark:text-slate-100 truncate">
                                                            {evt.title}
                                                        </span>
                                                    </div>
                                                    <span className="text-[11px] font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/80 px-2 py-0.5 rounded-lg border border-blue-100 dark:border-blue-900/50 shrink-0">
                                                        {evt.submissionRate}% Submission Rate
                                                    </span>
                                                </div>

                                                <div className="space-y-1.5 text-[11px]">
                                                    <div className="flex items-center gap-3">
                                                        <span className="w-24 text-slate-500 font-medium truncate shrink-0">
                                                            Registrations:
                                                        </span>
                                                        <div className="flex-1 bg-slate-200/70 dark:bg-slate-700/60 h-3.5 rounded-full overflow-hidden flex items-center">
                                                            <div
                                                                className="bg-blue-600 h-full rounded-full transition-all duration-500"
                                                                style={{ width: `${Math.max(regPct, regCount > 0 ? 4 : 0)}%` }}
                                                            />
                                                        </div>
                                                        <span className="w-10 text-right font-bold text-slate-800 dark:text-slate-200 shrink-0">
                                                            {regCount}
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center gap-3">
                                                        <span className="w-24 text-slate-500 font-medium truncate shrink-0">
                                                            Submissions:
                                                        </span>
                                                        <div className="flex-1 bg-slate-200/70 dark:bg-slate-700/60 h-3.5 rounded-full overflow-hidden flex items-center">
                                                            <div
                                                                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                                                                style={{ width: `${Math.max(subPct, subCount > 0 ? 4 : 0)}%` }}
                                                            />
                                                        </div>
                                                        <span className="w-10 text-right font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
                                                            {subCount}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </Card>

                            {/* Scalable Event Performance Breakdown Table */}
                            <Card className="rounded-2xl border border-slate-200/80 bg-white shadow-2xs dark:border-slate-800 dark:bg-slate-900 overflow-hidden space-y-0">
                                <div ref={tableRef} className="p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                                            Event Performance Breakdown
                                        </h2>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 font-normal">
                                            Paginated table showing all published events ({tableFilteredEvents.length} displaying).
                                        </p>
                                    </div>

                                    {/* Toolbar Filters: Status Dropdown & Search Input */}
                                    <div className="flex flex-wrap items-center gap-2">
                                        <div className="w-36">
                                            <HackHiveSelect
                                                value={tableStatusFilter}
                                                onChange={(e) => setTableStatusFilter(e.target.value)}
                                                options={[
                                                    { value: "ALL", label: "All Statuses" },
                                                    { value: "ACTIVE", label: "Active" },
                                                    { value: "UPCOMING", label: "Upcoming" },
                                                    { value: "COMPLETED", label: "Completed" },
                                                ]}
                                                size="sm"
                                            />
                                        </div>

                                        <div className="relative w-full sm:w-56">
                                            <Search className="pointer-events-none absolute left-3 top-2.5 size-3.5 text-slate-400" />
                                            <input
                                                type="text"
                                                value={tableSearchQuery}
                                                onChange={(e) => setTableSearchQuery(e.target.value)}
                                                placeholder="Search events..."
                                                className="w-full rounded-xl border border-slate-200 bg-slate-50/80 pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:bg-white dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-200 dark:focus:border-blue-500"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse text-xs">
                                        <thead>
                                            <tr className="border-b border-slate-100 bg-slate-50/60 dark:border-slate-800 dark:bg-slate-800/40 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                                                <th className="py-3.5 px-5">Event Name</th>
                                                <th className="py-3.5 px-4 text-center">Event Status</th>
                                                <th className="py-3.5 px-4 text-center">Registrations</th>
                                                <th className="py-3.5 px-4 text-center">Participants</th>
                                                <th className="py-3.5 px-4 text-center">Project Submissions</th>
                                                <th className="py-3.5 px-4 text-center">Submission Rate</th>
                                                <th className="py-3.5 px-4 text-center">Event Date</th>
                                                <th className="py-3.5 px-5 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                            {paginatedEvents.length > 0 ? (
                                                paginatedEvents.map((evt) => {
                                                    const status = getStatusBadge(evt);

                                                    return (
                                                        <tr
                                                            key={evt.id}
                                                            className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                                                        >
                                                            <td className="py-3.5 px-5 font-bold text-slate-900 dark:text-slate-100">
                                                                {evt.title}
                                                            </td>

                                                            <td className="py-3.5 px-4 text-center">
                                                                <Badge variant={status.variant} className="text-[10px] font-bold px-2 py-0.5">
                                                                    {status.label}
                                                                </Badge>
                                                            </td>

                                                            <td className="py-3.5 px-4 text-center font-extrabold text-slate-900 dark:text-slate-100">
                                                                {evt.registrationsCount || 0}
                                                            </td>

                                                            <td className="py-3.5 px-4 text-center font-bold text-slate-700 dark:text-slate-300">
                                                                {evt.participantsCount || evt.registrationsCount || 0} members
                                                            </td>

                                                            <td className="py-3.5 px-4 text-center font-extrabold text-indigo-600 dark:text-indigo-400">
                                                                {evt.submissionsCount || 0}
                                                            </td>

                                                            <td className="py-3.5 px-4 text-center font-bold text-blue-600 dark:text-blue-400">
                                                                {evt.submissionRate}%
                                                            </td>

                                                            <td className="py-3.5 px-4 text-center text-slate-600 dark:text-slate-400 font-medium">
                                                                {formatDate(evt.startDate)}
                                                            </td>

                                                            <td className="py-3.5 px-5 text-right">
                                                                <Button
                                                                    type="button"
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => setSelectedEventId(String(evt.id))}
                                                                    className="text-xs font-bold gap-1 px-3 py-1 rounded-xl border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900 hover:border-slate-300 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
                                                                >
                                                                    Inspect
                                                                </Button>
                                                            </td>
                                                        </tr>
                                                    );
                                                })
                                            ) : (
                                                <tr>
                                                    <td colSpan={8} className="py-8 text-center text-xs text-slate-400 dark:text-slate-500 font-medium">
                                                        No events found matching your search and filter criteria.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination Footer */}
                                {tableFilteredEvents.length > pageSize && (
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 font-medium gap-3">
                                        <div>
                                            Showing <strong className="text-slate-900 dark:text-slate-100">{(currentPage - 1) * pageSize + 1}</strong> to{" "}
                                            <strong className="text-slate-900 dark:text-slate-100">
                                                {Math.min(currentPage * pageSize, tableFilteredEvents.length)}
                                            </strong>{" "}
                                            of <strong className="text-slate-900 dark:text-slate-100">{tableFilteredEvents.length}</strong> events
                                        </div>

                                        <div className="flex items-center gap-1.5">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                disabled={currentPage === 1}
                                                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                                className="p-1.5 rounded-xl border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 disabled:opacity-40"
                                            >
                                                <ChevronLeft className="size-4" />
                                            </Button>

                                            <span className="text-xs font-semibold px-2">
                                                Page {currentPage} of {totalPages}
                                            </span>

                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                disabled={currentPage >= totalPages}
                                                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                                className="p-1.5 rounded-xl border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 disabled:opacity-40"
                                            >
                                                <ChevronRight className="size-4" />
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </Card>
                        </>
                    ) : (
                        /* ==================================================
                           2. SPECIFIC EVENT MODE CONTENT (NO REDUNDANT TABLE)
                           ================================================== */
                        selectedEventObj && (
                            <div className="grid gap-6 lg:grid-cols-3">
                                {/* CARD A: Event Statistics & Financial Overview */}
                                <Card className="border-slate-200/80 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
                                    <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                                        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                                            <Layers className="size-4 text-blue-600" /> Event Statistics
                                        </h3>
                                        <Badge variant={getStatusBadge(selectedEventObj).variant} className="text-[10px]">
                                            {getStatusBadge(selectedEventObj).label}
                                        </Badge>
                                    </div>

                                    <div className="space-y-3 text-xs">
                                        <div className="flex justify-between items-center">
                                            <span className="text-slate-500 font-medium">Event Date:</span>
                                            <span className="font-semibold text-slate-900 dark:text-slate-100">
                                                {formatDate(selectedEventObj.startDate)}
                                            </span>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <span className="text-slate-500 font-medium">Registration Deadline:</span>
                                            <span className="font-semibold text-slate-900 dark:text-slate-100">
                                                {formatDate(selectedEventObj.registrationEndDate)}
                                            </span>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <span className="text-slate-500 font-medium">Event Format:</span>
                                            <span className="font-semibold text-slate-900 dark:text-slate-100 uppercase">
                                                {selectedEventObj.eventMode || "Offline"}
                                            </span>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <span className="text-slate-500 font-medium">Registration Type:</span>
                                            <span className="font-bold text-blue-600 dark:text-blue-400">
                                                {selectedEventObj.registrationType || "FREE"}
                                                {selectedEventObj.registrationFee && selectedEventObj.registrationFee > 0
                                                    ? ` (₹${selectedEventObj.registrationFee})`
                                                    : ""}
                                            </span>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <span className="text-slate-500 font-medium">Team Configuration:</span>
                                            <span className="font-semibold text-slate-900 dark:text-slate-100">
                                                {selectedEventObj.minTeamSize || 1}–{selectedEventObj.maxTeamSize || 4} members
                                            </span>
                                        </div>

                                        {selectedEventObj.totalRevenue > 0 && (
                                            <div className="flex justify-between items-center border-t border-slate-100 pt-2.5 dark:border-slate-800">
                                                <span className="text-slate-500 font-bold flex items-center gap-1">
                                                    <IndianRupee className="size-3 text-emerald-600" /> Total Revenue:
                                                </span>
                                                <span className="font-extrabold text-emerald-600 text-sm">
                                                    ₹{selectedEventObj.totalRevenue}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </Card>

                                {/* CARD B: Registration & Participation Breakdown */}
                                <Card className="border-slate-200/80 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
                                    <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                                        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                                            <UserCheck className="size-4 text-emerald-600" /> Registration & Team Details
                                        </h3>
                                        <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                                            {selectedEventObj.registrationsCount} Entries
                                        </span>
                                    </div>

                                    <div className="space-y-3 text-xs">
                                        <div className="flex justify-between items-center p-2 rounded-xl bg-emerald-50/70 border border-emerald-100 dark:bg-emerald-950/30 dark:border-emerald-900/50">
                                            <span className="text-emerald-800 dark:text-emerald-300 font-semibold flex items-center gap-1.5">
                                                <CheckCircle2 className="size-3.5 text-emerald-600" /> Confirmed Registrations:
                                            </span>
                                            <span className="font-extrabold text-emerald-700 dark:text-emerald-300">
                                                {selectedEventObj.confirmedRegsCount}
                                            </span>
                                        </div>

                                        {selectedEventObj.pendingRegsCount > 0 && (
                                            <div className="flex justify-between items-center p-2 rounded-xl bg-amber-50/70 border border-amber-100 dark:bg-amber-950/30 dark:border-amber-900/50">
                                                <span className="text-amber-800 dark:text-amber-300 font-semibold flex items-center gap-1.5">
                                                    <Clock className="size-3.5 text-amber-600" /> Pending Payments:
                                                </span>
                                                <span className="font-extrabold text-amber-700 dark:text-amber-300">
                                                    {selectedEventObj.pendingRegsCount}
                                                </span>
                                            </div>
                                        )}

                                        {selectedEventObj.cancelledRegsCount > 0 && (
                                            <div className="flex justify-between items-center p-2 rounded-xl bg-slate-100 border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
                                                <span className="text-slate-600 dark:text-slate-400 font-semibold flex items-center gap-1.5">
                                                    <XCircle className="size-3.5 text-slate-500" /> Cancelled Entries:
                                                </span>
                                                <span className="font-extrabold text-slate-700 dark:text-slate-300">
                                                    {selectedEventObj.cancelledRegsCount}
                                                </span>
                                            </div>
                                        )}

                                        <div className="flex justify-between items-center pt-1">
                                            <span className="text-slate-500 font-medium">Total Registered Members:</span>
                                            <span className="font-bold text-slate-900 dark:text-slate-100">
                                                {selectedEventObj.participantsCount} members
                                            </span>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <span className="text-slate-500 font-medium">Average Team Size:</span>
                                            <span className="font-bold text-slate-900 dark:text-slate-100">
                                                {selectedEventObj.avgTeamSize} members / team
                                            </span>
                                        </div>
                                    </div>
                                </Card>

                                {/* CARD C: Project Submission Analytics */}
                                <Card className="border-slate-200/80 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
                                    <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                                        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                                            <FileCode2 className="size-4 text-indigo-600" /> Project Submission Breakdown
                                        </h3>
                                        <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                                            {selectedEventObj.submissionsCount} Finalized
                                        </span>
                                    </div>

                                    <div className="space-y-3 text-xs">
                                        <div className="flex justify-between items-center">
                                            <span className="text-slate-500 font-medium">Total Registered Teams:</span>
                                            <span className="font-semibold text-slate-900 dark:text-slate-100">
                                                {selectedEventObj.registrationsCount}
                                            </span>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <span className="text-slate-500 font-medium">Final Submissions (Submitted):</span>
                                            <span className="font-bold text-indigo-600 dark:text-indigo-400">
                                                {selectedEventObj.submissionsCount}
                                            </span>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <span className="text-slate-500 font-medium">Draft Submissions (In Progress):</span>
                                            <span className="font-semibold text-amber-600 dark:text-amber-400">
                                                {selectedEventObj.draftSubmissionsCount}
                                            </span>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <span className="text-slate-500 font-medium">Teams Pending Submission:</span>
                                            <span className="font-semibold text-slate-700 dark:text-slate-300">
                                                {Math.max(0, selectedEventObj.registrationsCount - selectedEventObj.submissionsCount)}
                                            </span>
                                        </div>

                                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
                                            <div className="flex justify-between items-center font-bold">
                                                <span className="text-slate-700 dark:text-slate-300">Submission Rate</span>
                                                <span className="text-blue-600 dark:text-blue-400">
                                                    {selectedEventObj.submissionRate}%
                                                </span>
                                            </div>

                                            <div className="h-2.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                                                <div
                                                    className="h-full bg-blue-600 rounded-full transition-all duration-500"
                                                    style={{ width: `${Math.min(100, selectedEventObj.submissionRate)}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        )
                    )}
                </>
            )}

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
