import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
    CheckCircle2,
    Clock,
    Crown,
    ExternalLink,
    Filter,
    Plus,
    Search,
    Shield,
    SlidersHorizontal,
    UserCheck,
    UserPlus,
    Users,
    XCircle,
} from "lucide-react";

import useAuth from "../../hooks/useAuth";
import HackHiveSelect from "../../components/ui/HackHiveSelect";
import { teamService } from "../../services/teamService";
import { eventService } from "../../services/eventService";
import TeamCard from "../../components/teams/TeamCard";
import CreateTeamModal from "../../components/teams/CreateTeamModal";
import TeamDetailsModal from "../../components/teams/TeamDetailsModal";
import DashboardSection from "../../components/student-dashboard/DashboardSection";
import { DashboardPageSkeleton, EmptyState } from "../../components/student-dashboard/DashboardStates";
import { Button } from "../../components/ui/Button";
import { Card, CardContent } from "../../components/ui/Card";

export default function StudentTeams() {
    const { user: authUser } = useAuth();
    const navigate = useNavigate();

    // Data State
    const [loading, setLoading] = useState(true);
    const [myTeams, setMyTeams] = useState([]);
    const [openTeams, setOpenTeams] = useState([]);
    const [myRequests, setMyRequests] = useState([]);
    const [events, setEvents] = useState([]);

    // UI Tab & Filter State
    const [activeTab, setActiveTab] = useState("my-teams"); // 'my-teams' | 'open-teams' | 'requests'
    const [searchQuery, setSearchQuery] = useState("");
    const [eventFilter, setEventFilter] = useState("ALL");
    const [actionLoadingId, setActionLoadingId] = useState(null);

    // Modals
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [selectedTeam, setSelectedTeam] = useState(null);

    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            const [myTeamsRes, openTeamsRes, reqsRes, eventsRes] = await Promise.allSettled([
                teamService.getMyTeams(),
                teamService.getOpenTeams(),
                teamService.getMyJoinRequests(),
                eventService.getAllEvents(),
            ]);

            setMyTeams(myTeamsRes.status === "fulfilled" && Array.isArray(myTeamsRes.value) ? myTeamsRes.value : []);
            setOpenTeams(openTeamsRes.status === "fulfilled" && Array.isArray(openTeamsRes.value) ? openTeamsRes.value : []);
            setMyRequests(reqsRes.status === "fulfilled" && Array.isArray(reqsRes.value) ? reqsRes.value : []);
            setEvents(eventsRes.status === "fulfilled" && Array.isArray(eventsRes.value) ? eventsRes.value : []);
        } catch {
            toast.error("Failed to load team workspaces.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    // IDs of teams current user has pending request for
    const pendingTeamIds = useMemo(() => {
        const pending = myRequests.filter((r) => r.status === "PENDING" || !r.status);
        return new Set(pending.map((r) => r.teamId));
    }, [myRequests]);

    // Set of my team IDs
    const myTeamIds = useMemo(() => {
        return new Set(myTeams.map((t) => t.id));
    }, [myTeams]);

    // Create Team Handler
    const handleCreateTeam = async (payload) => {
        try {
            setActionLoadingId("create");
            const newTeam = await teamService.createTeam(payload);
            setMyTeams((prev) => [newTeam, ...prev]);
            toast.success("Team workspace created!");
            setIsCreateOpen(false);
        } catch (err) {
            const msg = err?.response?.data?.message || "Failed to create team.";
            toast.error(msg);
        } finally {
            setActionLoadingId(null);
        }
    };

    // Send Join Request Handler
    const handleRequestJoin = async (teamId) => {
        try {
            setActionLoadingId(teamId);
            const reqRes = await teamService.sendJoinRequest(teamId);
            setMyRequests((prev) => [...prev, reqRes]);
            toast.success("Join request sent to team leader!");
        } catch (err) {
            const msg = err?.response?.data?.message || "Could not send join request.";
            toast.error(msg);
        } finally {
            setActionLoadingId(null);
        }
    };

    // Leave Team Handler
    const handleLeaveTeam = async (teamId) => {
        try {
            setActionLoadingId(teamId);
            await teamService.leaveTeam(teamId);
            setMyTeams((prev) => prev.filter((t) => t.id !== teamId));
            toast.success("You have left the team.");
        } catch {
            toast.error("Failed to leave team.");
        } finally {
            setActionLoadingId(null);
        }
    };

    // Cancel Join Request Handler
    const handleCancelRequest = async (requestId) => {
        try {
            setActionLoadingId(requestId);
            await teamService.cancelJoinRequest(requestId);
            setMyRequests((prev) => prev.filter((r) => r.requestId !== requestId));
            toast.success("Join request cancelled.");
        } catch {
            toast.error("Failed to cancel request.");
        } finally {
            setActionLoadingId(null);
        }
    };

    // Filter Logic
    const displayedTeams = useMemo(() => {
        let list = activeTab === "my-teams" ? [...myTeams] : [...openTeams];

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            list = list.filter(
                (t) =>
                    (t.name && t.name.toLowerCase().includes(q)) ||
                    (t.description && t.description.toLowerCase().includes(q)) ||
                    (t.eventTitle && t.eventTitle.toLowerCase().includes(q)) ||
                    (t.leaderName && t.leaderName.toLowerCase().includes(q))
            );
        }

        if (eventFilter !== "ALL") {
            list = list.filter((t) => String(t.eventId) === String(eventFilter));
        }

        return list;
    }, [activeTab, myTeams, openTeams, searchQuery, eventFilter]);

    if (loading) {
        return <DashboardPageSkeleton />;
    }

    return (
        <div className="space-y-8 pb-16">
            {/* Hero Header */}
            <Card className="overflow-hidden border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
                <CardContent className="p-6 sm:p-8">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                                    Team Hub
                                </span>
                            </div>
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
                                Team Workspaces & Recruitment
                            </h1>
                            <p className="max-w-2xl text-xs text-slate-500 dark:text-slate-400 leading-5">
                                Form a team for upcoming hackathons, request to join active open workspaces, and collaborate with your teammates.
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <Button
                                type="button"
                                onClick={() => setIsCreateOpen(true)}
                                className="rounded-xl bg-slate-900 text-xs font-bold text-white hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500"
                            >
                                <Plus className="mr-1.5 size-4" /> Create Team
                            </Button>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex flex-wrap items-center gap-2 pt-6 mt-6 border-t border-slate-100 dark:border-slate-800">
                        <button
                            type="button"
                            onClick={() => setActiveTab("my-teams")}
                            className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                                activeTab === "my-teams"
                                    ? "bg-slate-900 text-white shadow-2xs dark:bg-indigo-600"
                                    : "bg-slate-100 text-slate-600 hover:text-slate-900 dark:bg-slate-800 dark:text-slate-400"
                            }`}
                        >
                            My Teams ({myTeams.length})
                        </button>

                        <button
                            type="button"
                            onClick={() => setActiveTab("open-teams")}
                            className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                                activeTab === "open-teams"
                                    ? "bg-slate-900 text-white shadow-2xs dark:bg-indigo-600"
                                    : "bg-slate-100 text-slate-600 hover:text-slate-900 dark:bg-slate-800 dark:text-slate-400"
                            }`}
                        >
                            Join Available Teams ({openTeams.length})
                        </button>

                        <button
                            type="button"
                            onClick={() => setActiveTab("requests")}
                            className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                                activeTab === "requests"
                                    ? "bg-slate-900 text-white shadow-2xs dark:bg-indigo-600"
                                    : "bg-slate-100 text-slate-600 hover:text-slate-900 dark:bg-slate-800 dark:text-slate-400"
                            }`}
                        >
                            My Join Requests ({myRequests.length})
                        </button>
                    </div>
                </CardContent>
            </Card>

            {/* Search & Filters (Shown for My Teams & Join Teams tabs) */}
            {activeTab !== "requests" && (
                <Card className="border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
                    <CardContent className="p-4 sm:p-5">
                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                            <div className="group relative flex-1 max-w-md">
                                <Search className="pointer-events-none absolute left-3.5 top-3 size-4 text-slate-400 group-focus-within:text-indigo-600" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search by team name, description, event..."
                                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-xs text-slate-900 outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-800 dark:text-slate-100"
                                />
                            </div>

                            <div className="w-48">
                                <HackHiveSelect
                                    value={eventFilter}
                                    onChange={(e) => setEventFilter(e.target.value)}
                                    options={[
                                        { value: "ALL", label: "All Events" },
                                        ...events.map((evt) => ({ value: evt.id, label: evt.title })),
                                    ]}
                                    searchable={events.length > 3}
                                    searchPlaceholder="Search events..."
                                    size="sm"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Main Content Area */}
            {activeTab === "requests" ? (
                /* Tab 3: My Sent Join Requests */
                <DashboardSection
                    id="requests-list"
                    eyebrow="Activity"
                    title="My Join Requests"
                    description="Track the status of join requests sent to team leaders."
                >
                    <Card className="border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
                        <CardContent className="p-6">
                            {myRequests.length > 0 ? (
                                <div className="space-y-3">
                                    {myRequests.map((req) => (
                                        <div
                                            key={req.requestId}
                                            className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-800/40"
                                        >
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <Users className="size-4 text-indigo-600 dark:text-indigo-400" />
                                                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                                                        {req.teamName || `Team #${req.teamId}`}
                                                    </h4>
                                                </div>
                                                <p className="text-xs text-slate-500">
                                                    Applicant: {req.studentName} ({req.studentEmail})
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                {req.status === "APPROVED" || req.status === "ACCEPTED" ? (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                                                        <CheckCircle2 className="size-3.5" /> Approved
                                                    </span>
                                                ) : req.status === "REJECTED" ? (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-3 py-1 text-xs font-bold text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                                                        <XCircle className="size-3.5" /> Rejected
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                                                        <Clock className="size-3.5" /> Pending Review
                                                    </span>
                                                )}

                                                {(req.status === "PENDING" || !req.status) && (
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleCancelRequest(req.requestId)}
                                                        disabled={actionLoadingId === req.requestId}
                                                        className="text-xs font-semibold text-rose-600 hover:bg-rose-50"
                                                    >
                                                        Cancel Request
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <EmptyState
                                    icon={<UserPlus className="size-6" />}
                                    title="No join requests sent"
                                    description="When you request to join an open team, your application status will appear here."
                                    action={
                                        <Button type="button" size="sm" onClick={() => setActiveTab("open-teams")}>
                                            Browse Available Teams
                                        </Button>
                                    }
                                />
                            )}
                        </CardContent>
                    </Card>
                </DashboardSection>
            ) : (
                /* Tabs 1 & 2: My Teams & Open Teams Grid */
                <DashboardSection
                    id="teams-grid"
                    eyebrow={activeTab === "my-teams" ? "Workspaces" : "Recruitment"}
                    title={activeTab === "my-teams" ? "My Active Team Workspaces" : "Open Teams Looking for Members"}
                    description={
                        activeTab === "my-teams"
                            ? "Teams where you are an active member or team leader."
                            : "Browse teams with open slots and request to join their build."
                    }
                >
                    {displayedTeams.length > 0 ? (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {displayedTeams.map((team) => {
                                const isMyTeam = myTeamIds.has(team.id);
                                const isLeader = team.leaderId === authUser?.userId;
                                const hasPendingRequest = pendingTeamIds.has(team.id);

                                return (
                                    <TeamCard
                                        key={team.id}
                                        team={team}
                                        isMyTeam={isMyTeam}
                                        isLeader={isLeader}
                                        hasPendingRequest={hasPendingRequest}
                                        onViewDetails={(t) => setSelectedTeam(t)}
                                        onOpenWorkspace={() => navigate("/student/workspace")}
                                        onLeaveTeam={handleLeaveTeam}
                                        onRequestJoin={handleRequestJoin}
                                        isActionLoading={actionLoadingId === team.id}
                                    />
                                );
                            })}
                        </div>
                    ) : (
                        <Card className="border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
                            <CardContent className="p-8">
                                <EmptyState
                                    icon={<Users className="size-6" />}
                                    title={
                                        activeTab === "my-teams"
                                            ? "You are not part of any team yet"
                                            : "No open teams found"
                                    }
                                    description={
                                        activeTab === "my-teams"
                                            ? "Create a new team workspace for an upcoming hackathon or request to join an existing open team."
                                            : "Try adjusting your search query or event filter."
                                    }
                                    action={
                                        activeTab === "my-teams" ? (
                                            <Button
                                                type="button"
                                                onClick={() => setIsCreateOpen(true)}
                                                className="rounded-xl bg-indigo-600 text-xs font-bold text-white"
                                            >
                                                Create Your First Team
                                            </Button>
                                        ) : (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => {
                                                    setSearchQuery("");
                                                    setEventFilter("ALL");
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
            )}

            {/* Create Team Dialog */}
            <CreateTeamModal
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                events={events}
                onCreateTeam={handleCreateTeam}
                isLoading={actionLoadingId === "create"}
            />

            {/* Team Details & Members Dialog */}
            <TeamDetailsModal
                team={selectedTeam}
                isOpen={Boolean(selectedTeam)}
                onClose={() => setSelectedTeam(null)}
                currentUserId={authUser?.userId}
                currentStudentProfileId={authUser?.userId}
                onRefresh={loadData}
            />
        </div>
    );
}
