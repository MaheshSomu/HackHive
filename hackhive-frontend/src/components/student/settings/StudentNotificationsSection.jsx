import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Bell, Calendar, Clock, Trophy, Users, UserPlus, Megaphone, Sparkles, AlertCircle, RotateCcw, Loader2 } from "lucide-react";
import { Button } from "../../ui/Button";
import studentNotificationPreferenceService from "../../../services/studentNotificationPreferenceService";
import { getApiErrorMessage } from "../../../utils/apiError";

export default function StudentNotificationsSection() {
    const [notifications, setNotifications] = useState({
        eventRegistrationUpdates: true,
        eventReminders: true,
        submissionDeadlineReminders: true,
        teamInvitations: true,
        teamActivity: true,
        hackathonAnnouncements: false,
        weeklyRecommendations: true,
    });

    const [loading, setLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [updatingKey, setUpdatingKey] = useState(null);

    const fetchPreferences = useCallback(async () => {
        setLoading(true);
        setIsError(false);
        try {
            const data = await studentNotificationPreferenceService.getPreferences();
            if (data) {
                setNotifications({
                    eventRegistrationUpdates: Boolean(data.eventRegistrationUpdates),
                    eventReminders: Boolean(data.eventReminders),
                    submissionDeadlineReminders: Boolean(data.submissionDeadlineReminders),
                    teamInvitations: Boolean(data.teamInvitations),
                    teamActivity: Boolean(data.teamActivity),
                    hackathonAnnouncements: Boolean(data.hackathonAnnouncements),
                    weeklyRecommendations: Boolean(data.weeklyRecommendations),
                });
            }
        } catch (err) {
            console.error("Failed to load student notification preferences:", err);
            setIsError(true);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPreferences();
    }, [fetchPreferences]);

    const toggleSetting = async (key, label) => {
        if (updatingKey) return; // Prevent race conditions from rapid clicking

        const previousState = { ...notifications };
        const nextValue = !notifications[key];
        const updatedPayload = {
            ...notifications,
            [key]: nextValue,
        };

        // Optimistically update state
        setNotifications(updatedPayload);
        setUpdatingKey(key);

        try {
            const res = await studentNotificationPreferenceService.updatePreferences(updatedPayload);
            if (res) {
                setNotifications({
                    eventRegistrationUpdates: Boolean(res.eventRegistrationUpdates),
                    eventReminders: Boolean(res.eventReminders),
                    submissionDeadlineReminders: Boolean(res.submissionDeadlineReminders),
                    teamInvitations: Boolean(res.teamInvitations),
                    teamActivity: Boolean(res.teamActivity),
                    hackathonAnnouncements: Boolean(res.hackathonAnnouncements),
                    weeklyRecommendations: Boolean(res.weeklyRecommendations),
                });
            }
            toast.success(`${label} preference ${nextValue ? "enabled" : "disabled"}`);
        } catch (err) {
            console.error("Failed to update notification preference:", err);
            // Revert state on error
            setNotifications(previousState);
            toast.error(getApiErrorMessage(err, "Failed to update notification preference. Please try again."));
        } finally {
            setUpdatingKey(null);
        }
    };

    const notificationItems = [
        {
            key: "eventRegistrationUpdates",
            label: "Event Registration Updates",
            description: "Receive immediate email updates regarding hackathons you've registered for, schedule changes, and venue links.",
            icon: Calendar,
        },
        {
            key: "eventReminders",
            label: "Hackathon Reminders",
            description: "Automated reminders sent 24 hours and 1 hour prior to hackathon start times.",
            icon: Clock,
        },
        {
            key: "submissionDeadlineReminders",
            label: "Submission Deadline Reminders",
            description: "Urgent countdown alerts when project submission deadlines are approaching.",
            icon: Trophy,
        },
        {
            key: "teamInvitations",
            label: "Team Invitations",
            description: "Instant alerts when team captains invite you to join their project squad.",
            icon: UserPlus,
        },
        {
            key: "teamActivity",
            label: "Team Activity & Requests",
            description: "Notifications when teammates request to join your team or update project task statuses.",
            icon: Users,
        },
        {
            key: "hackathonAnnouncements",
            label: "Hackathon Announcements",
            description: "Major announcements, sponsor tracks, workshop invites, and prize updates from event hosts.",
            icon: Megaphone,
        },
        {
            key: "weeklyRecommendations",
            label: "Weekly Hackathon Recommendations",
            description: "Curated weekly digest of top upcoming hackathons tailored to your tech stack and interests.",
            icon: Sparkles,
        },
    ];

    return (
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-6">
            <div className="border-b border-slate-100 pb-4 dark:border-slate-800">
                <div className="flex items-center gap-2">
                    <Bell className="size-5 text-indigo-600 dark:text-indigo-400" />
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Notification Preferences</h3>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Manage your student-specific email notifications, deadline alerts, and team communications.
                </p>
            </div>

            {isError ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50/80 p-6 text-center text-rose-900 dark:border-rose-950 dark:bg-rose-950/40 dark:text-rose-300 space-y-3 shadow-xs">
                    <div className="mx-auto flex size-10 items-center justify-center rounded-xl bg-rose-100 text-rose-600 dark:bg-rose-900 dark:text-rose-300">
                        <AlertCircle className="size-5" />
                    </div>
                    <div className="space-y-1 max-w-sm mx-auto">
                        <h4 className="text-xs font-bold">Failed to load notification preferences</h4>
                        <p className="text-[11px] text-rose-600/80 dark:text-rose-400 leading-relaxed font-medium">
                            Unable to fetch your notification settings from the server.
                        </p>
                    </div>
                    <Button
                        type="button"
                        size="sm"
                        onClick={fetchPreferences}
                        className="bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs inline-flex items-center gap-2 px-4 py-2 rounded-xl"
                    >
                        <RotateCcw className="size-3.5" /> Retry
                    </Button>
                </div>
            ) : loading ? (
                <div className="p-8 text-center space-y-3">
                    <Loader2 className="size-6 animate-spin text-indigo-600 dark:text-indigo-400 mx-auto" />
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Loading preferences...</p>
                </div>
            ) : (
                <div className="space-y-3 max-w-2xl">
                    {notificationItems.map((item) => {
                        const Icon = item.icon;
                        const isChecked = notifications[item.key];
                        const isUpdating = updatingKey === item.key;

                        return (
                            <div
                                key={item.key}
                                className="flex items-start justify-between gap-4 p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800/40 dark:hover:bg-slate-800/60 transition-colors"
                            >
                                <div className="flex items-start gap-3 min-w-0">
                                    <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-white border border-slate-200/80 shadow-2xs text-indigo-600 dark:bg-slate-800 dark:border-slate-700 dark:text-indigo-400">
                                        <Icon className="size-4" />
                                    </div>
                                    <div className="space-y-0.5 min-w-0">
                                        <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                                            {item.label}
                                        </h4>
                                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>

                                {/* Custom Toggle Switch with loading state */}
                                <button
                                    type="button"
                                    role="switch"
                                    aria-checked={isChecked}
                                    aria-label={item.label}
                                    disabled={Boolean(updatingKey)}
                                    onClick={() => toggleSetting(item.key, item.label)}
                                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed ${
                                        isChecked ? "bg-indigo-600" : "bg-slate-200 dark:bg-slate-700"
                                    }`}
                                >
                                    <span
                                        className={`pointer-events-none flex items-center justify-center size-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                                            isChecked ? "translate-x-5" : "translate-x-0"
                                        }`}
                                    >
                                        {isUpdating && <Loader2 className="size-3 animate-spin text-indigo-600" />}
                                    </span>
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
