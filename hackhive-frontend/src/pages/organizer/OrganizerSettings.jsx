import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import {
    User,
    Building2,
    Lock,
    Bell,
    Info,
    Save,
    RotateCcw,
    AlertCircle,
    Globe,
    Mail,
    Phone,
    MapPin,
    Building,
    Sparkles,
    ShieldCheck,
    Check,
} from "lucide-react";

import useAuth from "../../hooks/useAuth";
import { organizerService } from "../../services/organizerService";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { DashboardPageSkeleton } from "../../components/student-dashboard/DashboardStates";

export default function OrganizerSettings() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState("profile");

    // Profile state & fetch
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isError, setIsError] = useState(false);

    // Form states for profile & organization
    const [formData, setFormData] = useState({
        organizationName: "",
        organizationType: "",
        description: "",
        websiteUrl: "",
        contactEmail: "",
        contactPhone: "",
        location: "",
        logoUrl: "",
    });

    const fetchOrganizerProfile = useCallback(async () => {
        setLoading(true);
        setIsError(false);
        try {
            const data = await organizerService.getProfile();
            setProfileData(data);
            if (data) {
                setFormData({
                    organizationName: data.organizationName || "",
                    organizationType: data.organizationType || "",
                    description: data.description || "",
                    websiteUrl: data.websiteUrl || "",
                    contactEmail: data.contactEmail || "",
                    contactPhone: data.contactPhone || "",
                    location: data.location || "",
                    logoUrl: data.logoUrl || "",
                });
            }
        } catch (err) {
            console.error("Failed to load organizer profile:", err);
            setIsError(true);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOrganizerProfile();
    }, [fetchOrganizerProfile]);

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const updated = await organizerService.updateProfile(formData);
            setProfileData(updated);
            toast.success("Organizer details updated successfully!");
        } catch (err) {
            console.error("Failed to update organizer profile:", err);
            toast.error(err.response?.data?.message || "Failed to update settings. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    const initials = (user?.fullName || user?.email || "O")
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    return (
        <div className="space-y-8 pb-16 w-full max-w-6xl mx-auto">
            {/* Header Banner */}
            <Card className="border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                <div className="space-y-1">
                    <span className="rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-purple-700 dark:bg-purple-950 dark:text-purple-300 border border-purple-100 dark:border-purple-900">
                        Host Controls
                    </span>
                    <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
                        Organizer Settings
                    </h1>
                    <p className="max-w-2xl text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        Manage your organizer account, organization details, security info, and system preferences.
                    </p>
                </div>
            </Card>

            {/* Main Content: Two-Column Responsive Layout */}
            {isError ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center text-rose-900 dark:border-rose-950 dark:bg-rose-950/40 dark:text-rose-300 space-y-3">
                    <div className="mx-auto flex size-11 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 dark:bg-rose-900 dark:text-rose-300">
                        <AlertCircle className="size-6" />
                    </div>
                    <div className="space-y-1">
                        <h4 className="text-sm font-bold">Failed to load organizer profile</h4>
                        <p className="text-xs text-rose-600/80 dark:text-rose-400">
                            There was an issue fetching your organization settings. Please try again.
                        </p>
                    </div>
                    <Button
                        type="button"
                        size="sm"
                        onClick={fetchOrganizerProfile}
                        className="bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs inline-flex items-center gap-1.5"
                    >
                        <RotateCcw className="size-3.5" /> Try Again
                    </Button>
                </div>
            ) : loading ? (
                <DashboardPageSkeleton />
            ) : (
                <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
                    {/* Left Column: Navigation Tabs */}
                    <Card className="h-fit border-slate-200/80 bg-white p-3 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                        <nav className="space-y-1">
                            <button
                                type="button"
                                onClick={() => setActiveTab("profile")}
                                className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold transition text-left ${
                                    activeTab === "profile"
                                        ? "bg-purple-600 text-white shadow-xs"
                                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                                }`}
                            >
                                <User className="size-4 shrink-0" />
                                <span>Profile</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setActiveTab("organization")}
                                className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold transition text-left ${
                                    activeTab === "organization"
                                        ? "bg-purple-600 text-white shadow-xs"
                                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                                }`}
                            >
                                <Building2 className="size-4 shrink-0" />
                                <span>Organization</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setActiveTab("security")}
                                className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold transition text-left ${
                                    activeTab === "security"
                                        ? "bg-purple-600 text-white shadow-xs"
                                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                                }`}
                            >
                                <Lock className="size-4 shrink-0" />
                                <span>Security</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setActiveTab("notifications")}
                                className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold transition text-left ${
                                    activeTab === "notifications"
                                        ? "bg-purple-600 text-white shadow-xs"
                                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                                }`}
                            >
                                <Bell className="size-4 shrink-0" />
                                <span>Notifications</span>
                            </button>
                        </nav>
                    </Card>

                    {/* Right Column: Selected Tab Content */}
                    <div className="space-y-6">
                        {/* TAB 1: PROFILE */}
                        {activeTab === "profile" && (
                            <Card className="border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-6">
                                <div className="border-b border-slate-100 pb-4 dark:border-slate-800 flex items-center justify-between">
                                    <div>
                                        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Organizer Profile</h3>
                                        <p className="text-xs text-slate-500">Account holder credentials and contact profile.</p>
                                    </div>
                                    {profileData?.verified && (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-extrabold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900">
                                            <ShieldCheck className="size-3.5 text-emerald-600" /> Verified Host
                                        </span>
                                    )}
                                </div>

                                {/* Avatar & Primary Info */}
                                <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                                    <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 text-xl font-black text-white shadow-md">
                                        {profileData?.logoUrl ? (
                                            <img
                                                src={profileData.logoUrl}
                                                alt="Organizer logo"
                                                className="size-full rounded-2xl object-cover"
                                            />
                                        ) : (
                                            <span>{initials}</span>
                                        )}
                                    </div>
                                    <div className="space-y-1 min-w-0">
                                        <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 truncate">
                                            {user?.fullName || profileData?.organizationName || "Organizer"}
                                        </h4>
                                        <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                                        <span className="inline-block rounded-md bg-purple-100 px-2 py-0.5 text-[10px] font-bold text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                                            {user?.role || "ORGANIZER"}
                                        </span>
                                    </div>
                                </div>

                                <form onSubmit={handleFormSubmit} className="space-y-4 max-w-xl">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            disabled
                                            value={user?.fullName || ""}
                                            className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 font-semibold cursor-not-allowed dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-100"
                                        />
                                        <p className="mt-1 text-[11px] text-slate-400">Synced with your auth user credentials.</p>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                            Account Email
                                        </label>
                                        <input
                                            type="email"
                                            disabled
                                            value={user?.email || ""}
                                            className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 font-semibold cursor-not-allowed dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-100"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                            Phone Number
                                        </label>
                                        <div className="relative mt-1">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                                            <input
                                                type="text"
                                                value={formData.contactPhone}
                                                onChange={(e) => setFormData((f) => ({ ...f, contactPhone: e.target.value }))}
                                                placeholder="+1 (555) 000-0000"
                                                className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2.5 text-xs text-slate-900 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                            Bio & Summary
                                        </label>
                                        <textarea
                                            rows={3}
                                            value={formData.description}
                                            onChange={(e) => setFormData((f) => ({ ...f, description: e.target.value }))}
                                            placeholder="Tell hackathon participants about your hosting background..."
                                            className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-900 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 resize-none"
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={saving}
                                        size="sm"
                                        className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs gap-1.5 px-5"
                                    >
                                        <Save className="size-3.5" />
                                        {saving ? "Saving Changes..." : "Save Profile Details"}
                                    </Button>
                                </form>
                            </Card>
                        )}

                        {/* TAB 2: ORGANIZATION */}
                        {activeTab === "organization" && (
                            <Card className="border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-6">
                                <div className="border-b border-slate-100 pb-4 dark:border-slate-800">
                                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Organization Information</h3>
                                    <p className="text-xs text-slate-500">Public details displayed on event pages and hackathon listings.</p>
                                </div>

                                <form onSubmit={handleFormSubmit} className="space-y-4 max-w-xl">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                            Organization Name
                                        </label>
                                        <div className="relative mt-1">
                                            <Building className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                                            <input
                                                type="text"
                                                required
                                                value={formData.organizationName}
                                                onChange={(e) => setFormData((f) => ({ ...f, organizationName: e.target.value }))}
                                                placeholder="e.g. Acme Tech Labs"
                                                className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2.5 text-xs text-slate-900 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 font-semibold"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                                Organization Type
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.organizationType}
                                                onChange={(e) => setFormData((f) => ({ ...f, organizationType: e.target.value }))}
                                                placeholder="e.g. University / Tech Company"
                                                className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-900 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                                Location
                                            </label>
                                            <div className="relative mt-1">
                                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                                                <input
                                                    type="text"
                                                    value={formData.location}
                                                    onChange={(e) => setFormData((f) => ({ ...f, location: e.target.value }))}
                                                    placeholder="City, Country"
                                                    className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2.5 text-xs text-slate-900 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                            Public Contact Email
                                        </label>
                                        <div className="relative mt-1">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                                            <input
                                                type="email"
                                                value={formData.contactEmail}
                                                onChange={(e) => setFormData((f) => ({ ...f, contactEmail: e.target.value }))}
                                                placeholder="support@organization.com"
                                                className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2.5 text-xs text-slate-900 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                            Website URL
                                        </label>
                                        <div className="relative mt-1">
                                            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                                            <input
                                                type="url"
                                                value={formData.websiteUrl}
                                                onChange={(e) => setFormData((f) => ({ ...f, websiteUrl: e.target.value }))}
                                                placeholder="https://organization.com"
                                                className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2.5 text-xs text-slate-900 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                            Organization Description
                                        </label>
                                        <textarea
                                            rows={4}
                                            value={formData.description}
                                            onChange={(e) => setFormData((f) => ({ ...f, description: e.target.value }))}
                                            placeholder="Provide a comprehensive overview of your organization and hackathon initiatives..."
                                            className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-900 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 resize-none"
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={saving}
                                        size="sm"
                                        className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs gap-1.5 px-5"
                                    >
                                        <Save className="size-3.5" />
                                        {saving ? "Saving Changes..." : "Save Organization Info"}
                                    </Button>
                                </form>
                            </Card>
                        )}

                        {/* TAB 3: SECURITY */}
                        {activeTab === "security" && (
                            <Card className="border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
                                <div className="border-b border-slate-100 pb-4 dark:border-slate-800">
                                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Security & Authentication</h3>
                                    <p className="text-xs text-slate-500">Security controls and password credential management.</p>
                                </div>

                                <div className="p-5 rounded-2xl bg-amber-50/80 border border-amber-200 dark:bg-amber-950/40 dark:border-amber-900/60 space-y-3">
                                    <div className="flex items-start gap-3">
                                        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300">
                                            <Info className="size-5" />
                                        </div>
                                        <div className="space-y-1">
                                            <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200">
                                                Password Management
                                            </h4>
                                            <p className="text-xs text-amber-800/90 dark:text-amber-300/90 leading-relaxed font-medium">
                                                Password management is handled through the authentication module.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        )}

                        {/* TAB 4: NOTIFICATIONS */}
                        {activeTab === "notifications" && (
                            <Card className="border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
                                <div className="border-b border-slate-100 pb-4 dark:border-slate-800">
                                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Notification Preferences</h3>
                                    <p className="text-xs text-slate-500">System broadcast and email alert preferences.</p>
                                </div>

                                <div className="p-5 rounded-2xl bg-indigo-50/80 border border-indigo-200 dark:bg-indigo-950/40 dark:border-indigo-900/60 space-y-3">
                                    <div className="flex items-start gap-3">
                                        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
                                            <Sparkles className="size-5" />
                                        </div>
                                        <div className="space-y-1">
                                            <h4 className="text-xs font-bold text-indigo-900 dark:text-indigo-200">
                                                Notifications Coming Soon
                                            </h4>
                                            <p className="text-xs text-indigo-800/90 dark:text-indigo-300/90 leading-relaxed font-medium">
                                                Notification settings will be available in a future release.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
