import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Bell, Save, Loader2, RotateCcw, AlertCircle } from "lucide-react";
import { Button } from "../../ui/Button";
import { organizerService } from "../../../services/organizerService";

export default function NotificationsSection() {
    const [toggles, setToggles] = useState({
        registrations: true,
        teamRequests: true,
        eventUpdates: true,
        weeklySummary: false,
    });

    const [originalToggles, setOriginalToggles] = useState({
        registrations: true,
        teamRequests: true,
        eventUpdates: true,
        weeklySummary: false,
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isError, setIsError] = useState(false);

    const notificationItems = [
        {
            key: "registrations",
            title: "Registration Notifications",
            description: "Receive instant email alerts whenever a student registers for your hackathon.",
        },
        {
            key: "teamRequests",
            title: "Team Join Requests",
            description: "Get notified when participants request team matching or organizer approval.",
        },
        {
            key: "eventUpdates",
            title: "Event Updates",
            description: "Alerts regarding timeline changes, submission deadlines, and judge scoring.",
        },
        {
            key: "weeklySummary",
            title: "Weekly Summary",
            description: "Receive a weekly analytical summary of participant engagement and registration growth.",
        },
    ];

    const fetchPreferences = useCallback(async () => {
        setLoading(true);
        setIsError(false);
        try {
            const data = await organizerService.getNotificationPreferences();
            if (data) {
                const loadedState = {
                    registrations: Boolean(data.registrations),
                    teamRequests: Boolean(data.teamRequests),
                    eventUpdates: Boolean(data.eventUpdates),
                    weeklySummary: Boolean(data.weeklySummary),
                };
                setToggles(loadedState);
                setOriginalToggles(loadedState);
            }
        } catch (err) {
            console.error("Failed to load notification preferences:", err);
            setIsError(true);
            toast.error("Failed to load notification preferences.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPreferences();
    }, [fetchPreferences]);

    const handleToggle = (key) => {
        if (saving) return;
        setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const isDirty = notificationItems.some(
        (item) => toggles[item.key] !== originalToggles[item.key]
    );

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isDirty || saving) return;

        setSaving(true);
        try {
            const updated = await organizerService.updateNotificationPreferences(toggles);
            if (updated) {
                const newState = {
                    registrations: Boolean(updated.registrations),
                    teamRequests: Boolean(updated.teamRequests),
                    eventUpdates: Boolean(updated.eventUpdates),
                    weeklySummary: Boolean(updated.weeklySummary),
                };
                setToggles(newState);
                setOriginalToggles(newState);
            }
            toast.success("Notification preferences updated successfully.");
        } catch (err) {
            console.error("Failed to update notification preferences:", err);
            const msg = err.response?.data?.message || "Failed to update notification preferences.";
            toast.error(msg);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-6">
            <div className="border-b border-slate-100 pb-4 dark:border-slate-800">
                <div className="flex items-center gap-2">
                    <Bell className="size-5 text-blue-600 dark:text-blue-400" />
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Notification Preferences</h3>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Configure which email notifications you receive from HackHive.
                </p>
            </div>

            {isError ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50/80 p-5 text-center text-rose-900 dark:border-rose-950 dark:bg-rose-950/40 dark:text-rose-300 space-y-3">
                    <div className="mx-auto flex size-10 items-center justify-center rounded-xl bg-rose-100 text-rose-600 dark:bg-rose-900 dark:text-rose-300">
                        <AlertCircle className="size-5" />
                    </div>
                    <p className="text-xs font-semibold">Failed to load notification preferences.</p>
                    <Button
                        type="button"
                        size="sm"
                        onClick={fetchPreferences}
                        className="bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs inline-flex items-center gap-1.5 px-4 py-2 rounded-xl"
                    >
                        <RotateCcw className="size-3.5" /> Retry
                    </Button>
                </div>
            ) : loading ? (
                <div className="space-y-4 max-w-2xl divide-y divide-slate-100 dark:divide-slate-800 animate-pulse">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="pt-4 first:pt-0 flex items-center justify-between gap-4">
                            <div className="space-y-1.5 flex-1">
                                <div className="h-3.5 w-36 bg-slate-200 dark:bg-slate-800 rounded-md" />
                                <div className="h-3 w-3/4 bg-slate-100 dark:bg-slate-800/60 rounded-md" />
                            </div>
                            <div className="h-6 w-11 bg-slate-200 dark:bg-slate-700 rounded-full shrink-0" />
                        </div>
                    ))}
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
                    <div className="space-y-4 divide-y divide-slate-100 dark:divide-slate-800">
                        {notificationItems.map((item) => {
                            const isChecked = toggles[item.key];
                            return (
                                <div key={item.key} className="pt-4 first:pt-0 flex items-center justify-between gap-4">
                                    <div className="space-y-0.5 min-w-0">
                                        <label
                                            htmlFor={`toggle-${item.key}`}
                                            className="text-xs font-bold text-slate-900 dark:text-slate-100 cursor-pointer select-none"
                                        >
                                            {item.title}
                                        </label>
                                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
                                            {item.description}
                                        </p>
                                    </div>

                                    {/* Toggle Switch */}
                                    <button
                                        type="button"
                                        id={`toggle-${item.key}`}
                                        onClick={() => handleToggle(item.key)}
                                        disabled={saving}
                                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 ${
                                            isChecked ? "bg-blue-600" : "bg-slate-200 dark:bg-slate-700"
                                        }`}
                                    >
                                        <span
                                            className={`pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                                                isChecked ? "translate-x-5" : "translate-x-0"
                                            }`}
                                        />
                                    </button>
                                </div>
                            );
                        })}
                    </div>

                    <div className="pt-2 flex items-center gap-3">
                        <Button
                            type="submit"
                            disabled={saving || !isDirty}
                            size="sm"
                            className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs gap-1.5 px-6 py-2.5 rounded-xl shadow-xs disabled:opacity-50 disabled:cursor-not-allowed dark:bg-blue-600 dark:hover:bg-blue-500"
                        >
                            {saving ? (
                                <>
                                    <Loader2 className="size-3.5 animate-spin" />
                                    Saving Changes...
                                </>
                            ) : (
                                <>
                                    <Save className="size-3.5" />
                                    Save Changes
                                </>
                            )}
                        </Button>
                        {!isDirty && (
                            <span className="text-xs text-slate-400 font-medium">
                                No changes made yet
                            </span>
                        )}
                    </div>
                </form>
            )}
        </div>
    );
}
