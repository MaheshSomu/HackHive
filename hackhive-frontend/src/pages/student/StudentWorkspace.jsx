import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
    ArrowRight,
    Building2,
    Calendar,
    CheckCircle2,
    Clock,
    Code,
    ExternalLink,
    FileText,
    FolderGit2,
    FolderKanban,
    Globe,
    Layers,
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
import { teamService } from "../../services/teamService";
import { workspaceService } from "../../services/workspaceService";
import KanbanTaskModal from "../../components/workspace/KanbanTaskModal";
import ResourceModal from "../../components/workspace/ResourceModal";
import DashboardSection from "../../components/student-dashboard/DashboardSection";
import { DashboardPageSkeleton, EmptyState } from "../../components/student-dashboard/DashboardStates";
import { Button } from "../../components/ui/Button";
import { Card, CardContent } from "../../components/ui/Card";

const KANBAN_COLUMNS = [
    { id: "BACKLOG", label: "Backlog", tone: "slate" },
    { id: "TODO", label: "To Do", tone: "indigo" },
    { id: "IN_PROGRESS", label: "In Progress", tone: "amber" },
    { id: "REVIEW", label: "In Review", tone: "purple" },
    { id: "COMPLETED", label: "Completed", tone: "emerald" },
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

    // Active View Sub-Tab
    const [activeTab, setActiveTab] = useState("overview"); // 'overview' | 'kanban' | 'resources' | 'notes' | 'members'

    // Note Input State
    const [noteInput, setNoteInput] = useState("");
    const [noteSearch, setNoteSearch] = useState("");

    // Modals
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [editTask, setEditTask] = useState(null);

    const [isResourceModalOpen, setIsResourceModalOpen] = useState(false);

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
            const [membersRes, tasksRes, resourcesRes] = await Promise.allSettled([
                teamService.getTeamMembers(teamId),
                workspaceService.getTeamTasks(teamId),
                workspaceService.getTeamResources(teamId),
            ]);

            setMembers(membersRes.status === "fulfilled" && Array.isArray(membersRes.value) ? membersRes.value : []);
            setTasks(tasksRes.status === "fulfilled" && Array.isArray(tasksRes.value) ? tasksRes.value : []);
            setResources(resourcesRes.status === "fulfilled" && Array.isArray(resourcesRes.value) ? resourcesRes.value : []);
        } catch {
            // silent catch
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

    // Metrics
    const metrics = useMemo(() => {
        const total = tasks.length;
        const completed = tasks.filter((t) => t.status === "COMPLETED").length;
        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
        return { total, completed, remaining: total - completed, percentage };
    }, [tasks]);

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
        } catch {
            toast.error("Failed to save task.");
        } finally {
            setActionLoadingId(null);
        }
    };

    // Task Delete
    const handleDeleteTask = async (taskId) => {
        try {
            setActionLoadingId(taskId);
            await workspaceService.deleteTask(taskId);
            setTasks((prev) => prev.filter((t) => t.id !== taskId));
            toast.success("Task deleted.");
        } catch {
            toast.error("Failed to delete task.");
        } finally {
            setActionLoadingId(null);
        }
    };

    // Add Resource Submit
    const handleResourceSubmit = async (payload) => {
        try {
            setActionLoadingId("resource");
            const created = await workspaceService.createResource({
                ...payload,
                teamId: parseInt(selectedTeamId, 10),
            });
            setResources((prev) => [...prev, created]);
            toast.success("Team resource added!");
            setIsResourceModalOpen(false);
        } catch {
            toast.error("Failed to add team resource.");
        } finally {
            setActionLoadingId(null);
        }
    };

    // Delete Resource
    const handleDeleteResource = async (resourceId) => {
        try {
            setActionLoadingId(resourceId);
            await workspaceService.deleteResource(resourceId);
            setResources((prev) => prev.filter((r) => r.id !== resourceId));
            toast.success("Resource deleted.");
        } catch {
            toast.error("Failed to delete resource.");
        } finally {
            setActionLoadingId(null);
        }
    };

    // Add Note Handler
    const handleAddNote = (e) => {
        e.preventDefault();
        if (!noteInput.trim()) return;
        const newNote = {
            id: Date.now(),
            text: noteInput.trim(),
            date: new Date().toLocaleDateString(),
            author: authUser?.fullName || "Teammate",
        };
        setNotes((prev) => [newNote, ...prev]);
        setNoteInput("");
        toast.success("Note added to workspace!");
    };

    const handleDeleteNote = (noteId) => {
        setNotes((prev) => prev.filter((n) => n.id !== noteId));
        toast.success("Note removed.");
    };

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
                            <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                                Team Collaboration Workspace
                            </span>
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
                                {currentTeam ? currentTeam.name : "Team Workspace"}
                            </h1>
                            <p className="max-w-2xl text-xs text-slate-500 dark:text-slate-400 leading-5">
                                {currentTeam?.eventTitle ? `Hackathon: ${currentTeam.eventTitle}` : "Notion & Linear inspired collaborative team hub."}
                            </p>
                        </div>

                        {/* Workspace Selector */}
                        {myTeams.length > 0 ? (
                            <div className="flex flex-col gap-1">
                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                    Active Team Workspace
                                </label>
                                <select
                                    value={selectedTeamId}
                                    onChange={(e) => setSelectedTeamId(e.target.value)}
                                    className="h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-bold text-slate-900 outline-none focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-100"
                                >
                                    {myTeams.map((t) => (
                                        <option key={t.id} value={t.id}>
                                            {t.name} ({t.eventTitle || "Hackathon"})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        ) : null}
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
                                onClick={() => setActiveTab("kanban")}
                                className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                                    activeTab === "kanban"
                                        ? "bg-slate-900 text-white shadow-2xs dark:bg-indigo-600"
                                        : "bg-slate-100 text-slate-600 hover:text-slate-900 dark:bg-slate-800 dark:text-slate-400"
                                }`}
                            >
                                Kanban Board ({tasks.length})
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
                                Resources & Links ({resources.length})
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
                                Team Notes ({notes.length})
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
                                Teammates ({members.length})
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
                            description="To access a team workspace, you need to create a team or join an existing team for a hackathon."
                        />
                    </CardContent>
                </Card>
            ) : workspaceLoading ? (
                <DashboardPageSkeleton />
            ) : (
                /* Active Workspace View */
                <>
                    {/* TAB 1: OVERVIEW */}
                    {activeTab === "overview" && (
                        <div className="space-y-6">
                            {/* Stat cards */}
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                <Card className="border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Tasks</span>
                                    <p className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-slate-100">{metrics.total}</p>
                                    <p className="mt-1 text-[11px] text-slate-500">Kanban tasks created</p>
                                </Card>

                                <Card className="border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Completed Tasks</span>
                                    <p className="mt-2 text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">{metrics.completed}</p>
                                    <p className="mt-1 text-[11px] text-slate-500">Resolved tasks</p>
                                </Card>

                                <Card className="border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Workspace Progress</span>
                                    <p className="mt-2 text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">{metrics.percentage}%</p>
                                    <div className="mt-2 h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                                        <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${metrics.percentage}%` }} />
                                    </div>
                                </Card>

                                <Card className="border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Team Resources</span>
                                    <p className="mt-2 text-3xl font-extrabold text-purple-600 dark:text-purple-400">{resources.length}</p>
                                    <p className="mt-1 text-[11px] text-slate-500">Repos & link assets</p>
                                </Card>
                            </div>

                            {/* Quick Actions & Members Summary */}
                            <DashboardSection
                                id="overview-actions"
                                eyebrow="Workspace Actions"
                                title="Collaborative Shortcuts"
                                description="Quick actions for your team workspace."
                            >
                                <div className="grid gap-4 sm:grid-cols-3">
                                    <Card
                                        onClick={() => {
                                            setEditTask(null);
                                            setIsTaskModalOpen(true);
                                        }}
                                        className="cursor-pointer border-slate-200/80 bg-white p-5 shadow-xs transition hover:border-indigo-300 dark:border-slate-800 dark:bg-slate-900"
                                    >
                                        <div className="flex size-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950">
                                            <Plus className="size-4" />
                                        </div>
                                        <h4 className="mt-3 text-xs font-bold text-slate-900 dark:text-slate-100">Create Kanban Task</h4>
                                        <p className="mt-0.5 text-[11px] text-slate-500">Add a task and assign to a teammate.</p>
                                    </Card>

                                    <Card
                                        onClick={() => setIsResourceModalOpen(true)}
                                        className="cursor-pointer border-slate-200/80 bg-white p-5 shadow-xs transition hover:border-indigo-300 dark:border-slate-800 dark:bg-slate-900"
                                    >
                                        <div className="flex size-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-950">
                                            <FolderGit2 className="size-4" />
                                        </div>
                                        <h4 className="mt-3 text-xs font-bold text-slate-900 dark:text-slate-100">Add Resource Link</h4>
                                        <p className="mt-0.5 text-[11px] text-slate-500">Add GitHub repo or Figma design URL.</p>
                                    </Card>

                                    <Card
                                        onClick={() => setActiveTab("notes")}
                                        className="cursor-pointer border-slate-200/80 bg-white p-5 shadow-xs transition hover:border-indigo-300 dark:border-slate-800 dark:bg-slate-900"
                                    >
                                        <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950">
                                            <FileText className="size-4" />
                                        </div>
                                        <h4 className="mt-3 text-xs font-bold text-slate-900 dark:text-slate-100">Team Notes</h4>
                                        <p className="mt-0.5 text-[11px] text-slate-500">Post workspace notes and code snippets.</p>
                                    </Card>
                                </div>
                            </DashboardSection>
                        </div>
                    )}

                    {/* TAB 2: KANBAN BOARD */}
                    {activeTab === "kanban" && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Kanban Board</h3>
                                    <p className="text-xs text-slate-500">Manage tasks and progress across your team.</p>
                                </div>
                                <Button
                                    type="button"
                                    onClick={() => {
                                        setEditTask(null);
                                        setIsTaskModalOpen(true);
                                    }}
                                    className="rounded-xl bg-indigo-600 text-xs font-bold text-white hover:bg-indigo-500"
                                >
                                    <Plus className="mr-1.5 size-4" /> New Task
                                </Button>
                            </div>

                            {/* Kanban Columns Grid */}
                            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
                                {KANBAN_COLUMNS.map((col) => {
                                    const colTasks = tasks.filter((t) => (t.status || "TODO") === col.id);

                                    return (
                                        <div
                                            key={col.id}
                                            className="flex flex-col rounded-2xl border border-slate-200/80 bg-slate-100/70 p-3 dark:border-slate-800 dark:bg-slate-900/40 min-h-[400px]"
                                        >
                                            {/* Column Header */}
                                            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200 dark:border-slate-800">
                                                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                                    {col.label}
                                                </span>
                                                <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-slate-600 shadow-2xs dark:bg-slate-800 dark:text-slate-300">
                                                    {colTasks.length}
                                                </span>
                                            </div>

                                            {/* Task Cards */}
                                            <div className="flex-1 space-y-3">
                                                {colTasks.map((task) => (
                                                    <Card
                                                        key={task.id}
                                                        className="border-slate-200/80 bg-white p-3.5 shadow-2xs dark:border-slate-800 dark:bg-slate-900 space-y-2"
                                                    >
                                                        <div className="flex items-center justify-between gap-1">
                                                            <span
                                                                className={`rounded px-1.5 py-0.5 text-[9px] font-bold ${
                                                                    task.priority === "URGENT"
                                                                        ? "bg-rose-100 text-rose-800"
                                                                        : task.priority === "HIGH"
                                                                        ? "bg-amber-100 text-amber-800"
                                                                        : "bg-slate-100 text-slate-700"
                                                                }`}
                                                            >
                                                                {task.priority || "MEDIUM"}
                                                            </span>

                                                            <button
                                                                type="button"
                                                                onClick={() => handleDeleteTask(task.id)}
                                                                className="text-slate-400 hover:text-rose-600 p-0.5"
                                                                title="Delete task"
                                                            >
                                                                <Trash2 className="size-3" />
                                                            </button>
                                                        </div>

                                                        <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                                                            {task.title}
                                                        </h4>

                                                        {task.description && (
                                                            <p className="line-clamp-2 text-[11px] text-slate-500">
                                                                {task.description}
                                                            </p>
                                                        )}

                                                        <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-400 space-y-1 dark:border-slate-800">
                                                            {task.assignedToName && (
                                                                <div>Assignee: <span className="font-semibold text-slate-700 dark:text-slate-300">{task.assignedToName}</span></div>
                                                            )}
                                                            {task.dueDate && <div>Due: {formatDate(task.dueDate)}</div>}
                                                        </div>

                                                        {/* Status Move Controls */}
                                                        <div className="flex items-center justify-between pt-1 text-[10px]">
                                                            {col.id !== "BACKLOG" && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        const idx = KANBAN_COLUMNS.findIndex((c) => c.id === col.id);
                                                                        if (idx > 0) handleMoveTaskStatus(task, KANBAN_COLUMNS[idx - 1].id);
                                                                    }}
                                                                    className="text-slate-400 hover:text-slate-700 font-bold"
                                                                >
                                                                    ← Move Back
                                                                </button>
                                                            )}
                                                            {col.id !== "COMPLETED" && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        const idx = KANBAN_COLUMNS.findIndex((c) => c.id === col.id);
                                                                        if (idx < KANBAN_COLUMNS.length - 1) handleMoveTaskStatus(task, KANBAN_COLUMNS[idx + 1].id);
                                                                    }}
                                                                    className="ml-auto text-indigo-600 font-bold hover:text-indigo-500"
                                                                >
                                                                    Move Next →
                                                                </button>
                                                            )}
                                                        </div>
                                                    </Card>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* TAB 3: RESOURCES & LINKS */}
                    {activeTab === "resources" && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Team Resources & Links</h3>
                                    <p className="text-xs text-slate-500">Shared repositories, designs, and project documentation.</p>
                                </div>
                                <Button
                                    type="button"
                                    onClick={() => setIsResourceModalOpen(true)}
                                    className="rounded-xl bg-indigo-600 text-xs font-bold text-white hover:bg-indigo-500"
                                >
                                    <Plus className="mr-1.5 size-4" /> Add Resource
                                </Button>
                            </div>

                            {resources.length > 0 ? (
                                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                    {resources.map((res) => (
                                        <Card
                                            key={res.id}
                                            className="flex flex-col justify-between border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-3"
                                        >
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                                        {res.resourceType}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeleteResource(res.id)}
                                                        className="text-slate-400 hover:text-rose-600"
                                                        title="Delete resource"
                                                    >
                                                        <Trash2 className="size-3.5" />
                                                    </button>
                                                </div>

                                                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{res.title}</h4>
                                                {res.description && <p className="text-xs text-slate-500">{res.description}</p>}
                                            </div>

                                            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                                <span className="text-[11px] text-slate-400">By: {res.addedByName || "Teammate"}</span>
                                                {res.resourceUrl && (
                                                    <a
                                                        href={res.resourceUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:underline"
                                                    >
                                                        Open Link <ExternalLink className="size-3" />
                                                    </a>
                                                )}
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <Card className="border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
                                    <CardContent className="p-8">
                                        <EmptyState
                                            icon={<FolderGit2 className="size-6" />}
                                            title="No team resources added yet"
                                            description="Share your GitHub repository URL or Figma designs with your team."
                                            action={
                                                <Button type="button" size="sm" onClick={() => setIsResourceModalOpen(true)}>
                                                    Add First Resource
                                                </Button>
                                            }
                                        />
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    )}

                    {/* TAB 4: TEAM NOTES */}
                    {activeTab === "notes" && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Team Notes & Snippets</h3>
                                    <p className="text-xs text-slate-500">Shared workspace notes for architecture and setup instructions.</p>
                                </div>
                            </div>

                            {/* Add Note Form */}
                            <Card className="border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                                <form onSubmit={handleAddNote} className="flex gap-3">
                                    <input
                                        type="text"
                                        value={noteInput}
                                        onChange={(e) => setNoteInput(e.target.value)}
                                        placeholder="Post a quick note or update to the team workspace..."
                                        className="h-10 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs text-slate-900 outline-none focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-100"
                                    />
                                    <Button type="submit" size="sm" className="bg-indigo-600 text-white font-bold">
                                        Post Note
                                    </Button>
                                </form>
                            </Card>

                            {/* Notes List */}
                            {notes.length > 0 ? (
                                <div className="space-y-3">
                                    {notes.map((n) => (
                                        <Card
                                            key={n.id}
                                            className="border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900 flex items-start justify-between"
                                        >
                                            <div className="space-y-1">
                                                <p className="text-xs text-slate-800 dark:text-slate-200">{n.text}</p>
                                                <p className="text-[10px] text-slate-400">
                                                    Posted by <span className="font-semibold text-slate-600 dark:text-slate-300">{n.author}</span> on {n.date}
                                                </p>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => handleDeleteNote(n.id)}
                                                className="text-slate-400 hover:text-rose-600 p-1"
                                                title="Delete note"
                                            >
                                                <Trash2 className="size-3.5" />
                                            </button>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <Card className="border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
                                    <CardContent className="p-8">
                                        <EmptyState
                                            icon={<FileText className="size-6" />}
                                            title="No notes posted yet"
                                            description="Use the input above to post your first workspace note."
                                        />
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    )}

                    {/* TAB 5: TEAMMATES */}
                    {activeTab === "members" && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Team Members ({members.length})</h3>
                                <p className="text-xs text-slate-500">Teammates collaborating in this workspace.</p>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {members.map((m) => {
                                    const initials = (m.fullName || m.email || "M")[0].toUpperCase();
                                    const isLead = m.role === "LEADER" || m.fullName === currentTeam?.leaderName;

                                    return (
                                        <Card
                                            key={m.memberId || m.studentProfileId || m.email}
                                            className="border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 flex items-center gap-3"
                                        >
                                            <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-slate-900 font-bold text-xs text-white dark:bg-indigo-600">
                                                {initials}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-1.5">
                                                    <h4 className="truncate text-xs font-bold text-slate-900 dark:text-slate-100">
                                                        {m.fullName || "Teammate"}
                                                    </h4>
                                                    {isLead && (
                                                        <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold text-amber-800">
                                                            Leader
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="truncate text-[11px] text-slate-500">{m.email}</p>
                                                {m.college && <p className="truncate text-[10px] text-slate-400">{m.college}</p>}
                                            </div>
                                        </Card>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Modals */}
                    <KanbanTaskModal
                        isOpen={isTaskModalOpen}
                        onClose={() => setIsTaskModalOpen(false)}
                        initialData={editTask}
                        members={members}
                        onSubmit={handleTaskSubmit}
                        isLoading={actionLoadingId === "task"}
                    />

                    <ResourceModal
                        isOpen={isResourceModalOpen}
                        onClose={() => setIsResourceModalOpen(false)}
                        onSubmit={handleResourceSubmit}
                        isLoading={actionLoadingId === "resource"}
                    />
                </>
            )}
        </div>
    );
}
