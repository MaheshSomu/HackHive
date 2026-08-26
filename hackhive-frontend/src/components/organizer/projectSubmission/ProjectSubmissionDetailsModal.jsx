import { useState, useEffect, useMemo, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
    X,
    FolderGit2,
    Globe,
    FileText,
    Clock,
    CheckCircle2,
    UserCheck,
    ExternalLink,
    AlertCircle,
    Star,
    Award,
    Save,
    Send,
    Shield,
    Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "../../ui/Button";
import ConfirmModal from "../../ui/ConfirmModal";
import { projectSubmissionEvaluationService } from "../../../services/projectSubmissionEvaluationService";

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

const CRITERIA = [
    { key: "innovationScore", label: "Innovation", desc: "Originality, creativity & uniqueness of the concept" },
    { key: "technicalImplementationScore", label: "Technical Implementation", desc: "Code quality, architecture & execution complexity" },
    { key: "problemRelevanceScore", label: "Problem Relevance", desc: "Direct addressing of real-world problem statement" },
    { key: "uiUxScore", label: "UI / UX", desc: "Interface design, user experience & usability" },
    { key: "impactScore", label: "Impact", desc: "Potential value, scalability & real-world utility" },
];

export default function ProjectSubmissionDetailsModal({
    isOpen = false,
    onClose,
    submission = null,
}) {
    const [evaluation, setEvaluation] = useState(null);
    const [loadingEval, setLoadingEval] = useState(false);
    const [savingDraft, setSavingDraft] = useState(false);
    const [finalizing, setFinalizing] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

    const [scores, setScores] = useState({
        innovationScore: 0,
        technicalImplementationScore: 0,
        problemRelevanceScore: 0,
        uiUxScore: 0,
        impactScore: 0,
    });
    const [reviewComment, setReviewComment] = useState("");

    // Load Evaluation for Submission
    const loadEvaluation = useCallback(async (submissionId) => {
        if (!submissionId) return;
        try {
            setLoadingEval(true);
            const res = await projectSubmissionEvaluationService.getEvaluationBySubmissionId(submissionId);
            if (res) {
                setEvaluation(res);
                setScores({
                    innovationScore: res.innovationScore ?? 0,
                    technicalImplementationScore: res.technicalImplementationScore ?? 0,
                    problemRelevanceScore: res.problemRelevanceScore ?? 0,
                    uiUxScore: res.uiUxScore ?? 0,
                    impactScore: res.impactScore ?? 0,
                });
                setReviewComment(res.reviewComment || "");
            }
        } catch {
            setEvaluation(null);
            setScores({
                innovationScore: 0,
                technicalImplementationScore: 0,
                problemRelevanceScore: 0,
                uiUxScore: 0,
                impactScore: 0,
            });
            setReviewComment("");
        } finally {
            setLoadingEval(false);
        }
    }, []);

    useEffect(() => {
        if (isOpen && submission?.id) {
            loadEvaluation(submission.id);
        }
    }, [isOpen, submission?.id, loadEvaluation]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape" && isOpen && !savingDraft && !finalizing) {
                onClose();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, savingDraft, finalizing, onClose]);

    // Calculate Preview Total Score
    const previewTotalScore = useMemo(() => {
        return (
            (Number(scores.innovationScore) || 0) +
            (Number(scores.technicalImplementationScore) || 0) +
            (Number(scores.problemRelevanceScore) || 0) +
            (Number(scores.uiUxScore) || 0) +
            (Number(scores.impactScore) || 0)
        );
    }, [scores]);

    const handleScoreChange = (key, value) => {
        const val = Math.min(10, Math.max(0, parseInt(value, 10) || 0));
        setScores((prev) => ({ ...prev, [key]: val }));
    };

    // Save Draft Evaluation
    const handleSaveDraft = async (e) => {
        e?.preventDefault();
        if (!submission?.id) return;

        try {
            setSavingDraft(true);
            const payload = {
                ...scores,
                reviewComment,
            };
            let res;
            if (evaluation?.id) {
                res = await projectSubmissionEvaluationService.updateEvaluationDraft(evaluation.id, payload);
            } else {
                res = await projectSubmissionEvaluationService.saveEvaluationDraft(submission.id, payload);
            }
            setEvaluation(res);
            toast.success("Project evaluation draft saved successfully!");
        } catch (err) {
            const msg = err.response?.data?.message || "Failed to save evaluation draft.";
            toast.error(msg);
        } finally {
            setSavingDraft(false);
        }
    };

    // Finalize Evaluation
    const handleConfirmFinalize = async () => {
        if (!submission?.id) return;

        try {
            setFinalizing(true);
            // Save draft first if evaluation doesn't exist yet
            let evalId = evaluation?.id;
            if (!evalId) {
                const saved = await projectSubmissionEvaluationService.saveEvaluationDraft(submission.id, {
                    ...scores,
                    reviewComment,
                });
                evalId = saved.id;
            } else {
                await projectSubmissionEvaluationService.updateEvaluationDraft(evalId, {
                    ...scores,
                    reviewComment,
                });
            }

            const finalizedRes = await projectSubmissionEvaluationService.finalizeEvaluation(evalId);
            setEvaluation(finalizedRes);
            setIsConfirmModalOpen(false);
            toast.success("Project evaluation finalized successfully!");
        } catch (err) {
            const msg = err.response?.data?.message || "Failed to finalize project evaluation.";
            toast.error(msg);
        } finally {
            setFinalizing(false);
        }
    };

    if (!isOpen || !submission) return null;

    const isSubmitted = submission.submissionStatus === "SUBMITTED";
    const isFinalized = evaluation?.status === "FINALIZED";

    return (
        <AnimatePresence>
            <div
                className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
                role="dialog"
                aria-modal="true"
            >
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
                />

                {/* Modal Container */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 15 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="relative flex flex-col w-full max-w-4xl max-h-[92vh] rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden dark:border-slate-800 dark:bg-slate-900"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 px-6 py-4 bg-slate-50/50 dark:bg-slate-800/50">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <span
                                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                                        isSubmitted
                                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                                            : "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400"
                                    }`}
                                >
                                    Submission: {submission.submissionStatus}
                                </span>
                                {evaluation && (
                                    <span
                                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                                            isFinalized
                                                ? "bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300"
                                                : "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                                        }`}
                                    >
                                        Evaluation: {evaluation.status} ({evaluation.totalScore}/50)
                                    </span>
                                )}
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 truncate">
                                {submission.projectTitle || "Untitled Project"}
                            </h3>
                        </div>

                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-500 transition-colors"
                        >
                            <X className="size-5" />
                        </button>
                    </div>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-8">
                        {/* Section A: Project Submission Details */}
                        <div className="space-y-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-slate-200/80 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-800/50 text-xs">
                                <div>
                                    <span className="text-slate-400 font-semibold uppercase">Submitted Team:</span>{" "}
                                    <strong className="text-slate-800 dark:text-slate-200">{submission.teamName || "N/A"}</strong>
                                    {" • "}
                                    <span className="text-slate-400 font-semibold uppercase">Leader:</span>{" "}
                                    <strong className="text-slate-800 dark:text-slate-200">{submission.submittedByName || "Leader"}</strong>
                                </div>
                                {submission.submittedAt && (
                                    <div className="flex items-center gap-1.5 text-slate-500">
                                        <Clock className="size-3.5 text-emerald-500" />
                                        <span>{formatDate(submission.submittedAt)}</span>
                                    </div>
                                )}
                            </div>

                            {/* Problem Statement */}
                            <div className="space-y-1.5">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                    Problem Statement
                                </h4>
                                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                                    {submission.problemStatement || "No problem statement provided."}
                                </div>
                            </div>

                            {/* Project Description */}
                            <div className="space-y-1.5">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                    Project Description
                                </h4>
                                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                                    {submission.projectDescription || "No description provided."}
                                </div>
                            </div>

                            {/* Tech Stack */}
                            {submission.technologiesUsed && (
                                <div className="space-y-2">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                        Technologies Used
                                    </h4>
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

                            {/* Links */}
                            <div className="grid gap-3 sm:grid-cols-3">
                                {submission.githubUrl && (
                                    <a
                                        href={submission.githubUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-xs font-semibold text-slate-800 dark:text-slate-200 group"
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
                                        className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-xs font-semibold text-slate-800 dark:text-slate-200 group"
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
                                        className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-xs font-semibold text-slate-800 dark:text-slate-200 group"
                                    >
                                        <span className="flex items-center gap-2 truncate">
                                            <FileText className="size-4 text-indigo-600 dark:text-indigo-400" />
                                            Presentation Deck
                                        </span>
                                        <ExternalLink className="size-3.5 text-slate-400 group-hover:text-indigo-600 shrink-0" />
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="border-t border-slate-200 dark:border-slate-800 pt-6" />

                        {/* Section B: Organizer Evaluation & Scoring */}
                        <div className="space-y-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <Award className="size-5 text-purple-600 dark:text-purple-400" />
                                        <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
                                            Organizer Evaluation & Scoring
                                        </h4>
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        Evaluate the project using five judging criteria (0–10 points each).
                                    </p>
                                </div>

                                {/* Total Score Live Badge */}
                                <div className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-xl shadow-md shrink-0">
                                    <Star className="size-4 fill-white/80" />
                                    <span className="text-xs font-bold uppercase tracking-wider">Total Score:</span>
                                    <span className="text-lg font-black">{isFinalized ? evaluation.totalScore : previewTotalScore} / 50</span>
                                </div>
                            </div>

                            {/* Finalized Locked Banner */}
                            {isFinalized && (
                                <div className="flex items-center gap-3 p-4 rounded-xl border border-purple-200 bg-purple-50 text-purple-900 dark:border-purple-900 dark:bg-purple-950/40 dark:text-purple-300 text-xs">
                                    <CheckCircle2 className="size-5 text-purple-600 shrink-0" />
                                    <div>
                                        <p className="font-bold">Evaluation Finalized & Locked</p>
                                        <p className="opacity-90">
                                            Evaluated by {evaluation.organizerName || "Organizer"}{" "}
                                            {evaluation.finalizedAt && `on ${formatDate(evaluation.finalizedAt)}`}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Criteria Inputs Grid */}
                            <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-5">
                                {CRITERIA.map((criterion) => {
                                    const currentVal = scores[criterion.key];
                                    return (
                                        <div
                                            key={criterion.key}
                                            className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-800/40 space-y-2"
                                        >
                                            <div className="flex items-center justify-between">
                                                <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                                    {criterion.label}
                                                </label>
                                                <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded-lg">
                                                    {currentVal} / 10
                                                </span>
                                            </div>

                                            <p className="text-[11px] text-slate-500 dark:text-slate-400 h-8 leading-tight">
                                                {criterion.desc}
                                            </p>

                                            {!isFinalized ? (
                                                <div className="space-y-1 pt-1">
                                                    <input
                                                        type="range"
                                                        min="0"
                                                        max="10"
                                                        step="1"
                                                        value={currentVal}
                                                        onChange={(e) => handleScoreChange(criterion.key, e.target.value)}
                                                        className="w-full accent-indigo-600 cursor-pointer"
                                                    />
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        max="10"
                                                        value={currentVal}
                                                        onChange={(e) => handleScoreChange(criterion.key, e.target.value)}
                                                        className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1 text-xs text-center font-bold text-slate-900 dark:text-slate-100"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="pt-2">
                                                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                                                        <div
                                                            className="bg-indigo-600 h-full rounded-full"
                                                            style={{ width: `${(currentVal / 10) * 100}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Review Comment */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                                    Organizer Review Feedback & Comments
                                </label>
                                {!isFinalized ? (
                                    <textarea
                                        rows={3}
                                        value={reviewComment}
                                        onChange={(e) => setReviewComment(e.target.value)}
                                        placeholder="Add constructive feedback, evaluation remarks, or key strengths..."
                                        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 p-3.5 text-xs text-slate-900 bg-white dark:bg-slate-800/80 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                ) : (
                                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                                        {reviewComment || "No evaluation comments provided."}
                                    </div>
                                )}
                            </div>

                            {/* Action Buttons (Organizer Only) */}
                            {!isFinalized && (
                                <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={handleSaveDraft}
                                        isLoading={savingDraft}
                                        disabled={savingDraft || finalizing}
                                    >
                                        <Save className="mr-1.5 size-4" /> Save Evaluation Draft
                                    </Button>

                                    <Button
                                        type="button"
                                        size="sm"
                                        onClick={() => setIsConfirmModalOpen(true)}
                                        disabled={savingDraft || finalizing}
                                    >
                                        <Send className="mr-1.5 size-4" /> Finalize Evaluation
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="border-t border-slate-100 dark:border-slate-800 px-6 py-3.5 bg-slate-50/50 dark:bg-slate-800/50 flex justify-end">
                        <Button type="button" variant="outline" size="sm" onClick={onClose}>
                            Close
                        </Button>
                    </div>
                </motion.div>
            </div>

            {/* Confirm Finalization Modal */}
            <ConfirmModal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={handleConfirmFinalize}
                title="Finalize Project Evaluation?"
                description="Are you sure you want to finalize this evaluation? Once finalized, scores and feedback will be locked and cannot be edited further."
                confirmText="Yes, Finalize Evaluation"
                cancelText="Cancel & Keep Editing"
                isDanger={false}
                isLoading={finalizing}
            />
        </AnimatePresence>
    );
}
