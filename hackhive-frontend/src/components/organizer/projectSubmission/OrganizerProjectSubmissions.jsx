import { useState, useEffect, useMemo, useCallback } from "react";
import {
    Search,
    FolderGit2,
    Globe,
    FileText,
    ExternalLink,
    Eye,
    Filter,
    Clock,
    CheckCircle2,
    AlertCircle,
    RotateCcw,
    Layers,
    Users,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "../../ui/Card";
import { Button } from "../../ui/Button";
import HackHiveSelect from "../../ui/HackHiveSelect";
import ProjectSubmissionDetailsModal from "./ProjectSubmissionDetailsModal";
import { SkeletonBlock } from "../../student-dashboard/DashboardStates";
import { projectSubmissionService } from "../../../services/projectSubmissionService";

function formatDate(dateStr) {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return "N/A";
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
    }).format(d);
}

export default function OrganizerProjectSubmissions({ selectedEventId = "" }) {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    // Search & Filter
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL"); // 'ALL' | 'SUBMITTED' | 'DRAFT'

    // Selected Submission for Details Modal
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

    // Load Event Submissions from API
    const loadSubmissions = useCallback(async (eventId) => {
        if (!eventId) return;
        try {
            setLoading(true);
            setIsError(false);
            const res = await projectSubmissionService.getEventProjectSubmissions(eventId);
            setSubmissions(Array.isArray(res) ? res : []);
        } catch (err) {
            console.error("Failed to load event project submissions:", err);
            setIsError(true);
            setSubmissions([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (selectedEventId) {
            loadSubmissions(selectedEventId);
        }
    }, [selectedEventId, loadSubmissions]);

    // Filtered Submissions
    const filteredSubmissions = useMemo(() => {
        let list = [...submissions];

        if (statusFilter !== "ALL") {
            list = list.filter((s) => s.submissionStatus === statusFilter);
        }

        if (searchQuery.trim()) {
            const q = searchQuery.trim().toLowerCase();
            list = list.filter((s) => {
                const titleMatch = s.projectTitle && s.projectTitle.toLowerCase().includes(q);
                const teamMatch = s.teamName && s.teamName.toLowerCase().includes(q);
                const leaderMatch = s.submittedByName && s.submittedByName.toLowerCase().includes(q);
                const techMatch = s.technologiesUsed && s.technologiesUsed.toLowerCase().includes(q);
                return titleMatch || teamMatch || leaderMatch || techMatch;
            });
        }

        return list;
    }, [submissions, statusFilter, searchQuery]);

    // Metrics
    const metrics = useMemo(() => {
        const total = submissions.length;
        const submittedCount = submissions.filter((s) => s.submissionStatus === "SUBMITTED").length;
        const draftCount = submissions.filter((s) => s.submissionStatus === "DRAFT").length;
        return { total, submittedCount, draftCount };
    }, [submissions]);

    const handleViewDetails = (submission) => {
        setSelectedSubmission(submission);
        setIsDetailsModalOpen(true);
    };

    if (loading) {
        return (
            <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-3">
                    <SkeletonBlock className="h-20 w-full" />
                    <SkeletonBlock className="h-20 w-full" />
                    <SkeletonBlock className="h-20 w-full" />
                </div>
                <SkeletonBlock className="h-64 w-full" />
            </div>
        );
    }

    return (
        <div className="space-y-6 w-full">
            {/* Summary Metrics Cards */}
            <div className="grid gap-4 sm:grid-cols-3">
                <Card className="border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Submissions</span>
                    <p className="mt-1 text-2xl font-extrabold text-slate-900 dark:text-slate-100">{metrics.total}</p>
                    <p className="text-[11px] text-slate-500">All team entries</p>
                </Card>

                <Card className="border-emerald-200/60 bg-emerald-50/40 p-5 shadow-xs dark:border-emerald-950/60 dark:bg-emerald-950/20">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Finalized Submissions</span>
                    <p className="mt-1 text-2xl font-extrabold text-emerald-900 dark:text-emerald-100">{metrics.submittedCount}</p>
                    <p className="text-[11px] text-emerald-600/80 dark:text-emerald-400/80">Submitted & locked</p>
                </Card>

                <Card className="border-amber-200/60 bg-amber-50/40 p-5 shadow-xs dark:border-amber-950/60 dark:bg-amber-950/20">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">Draft Submissions</span>
                    <p className="mt-1 text-2xl font-extrabold text-amber-900 dark:text-amber-100">{metrics.draftCount}</p>
                    <p className="text-[11px] text-amber-600/80 dark:text-amber-400/80">In progress</p>
                </Card>
            </div>

            {/* Toolbar: Search & Filter */}
            <Card className="border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by project title, team name, leader, or tech stack..."
                            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 pl-10 pr-4 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div className="flex items-center gap-2 min-w-[180px]">
                        <Filter className="size-4 text-slate-400 shrink-0" />
                        <HackHiveSelect
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            options={[
                                { value: "ALL", label: "All Statuses" },
                                { value: "SUBMITTED", label: "Submitted Only" },
                                { value: "DRAFT", label: "Drafts Only" },
                            ]}
                            size="sm"
                        />
                    </div>
                </div>
            </Card>

            {/* Submissions List / Table */}
            {isError ? (
                <Card className="border-rose-200 bg-rose-50/50 p-6 text-center text-xs text-rose-700 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-400">
                    <AlertCircle className="mx-auto size-6 text-rose-500 mb-2" />
                    <p>Failed to load project submissions for this event.</p>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mt-3"
                        onClick={() => loadSubmissions(selectedEventId)}
                    >
                        <RotateCcw className="mr-1.5 size-3.5" /> Retry
                    </Button>
                </Card>
            ) : filteredSubmissions.length === 0 ? (
                <Card className="border-slate-200/80 bg-white p-12 text-center shadow-xs dark:border-slate-800 dark:bg-slate-900">
                    <FolderGit2 className="mx-auto size-10 text-slate-400 mb-3" />
                    <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
                        {submissions.length === 0 ? "No Project Submissions Yet" : "No Matching Submissions Found"}
                    </h4>
                    <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
                        {submissions.length === 0
                            ? "Teams registered for this event have not created or submitted any projects yet."
                            : "Try adjusting your search criteria or status filter."}
                    </p>
                </Card>
            ) : (
                <div className="space-y-3">
                    {filteredSubmissions.map((submission) => {
                        const isSubmitted = submission.submissionStatus === "SUBMITTED";
                        return (
                            <Card
                                key={submission.id}
                                className="border-slate-200/80 bg-white p-5 shadow-xs hover:border-indigo-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-800 transition"
                            >
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="space-y-1.5 flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span
                                                className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                                                    isSubmitted
                                                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                                                        : "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400"
                                                }`}
                                            >
                                                {submission.submissionStatus}
                                            </span>
                                            <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-lg">
                                                Team: {submission.teamName || "Team"}
                                            </span>
                                            {submission.submittedByName && (
                                                <span className="text-[11px] text-slate-500">
                                                    Submitted by: {submission.submittedByName}
                                                </span>
                                            )}
                                        </div>

                                        <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 truncate">
                                            {submission.projectTitle || "Untitled Project"}
                                        </h4>

                                        {submission.problemStatement && (
                                            <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                                                {submission.problemStatement}
                                            </p>
                                        )}

                                        {/* Tech pills */}
                                        {submission.technologiesUsed && (
                                            <div className="flex flex-wrap gap-1 pt-1">
                                                {submission.technologiesUsed.split(",").slice(0, 5).map((tech, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-medium text-slate-600 dark:text-slate-400"
                                                    >
                                                        {tech.trim()}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Buttons & Links */}
                                    <div className="flex flex-wrap items-center gap-2 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 dark:border-slate-800 shrink-0">
                                        {submission.githubUrl && (
                                            <a
                                                href={submission.githubUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-indigo-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                                                title="GitHub Repository"
                                            >
                                                <FolderGit2 className="size-4" />
                                            </a>
                                        )}
                                        {submission.demoUrl && (
                                            <a
                                                href={submission.demoUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-emerald-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                                                title="Live Demo"
                                            >
                                                <Globe className="size-4" />
                                            </a>
                                        )}

                                        <Button
                                            type="button"
                                            size="sm"
                                            onClick={() => handleViewDetails(submission)}
                                        >
                                            <Eye className="mr-1.5 size-3.5" /> Evaluate & View Details
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}

            {/* Read-Only Submission Details Modal */}
            <ProjectSubmissionDetailsModal
                isOpen={isDetailsModalOpen}
                onClose={() => {
                    setIsDetailsModalOpen(false);
                    setSelectedSubmission(null);
                }}
                submission={selectedSubmission}
            />
        </div>
    );
}
