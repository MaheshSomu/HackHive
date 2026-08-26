import { useState, useEffect, useMemo, useCallback } from "react";
import {
    Trophy,
    Award,
    Star,
    CheckCircle2,
    Clock,
    AlertCircle,
    RotateCcw,
    Send,
    Save,
    Shield,
    Sparkles,
    Medal,
} from "lucide-react";
import { toast } from "sonner";
import { Card } from "../../ui/Card";
import { Button } from "../../ui/Button";
import ConfirmModal from "../../ui/ConfirmModal";
import { SkeletonBlock } from "../../student-dashboard/DashboardStates";
import { projectResultService } from "../../../services/projectResultService";

const AWARD_PRESETS = [
    "1st Place Winner",
    "2nd Place Runner Up",
    "3rd Place",
    "Best UI/UX",
    "Best Innovation",
    "Special Mention",
];

export default function OrganizerProjectResults({ selectedEventId = "" }) {
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    // Editing states for rank & award per item
    const [editingConfigs, setEditingConfigs] = useState({});
    const [savingItem, setSavingItem] = useState({});
    const [publishingItem, setPublishingItem] = useState({});
    const [publishingAll, setPublishingAll] = useState(false);

    // Modal state for publish warning
    const [isPublishAllModalOpen, setIsPublishAllModalOpen] = useState(false);

    const loadLeaderboard = useCallback(async (eventId) => {
        if (!eventId) return;
        try {
            setLoading(true);
            setIsError(false);
            const res = await projectResultService.getEventLeaderboardForOrganizer(eventId);
            const list = Array.isArray(res) ? res : [];
            setLeaderboard(list);

            // Populate editing state
            const configs = {};
            list.forEach((item) => {
                const key = item.id || item.projectSubmissionId;
                configs[key] = {
                    rank: item.rank ?? "",
                    awardTitle: item.awardTitle ?? "",
                };
            });
            setEditingConfigs(configs);
        } catch (err) {
            console.error("Failed to load organizer leaderboard:", err);
            setIsError(true);
            setLeaderboard([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (selectedEventId) {
            loadLeaderboard(selectedEventId);
        }
    }, [selectedEventId, loadLeaderboard]);

    const metrics = useMemo(() => {
        const total = leaderboard.length;
        const finalizedEvalCount = leaderboard.filter((item) => item.evaluationStatus === "FINALIZED").length;
        const publishedCount = leaderboard.filter((item) => item.status === "PUBLISHED").length;
        return { total, finalizedEvalCount, publishedCount };
    }, [leaderboard]);

    const handleConfigChange = (key, field, val) => {
        setEditingConfigs((prev) => ({
            ...prev,
            [key]: {
                ...prev[key],
                [field]: val,
            },
        }));
    };

    const handlePresetAward = (key, presetText) => {
        handleConfigChange(key, "awardTitle", presetText);
    };

    // Save individual result configuration
    const handleSaveConfig = async (item) => {
        const key = item.id || item.projectSubmissionId;
        const config = editingConfigs[key] || {};
        const submissionId = item.projectSubmissionId;

        if (item.evaluationStatus !== "FINALIZED") {
            toast.error("Project submission evaluation must be FINALIZED before configuring results.");
            return;
        }

        try {
            setSavingItem((prev) => ({ ...prev, [key]: true }));
            const parsedRank = config.rank ? parseInt(config.rank, 10) : null;
            const payload = {
                projectSubmissionId: submissionId,
                rank: parsedRank,
                awardTitle: config.awardTitle,
            };

            let res;
            if (item.id) {
                res = await projectResultService.updateResult(item.id, {
                    rank: parsedRank,
                    awardTitle: config.awardTitle,
                });
            } else {
                res = await projectResultService.configureResult(selectedEventId, payload);
            }

            toast.success("Result configuration saved successfully!");
            loadLeaderboard(selectedEventId);
        } catch (err) {
            const msg = err.response?.data?.message || "Failed to save result configuration.";
            toast.error(msg);
        } finally {
            setSavingItem((prev) => ({ ...prev, [key]: false }));
        }
    };

    // Publish individual result
    const handlePublishSingle = async (item) => {
        if (!item.id) {
            toast.error("Please save the result configuration first before publishing.");
            return;
        }
        if (item.evaluationStatus !== "FINALIZED") {
            toast.error("Evaluation must be FINALIZED before publishing results.");
            return;
        }

        try {
            const key = item.id;
            setPublishingItem((prev) => ({ ...prev, [key]: true }));
            await projectResultService.publishResult(item.id);
            toast.success("Project result published successfully!");
            loadLeaderboard(selectedEventId);
        } catch (err) {
            const msg = err.response?.data?.message || "Failed to publish project result.";
            toast.error(msg);
        } finally {
            const key = item.id;
            setPublishingItem((prev) => ({ ...prev, [key]: false }));
        }
    };

    // Publish all event results
    const handlePublishAllConfirmed = async () => {
        try {
            setPublishingAll(true);
            await projectResultService.publishAllResultsForEvent(selectedEventId);
            toast.success("All event results published successfully!");
            setIsPublishAllModalOpen(false);
            loadLeaderboard(selectedEventId);
        } catch (err) {
            const msg = err.response?.data?.message || "Failed to publish event results.";
            toast.error(msg);
        } finally {
            setPublishingAll(false);
        }
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
            {/* Header Metrics */}
            <div className="grid gap-4 sm:grid-cols-3">
                <Card className="border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Entries</span>
                    <p className="mt-1 text-2xl font-extrabold text-slate-900 dark:text-slate-100">{metrics.total}</p>
                    <p className="text-[11px] text-slate-500">Submitted projects</p>
                </Card>

                <Card className="border-purple-200/60 bg-purple-50/40 p-5 shadow-xs dark:border-purple-950/60 dark:bg-purple-950/20">
                    <span className="text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400">Finalized Evaluations</span>
                    <p className="mt-1 text-2xl font-extrabold text-purple-900 dark:text-purple-100">{metrics.finalizedEvalCount}</p>
                    <p className="text-[11px] text-purple-600/80 dark:text-purple-400/80">Ready for results</p>
                </Card>

                <Card className="border-emerald-200/60 bg-emerald-50/40 p-5 shadow-xs dark:border-emerald-950/60 dark:bg-emerald-950/20">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Published Results</span>
                    <p className="mt-1 text-2xl font-extrabold text-emerald-900 dark:text-emerald-100">{metrics.publishedCount}</p>
                    <p className="text-[11px] text-emerald-600/80 dark:text-emerald-400/80">Visible to students</p>
                </Card>
            </div>

            {/* Toolbar Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <Trophy className="size-5 text-amber-500" />
                        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                            Event Leaderboard & Winner Management
                        </h3>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        Assign rankings, custom awards, and publish official event results to participating student teams.
                    </p>
                </div>

                {metrics.finalizedEvalCount > 0 && (
                    <Button
                        type="button"
                        size="sm"
                        onClick={() => setIsPublishAllModalOpen(true)}
                        className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold shrink-0"
                    >
                        <Send className="mr-1.5 size-4" /> Publish All Results
                    </Button>
                )}
            </div>

            {/* Leaderboard Table / Cards */}
            {isError ? (
                <Card className="border-rose-200 bg-rose-50/50 p-6 text-center text-xs text-rose-700 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-400">
                    <AlertCircle className="mx-auto size-6 text-rose-500 mb-2" />
                    <p>Failed to load event leaderboard and result data.</p>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mt-3"
                        onClick={() => loadLeaderboard(selectedEventId)}
                    >
                        <RotateCcw className="mr-1.5 size-3.5" /> Retry
                    </Button>
                </Card>
            ) : leaderboard.length === 0 ? (
                <Card className="border-slate-200/80 bg-white p-12 text-center shadow-xs dark:border-slate-800 dark:bg-slate-900">
                    <Trophy className="mx-auto size-10 text-slate-400 mb-3" />
                    <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">No Submitted Projects Available</h4>
                    <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
                        Once registered teams submit their projects and evaluations are completed, they will appear on this leaderboard.
                    </p>
                </Card>
            ) : (
                <div className="space-y-4">
                    {leaderboard.map((item, idx) => {
                        const itemKey = item.id || item.projectSubmissionId;
                        const config = editingConfigs[itemKey] || { rank: "", awardTitle: "" };
                        const isFinalized = item.evaluationStatus === "FINALIZED";
                        const isPublished = item.status === "PUBLISHED";
                        const isSaving = savingItem[itemKey];
                        const isPublishing = publishingItem[itemKey];

                        return (
                            <Card
                                key={itemKey}
                                className={`border p-5 shadow-xs transition ${
                                    isPublished
                                        ? "border-emerald-200 bg-emerald-50/20 dark:border-emerald-950/60 dark:bg-emerald-950/10"
                                        : isFinalized
                                        ? "border-purple-200 bg-purple-50/20 dark:border-purple-950/60 dark:bg-purple-950/10"
                                        : "border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 opacity-80"
                                }`}
                            >
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                    {/* Left: Position Rank & Team Info */}
                                    <div className="flex items-start gap-4 flex-1 min-w-0">
                                        <div className="flex size-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:bg-amber-400/10 dark:text-amber-400 shrink-0 font-extrabold text-base border border-amber-200 dark:border-amber-900/50">
                                            {item.rank ? `#${item.rank}` : `#${idx + 1}`}
                                        </div>

                                        <div className="space-y-1.5 flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span
                                                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                                                        isPublished
                                                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                                                            : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                                                    }`}
                                                >
                                                    Result: {item.status || "DRAFT"}
                                                </span>
                                                <span
                                                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                                                        isFinalized
                                                            ? "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300"
                                                            : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                                                    }`}
                                                >
                                                    Eval: {item.evaluationStatus || "NOT_EVALUATED"}
                                                </span>
                                            </div>

                                            <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 truncate">
                                                {item.projectTitle || "Untitled Project"}
                                            </h4>

                                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                                Team: <strong className="text-slate-800 dark:text-slate-200">{item.teamName || "N/A"}</strong>
                                                {item.submittedByName && ` • Leader: ${item.submittedByName}`}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Middle: Score Badge */}
                                    <div className="flex items-center gap-3 shrink-0">
                                        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-center min-w-[110px]">
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Evaluation</span>
                                            <p className="text-lg font-black text-indigo-600 dark:text-indigo-400">
                                                {item.totalScore ?? 0} <span className="text-xs font-semibold text-slate-400">/ 50</span>
                                            </p>
                                        </div>
                                    </div>

                                    {/* Right: Config Inputs (Rank & Award) & Actions */}
                                    <div className="space-y-3 lg:w-72 shrink-0">
                                        <div className="flex items-center gap-2">
                                            <label className="text-[11px] font-bold text-slate-500 w-12 shrink-0">Rank:</label>
                                            <input
                                                type="number"
                                                min="1"
                                                value={config.rank}
                                                onChange={(e) => handleConfigChange(itemKey, "rank", e.target.value)}
                                                placeholder="e.g. 1"
                                                disabled={!isFinalized}
                                                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-bold text-slate-900 dark:text-slate-100"
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <label className="text-[11px] font-bold text-slate-500 w-12 shrink-0">Award:</label>
                                                <input
                                                    type="text"
                                                    value={config.awardTitle}
                                                    onChange={(e) => handleConfigChange(itemKey, "awardTitle", e.target.value)}
                                                    placeholder="e.g. 1st Place Winner"
                                                    disabled={!isFinalized}
                                                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs text-slate-900 dark:text-slate-100"
                                                />
                                            </div>

                                            {/* Quick Presets */}
                                            {isFinalized && (
                                                <div className="flex flex-wrap gap-1 pt-1">
                                                    {AWARD_PRESETS.slice(0, 3).map((preset) => (
                                                        <button
                                                            key={preset}
                                                            type="button"
                                                            onClick={() => handlePresetAward(itemKey, preset)}
                                                            className="text-[9px] font-bold rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 text-slate-600 dark:text-slate-400 hover:text-indigo-600 px-1.5 py-0.5 transition"
                                                        >
                                                            + {preset}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Action buttons */}
                                        <div className="flex items-center gap-2 pt-1">
                                            <Button
                                                type="button"
                                                size="xs"
                                                variant="outline"
                                                onClick={() => handleSaveConfig(item)}
                                                isLoading={isSaving}
                                                disabled={!isFinalized || isSaving || isPublishing}
                                                className="flex-1 text-xs"
                                            >
                                                <Save className="mr-1 size-3" /> Save
                                            </Button>

                                            <Button
                                                type="button"
                                                size="xs"
                                                onClick={() => handlePublishSingle(item)}
                                                isLoading={isPublishing}
                                                disabled={!isFinalized || !item.id || isSaving || isPublishing || isPublished}
                                                className={`flex-1 text-xs ${
                                                    isPublished
                                                        ? "bg-emerald-600 text-white cursor-default"
                                                        : "bg-indigo-600 hover:bg-indigo-700 text-white"
                                                }`}
                                            >
                                                {isPublished ? (
                                                    <>
                                                        <CheckCircle2 className="mr-1 size-3" /> Published
                                                    </>
                                                ) : (
                                                    <>
                                                        <Send className="mr-1 size-3" /> Publish
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}

            {/* Confirm Publish All Modal */}
            <ConfirmModal
                isOpen={isPublishAllModalOpen}
                onClose={() => setIsPublishAllModalOpen(false)}
                onConfirm={handlePublishAllConfirmed}
                title="Publish All Event Results & Leaderboard?"
                description="Publishing results will make final rankings and awards visible to participating teams. Are you sure you want to make all results public?"
                confirmText="Yes, Publish All Results"
                cancelText="Cancel"
                isDanger={false}
                isLoading={publishingAll}
            />
        </div>
    );
}
