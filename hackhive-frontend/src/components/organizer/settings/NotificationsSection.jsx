import { useState } from "react";
import { Bell, Sparkles } from "lucide-react";
import { Badge } from "../../ui/Badge";

export default function NotificationsSection() {
    const [toggles, setToggles] = useState({
        registrations: true,
        teamRequests: true,
        eventUpdates: true,
        weeklySummary: false,
    });

    const handleToggle = (key) => {
        setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
    };

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

    return (
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-6">
            <div className="border-b border-slate-100 pb-4 dark:border-slate-800 flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <Bell className="size-5 text-purple-600 dark:text-purple-400" />
                        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Notification Preferences</h3>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Configure event trigger notifications and email alert frequencies.
                    </p>
                </div>
                <Badge variant="purple" className="gap-1 px-3 py-1 text-xs font-bold">
                    <Sparkles className="size-3" /> Preview UI
                </Badge>
            </div>

            {/* Feature Banner */}
            <div className="rounded-2xl bg-indigo-50/80 p-4 border border-indigo-100 dark:bg-indigo-950/40 dark:border-indigo-900/60 flex items-start gap-3">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
                    <Sparkles className="size-4.5" />
                </div>
                <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-indigo-900 dark:text-indigo-200">
                        Feature Announcement
                    </h4>
                    <p className="text-xs text-indigo-700/90 dark:text-indigo-300/90 font-medium">
                        This feature will be available soon. Real-time email webhooks and automated push notifications will be fully enabled in the next update.
                    </p>
                </div>
            </div>

            {/* Toggle List */}
            <div className="space-y-4 max-w-2xl divide-y divide-slate-100 dark:divide-slate-800">
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
                                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500/20 ${
                                    isChecked ? "bg-purple-600" : "bg-slate-200 dark:bg-slate-700"
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
        </div>
    );
}
