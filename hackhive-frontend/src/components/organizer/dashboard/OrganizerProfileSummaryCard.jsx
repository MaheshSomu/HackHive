import { ShieldCheck, Settings, Building2 } from "lucide-react";
import { Card } from "../../ui/Card";
import { Badge } from "../../ui/Badge";
import { Button } from "../../ui/Button";
import { getImageUrl } from "../../../utils/imageUtils";

export default function OrganizerProfileSummaryCard({ profileData, user, onNavigate }) {
    const completionFields = [
        profileData?.organizationName,
        profileData?.organizationType,
        profileData?.description,
        profileData?.contactEmail || user?.email,
        profileData?.contactPhone,
        profileData?.websiteUrl,
        profileData?.location,
        profileData?.logoUrl,
    ];

    const filledCount = completionFields.filter((f) => Boolean(f && String(f).trim().length > 0)).length;
    const completionPercentage = Math.round((filledCount / completionFields.length) * 100);

    const initials = (profileData?.organizationName || user?.fullName || user?.email || "O")
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    const isVerified = Boolean(profileData?.verified);

    return (
        <Card className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
                <div className="flex items-center gap-2">
                    <div className="flex size-8 items-center justify-center rounded-xl bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200">
                        <Building2 className="size-4" />
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Organizer Profile Summary</h3>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">Host organization identity & verification</p>
                    </div>
                </div>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onNavigate("/organizer/settings")}
                    className="text-xs font-bold gap-1.5 rounded-xl border-slate-200 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                    <Settings className="size-3.5" /> Settings
                </Button>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex size-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-xl font-black text-white shadow-md overflow-hidden ring-2 ring-blue-100 dark:ring-blue-950">
                    {profileData?.logoUrl ? (
                        <img
                            src={getImageUrl(profileData.logoUrl)}
                            alt={profileData?.organizationName || "Logo"}
                            className="size-full object-cover"
                            onError={(e) => {
                                e.currentTarget.style.display = "none";
                            }}
                        />
                    ) : null}
                    <span className={profileData?.logoUrl ? "hidden" : "block"}>{initials}</span>
                </div>

                <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 truncate">
                            {profileData?.organizationName || user?.fullName || "Organization"}
                        </h4>
                        {isVerified ? (
                            <Badge variant="success" className="gap-1 text-[10px] px-2 py-0.5 font-bold">
                                <ShieldCheck className="size-3 text-emerald-600" /> Verified
                            </Badge>
                        ) : (
                            <Badge variant="secondary" className="text-[10px] px-2 py-0.5">
                                Standard Host
                            </Badge>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="inline-block rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-800 dark:bg-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                            {user?.role || "ORGANIZER"}
                        </span>
                        <span className="text-[11px] text-slate-500 truncate">{user?.email}</span>
                    </div>
                </div>
            </div>

            {/* Profile Completion Bar */}
            <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100 dark:bg-slate-800/40 dark:border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700 dark:text-slate-300">Profile Completion</span>
                    <span className="font-black text-blue-600 dark:text-blue-400">{completionPercentage}%</span>
                </div>

                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                    <div
                        className="h-full rounded-full bg-gradient-to-r from-slate-900 to-blue-600 dark:from-blue-600 dark:to-indigo-600 transition-all duration-500 ease-out"
                        style={{ width: `${completionPercentage}%` }}
                    />
                </div>
            </div>
        </Card>
    );
}
