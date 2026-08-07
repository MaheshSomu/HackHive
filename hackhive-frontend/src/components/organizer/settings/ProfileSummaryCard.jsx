import { Building2, Globe, Mail, MapPin, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Badge } from "../../ui/Badge";

export default function ProfileSummaryCard({ profileData, user }) {
    // Calculate profile completion percentage based on 8 core fields
    const completionFields = [
        { label: "Organization Name", value: profileData?.organizationName },
        { label: "Organization Type", value: profileData?.organizationType },
        { label: "Description", value: profileData?.description },
        { label: "Contact Email", value: profileData?.contactEmail || user?.email },
        { label: "Contact Phone", value: profileData?.contactPhone },
        { label: "Website URL", value: profileData?.websiteUrl },
        { label: "Location", value: profileData?.location },
        { label: "Logo URL", value: profileData?.logoUrl },
    ];

    const filledCount = completionFields.filter((f) => Boolean(f.value && String(f.value).trim().length > 0)).length;
    const completionPercentage = Math.round((filledCount / completionFields.length) * 100);

    const initials = (profileData?.organizationName || user?.fullName || user?.email || "O")
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    const isVerified = Boolean(profileData?.verified);

    return (
        <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 transition-all">
            {/* Background Decorative Accent Gradient */}
            <div className="absolute -right-16 -top-16 size-64 rounded-full bg-gradient-to-br from-purple-500/10 via-indigo-500/5 to-transparent blur-3xl pointer-events-none" />

            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                {/* Left Column: Logo & Main Info */}
                <div className="flex items-start sm:items-center gap-5">
                    {/* Organization Logo */}
                    <div className="relative flex size-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 text-2xl font-black text-white shadow-md ring-4 ring-purple-50 dark:ring-purple-950/40 overflow-hidden">
                        {profileData?.logoUrl ? (
                            <img
                                src={profileData.logoUrl}
                                alt={profileData?.organizationName || "Organization Logo"}
                                className="size-full object-cover"
                                onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                }}
                            />
                        ) : null}
                        <span className={profileData?.logoUrl ? "hidden" : "block"}>{initials}</span>
                    </div>

                    {/* Details */}
                    <div className="space-y-1.5 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                            <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 truncate">
                                {profileData?.organizationName || user?.fullName || "Organization Name"}
                            </h2>
                            {isVerified ? (
                                <Badge variant="success" className="gap-1 px-2.5 py-0.5 text-xs font-bold shadow-2xs">
                                    <ShieldCheck className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                                    <span>✔ Verified Organizer</span>
                                </Badge>
                            ) : (
                                <Badge variant="secondary" className="text-[11px] font-semibold">
                                    Standard Host
                                </Badge>
                            )}
                        </div>

                        {/* Metadata badges */}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-600 dark:text-slate-400 font-medium">
                            <div className="flex items-center gap-1.5 min-w-0">
                                <Mail className="size-3.5 text-slate-400 shrink-0" />
                                <span className="truncate">{profileData?.contactEmail || user?.email || "No email set"}</span>
                            </div>

                            {profileData?.location && (
                                <div className="flex items-center gap-1.5 min-w-0">
                                    <MapPin className="size-3.5 text-slate-400 shrink-0" />
                                    <span className="truncate">{profileData.location}</span>
                                </div>
                            )}

                            {profileData?.websiteUrl && (
                                <div className="flex items-center gap-1.5 min-w-0">
                                    <Globe className="size-3.5 text-slate-400 shrink-0" />
                                    <a
                                        href={profileData.websiteUrl.startsWith("http") ? profileData.websiteUrl : `https://${profileData.websiteUrl}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="truncate text-purple-600 hover:underline dark:text-purple-400"
                                    >
                                        {profileData.websiteUrl.replace(/^https?:\/\//, "")}
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Profile Completion Progress Bar */}
                <div className="w-full lg:w-72 shrink-0 rounded-2xl bg-slate-50/80 p-4 border border-slate-100 dark:bg-slate-800/40 dark:border-slate-800/80 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                            <CheckCircle2 className="size-3.5 text-purple-600 dark:text-purple-400" />
                            Profile Completion
                        </span>
                        <span className="font-black text-purple-700 dark:text-purple-300">{completionPercentage}%</span>
                    </div>

                    {/* Progress Bar Container */}
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                        <div
                            className="h-full rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 transition-all duration-500 ease-out"
                            style={{ width: `${completionPercentage}%` }}
                        />
                    </div>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                        {completionPercentage === 100
                            ? "✨ Perfect! Your profile is 100% complete."
                            : `Complete ${completionFields.length - filledCount} remaining field(s) for 100%.`}
                    </p>
                </div>
            </div>
        </div>
    );
}
