import { useState } from "react";
import { toast } from "sonner";
import {
    Bell,
    Check,
    Eye,
    Globe,
    Info,
    KeyRound,
    Lock,
    Moon,
    Shield,
    Sliders,
    Sun,
    User,
    UserCheck,
} from "lucide-react";

import useAuth from "../../hooks/useAuth";
import { Button } from "../../components/ui/Button";
import { Card, CardContent } from "../../components/ui/Card";

export default function StudentSettings() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState("account");

    // Form States
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [loading, setLoading] = useState(false);

    // Preferences & Privacy Toggle States (Local persistent state)
    const [notificationsConfig, setNotificationsConfig] = useState({
        emailEvents: true,
        emailTeams: true,
        emailAnnouncements: false,
        inAppActivity: true,
    });

    const [preferencesConfig, setPreferencesConfig] = useState({
        theme: "system", // 'light' | 'dark' | 'system'
        compactView: false,
        language: "English (US)",
    });

    const [privacyConfig, setPrivacyConfig] = useState({
        publicProfile: true,
        allowTeamInvites: true,
        showSkillsToRecruiters: true,
    });

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        if (!passwordData.currentPassword || !passwordData.newPassword) {
            toast.error("Please fill in all password fields.");
            return;
        }
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error("New passwords do not match.");
            return;
        }
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
            toast.success("Security credentials updated successfully.");
        }, 600);
    };

    return (
        <div className="space-y-8 pb-16">
            {/* Header Hero */}
            <Card className="border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                <div className="space-y-1">
                    <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                        Preferences & Control
                    </span>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
                        Account Settings
                    </h1>
                    <p className="max-w-2xl text-xs text-slate-500 dark:text-slate-400 leading-5">
                        Manage your student account, security credentials, notification triggers, and privacy controls.
                    </p>
                </div>

                {/* Tab Controls */}
                <div className="flex flex-wrap items-center gap-2 pt-6 mt-6 border-t border-slate-100 dark:border-slate-800">
                    <button
                        type="button"
                        onClick={() => setActiveTab("account")}
                        className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition ${
                            activeTab === "account"
                                ? "bg-slate-900 text-white shadow-2xs dark:bg-indigo-600"
                                : "bg-slate-100 text-slate-600 hover:text-slate-900 dark:bg-slate-800 dark:text-slate-400"
                        }`}
                    >
                        <User className="size-3.5" /> Account
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab("security")}
                        className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition ${
                            activeTab === "security"
                                ? "bg-slate-900 text-white shadow-2xs dark:bg-indigo-600"
                                : "bg-slate-100 text-slate-600 hover:text-slate-900 dark:bg-slate-800 dark:text-slate-400"
                        }`}
                    >
                        <Lock className="size-3.5" /> Security
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab("notifications")}
                        className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition ${
                            activeTab === "notifications"
                                ? "bg-slate-900 text-white shadow-2xs dark:bg-indigo-600"
                                : "bg-slate-100 text-slate-600 hover:text-slate-900 dark:bg-slate-800 dark:text-slate-400"
                        }`}
                    >
                        <Bell className="size-3.5" /> Notifications
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab("preferences")}
                        className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition ${
                            activeTab === "preferences"
                                ? "bg-slate-900 text-white shadow-2xs dark:bg-indigo-600"
                                : "bg-slate-100 text-slate-600 hover:text-slate-900 dark:bg-slate-800 dark:text-slate-400"
                        }`}
                    >
                        <Sliders className="size-3.5" /> Preferences
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab("privacy")}
                        className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition ${
                            activeTab === "privacy"
                                ? "bg-slate-900 text-white shadow-2xs dark:bg-indigo-600"
                                : "bg-slate-100 text-slate-600 hover:text-slate-900 dark:bg-slate-800 dark:text-slate-400"
                        }`}
                    >
                        <Shield className="size-3.5" /> Privacy
                    </button>
                </div>
            </Card>

            {/* TAB 1: ACCOUNT */}
            {activeTab === "account" && (
                <Card className="border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-6">
                    <div className="border-b border-slate-100 pb-4 dark:border-slate-800">
                        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Account Details</h3>
                        <p className="text-xs text-slate-500">Your core authentication profile details.</p>
                    </div>

                    <div className="grid gap-4 max-w-xl">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                Full Name
                            </label>
                            <input
                                type="text"
                                disabled
                                value={user?.fullName || "Student User"}
                                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 font-semibold cursor-not-allowed dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-100"
                            />
                            <p className="mt-1 text-[11px] text-slate-400">Name is synced with your student profile.</p>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                Email Address
                            </label>
                            <input
                                type="email"
                                disabled
                                value={user?.email || "student@hackhive.com"}
                                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 font-semibold cursor-not-allowed dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-100"
                            />
                            <p className="mt-1 text-[11px] text-slate-400">Email is tied to your JWT login credentials.</p>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                Platform Role
                            </label>
                            <div className="mt-1 flex items-center gap-2">
                                <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                                    {user?.role || "STUDENT"}
                                </span>
                            </div>
                        </div>
                    </div>
                </Card>
            )}

            {/* TAB 2: SECURITY */}
            {activeTab === "security" && (
                <div className="space-y-6">
                    <Card className="border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-6">
                        <div className="border-b border-slate-100 pb-4 dark:border-slate-800">
                            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Update Password</h3>
                            <p className="text-xs text-slate-500">Change your account login credentials.</p>
                        </div>

                        <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-xl">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                    Current Password
                                </label>
                                <input
                                    type="password"
                                    value={passwordData.currentPassword}
                                    onChange={(e) => setPasswordData((p) => ({ ...p, currentPassword: e.target.value }))}
                                    placeholder="••••••••"
                                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-800 dark:text-slate-100"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData((p) => ({ ...p, newPassword: e.target.value }))}
                                    placeholder="Minimum 8 characters"
                                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-800 dark:text-slate-100"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                    Confirm New Password
                                </label>
                                <input
                                    type="password"
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData((p) => ({ ...p, confirmPassword: e.target.value }))}
                                    placeholder="Repeat new password"
                                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-800 dark:text-slate-100"
                                />
                            </div>

                            <Button type="submit" disabled={loading} size="sm" className="bg-indigo-600 text-white font-bold px-6">
                                {loading ? "Updating..." : "Update Password"}
                            </Button>
                        </form>
                    </Card>

                    {/* Disabled 2FA Informational Box */}
                    <Card className="border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 flex items-start gap-3">
                        <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
                            <Info className="size-4" />
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">Two-Factor Authentication (2FA)</h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-5">
                                Hardware 2FA token authentication will become available when supported in a future backend release.
                            </p>
                        </div>
                    </Card>
                </div>
            )}

            {/* TAB 3: NOTIFICATIONS */}
            {activeTab === "notifications" && (
                <Card className="border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-6">
                    <div className="border-b border-slate-100 pb-4 dark:border-slate-800">
                        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Notification Preferences</h3>
                        <p className="text-xs text-slate-500">Configure email and in-app alerts.</p>
                    </div>

                    <div className="space-y-4 max-w-xl">
                        <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/50">
                            <div>
                                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">Event Registrations & Deadlines</h4>
                                <p className="text-[11px] text-slate-500">Receive reminders for registered hackathons.</p>
                            </div>
                            <input
                                type="checkbox"
                                checked={notificationsConfig.emailEvents}
                                onChange={(e) => {
                                    setNotificationsConfig((n) => ({ ...n, emailEvents: e.target.checked }));
                                    toast.success("Notification setting saved");
                                }}
                                className="size-4 accent-indigo-600"
                            />
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/50">
                            <div>
                                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">Team Invitations & Requests</h4>
                                <p className="text-[11px] text-slate-500">Alerts when someone requests to join your team.</p>
                            </div>
                            <input
                                type="checkbox"
                                checked={notificationsConfig.emailTeams}
                                onChange={(e) => {
                                    setNotificationsConfig((n) => ({ ...n, emailTeams: e.target.checked }));
                                    toast.success("Notification setting saved");
                                }}
                                className="size-4 accent-indigo-600"
                            />
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/50">
                            <div>
                                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">In-App Activity Notifications</h4>
                                <p className="text-[11px] text-slate-500">Show unread bell notifications in header.</p>
                            </div>
                            <input
                                type="checkbox"
                                checked={notificationsConfig.inAppActivity}
                                onChange={(e) => {
                                    setNotificationsConfig((n) => ({ ...n, inAppActivity: e.target.checked }));
                                    toast.success("Notification setting saved");
                                }}
                                className="size-4 accent-indigo-600"
                            />
                        </div>
                    </div>
                </Card>
            )}

            {/* TAB 4: PREFERENCES */}
            {activeTab === "preferences" && (
                <Card className="border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-6">
                    <div className="border-b border-slate-100 pb-4 dark:border-slate-800">
                        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Workspace Preferences</h3>
                        <p className="text-xs text-slate-500">Customize interface themes and regional settings.</p>
                    </div>

                    <div className="space-y-4 max-w-xl">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                Language
                            </label>
                            <select
                                value={preferencesConfig.language}
                                onChange={(e) => {
                                    setPreferencesConfig((p) => ({ ...p, language: e.target.value }));
                                    toast.success("Language preference updated");
                                }}
                                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 outline-none focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-100 font-semibold"
                            >
                                <option value="English (US)">English (US)</option>
                                <option value="English (UK)">English (UK)</option>
                            </select>
                        </div>
                    </div>
                </Card>
            )}

            {/* TAB 5: PRIVACY */}
            {activeTab === "privacy" && (
                <Card className="border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-6">
                    <div className="border-b border-slate-100 pb-4 dark:border-slate-800">
                        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Privacy & Visibility</h3>
                        <p className="text-xs text-slate-500">Control who can discover your profile and team availability.</p>
                    </div>

                    <div className="space-y-4 max-w-xl">
                        <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/50">
                            <div>
                                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">Public Student Directory Listing</h4>
                                <p className="text-[11px] text-slate-500">Allow team recruiters and organizers to search your profile.</p>
                            </div>
                            <input
                                type="checkbox"
                                checked={privacyConfig.publicProfile}
                                onChange={(e) => {
                                    setPrivacyConfig((p) => ({ ...p, publicProfile: e.target.checked }));
                                    toast.success("Privacy setting updated");
                                }}
                                className="size-4 accent-indigo-600"
                            />
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/50">
                            <div>
                                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">Open to Team Invites</h4>
                                <p className="text-[11px] text-slate-500">Show your profile in available teammates search.</p>
                            </div>
                            <input
                                type="checkbox"
                                checked={privacyConfig.allowTeamInvites}
                                onChange={(e) => {
                                    setPrivacyConfig((p) => ({ ...p, allowTeamInvites: e.target.checked }));
                                    toast.success("Privacy setting updated");
                                }}
                                className="size-4 accent-indigo-600"
                            />
                        </div>
                    </div>
                </Card>
            )}
        </div>
    );
}
