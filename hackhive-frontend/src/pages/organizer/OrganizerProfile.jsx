import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    ArrowRight,
    Building2,
    Calendar,
    Edit,
    ExternalLink,
    Globe,
    Mail,
    MapPin,
    Phone,
    Share2,
    ShieldCheck,
    RotateCw,
    AlertCircle,
    UserCheck,
    Plus,
} from "lucide-react";

import useAuth from "../../hooks/useAuth";
import { organizerService } from "../../services/organizerService";
import { getImageUrl } from "../../utils/imageUtils";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";

// Platform Icon Components
function LinkedinIcon({ className = "size-4" }) {
    return (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.74a1.63 1.63 0 1 0 0 3.26 1.63 1.63 0 0 0 0-3.26z" />
        </svg>
    );
}

function GithubIcon({ className = "size-4" }) {
    return (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
        </svg>
    );
}

function XIcon({ className = "size-4" }) {
    return (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
    );
}

function InstagramIcon({ className = "size-4" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
            <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
        </svg>
    );
}

function FacebookIcon({ className = "size-4" }) {
    return (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
    );
}

const PLATFORM_META = {
    LINKEDIN: {
        label: "LinkedIn",
        icon: LinkedinIcon,
        colorClass: "border-sky-200/80 bg-sky-50/70 text-sky-700 hover:bg-sky-100 dark:border-sky-900/60 dark:bg-sky-950/40 dark:text-sky-300 dark:hover:bg-sky-900/60",
    },
    GITHUB: {
        label: "GitHub",
        icon: GithubIcon,
        colorClass: "border-slate-200 bg-slate-100/70 text-slate-800 hover:bg-slate-200/80 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-200 dark:hover:bg-slate-700/60",
    },
    X: {
        label: "X (Twitter)",
        icon: XIcon,
        colorClass: "border-slate-200 bg-slate-100/70 text-slate-900 hover:bg-slate-200/80 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-100 dark:hover:bg-slate-700/60",
    },
    INSTAGRAM: {
        label: "Instagram",
        icon: InstagramIcon,
        colorClass: "border-pink-200/80 bg-pink-50/70 text-pink-700 hover:bg-pink-100 dark:border-pink-900/60 dark:bg-pink-950/40 dark:text-pink-300 dark:hover:bg-pink-900/60",
    },
    FACEBOOK: {
        label: "Facebook",
        icon: FacebookIcon,
        colorClass: "border-blue-200/80 bg-blue-50/70 text-blue-700 hover:bg-blue-100 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300 dark:hover:bg-blue-900/60",
    },
};

const normalizeSocialUrl = (url) => {
    if (!url || !url.trim()) return "";
    let trimmed = url.trim();
    if (!/^https?:\/\//i.test(trimmed)) {
        trimmed = `https://${trimmed}`;
    }
    return trimmed;
};

const formatDateRange = (start, end) => {
    if (!start) return "Date TBD";
    const startDate = new Date(start);
    if (isNaN(startDate.getTime())) return "Date TBD";

    const startMonth = startDate.toLocaleDateString("en-US", { month: "short" });
    const startDay = startDate.getDate();
    const startYear = startDate.getFullYear();

    if (!end) {
        return `${startMonth} ${startDay}, ${startYear}`;
    }

    const endDate = new Date(end);
    if (isNaN(endDate.getTime())) {
        return `${startMonth} ${startDay}, ${startYear}`;
    }

    const endMonth = endDate.toLocaleDateString("en-US", { month: "short" });
    const endDay = endDate.getDate();
    const endYear = endDate.getFullYear();

    if (startYear === endYear) {
        if (startMonth === endMonth) {
            if (startDay === endDay) {
                return `${startMonth} ${startDay}, ${startYear}`;
            }
            return `${startMonth} ${startDay} – ${endDay}, ${startYear}`;
        }
        return `${startMonth} ${startDay} – ${endMonth} ${endDay}, ${startYear}`;
    }
    return `${startMonth} ${startDay}, ${startYear} – ${endMonth} ${endDay}, ${endYear}`;
};

const calculateEventStatus = (event) => {
    if (!event) return null;
    const now = Date.now();
    const start = event.startDate ? new Date(event.startDate).getTime() : 0;
    const end = event.endDate ? new Date(event.endDate).getTime() : 0;
    const regStart = event.registrationStartDate ? new Date(event.registrationStartDate).getTime() : 0;
    const regEnd = event.registrationEndDate ? new Date(event.registrationEndDate).getTime() : 0;

    if (end > 0 && now > end) {
        return { label: "Completed", variant: "secondary" };
    }
    if (start > 0 && now < start) {
        if (regEnd > 0 && now > regEnd) {
            return { label: "Registration Closed", variant: "secondary" };
        }
        if (regStart > 0 && now < regStart) {
            return { label: "Upcoming", variant: "purple" };
        }
        return { label: "Registration Open", variant: "success" };
    }
    if (start > 0 && now >= start && (end === 0 || now <= end)) {
        return { label: "Live", variant: "success" };
    }
    return null;
};

export default function OrganizerProfile() {
    const { user } = useAuth();
    const navigate = useNavigate();

    // Profile State
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [logoError, setLogoError] = useState(false);

    // Social Links State (Independent loading/error state)
    const [socialLinks, setSocialLinks] = useState([]);
    const [socialLinksLoading, setSocialLinksLoading] = useState(true);
    const [socialLinksError, setSocialLinksError] = useState(false);

    // Events State (Independent loading/error state)
    const [events, setEvents] = useState([]);
    const [eventsLoading, setEventsLoading] = useState(true);
    const [eventsError, setEventsError] = useState(false);

    const fetchProfile = useCallback(async () => {
        try {
            setLoading(true);
            setError(false);
            setLogoError(false);
            const data = await organizerService.getProfile();
            setProfile(data);
        } catch (err) {
            console.error("Failed to load organizer profile:", err);
            setError(true);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchSocialLinks = useCallback(async () => {
        try {
            setSocialLinksLoading(true);
            setSocialLinksError(false);
            const data = await organizerService.getSocialLinks();
            setSocialLinks(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Failed to load social links:", err);
            setSocialLinksError(true);
        } finally {
            setSocialLinksLoading(false);
        }
    }, []);

    const fetchEvents = useCallback(async () => {
        try {
            setEventsLoading(true);
            setEventsError(false);
            const data = await organizerService.getMyEvents();
            setEvents(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Failed to load organizer events:", err);
            setEventsError(true);
        } finally {
            setEventsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProfile();
        fetchSocialLinks();
        fetchEvents();
    }, [fetchProfile, fetchSocialLinks, fetchEvents]);

    // Active non-empty social links
    const activeSocialLinks = useMemo(() => {
        return socialLinks.filter((item) => item.platform && item.url && item.url.trim().length > 0);
    }, [socialLinks]);

    // Sort events: upcoming first, completed after
    const sortedEvents = useMemo(() => {
        const now = Date.now();
        return [...events].sort((a, b) => {
            const startA = a.startDate ? new Date(a.startDate).getTime() : 0;
            const startB = b.startDate ? new Date(b.startDate).getTime() : 0;
            const endA = a.endDate ? new Date(a.endDate).getTime() : 0;
            const endB = b.endDate ? new Date(b.endDate).getTime() : 0;

            const isUpcomingA = (startA > 0 && startA > now) || (endA > 0 && endA > now);
            const isUpcomingB = (startB > 0 && startB > now) || (endB > 0 && endB > now);

            if (isUpcomingA && !isUpcomingB) return -1;
            if (!isUpcomingA && isUpcomingB) return 1;

            if (isUpcomingA && isUpcomingB) {
                return startA - startB;
            }
            return endB - endA;
        });
    }, [events]);

    const displayedEvents = sortedEvents.slice(0, 6);
    const hasMoreEvents = events.length > 6;

    const orgName = profile?.organizationName || user?.fullName || "Organization Name";
    const initials = orgName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    const isVerified = Boolean(profile?.verified);

    if (loading) {
        return (
            <div className="space-y-6 animate-pulse">
                {/* Header Skeleton */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="h-8 w-48 rounded-lg bg-slate-200 dark:bg-slate-800" />
                    <div className="h-10 w-32 rounded-xl bg-slate-200 dark:bg-slate-800" />
                </div>

                {/* Profile Card Skeleton */}
                <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                        <div className="size-24 rounded-2xl bg-slate-200 dark:bg-slate-800 shrink-0" />
                        <div className="space-y-3 flex-1">
                            <div className="h-7 w-64 rounded-md bg-slate-200 dark:bg-slate-800" />
                            <div className="h-4 w-40 rounded-md bg-slate-200 dark:bg-slate-800" />
                            <div className="h-4 w-52 rounded-md bg-slate-200 dark:bg-slate-800" />
                        </div>
                    </div>
                </div>

                {/* Details Grid Skeleton */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="h-48 rounded-2xl border border-slate-200/80 bg-white p-6 dark:border-slate-800 dark:bg-slate-900" />
                    <div className="h-48 rounded-2xl border border-slate-200/80 bg-white p-6 dark:border-slate-800 dark:bg-slate-900" />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-[400px] flex-col items-center justify-center rounded-3xl border border-slate-200/80 bg-white p-8 text-center shadow-xs dark:border-slate-800 dark:bg-slate-900">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400">
                    <AlertCircle className="size-7" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-slate-100">
                    Failed to load profile
                </h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    There was an issue fetching your organizer profile information.
                </p>
                <Button
                    onClick={fetchProfile}
                    className="mt-5 gap-2"
                    variant="outline"
                    aria-label="Retry loading organizer profile"
                >
                    <RotateCw className="size-4" />
                    Try Again
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-10">
            {/* Header / Action Bar */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">
                        Organizer Profile
                    </h1>
                    <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
                        Public organization details and contact profile.
                    </p>
                </div>
                <div>
                    <Button
                        onClick={() => navigate("/organizer/settings")}
                        className="w-full sm:w-auto gap-2 shadow-sm bg-purple-600 hover:bg-purple-700 text-white dark:bg-purple-600 dark:hover:bg-purple-500 focus-visible:ring-2 focus-visible:ring-purple-500"
                        aria-label="Edit Organizer Profile"
                    >
                        <Edit className="size-4" />
                        Edit Profile
                    </Button>
                </div>
            </div>

            {/* Main Hero Profile Card */}
            <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs dark:border-slate-800 dark:bg-slate-900 transition-all">
                <div className="absolute -right-16 -top-16 size-64 rounded-full bg-gradient-to-br from-purple-500/10 via-indigo-500/5 to-transparent blur-3xl pointer-events-none" />

                <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-5">
                        {/* Logo or Initials */}
                        <div className="relative flex size-20 sm:size-24 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 text-2xl sm:text-3xl font-black text-white shadow-md ring-4 ring-purple-50 dark:ring-purple-950/40 overflow-hidden">
                            {profile?.logoUrl && !logoError ? (
                                <img
                                    src={getImageUrl(profile.logoUrl)}
                                    alt={`${orgName} logo`}
                                    className="size-full object-cover"
                                    onError={() => setLogoError(true)}
                                />
                            ) : (
                                <span>{initials}</span>
                            )}
                        </div>

                        {/* Title & Metadata */}
                        <div className="space-y-2 min-w-0">
                            <div className="flex flex-wrap items-center gap-2.5">
                                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 truncate">
                                    {orgName}
                                </h2>
                                {isVerified ? (
                                    <Badge variant="success" className="gap-1 px-2.5 py-0.5 text-xs font-bold shadow-2xs">
                                        <ShieldCheck className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                                        <span>Verified</span>
                                    </Badge>
                                ) : (
                                    <Badge variant="secondary" className="text-xs font-semibold">
                                        Standard Host
                                    </Badge>
                                )}
                            </div>

                            {profile?.organizationType && (
                                <div className="flex items-center gap-1.5 text-xs font-semibold text-purple-600 dark:text-purple-400">
                                    <Building2 className="size-3.5" />
                                    <span>{profile.organizationType}</span>
                                </div>
                            )}

                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                                {profile?.location && (
                                    <span className="flex items-center gap-1">
                                        <MapPin className="size-3.5 text-slate-400 shrink-0" />
                                        <span className="truncate">{profile.location}</span>
                                    </span>
                                )}
                                <span className="flex items-center gap-1">
                                    <UserCheck className="size-3.5 text-slate-400 shrink-0" />
                                    <span>Organizer Account</span>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Information Grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* About & Description */}
                <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
                    <div className="flex items-center gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
                        <Building2 className="size-4 text-purple-600 dark:text-purple-400 shrink-0" />
                        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                            About Organization
                        </h3>
                    </div>

                    <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        {profile?.description ? (
                            <p className="whitespace-pre-line">{profile.description}</p>
                        ) : (
                            <p className="italic text-slate-400 dark:text-slate-500">
                                No organization description provided yet.
                            </p>
                        )}
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div>
                            <span className="block font-medium text-slate-400">Organization Type</span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200">
                                {profile?.organizationType || "Not specified"}
                            </span>
                        </div>
                        <div>
                            <span className="block font-medium text-slate-400">Verification Status</span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200">
                                {isVerified ? "Verified Organizer" : "Standard Host"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Contact & Location Details */}
                <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
                    <div className="flex items-center gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
                        <Mail className="size-4 text-purple-600 dark:text-purple-400 shrink-0" />
                        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                            Contact Information
                        </h3>
                    </div>

                    <div className="space-y-4 text-sm">
                        {/* Contact Email */}
                        <div className="flex items-start gap-3">
                            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400">
                                <Mail className="size-4" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs font-semibold text-slate-400">Contact Email</p>
                                <p className="font-medium text-slate-900 dark:text-slate-100 truncate">
                                    {profile?.contactEmail || user?.email || "Not specified"}
                                </p>
                            </div>
                        </div>

                        {/* Contact Phone */}
                        <div className="flex items-start gap-3">
                            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400">
                                <Phone className="size-4" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs font-semibold text-slate-400">Contact Phone</p>
                                <p className="font-medium text-slate-900 dark:text-slate-100 truncate">
                                    {profile?.contactPhone || "Not specified"}
                                </p>
                            </div>
                        </div>

                        {/* Location */}
                        <div className="flex items-start gap-3">
                            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400">
                                <MapPin className="size-4" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs font-semibold text-slate-400">Location</p>
                                <p className="font-medium text-slate-900 dark:text-slate-100 truncate">
                                    {profile?.location || "Not specified"}
                                </p>
                            </div>
                        </div>

                        {/* Website */}
                        <div className="flex items-start gap-3">
                            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400">
                                <Globe className="size-4" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs font-semibold text-slate-400">Website</p>
                                {profile?.websiteUrl ? (
                                    <a
                                        href={profile.websiteUrl.startsWith("http") ? profile.websiteUrl : `https://${profile.websiteUrl}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="font-medium text-purple-600 hover:underline dark:text-purple-400 truncate block"
                                    >
                                        {profile.websiteUrl}
                                    </a>
                                ) : (
                                    <p className="font-medium text-slate-900 dark:text-slate-100">Not specified</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Social Links Section */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                        <Share2 className="size-4 text-purple-600 dark:text-purple-400 shrink-0" />
                        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                            Social Links
                        </h3>
                    </div>

                    {activeSocialLinks.length > 0 && (
                        <Button
                            onClick={() => navigate("/organizer/settings")}
                            size="sm"
                            variant="ghost"
                            className="h-8 gap-1.5 text-xs text-purple-600 hover:text-purple-700 dark:text-purple-400"
                            aria-label="Manage Social Links"
                        >
                            <Edit className="size-3.5" />
                            Manage Links
                        </Button>
                    )}
                </div>

                {socialLinksLoading ? (
                    <div className="flex flex-wrap gap-3 animate-pulse">
                        {[1, 2, 3].map((n) => (
                            <div key={n} className="h-10 w-36 rounded-xl bg-slate-200 dark:bg-slate-800" />
                        ))}
                    </div>
                ) : socialLinksError ? (
                    <p className="text-xs text-slate-400 italic">Unable to load social links.</p>
                ) : activeSocialLinks.length === 0 ? (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-800/30">
                        <div className="flex items-center gap-3">
                            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400">
                                <Share2 className="size-4.5" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                                    No social profiles connected yet.
                                </p>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                    Add social links from Settings to build community trust.
                                </p>
                            </div>
                        </div>

                        <Button
                            onClick={() => navigate("/organizer/settings")}
                            size="sm"
                            variant="outline"
                            className="shrink-0 gap-1.5 text-xs border-purple-200 text-purple-700 hover:bg-purple-50 dark:border-purple-900 dark:text-purple-300 dark:hover:bg-purple-950/40"
                            aria-label="Add Social Links"
                        >
                            <Plus className="size-3.5" />
                            Add Social Links
                        </Button>
                    </div>
                ) : (
                    <div className="flex flex-wrap gap-3">
                        {activeSocialLinks.map((item) => {
                            const meta = PLATFORM_META[item.platform] || {
                                label: item.platform,
                                icon: Globe,
                                colorClass: "border-slate-200 bg-slate-50 text-slate-800 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200",
                            };
                            const IconComponent = meta.icon;
                            const href = normalizeSocialUrl(item.url);

                            return (
                                <a
                                    key={item.id || item.platform}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-xs font-bold transition-all shadow-2xs ${meta.colorClass}`}
                                    aria-label={`Visit organization ${meta.label} page`}
                                >
                                    <IconComponent className="size-4 shrink-0" />
                                    <span>{meta.label}</span>
                                    <ExternalLink className="size-3 opacity-60 ml-0.5" />
                                </a>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Events by this Organizer Section */}
            <div className="space-y-5 pt-4 border-t border-slate-200/80 dark:border-slate-800">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <Calendar className="size-5 text-purple-600 dark:text-purple-400 shrink-0" />
                            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-slate-100">
                                Events by this Organizer
                            </h2>
                        </div>
                        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
                            Recent hackathons and events hosted by this organization.
                        </p>
                    </div>

                    {!eventsLoading && !eventsError && events.length > 0 && (
                        <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                            {hasMoreEvents
                                ? `Showing 6 of ${events.length} events`
                                : `Showing ${events.length} ${events.length === 1 ? "event" : "events"}`}
                        </div>
                    )}
                </div>

                {/* Event Content States */}
                {eventsLoading ? (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3].map((n) => (
                            <div
                                key={n}
                                className="h-44 rounded-2xl border border-slate-200/80 bg-white p-5 animate-pulse dark:border-slate-800 dark:bg-slate-900 space-y-3"
                            >
                                <div className="h-4 w-24 rounded bg-slate-200 dark:bg-slate-800" />
                                <div className="h-6 w-3/4 rounded bg-slate-200 dark:bg-slate-800" />
                                <div className="h-4 w-1/2 rounded bg-slate-200 dark:bg-slate-800" />
                            </div>
                        ))}
                    </div>
                ) : eventsError ? (
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200/80 bg-white p-6 text-center shadow-xs dark:border-slate-800 dark:bg-slate-900">
                        <AlertCircle className="size-6 text-rose-500" />
                        <p className="mt-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                            Unable to load events.
                        </p>
                        <Button
                            onClick={fetchEvents}
                            size="sm"
                            variant="outline"
                            className="mt-3 gap-1.5 text-xs"
                            aria-label="Retry loading events"
                        >
                            <RotateCw className="size-3.5" />
                            Retry
                        </Button>
                    </div>
                ) : events.length === 0 ? (
                    <div className="flex min-h-[180px] flex-col items-center justify-center rounded-2xl border border-slate-200/80 bg-white p-6 text-center shadow-xs dark:border-slate-800 dark:bg-slate-900">
                        <div className="flex size-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400">
                            <Calendar className="size-6" />
                        </div>
                        <h4 className="mt-3 text-sm font-bold text-slate-900 dark:text-slate-100">
                            No events created yet
                        </h4>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            This organization hasn't created any events yet.
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Event Cards Grid */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {displayedEvents.map((evt) => {
                                const status = calculateEventStatus(evt);
                                const dateText = formatDateRange(evt.startDate, evt.endDate);

                                return (
                                    <div
                                        key={evt.id}
                                        className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all hover:border-purple-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-purple-900/60"
                                    >
                                        <div className="space-y-3">
                                            {/* Header Tags */}
                                            <div className="flex items-center justify-between gap-2 flex-wrap">
                                                <span className="inline-flex items-center rounded-md bg-purple-50 px-2.5 py-0.5 text-[11px] font-semibold text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-100 dark:border-purple-900/40">
                                                    {evt.eventMode || "Offline"}
                                                </span>
                                                {status && (
                                                    <Badge
                                                        variant={status.variant}
                                                        className="text-[10px] font-bold px-2 py-0.5"
                                                    >
                                                        {status.label}
                                                    </Badge>
                                                )}
                                            </div>

                                            {/* Title */}
                                            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 line-clamp-2">
                                                {evt.title}
                                            </h3>

                                            {/* Details */}
                                            <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar className="size-3.5 shrink-0 text-slate-400" />
                                                    <span className="truncate">{dateText}</span>
                                                </div>

                                                {evt.location && (
                                                    <div className="flex items-center gap-1.5">
                                                        <MapPin className="size-3.5 shrink-0 text-slate-400" />
                                                        <span className="truncate">{evt.location}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* View All Events Button */}
                        {hasMoreEvents && (
                            <div className="flex justify-center pt-2">
                                <Button
                                    onClick={() => navigate("/organizer/events")}
                                    variant="outline"
                                    className="gap-2 shadow-2xs font-semibold text-xs border-purple-200 text-purple-700 hover:bg-purple-50 dark:border-purple-900 dark:text-purple-300 dark:hover:bg-purple-950/40"
                                    aria-label="View All Events"
                                >
                                    <span>View All Events</span>
                                    <ArrowRight className="size-4" />
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
