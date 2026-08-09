import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";
import {
    ArrowRight,
    Building2,
    Calendar,
    CheckCircle2,
    Clock,
    Code,
    Edit3,
    ExternalLink,
    FileText,
    FolderGit2,
    FolderKanban,
    Globe,
    Layers,
    MessageSquare,
    MoveRight,
    Plus,
    Search,
    Shield,
    Sparkles,
    Trash2,
    UserCheck,
    Users,
} from "lucide-react";

import useAuth from "../../hooks/useAuth";
import HackHiveSelect from "../../components/ui/HackHiveSelect";
import { teamService } from "../../services/teamService";
import { workspaceService } from "../../services/workspaceService";
import TeamChat from "../../components/workspace/TeamChat";
import KanbanTaskModal from "../../components/workspace/KanbanTaskModal";
import ResourceModal from "../../components/workspace/ResourceModal";
import TeamResources from "../../components/workspace/TeamResources";
import TeamMembers from "../../components/workspace/TeamMembers";
import { ConfirmModal } from "../../components/ui/ConfirmModal";
import DashboardSection from "../../components/student-dashboard/DashboardSection";
import { DashboardPageSkeleton, EmptyState } from "../../components/student-dashboard/DashboardStates";
import { Button } from "../../components/ui/Button";
import { Card, CardContent } from "../../components/ui/Card";

const KANBAN_COLUMNS = [
    { id: "TODO", label: "To Do", tone: "indigo" },
    { id: "IN_PROGRESS", label: "In Progress", tone: "amber" },
    { id: "DONE", label: "Done", tone: "emerald" },
];

function formatDate(dateStr) {
    if (!dateStr) return "No due date";
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return "No due date";
    return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(d);
}

export default function StudentWorkspace() {
    const { user: authUser } = useAuth();

    // Data State
    const [myTeams, setMyTeams] = useState([]);
    const [selectedTeamId, setSelectedTeamId] = useState("");
    const [members, setMembers] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [resources, setResources] = useState([]);
    const [notes, setNotes] = useState([]);

    const [loading, setLoading] = useState(true);
    const [workspaceLoading, setWorkspaceLoading] = useState(false);
    const [actionLoadingId, setActionLoadingId] = useState(null);

    // Active View Sub-Tab: 'overview' | 'chat' | 'kanban' | 'resources' | 'members' | 'notes'
    const [activeTab, setActiveTab] = useState("overview");

    // Note State & Editing
    const [noteTitle, setNoteTitle] = useState("");
    const [noteContent, setNoteContent] = useState("");
    const [editingNoteId, setEditingNoteId] = useState(null);

    // Task Modals & Confirm Deletion
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [editTask, setEditTask] = useState(null);
    const [deletingTaskId, setDeletingTaskId] = useState(null);

    // Resource Modals & State
    const [isResourceModalOpen, setIsResourceModalOpen] = useState(false);
    const [editingResource, setEditingResource] = useState(null);
    const [deletingResourceId, setDeletingResourceId] = useState(null);
    const [resourceError, setResourceError] = useState(false);

    // Member Action Modals & State
    const [removingMember, setRemovingMember] = useState(null);
    const [transferringLeaderMember, setTransferringLeaderMember] = useState(null);
    const [membersError, setMembersError] = useState(false);

    // 1. Initial Load My Teams
    useEffect(() => {
        let isMounted = true;
        const loadInitialTeams = async () => {
            try {
                setLoading(true);
                const res = await teamService.getMyTeams();
                if (isMounted) {
                    const list = Array.isArray(res) ? res : [];
                    setMyTeams(list);
                    if (list[0]) {
                        setSelectedTeamId(String(list[0].id));
                    }
                }
            } catch {
                if (isMounted) setMyTeams([]);
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        loadInitialTeams();
        return () => {
            isMounted = false;
        };
    }, []);

    // 2. Load Selected Workspace Data
    const loadWorkspace = useCallback(async (teamId) => {
        if (!teamId) return;
        try {
            setWorkspaceLoading(true);
            setResourceError(false);
            const [membersRes, tasksRes, resourcesRes] = await Promise.allSettled([
                teamService.getTeamMembers(teamId),
                workspaceService.getTeamTasks(teamId),
                workspaceService.getTeamResources(teamId),
            ]);

            if (membersRes.status === "fulfilled" && Array.isArray(membersRes.value)) {
                setMembers(membersRes.value);
            } else {
                setMembers([]);
                if (membersRes.status === "rejected") {
                    setMembersError(true);
                }
            }
            setTasks(tasksRes.status === "fulfilled" && Array.isArray(tasksRes.value) ? tasksRes.value : []);
            if (resourcesRes.status === "fulfilled" && Array.isArray(resourcesRes.value)) {
                setResources(resourcesRes.value);
            } else {
                setResources([]);
                if (resourcesRes.status === "rejected") {
                    setResourceError(true);
                }
            }
        } catch {
            setResourceError(true);
        } finally {
            setWorkspaceLoading(false);
        }
    }, []);

    useEffect(() => {
        if (selectedTeamId) {
            loadWorkspace(selectedTeamId);
        }
    }, [selectedTeamId, loadWorkspace]);

    // Active Selected Team
    const currentTeam = myTeams.find((t) => String(t.id) === String(selectedTeamId));

    // Detailed Metrics
    const metrics = useMemo(() => {
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter((t) => t.status === "DONE" || t.status === "COMPLETED").length;
        const pendingTasks = totalTasks - completedTasks;
        const totalMembers = members.length;
        const totalResources = resources.length;
        const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
        return { totalTasks, completedTasks, pendingTasks, totalMembers, totalResources, percentage };
    }, [tasks, members, resources]);

    // Kanban Move Task
    const handleMoveTaskStatus = async (task, nextStatus) => {
        try {
            setActionLoadingId(task.id);
            const payload = {
                teamId: task.teamId || parseInt(selectedTeamId, 10),
                title: task.title,
                description: task.description,
                assignedToStudentProfileId: task.assignedToStudentProfileId,
                priority: task.priority || "MEDIUM",
                dueDate: task.dueDate,
                status: nextStatus,
            };
            const updated = await workspaceService.updateTask(task.id, payload);
            setTasks((prev) => prev.map((t) => (t.id === task.id ? updated : t)));
            toast.success(`Task moved to ${nextStatus.replace("_", " ")}`);
        } catch {
            toast.error("Failed to update task status.");
        } finally {
            setActionLoadingId(null);
        }
    };

    // Task Create/Edit Submit
    const handleTaskSubmit = async (payload) => {
        try {
            setActionLoadingId("task");
            if (editTask) {
                const updated = await workspaceService.updateTask(editTask.id, {
                    ...payload,
                    teamId: parseInt(selectedTeamId, 10),
                });
                setTasks((prev) => prev.map((t) => (t.id === editTask.id ? updated : t)));
                toast.success("Task updated!");
            } else {
                const created = await workspaceService.createTask({
                    ...payload,
                    teamId: parseInt(selectedTeamId, 10),
                });
                setTasks((prev) => [...prev, created]);
                toast.success("Kanban task created!");
            }
            setIsTaskModalOpen(false);
            setEditTask(null);
        } catch {
            toast.error("Failed to save task.");
        } finally {
            setActionLoadingId(null);
        }
    };

    // Task Delete Confirmation
    const handleConfirmDeleteTask = async () => {
        if (!deletingTaskId) return;
        try {
            setActionLoadingId(deletingTaskId);
            await workspaceService.deleteTask(deletingTaskId);
            setTasks((prev) => prev.filter((t) => t.id !== deletingTaskId));
            toast.success("Task deleted successfully.");
        } catch {
            toast.error("Failed to delete task.");
        } finally {
            setDeletingTaskId(null);
            setActionLoadingId(null);
        }
    };

    // Resource Submit (Create & Update)
    const handleResourceSubmit = async (payload) => {
        try {
            setActionLoadingId("resource");
            if (editingResource) {
                const updated = await workspaceService.updateResource(editingResource.id, payload);
                setResources((prev) => prev.map((r) => (r.id === editingResource.id ? updated : r)));
                toast.success("Team resource updated!");
            } else {
                const created = await workspaceService.createResource({
                    ...payload,
                    teamId: parseInt(selectedTeamId, 10),
                });
                setResources((prev) => [...prev, created]);
                toast.success("Team resource added!");
            }
            setIsResourceModalOpen(false);
            setEditingResource(null);
        } catch {
            toast.error(editingResource ? "Failed to update resource." : "Failed to add team resource.");
        } finally {
            setActionLoadingId(null);
        }
    };

    // Confirm Delete Resource
    const handleConfirmDeleteResource = async () => {
        if (!deletingResourceId) return;
        try {
            setActionLoadingId(deletingResourceId);
            await workspaceService.deleteResource(deletingResourceId);
            setResources((prev) => prev.filter((r) => r.id !== deletingResourceId));
            toast.success("Resource deleted.");
        } catch {
            toast.error("Failed to delete resource.");
        } finally {
            setDeletingResourceId(null);
            setActionLoadingId(null);
        }
    };

    // Confirm Remove Team Member
    const handleConfirmRemoveMember = async () => {
        if (!removingMember) return;
        const targetProfileId = removingMember.studentProfileId || removingMember.memberId;
        try {
            setActionLoadingId(`remove-${targetProfileId}`);
            await teamService.removeMember(selectedTeamId, targetProfileId);
            setMembers((prev) => prev.filter((m) => (m.studentProfileId || m.memberId) !== targetProfileId));
            toast.success(`${removingMember.fullName || "Member"} removed from team.`);
        } catch {
            toast.error("Failed to remove member.");
        } finally {
            setRemovingMember(null);
            setActionLoadingId(null);
        }
    };

    // Confirm Transfer Leadership
    const handleConfirmTransferLeadership = async () => {
        if (!transferringLeaderMember) return;
        const targetProfileId = transferringLeaderMember.studentProfileId || transferringLeaderMember.memberId;
        try {
            setActionLoadingId(`transfer-${targetProfileId}`);
            if (teamService.updateTeam) {
                await teamService.updateTeam(selectedTeamId, { leaderStudentProfileId: targetProfileId });
            }
            setMembers((prev) =>
                prev.map((m) => ({
                    ...m,
                    role: (m.studentProfileId || m.memberId) === targetProfileId ? "LEADER" : "MEMBER",
                }))
            );
            toast.success(`Leadership transferred to ${transferringLeaderMember.fullName || "teammate"}.`);
        } catch {
            toast.error("Failed to transfer leadership.");
        } finally {
            setTransferringLeaderMember(null);
            setActionLoadingId(null);
        }
    };

    // Note Handlers
    const handleSaveNote = (e) => {
        e.preventDefault();
        if (!noteContent.trim()) return;

        if (editingNoteId) {
            setNotes((prev) =>
                prev.map((n) =>
                    n.id === editingNoteId
                        ? {
                              ...n,
                              title: noteTitle.trim() || "Workspace Note",
                              text: noteContent.trim(),
                              updatedAt: new Date().toLocaleDateString(),
                          }
                        : n
                )
            );
            toast.success("Note updated!");
            setEditingNoteId(null);
        } else {
            const newNote = {
                id: Date.now(),
                title: noteTitle.trim() || "Workspace Note",
                text: noteContent.trim(),
                date: new Date().toLocaleDateString(),
                author: authUser?.fullName || "Teammate",
            };
            setNotes((prev) => [newNote, ...prev]);
            toast.success("Note created!");
        }

        setNoteTitle("");
        setNoteContent("");
    };

    const handleEditNoteClick = (note) => {
        setEditingNoteId(note.id);
        setNoteTitle(note.title || "");
        setNoteContent(note.text || "");
    };

    const handleDeleteNote = (noteId) => {
        setNotes((prev) => prev.filter((n) => n.id !== noteId));
        if (editingNoteId === noteId) {
            setEditingNoteId(null);
            setNoteTitle("");
            setNoteContent("");
        }
        toast.success("Note removed.");
    };

    if (loading) {
        return <DashboardPageSkeleton />;
    }

    return (
        <div className="space-y-8 pb-16 w-full">
            {/* Top Header */}
            <Card className="overflow-hidden border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
                <CardContent className="p-6 sm:p-8">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                        <div className="space-y-1.5">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                                    Team Workspace
                                </span>
                                <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                                    Status: Active
                                </span>
                                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                                    Online
                                </span>
                            </div>
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
                                {currentTeam ? currentTeam.name : "Team Workspace"}
                            </h1>
                            <p className="max-w-2xl text-xs text-slate-500 dark:text-slate-400 leading-5">
                                {currentTeam?.eventTitle ? `Hackathon: ${currentTeam.eventTitle}` : "Notion & Linear inspired collaborative team hub."}
                            </p>
                        </div>

                        {/* Workspace Selector */}
                        {myTeams.length > 0 && (
                            <div className="flex flex-col gap-1 min-w-[240px]">
                                <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                                    Active Team Workspace
                                </label>
                                <HackHiveSelect
                                    value={selectedTeamId}
                                    onChange={(e) => setSelectedTeamId(e.target.value)}
                                    options={myTeams.map((t) => ({
                                        value: t.id,
                                        label: `${t.name} (${t.eventTitle || "Hackathon"})`,
                                    }))}
                                    searchable={myTeams.length > 3}
                                    searchPlaceholder="Search workspace..."
                                    size="sm"
                                />
                            </div>
                        )}
                    </div>

                    {/* Navigation Tabs */}
                    {myTeams.length > 0 && (
                        <div className="flex flex-wrap items-center gap-2 pt-6 mt-6 border-t border-slate-100 dark:border-slate-800">
                            <button
                                type="button"
                                onClick={() => setActiveTab("overview")}
                                className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                                    activeTab === "overview"
                                        ? "bg-slate-900 text-white shadow-2xs dark:bg-indigo-600"
                                        : "bg-slate-100 text-slate-600 hover:text-slate-900 dark:bg-slate-800 dark:text-slate-400"
                                }`}
                            >
                                Overview
                            </button>

                            <button
                                type="button"
                                onClick={() => setActiveTab("chat")}
                                className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                                    activeTab === "chat"
                                        ? "bg-slate-900 text-white shadow-2xs dark:bg-indigo-600"
                                        : "bg-slate-100 text-slate-600 hover:text-slate-900 dark:bg-slate-800 dark:text-slate-400"
                                }`}
                            >
                                Chat
                            </button>

                            <button
                                type="button"
                                onClick={() => setActiveTab("kanban")}
                                className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                                    activeTab === "kanban"
                                        ? "bg-slate-900 text-white shadow-2xs dark:bg-indigo-600"
                                        : "bg-slate-100 text-slate-600 hover:text-slate-900 dark:bg-slate-800 dark:text-slate-400"
                                }`}
                            >
                                Kanban ({tasks.length})
                            </button>

                            <button
                                type="button"
                                onClick={() => setActiveTab("resources")}
                                className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                                    activeTab === "resources"
                                        ? "bg-slate-900 text-white shadow-2xs dark:bg-indigo-600"
                                        : "bg-slate-100 text-slate-600 hover:text-slate-900 dark:bg-slate-800 dark:text-slate-400"
                                }`}
                            >
                                Resources ({resources.length})
                            </button>

                            <button
                                type="button"
                                onClick={() => setActiveTab("members")}
                                className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                                    activeTab === "members"
                                        ? "bg-slate-900 text-white shadow-2xs dark:bg-indigo-600"
                                        : "bg-slate-100 text-slate-600 hover:text-slate-900 dark:bg-slate-800 dark:text-slate-400"
                                }`}
                            >
                                Members ({members.length})
                            </button>

                            <button
                                type="button"
                                onClick={() => setActiveTab("notes")}
                                className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                                    activeTab === "notes"
                                        ? "bg-slate-900 text-white shadow-2xs dark:bg-indigo-600"
                                        : "bg-slate-100 text-slate-600 hover:text-slate-900 dark:bg-slate-800 dark:text-slate-400"
                                }`}
                            >
                                Notes ({notes.length})
                            </button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Empty State if student is not in a team */}
            {myTeams.length === 0 ? (
                <Card className="border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
                    <CardContent className="p-12">
                        <EmptyState
                            icon={<FolderKanban className="size-8 text-indigo-600" />}
                            title="No active team workspace found"
                            description="To access a team workspace, create a team or join an existing team for a hackathon."
                        />
                    </CardContent>
                </Card>
            ) : workspaceLoading ? (
                <DashboardPageSkeleton />
            ) : (
                <>
                    {/* TAB 1: OVERVIEW */}
                    {activeTab === "overview" && (
                        <div className="space-y-8">
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                                <Card className="border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Members</span>
                                    <p className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-slate-100">{metrics.totalMembers}</p>
                                    <p className="mt-1 text-[11px] text-slate-500">Active teammates</p>
                                </Card>

                                <Card className="border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Tasks</span>
                                    <p className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-slate-100">{metrics.totalTasks}</p>
                                    <p className="mt-1 text-[11px] text-slate-500">Kanban tasks</p>
                                </Card>

                                <Card className="border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Completed Tasks</span>
                                    <p className="mt-2 text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">{metrics.completedTasks}</p>
                                    <p className="mt-1 text-[11px] text-slate-500">Done items</p>
                                </Card>

                                <Card className="border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Pending Tasks</span>
                                    <p className="mt-2 text-3xl font-extrabold text-amber-600 dark:text-amber-400">{metrics.pendingTasks}</p>
                                    <p className="mt-1 text-[11px] text-slate-500">In progress / To do</p>
                                </Card>

                                <Card className="border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Resources</span>
                                    <p className="mt-2 text-3xl font-extrabold text-purple-600 dark:text-purple-400">{metrics.totalResources}</p>
                                    <p className="mt-1 text-[11px] text-slate-500">Repos & link assets</p>
                                </Card>
                            </div>

                            <DashboardSection
                                id="quick-actions"
                                eyebrow="Navigation Shortcuts"
                                title="Quick Actions"
                                description="Navigate directly to workspace collaboration tools."
                            >
                                <div className="grid gap-4 sm:grid-cols-3">
                                    <Card
                                        onClick={() => setActiveTab("chat")}
                                        className="cursor-pointer border-slate-200/80 bg-white p-5 shadow-xs transition hover:border-indigo-300 dark:border-slate-800 dark:bg-slate-900 space-y-2"
                                    >
                                        <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950">
                                            <MessageSquare className="size-5" />
                                        </div>
                                        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Open Team Chat</h4>
                                        <p className="text-xs text-slate-500">Access real-time channel discussions with teammates.</p>
                                    </Card>

                                    <Card
                                        onClick={() => setActiveTab("kanban")}
                                        className="cursor-pointer border-slate-200/80 bg-white p-5 shadow-xs transition hover:border-indigo-300 dark:border-slate-800 dark:bg-slate-900 space-y-2"
                                    >
                                        <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950">
                                            <FolderKanban className="size-5" />
                                        </div>
                                        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Open Kanban Board</h4>
                                        <p className="text-xs text-slate-500">Track tasks across To Do, In Progress, and Done states.</p>
                                    </Card>

                                    <Card
                                        onClick={() => setActiveTab("resources")}
                                        className="cursor-pointer border-slate-200/80 bg-white p-5 shadow-xs transition hover:border-indigo-300 dark:border-slate-800 dark:bg-slate-900 space-y-2"
                                    >
                                        <div className="flex size-10 items-center justify-center rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-950">
                                            <FolderGit2 className="size-5" />
                                        </div>
                                        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Open Resources</h4>
                                        <p className="text-xs text-slate-500">Access shared GitHub repositories, Figma wireframes, and drive links.</p>
                                    </Card>
                                </div>
                            </DashboardSection>
                        </div>
                    )}

                    {/* TAB 2: CHAT */}
                    {activeTab === "chat" && (
                        <div className="w-full">
                            <TeamChat team={currentTeam} members={members} />
                        </div>
                    )}

                    {/* TAB 3: KANBAN BOARD */}
                    {activeTab === "kanban" && (
                        <div className="space-y-6 w-full">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Kanban Board</h3>
                                    <p className="text-xs text-slate-500">Manage tasks across To Do, In Progress, and Done columns.</p>
                                </div>
                                <Button
                                    type="button"
                                    onClick={() => {
                                        setEditTask(null);
                                        setIsTaskModalOpen(true);
                                    }}
                                    className="rounded-xl bg-indigo-600 text-xs font-bold text-white hover:bg-indigo-500 shadow-2xs"
                                >
                                    <Plus className="mr-1.5 size-4" /> New Task
                                </Button>
                            </div>

                            {/* 3 Equal Width Columns - Full Workspace Stretch */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                                {KANBAN_COLUMNS.map((col) => {
                                    const colTasks = tasks.filter(
                                        (t) =>
                                            (t.status || "TODO") === col.id ||
                                            (col.id === "DONE" && t.status === "COMPLETED")
                                    );

                                    return (
                                        <div
                                            key={col.id}
                                            className="flex flex-col rounded-2xl border border-slate-200/80 bg-slate-100/70 p-4 dark:border-slate-800 dark:bg-slate-900/40 min-h-[500px] w-full"
                                        >
                                            {/* Sticky Header */}
                                            <div className="sticky top-0 z-10 flex items-center justify-between pb-3.5 mb-3 border-b border-slate-200/80 bg-slate-100/95 dark:bg-slate-900/90 backdrop-blur-xs rounded-t-xl px-1">
                                                <div className="flex items-center gap-2">
                                                    <span
                                                        className={`size-2.5 rounded-full ${
                                                            col.id === "TODO"
                                                                ? "bg-indigo-500"
                                                                : col.id === "IN_PROGRESS"
                                                                ? "bg-amber-500"
                                                                : "bg-emerald-500"
                                                        }`}
                                                    />
                                                    <span className="text-xs font-extrabold tracking-tight text-slate-800 dark:text-slate-200 uppercase">
                                                        {col.label}
                                                    </span>
                                                </div>

                                                <span className="rounded-full bg-white px-2.5 py-0.5 text-[10px] font-bold text-slate-700 shadow-2xs dark:bg-slate-800 dark:text-slate-300">
                                                    {colTasks.length}
                                                </span>
                                            </div>

                                            {/* Tasks List */}
                                            <div className="flex-1 space-y-3.5 overflow-y-auto max-h-[550px] pr-1">
                                                {colTasks.length > 0 ? (
                                                    colTasks.map((task) => {
                                                        const assigneeInitials = (task.assignedToName || "U")[0].toUpperCase();

                                                        return (
                                                            <motion.div
                                                                key={task.id}
                                                                initial={{ opacity: 0, y: 4 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                transition={{ duration: 0.15 }}
                                                            >
                                                                <Card className="border-slate-200/80 bg-white p-4 shadow-2xs hover:border-indigo-400 hover:shadow-md transition-all duration-200 dark:border-slate-800 dark:bg-slate-900 space-y-3">
                                                                    {/* Header Badges & Actions */}
                                                                    <div className="flex items-center justify-between gap-1">
                                                                        <span
                                                                            className={`rounded-md px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider ${
                                                                                task.priority === "URGENT"
                                                                                    ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-400"
                                                                                    : task.priority === "HIGH"
                                                                                    ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-400"
                                                                                    : task.priority === "LOW"
                                                                                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400"
                                                                                    : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                                                                            }`}
                                                                        >
                                                                            {task.priority || "MEDIUM"}
                                                                        </span>

                                                                        <div className="flex items-center gap-1">
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => {
                                                                                    setEditTask(task);
                                                                                    setIsTaskModalOpen(true);
                                                                                }}
                                                                                className="p-1 text-slate-400 hover:text-indigo-600 transition"
                                                                                title="Edit task"
                                                                            >
                                                                                <Edit3 className="size-3.5" />
                                                                            </button>
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => setDeletingTaskId(task.id)}
                                                                                className="p-1 text-slate-400 hover:text-rose-600 transition"
                                                                                title="Delete task"
                                                                            >
                                                                                <Trash2 className="size-3.5" />
                                                                            </button>
                                                                        </div>
                                                                    </div>

                                                                    {/* Title & Short Description */}
                                                                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-snug">
                                                                        {task.title}
                                                                    </h4>

                                                                    {task.description && (
                                                                        <p className="line-clamp-2 text-[11px] text-slate-500 leading-4">
                                                                            {task.description}
                                                                        </p>
                                                                    )}

                                                                    {/* Assignee Avatar & Due Date */}
                                                                    <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 dark:border-slate-800">
                                                                        <div className="flex items-center gap-1.5 min-w-0">
                                                                            <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-slate-900 font-bold text-[9px] text-white dark:bg-indigo-600">
                                                                                {assigneeInitials}
                                                                            </div>
                                                                            <span className="truncate max-w-[100px] font-semibold text-slate-700 dark:text-slate-300">
                                                                                {task.assignedToName || "Unassigned"}
                                                                            </span>
                                                                        </div>
                                                                        {task.dueDate && <div>Due: {formatDate(task.dueDate)}</div>}
                                                                    </div>

                                                                    {/* Move Task Controls */}
                                                                    <div className="flex items-center justify-between pt-1 text-[10px]">
                                                                        {col.id !== "TODO" && (
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => {
                                                                                    const idx = KANBAN_COLUMNS.findIndex((c) => c.id === col.id);
                                                                                    if (idx > 0) handleMoveTaskStatus(task, KANBAN_COLUMNS[idx - 1].id);
                                                                                }}
                                                                                className="text-slate-400 hover:text-slate-700 font-bold transition"
                                                                            >
                                                                                ← Move Back
                                                                            </button>
                                                                        )}
                                                                        {col.id !== "DONE" && (
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => {
                                                                                    const idx = KANBAN_COLUMNS.findIndex((c) => c.id === col.id);
                                                                                    if (idx < KANBAN_COLUMNS.length - 1) handleMoveTaskStatus(task, KANBAN_COLUMNS[idx + 1].id);
                                                                                }}
                                                                                className="ml-auto text-indigo-600 font-bold hover:text-indigo-500 transition"
                                                                            >
                                                                                Move Next →
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                </Card>
                                                            </motion.div>
                                                        );
                                                    })
                                                ) : (
                                                    <div className="p-6 text-center space-y-1 my-auto">
                                                        <p className="text-[11px] font-semibold text-slate-400">No tasks in {col.label}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* TAB 4: RESOURCES */}
                    {activeTab === "resources" && (
                        <TeamResources
                            resources={resources}
                            isLoading={workspaceLoading}
                            isError={resourceError}
                            onAddResource={() => {
                                setEditingResource(null);
                                setIsResourceModalOpen(true);
                            }}
                            onEditResource={(res) => {
                                setEditingResource(res);
                                setIsResourceModalOpen(true);
                            }}
                            onDeleteResource={(id) => setDeletingResourceId(id)}
                            onRetry={() => loadWorkspace(selectedTeamId)}
                        />
                    )}

                    {/* TAB 5: MEMBERS */}
                    {activeTab === "members" && (
                        <TeamMembers
                            members={members}
                            currentTeam={currentTeam}
                            currentUser={authUser}
                            isLoading={workspaceLoading}
                            isError={membersError}
                            onRemoveMember={(m) => setRemovingMember(m)}
                            onTransferLeadership={(m) => setTransferringLeaderMember(m)}
                            onRetry={() => loadWorkspace(selectedTeamId)}
                        />
                    )}

                    {/* TAB 6: DEDICATED TEAM NOTES */}
                    {activeTab === "notes" && (
                        <div className="space-y-6 w-full">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Team Workspace Notes</h3>
                                    <p className="text-xs text-slate-500">Full-width dedicated space for architecture, API schemas, and team guidelines.</p>
                                </div>
                            </div>

                            {/* Create / Edit Note Form */}
                            <Card className="border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                    {editingNoteId ? "Edit Workspace Note" : "Create New Workspace Note"}
                                </h4>
                                <form onSubmit={handleSaveNote} className="space-y-3">
                                    <input
                                        type="text"
                                        value={noteTitle}
                                        onChange={(e) => setNoteTitle(e.target.value)}
                                        placeholder="Note title (e.g. System Architecture & API Endpoints)..."
                                        className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-slate-900 outline-none focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-100"
                                    />
                                    <textarea
                                        rows={4}
                                        value={noteContent}
                                        onChange={(e) => setNoteContent(e.target.value)}
                                        placeholder="Write details, markdown code snippets, or team guidelines..."
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-900 outline-none focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-100"
                                    />
                                    <div className="flex items-center gap-2">
                                        <Button type="submit" size="sm" className="bg-indigo-600 text-white font-bold">
                                            {editingNoteId ? "Save Changes" : "Create Note"}
                                        </Button>
                                        {editingNoteId && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => {
                                                    setEditingNoteId(null);
                                                    setNoteTitle("");
                                                    setNoteContent("");
                                                }}
                                            >
                                                Cancel
                                            </Button>
                                        )}
                                    </div>
                                </form>
                            </Card>

                            {/* Notes List */}
                            {notes.length > 0 ? (
                                <div className="grid gap-4 sm:grid-cols-2">
                                    {notes.map((n) => (
                                        <Card
                                            key={n.id}
                                            className="flex flex-col justify-between border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-3"
                                        >
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{n.title}</h4>
                                                    <div className="flex items-center gap-1">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleEditNoteClick(n)}
                                                            className="p-1 text-slate-400 hover:text-indigo-600"
                                                            title="Edit note"
                                                        >
                                                            <Edit3 className="size-3.5" />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDeleteNote(n.id)}
                                                            className="p-1 text-slate-400 hover:text-rose-600"
                                                            title="Delete note"
                                                        >
                                                            <Trash2 className="size-3.5" />
                                                        </button>
                                                    </div>
                                                </div>
                                                <p className="whitespace-pre-wrap text-xs text-slate-600 leading-relaxed dark:text-slate-300">
                                                    {n.text}
                                                </p>
                                            </div>

                                            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                                                <span>Author: {n.author}</span>
                                                <span>{n.updatedAt ? `Updated ${n.updatedAt}` : n.date}</span>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <Card className="border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
                                    <CardContent className="p-8">
                                        <EmptyState
                                            icon={<FileText className="size-6 text-indigo-600" />}
                                            title="No team notes created yet"
                                            description="Use the form above to record team notes, API documentation, or architecture decisions."
                                        />
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    )}

                    {/* Modals */}
                    <KanbanTaskModal
                        isOpen={isTaskModalOpen}
                        onClose={() => {
                            setIsTaskModalOpen(false);
                            setEditTask(null);
                        }}
                        initialData={editTask}
                        members={members}
                        onSubmit={handleTaskSubmit}
                        isLoading={actionLoadingId === "task"}
                    />

                    <ResourceModal
                        isOpen={isResourceModalOpen}
                        onClose={() => {
                            setIsResourceModalOpen(false);
                            setEditingResource(null);
                        }}
                        initialData={editingResource}
                        onSubmit={handleResourceSubmit}
                        isLoading={actionLoadingId === "resource"}
                    />

                    <ConfirmModal
                        isOpen={Boolean(deletingTaskId)}
                        onClose={() => setDeletingTaskId(null)}
                        onConfirm={handleConfirmDeleteTask}
                        title="Delete Kanban Task"
                        description="Are you sure you want to delete this task? This action cannot be undone."
                        confirmText="Delete Task"
                        isDanger
                        isLoading={actionLoadingId === deletingTaskId}
                    />

                    <ConfirmModal
                        isOpen={Boolean(deletingResourceId)}
                        onClose={() => setDeletingResourceId(null)}
                        onConfirm={handleConfirmDeleteResource}
                        title="Delete Team Resource"
                        description="Are you sure you want to delete this team resource? This action cannot be undone."
                        confirmText="Delete Resource"
                        isDanger
                        isLoading={actionLoadingId === deletingResourceId}
                    />

                    <ConfirmModal
                        isOpen={Boolean(removingMember)}
                        onClose={() => setRemovingMember(null)}
                        onConfirm={handleConfirmRemoveMember}
                        title="Remove Team Member"
                        description={`Are you sure you want to remove ${removingMember?.fullName || "this member"} from the team?`}
                        confirmText="Remove Member"
                        isDanger
                        isLoading={actionLoadingId === `remove-${removingMember?.studentProfileId || removingMember?.memberId}`}
                    />

                    <ConfirmModal
                        isOpen={Boolean(transferringLeaderMember)}
                        onClose={() => setTransferringLeaderMember(null)}
                        onConfirm={handleConfirmTransferLeadership}
                        title="Transfer Team Leadership"
                        description={`Are you sure you want to transfer team leadership to ${transferringLeaderMember?.fullName || "this member"}?`}
                        confirmText="Transfer Leadership"
                        isLoading={actionLoadingId === `transfer-${transferringLeaderMember?.studentProfileId || transferringLeaderMember?.memberId}`}
                    />
                </>
            )}
        </div>
    );
}
