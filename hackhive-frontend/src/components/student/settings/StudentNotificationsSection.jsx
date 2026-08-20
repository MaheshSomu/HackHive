import { useState } from "react";
import { toast } from "sonner";
import { Bell, Calendar, Clock, Trophy, Users, UserPlus, Megaphone, Sparkles } from "lucide-react";

export default function StudentNotificationsSection() {
    const [notifications, setNotifications] = useState({
        eventRegistrations: true,
        hackathonReminders: true,
        submissionDeadlines: true,
        teamInvitations: true,
        teamActivity: true,
        hackathonAnnouncements: false,
        weeklyRecommendations: true,
    });

    const toggleSetting = (key, label) => {
        setNotifications((prev) => {
            const updated = !prev[key];
            toast.success(`${label} preference ${updated ? "enabled" : "disabled"}`);
            return { ...prev, [key]: updated };
        });
    };

    const notificationItems = [
        {
            key: "eventRegistrations",
            label: "Event Registration Updates",
            description: "Receive immediate email updates regarding hackathons you've registered for, schedule changes, and venue links.",
            icon: Calendar,
        },
        {
            key: "hackathonReminders",
            label: "Hackathon Reminders",
            description: "Automated reminders sent 24 hours and 1 hour prior to hackathon start times.",
            icon: Clock,
        },
        {
            key: "submissionDeadlines",
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

            <div className="space-y-3 max-w-2xl">
                {notificationItems.map((item) => {
                    const Icon = item.icon;
                    const isChecked = notifications[item.key];

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

                            {/* Polished Custom Toggle Switch */}
                            <button
                                type="button"
                                role="switch"
                                aria-checked={isChecked}
                                aria-label={item.label}
                                onClick={() => toggleSetting(item.key, item.label)}
                                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                                    isChecked ? "bg-indigo-600" : "bg-slate-200 dark:bg-slate-700"
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
