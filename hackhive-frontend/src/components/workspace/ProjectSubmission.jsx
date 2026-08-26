import { useState, useEffect, useMemo, useCallback } from "react";
import { toast } from "sonner";
import {
    FolderGit2,
    Globe,
    FileText,
    Send,
    CheckCircle2,
    AlertCircle,
    Edit3,
    Lock,
    Clock,
    Sparkles,
    ExternalLink,
    Shield,
    Plus,
    Save,
    RotateCcw,
    Layers,
} from "lucide-react";
import { Card, CardContent } from "../ui/Card";
import { Button } from "../ui/Button";
import ConfirmModal from "../ui/ConfirmModal";
import { SkeletonBlock } from "../student-dashboard/DashboardStates";
import { projectSubmissionService } from "../../services/projectSubmissionService";
import { projectResultService } from "../../services/projectResultService";

function formatDate(dateStr) {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return null;
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
    }).format(d);
}

export default function ProjectSubmission({ currentTeam = null, authUser = null }) {
    const [submission, setSubmission] = useState(null);
    const [publishedResult, setPublishedResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [savingDraft, setSavingDraft] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [isCreatingDraft, setIsCreatingDraft] = useState(false);

    const [formData, setFormData] = useState({
        projectTitle: "",
        problemStatement: "",
        projectDescription: "",
        technologiesUsed: "",
        githubUrl: "",
        demoUrl: "",
        presentationUrl: "",
    });

    const [errors, setErrors] = useState({});

    // Team Leader Check
    const isLeader = useMemo(() => {
        if (!authUser || !currentTeam) return false;
        const currentUserId = authUser.id;
        const currentStudentId = authUser.studentProfileId || authUser.id;
        if (currentTeam.leaderId && String(currentTeam.leaderId) === String(currentUserId)) return true;
        if (currentTeam.leaderStudentProfileId && String(currentTeam.leaderStudentProfileId) === String(currentStudentId)) return true;
        if (currentTeam.leaderName && authUser.fullName && currentTeam.leaderName.toLowerCase() === authUser.fullName.toLowerCase()) return true;
        return false;
    }, [authUser, currentTeam]);

    // Load Project Submission & Published Result Data for Current Team
    const loadSubmission = useCallback(async () => {
        if (!currentTeam?.id) return;
        try {
            setLoading(true);
            setNotFound(false);
            const res = await projectSubmissionService.getProjectSubmission(currentTeam.id);
            if (res) {
                setSubmission(res);
                setFormData({
                    projectTitle: res.projectTitle || "",
                    problemStatement: res.problemStatement || "",
                    projectDescription: res.projectDescription || "",
                    technologiesUsed: res.technologiesUsed || "",
                    githubUrl: res.githubUrl || "",
                    demoUrl: res.demoUrl || "",
                    presentationUrl: res.presentationUrl || "",
                });

                // Fetch published result for student team if submission is SUBMITTED
                try {
                    const resultRes = await projectResultService.getPublishedResultForTeam(currentTeam.id);
                    if (resultRes) {
                        setPublishedResult(resultRes);
                    }
                } catch {
                    setPublishedResult(null);
                }
            }
        } catch (err) {
            if (err.response?.status === 404) {
                setSubmission(null);
                setNotFound(true);
            } else {
                setSubmission(null);
                setNotFound(true);
            }
        } finally {
            setLoading(false);
        }
    }, [currentTeam?.id]);

    useEffect(() => {
        loadSubmission();
    }, [loadSubmission]);

    // Handle Input Field Change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: null }));
        }
    };

    // Client-side Validation
    const validateForm = () => {
        const newErrors = {};
        if (!formData.projectTitle.trim()) {
            newErrors.projectTitle = "Project title is required.";
        }
        if (!formData.problemStatement.trim()) {
            newErrors.problemStatement = "Problem statement is required.";
        }
        if (!formData.projectDescription.trim()) {
            newErrors.projectDescription = "Project description is required.";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // 1. Create Draft Submission
    const handleCreateDraft = async (e) => {
        e?.preventDefault();
        if (!validateForm()) {
            toast.error("Please fill in all required fields.");
            return;
        }

        try {
            setSavingDraft(true);
            const payload = {
                eventId: currentTeam.eventId,
                teamId: currentTeam.id,
                ...formData,
            };
            const created = await projectSubmissionService.createProjectSubmission(payload);
            setSubmission(created);
            setNotFound(false);
            setIsCreatingDraft(false);
            toast.success("Project submission draft created successfully!");
        } catch (err) {
            const errMsg = err.response?.data?.message || "Failed to create project submission draft.";
            toast.error(errMsg);
        } finally {
            setSavingDraft(false);
        }
    };

    // 2. Update Draft Submission
    const handleSaveDraft = async (e) => {
        e?.preventDefault();
        if (!submission?.id) return;
        if (!validateForm()) {
            toast.error("Please fill in all required fields.");
            return;
        }

        try {
            setSavingDraft(true);
            const updated = await projectSubmissionService.updateProjectSubmission(submission.id, formData);
            setSubmission(updated);
            toast.success("Project submission draft saved successfully!");
        } catch (err) {
            const errMsg = err.response?.data?.message || "Failed to update project submission draft.";
            toast.error(errMsg);
        } finally {
            setSavingDraft(false);
        }
    };

    // 3. Finalize & Submit Project (Triggers ConfirmModal)
    const handleConfirmSubmit = async () => {
        if (!submission?.id) return;

        try {
            setSubmitting(true);
            const submitted = await projectSubmissionService.submitProjectSubmission(submission.id);
            setSubmission(submitted);
            setIsConfirmModalOpen(false);
            toast.success("Project submitted successfully!");
        } catch (err) {
            const errMsg = err.response?.data?.message || "Failed to submit project.";
            toast.error(errMsg);
        } finally {
            setSubmitting(false);
        }
    };

    // Loading State Skeleton
    if (loading) {
        return (
            <Card className="border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
                <SkeletonBlock className="h-8 w-64" />
                <SkeletonBlock className="h-4 w-96" />
                <SkeletonBlock className="h-32 w-full" />
            </Card>
        );
    }

    const isSubmitted = submission?.submissionStatus === "SUBMITTED";

    return (
        <div className="space-y-6 w-full">
            {/* Header Banner */}
            <Card className="overflow-hidden border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
                <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                                    Project Submission
                                </span>
                                {submission && (
                                    <span
                                        className={`rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider ${
                                            isSubmitted
                                                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                                                : "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400"
                                        }`}
                                    >
                                        Status: {submission.submissionStatus}
                                    </span>
                                )}
                            </div>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 sm:text-2xl">
                                {currentTeam?.name ? `${currentTeam.name} — Submission` : "Project Submission"}
                            </h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                {isSubmitted
                                    ? "Your project has been officially submitted and finalized for evaluation."
                                    : submission
                                    ? "Draft project details. Only the team leader can edit and submit."
                                    : "Submit your team's project details for the hackathon."}
                            </p>
                        </div>

                        {/* Quick Action Info / Badges */}
                        {isSubmitted && submission.submittedAt && (
                            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 px-3 py-2 rounded-xl border border-slate-100 dark:border-slate-800">
                                <Clock className="size-4 text-emerald-500 shrink-0" />
                                <span>Submitted: {formatDate(submission.submittedAt)}</span>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* ---------------------------------------------------- */}
            {/* STATE 1: NO SUBMISSION YET (EMPTY STATE)             */}
            {/* ---------------------------------------------------- */}
            {notFound && !submission && !isCreatingDraft && (
                <Card className="border-slate-200/80 bg-white p-8 text-center shadow-xs dark:border-slate-800 dark:bg-slate-900">
                    <CardContent className="flex flex-col items-center space-y-4 max-w-lg mx-auto py-6">
                        <div className="flex size-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/80 dark:text-indigo-400">
                            <FolderGit2 className="size-7" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                                No Project Submission Found
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                {isLeader
                                    ? "Your team has not created a project submission draft yet. As team leader, you can initialize the submission draft now."
                                    : "Your team has not submitted a project yet. Only your team leader can create and manage the project submission."}
                            </p>
                        </div>

                        {isLeader ? (
                            <Button
                                type="button"
                                size="sm"
                                className="mt-2"
                                onClick={() => setIsCreatingDraft(true)}
                            >
                                <Plus className="mr-1.5 size-4" />
                                Start Project Submission
                            </Button>
                        ) : (
                            <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 bg-amber-50 dark:bg-amber-950/50 dark:text-amber-400 px-3 py-2 rounded-xl border border-amber-200/60 dark:border-amber-900/60">
                                <Shield className="size-4 shrink-0" />
                                <span>Waiting for team leader to create draft submission</span>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* ---------------------------------------------------- */}
            {/* STATE 2: DRAFT STATE (EDITABLE FORM FOR LEADER,      */}
            {/* READ-ONLY FOR MEMBERS)                               */}
            {/* ---------------------------------------------------- */}
            {((submission && !isSubmitted) || (notFound && isCreatingDraft)) && (
                <Card className="border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
                    <CardContent className="p-6 sm:p-8 space-y-6">
                        {!isLeader && (
                            <div className="flex items-center gap-2 rounded-xl border border-amber-200/80 bg-amber-50/80 p-4 text-xs font-semibold text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-400">
                                <AlertCircle className="size-4 shrink-0 text-amber-600 dark:text-amber-400" />
                                <span>
                                    You are viewing the team's submission draft in read-only mode. Only the team leader ({currentTeam?.leaderName || "Leader"}) can edit or submit.
                                </span>
                            </div>
                        )}

                        <form onSubmit={submission ? handleSaveDraft : handleCreateDraft} className="space-y-6">
                            {/* Project Title */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                                    Project Title <span className="text-rose-500">*</span>
                                </label>
                                {isLeader ? (
                                    <input
                                        type="text"
                                        name="projectTitle"
                                        value={formData.projectTitle}
                                        onChange={handleChange}
                                        placeholder="e.g. HackHive — Collaborative Hackathon Ecosystem"
                                        className={`w-full rounded-xl border px-3.5 py-2.5 text-xs text-slate-900 bg-white dark:bg-slate-800/80 dark:text-slate-100 transition-colors focus:outline-none focus:ring-2 ${
                                            errors.projectTitle
                                                ? "border-rose-400 focus:ring-rose-500"
                                                : "border-slate-200 focus:ring-indigo-500 dark:border-slate-700"
                                        }`}
                                    />
                                ) : (
                                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-200/60 dark:border-slate-700">
                                        {formData.projectTitle || "Untitled Project"}
                                    </p>
                                )}
                                {errors.projectTitle && <p className="text-[11px] font-semibold text-rose-500">{errors.projectTitle}</p>}
                            </div>

                            {/* Problem Statement */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                                    Problem Statement <span className="text-rose-500">*</span>
                                </label>
                                {isLeader ? (
                                    <textarea
                                        name="problemStatement"
                                        rows={3}
                                        value={formData.problemStatement}
                                        onChange={handleChange}
                                        placeholder="Describe the real-world problem your project aims to solve..."
                                        className={`w-full rounded-xl border px-3.5 py-2.5 text-xs text-slate-900 bg-white dark:bg-slate-800/80 dark:text-slate-100 transition-colors focus:outline-none focus:ring-2 ${
                                            errors.problemStatement
                                                ? "border-rose-400 focus:ring-rose-500"
                                                : "border-slate-200 focus:ring-indigo-500 dark:border-slate-700"
                                        }`}
                                    />
                                ) : (
                                    <p className="text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-200/60 dark:border-slate-700 whitespace-pre-wrap leading-relaxed">
                                        {formData.problemStatement || "No problem statement specified."}
                                    </p>
                                )}
                                {errors.problemStatement && <p className="text-[11px] font-semibold text-rose-500">{errors.problemStatement}</p>}
                            </div>

                            {/* Project Description */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                                    Project Description <span className="text-rose-500">*</span>
                                </label>
                                {isLeader ? (
                                    <textarea
                                        name="projectDescription"
                                        rows={5}
                                        value={formData.projectDescription}
                                        onChange={handleChange}
                                        placeholder="Provide a comprehensive overview of your solution, key features, architecture, and workflow..."
                                        className={`w-full rounded-xl border px-3.5 py-2.5 text-xs text-slate-900 bg-white dark:bg-slate-800/80 dark:text-slate-100 transition-colors focus:outline-none focus:ring-2 ${
                                            errors.projectDescription
                                                ? "border-rose-400 focus:ring-rose-500"
                                                : "border-slate-200 focus:ring-indigo-500 dark:border-slate-700"
                                        }`}
                                    />
                                ) : (
                                    <p className="text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-200/60 dark:border-slate-700 whitespace-pre-wrap leading-relaxed">
                                        {formData.projectDescription || "No description specified."}
                                    </p>
                                )}
                                {errors.projectDescription && <p className="text-[11px] font-semibold text-rose-500">{errors.projectDescription}</p>}
                            </div>

                            {/* Technologies Used */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                                    Technologies Used
                                </label>
                                {isLeader ? (
                                    <input
                                        type="text"
                                        name="technologiesUsed"
                                        value={formData.technologiesUsed}
                                        onChange={handleChange}
                                        placeholder="e.g. React, Spring Boot, PostgreSQL, TailwindCSS, WebSocket"
                                        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 px-3.5 py-2.5 text-xs text-slate-900 bg-white dark:bg-slate-800/80 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                ) : (
                                    <p className="text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-200/60 dark:border-slate-700">
                                        {formData.technologiesUsed || "Not specified."}
                                    </p>
                                )}
                            </div>

                            {/* URLs Grid */}
                            <div className="grid gap-4 sm:grid-cols-3">
                                {/* GitHub Repo URL */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                                        <FolderGit2 className="size-3.5 text-slate-500" /> GitHub Repository
                                    </label>
                                    {isLeader ? (
                                        <input
                                            type="url"
                                            name="githubUrl"
                                            value={formData.githubUrl}
                                            onChange={handleChange}
                                            placeholder="https://github.com/..."
                                            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 px-3.5 py-2 text-xs text-slate-900 bg-white dark:bg-slate-800/80 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    ) : (
                                        <p className="text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-700 truncate">
                                            {formData.githubUrl || "None"}
                                        </p>
                                    )}
                                </div>

                                {/* Live Demo URL */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                                        <Globe className="size-3.5 text-slate-500" /> Live Demo URL
                                    </label>
                                    {isLeader ? (
                                        <input
                                            type="url"
                                            name="demoUrl"
                                            value={formData.demoUrl}
                                            onChange={handleChange}
                                            placeholder="https://..."
                                            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 px-3.5 py-2 text-xs text-slate-900 bg-white dark:bg-slate-800/80 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    ) : (
                                        <p className="text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-700 truncate">
                                            {formData.demoUrl || "None"}
                                        </p>
                                    )}
                                </div>

                                {/* Presentation URL */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                                        <FileText className="size-3.5 text-slate-500" /> Presentation / Slide Deck
                                    </label>
                                    {isLeader ? (
                                        <input
                                            type="url"
                                            name="presentationUrl"
                                            value={formData.presentationUrl}
                                            onChange={handleChange}
                                            placeholder="https://canva.com/..."
                                            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 px-3.5 py-2 text-xs text-slate-900 bg-white dark:bg-slate-800/80 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    ) : (
                                        <p className="text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-700 truncate">
                                            {formData.presentationUrl || "None"}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Action Bar (Leader Only) */}
                            {isLeader && (
                                <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                                    {notFound && isCreatingDraft && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setIsCreatingDraft(false)}
                                            disabled={savingDraft}
                                        >
                                            Cancel
                                        </Button>
                                    )}

                                    <Button
                                        type="submit"
                                        variant="outline"
                                        size="sm"
                                        isLoading={savingDraft}
                                        disabled={savingDraft}
                                    >
                                        <Save className="mr-1.5 size-4" />
                                        {submission ? "Save Draft" : "Create Draft"}
                                    </Button>

                                    {submission && (
                                        <Button
                                            type="button"
                                            size="sm"
                                            onClick={() => {
                                                if (validateForm()) {
                                                    setIsConfirmModalOpen(true);
                                                } else {
                                                    toast.error("Please complete required fields before submitting.");
                                                }
                                            }}
                                            disabled={savingDraft || submitting}
                                        >
                                            <Send className="mr-1.5 size-4" />
                                            Submit Project
                                        </Button>
                                    )}
                                </div>
                            )}
                        </form>
                    </CardContent>
                </Card>
            )}

            {/* ---------------------------------------------------- */}
            {/* STATE 3: SUBMITTED STATE (READ-ONLY FOR ALL)         */}
            {/* ---------------------------------------------------- */}
            {isSubmitted && submission && (
                <Card className="border-emerald-200/80 bg-white shadow-xs dark:border-emerald-900/60 dark:bg-slate-900 overflow-hidden">
                    <div className="bg-emerald-500/10 border-b border-emerald-200/60 dark:border-emerald-900/40 p-4 flex items-center gap-3 text-emerald-800 dark:text-emerald-300">
                        <CheckCircle2 className="size-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                        <div className="space-y-0.5 text-xs">
                            <p className="font-bold">Project Submission Finalized & Locked</p>
                            <p className="opacity-90">
                                Submitted by {submission.submittedByName || "Team Leader"}{" "}
                                {submission.submittedAt && `on ${formatDate(submission.submittedAt)}`}
                            </p>
                        </div>
                    </div>

                    <CardContent className="p-6 sm:p-8 space-y-6">
                        {/* Title */}
                        <div className="space-y-1">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                Project Title
                            </span>
                            <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
                                {submission.projectTitle}
                            </h3>
                        </div>

                        {/* Problem Statement */}
                        <div className="space-y-1.5">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                Problem Statement
                            </span>
                            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                                {submission.problemStatement}
                            </div>
                        </div>

                        {/* Project Description */}
                        <div className="space-y-1.5">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                Project Description
                            </span>
                            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                                {submission.projectDescription}
                            </div>
                        </div>

                        {/* Technologies Used */}
                        {submission.technologiesUsed && (
                            <div className="space-y-2">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                    Technologies Used
                                </span>
                                <div className="flex flex-wrap gap-1.5">
                                    {submission.technologiesUsed.split(",").map((tech, idx) => (
                                        <span
                                            key={idx}
                                            className="rounded-lg bg-indigo-50 dark:bg-indigo-950/80 px-2.5 py-1 text-xs font-semibold text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900/50"
                                        >
                                            {tech.trim()}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* URLs & Links */}
                        <div className="grid gap-3 sm:grid-cols-3 pt-2">
                            {submission.githubUrl && (
                                <a
                                    href={submission.githubUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-xs font-semibold text-slate-800 dark:text-slate-200 group"
                                >
                                    <span className="flex items-center gap-2 truncate">
                                        <FolderGit2 className="size-4 text-slate-600 dark:text-slate-400" />
                                        GitHub Repository
                                    </span>
                                    <ExternalLink className="size-3.5 text-slate-400 group-hover:text-indigo-600 shrink-0" />
                                </a>
                            )}

                            {submission.demoUrl && (
                                <a
                                    href={submission.demoUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-xs font-semibold text-slate-800 dark:text-slate-200 group"
                                >
                                    <span className="flex items-center gap-2 truncate">
                                        <Globe className="size-4 text-emerald-600 dark:text-emerald-400" />
                                        Live Demo
                                    </span>
                                    <ExternalLink className="size-3.5 text-slate-400 group-hover:text-indigo-600 shrink-0" />
                                </a>
                            )}

                            {submission.presentationUrl && (
                                <a
                                    href={submission.presentationUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-xs font-semibold text-slate-800 dark:text-slate-200 group"
                                >
                                    <span className="flex items-center gap-2 truncate">
                                        <FileText className="size-4 text-indigo-600 dark:text-indigo-400" />
                                        Presentation Deck
                                    </span>
                                    <ExternalLink className="size-3.5 text-slate-400 group-hover:text-indigo-600 shrink-0" />
                                </a>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Official Event Results & Evaluation (Visible to students when published by organizer) */}
            {isSubmitted && (
                <Card className="border-purple-200 bg-white shadow-xs dark:border-purple-900/60 dark:bg-slate-900 overflow-hidden">
                    {publishedResult ? (
                        <div className="space-y-6 p-6 sm:p-8">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="rounded-full bg-purple-100 px-3 py-0.5 text-xs font-extrabold uppercase tracking-wider text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                                            Official Event Results Published
                                        </span>
                                        {publishedResult.rank && (
                                            <span className="rounded-full bg-amber-100 px-3 py-0.5 text-xs font-extrabold uppercase tracking-wider text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                                                Rank #{publishedResult.rank}
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="text-xl font-black text-slate-900 dark:text-slate-100">
                                        {publishedResult.awardTitle || "Finalist Entry"}
                                    </h3>
                                </div>

                                <div className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2.5 rounded-xl shadow-md shrink-0">
                                    <span className="text-xs font-bold uppercase tracking-wider">Final Score:</span>
                                    <span className="text-xl font-black">{publishedResult.totalScore} / 50</span>
                                </div>
                            </div>

                            {/* Score Breakdown Grid */}
                            <div className="grid gap-3 sm:grid-cols-5">
                                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 text-center">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Innovation</span>
                                    <p className="text-base font-extrabold text-indigo-600 dark:text-indigo-400 mt-0.5">{publishedResult.innovationScore ?? 0} / 10</p>
                                </div>
                                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 text-center">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Technical</span>
                                    <p className="text-base font-extrabold text-indigo-600 dark:text-indigo-400 mt-0.5">{publishedResult.technicalImplementationScore ?? 0} / 10</p>
                                </div>
                                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 text-center">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Relevance</span>
                                    <p className="text-base font-extrabold text-indigo-600 dark:text-indigo-400 mt-0.5">{publishedResult.problemRelevanceScore ?? 0} / 10</p>
                                </div>
                                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 text-center">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">UI / UX</span>
                                    <p className="text-base font-extrabold text-indigo-600 dark:text-indigo-400 mt-0.5">{publishedResult.uiUxScore ?? 0} / 10</p>
                                </div>
                                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 text-center">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Impact</span>
                                    <p className="text-base font-extrabold text-indigo-600 dark:text-indigo-400 mt-0.5">{publishedResult.impactScore ?? 0} / 10</p>
                                </div>
                            </div>

                            {/* Organizer Feedback */}
                            {publishedResult.reviewComment && (
                                <div className="space-y-1.5 pt-2">
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                                        Organizer Review & Feedback
                                    </span>
                                    <div className="p-4 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40 text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                                        {publishedResult.reviewComment}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="p-6 text-center text-xs text-slate-500 space-y-1">
                            <p className="font-bold text-slate-800 dark:text-slate-200">Results Pending Publication</p>
                            <p>Official event results and evaluations have not been published yet by the event organizer.</p>
                        </div>
                    )}
                </Card>
            )}

            {/* Confirmation Modal before Finalizing Submission */}
            <ConfirmModal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={handleConfirmSubmit}
                title="Submit Project for Evaluation?"
                description="Are you sure you want to submit this project? Once submitted, your project submission will be locked and cannot be edited further."
                confirmText="Yes, Submit Project"
                cancelText="Cancel & Keep Editing"
                isDanger={false}
                isLoading={submitting}
            />
        </div>
    );
}
