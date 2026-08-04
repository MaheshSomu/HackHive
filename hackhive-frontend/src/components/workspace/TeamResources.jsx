import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    Plus,
    ExternalLink,
    Pencil,
    Trash2,
    Copy,
    Check,
    FolderGit2,
    BookOpen,
    Globe,
    AlertCircle,
    RotateCcw,
    Link2,
} from "lucide-react";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { SkeletonBlock } from "../student-dashboard/DashboardStates";
import { toast } from "sonner";

// Custom SVG Icons for Brands
function GithubIcon({ className = "size-4" }) {
    return (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
            />
        </svg>
    );
}

function FigmaIcon({ className = "size-4" }) {
    return (
        <svg className={className} viewBox="0 0 38 57" fill="none">
            <path
                d="M19 28.5C19 23.2533 23.2533 19 28.5 19C33.7467 19 38 23.2533 38 28.5C38 33.7467 33.7467 38 28.5 38H19V28.5Z"
                fill="#1ABCFE"
            />
            <path
                d="M0 47.5C0 42.2533 4.25329 38 9.5 38H19V47.5C19 52.7467 14.7467 57 9.5 57C4.25329 57 0 52.7467 0 47.5Z"
                fill="#0ACF83"
            />
            <path d="M19 0V19H28.5C33.7467 19 38 14.7467 38 9.5C38 4.25329 33.7467 0 28.5 0H19Z" fill="#FF7262" />
            <path d="M0 9.5C0 14.7467 4.25329 19 9.5 19H19V0H9.5C4.25329 0 0 4.25329 0 9.5Z" fill="#F24E1E" />
            <path d="M0 28.5C0 33.7467 4.25329 38 9.5 38H19V19H9.5C4.25329 19 0 23.2533 0 28.5Z" fill="#A259FF" />
        </svg>
    );
}

function GoogleDriveIcon({ className = "size-4" }) {
    return (
        <svg className={className} viewBox="0 0 87.3 78" fill="currentColor">
            <path d="M6.6 66.85l3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8H0c0 1.55.4 3.1 1.2 4.5l5.4 9.35z" fill="#0066DA" />
            <path d="M43.65 25L29.9 1.2c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44a8.9 8.9 0 00-1.2 4.5h27.5L43.65 25z" fill="#00AC47" />
            <path d="M73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.85-3.2 7.4-12.8c.8-1.4 1.2-2.95 1.2-4.5H59.8l6.3 10.9 7.45 12.9z" fill="#EA4335" />
            <path d="M43.65 25L57.4 1.2C56.05.4 54.5 0 52.9 0H34.4c-1.6 0-3.15.4-4.5 1.2L43.65 25z" fill="#00832D" />
            <path d="M59.8 53H27.5L13.75 76.8c1.35.8 2.9 1.2 4.5 1.2h50.9c1.6 0 3.15-.4 4.5-1.2L59.8 53z" fill="#2684FC" />
            <path d="M73.4 21.65l-12.7-22C59.35.8 57.8.4 56.2.4L43.65 25l16.15 28h27.5c0-1.55-.4-3.1-1.2-4.5l-12.7-21.85z" fill="#FFBA00" />
        </svg>
    );
}

// Icon mapper for Resource Types
export function getResourceIcon(type, className = "size-4.5") {
    const normalized = (type || "").toUpperCase();

    switch (normalized) {
        case "GITHUB":
            return <GithubIcon className={className} />;
        case "FIGMA":
        case "DESIGN":
            return <FigmaIcon className={className} />;
        case "DRIVE":
        case "GOOGLE_DRIVE":
        case "DATASET":
            return <GoogleDriveIcon className={className} />;
        case "DOCUMENTATION":
        case "DOCS":
            return <BookOpen className={className} />;
        case "WEBSITE":
        case "LINK":
            return <Globe className={className} />;
        default:
            return <FolderGit2 className={className} />;
    }
}

// Color theme helper per type
function getResourceTypeTheme(type) {
    const normalized = (type || "").toUpperCase();
    switch (normalized) {
        case "GITHUB":
            return {
                bg: "bg-slate-900 text-white dark:bg-slate-800 dark:text-slate-100",
                badgeVariant: "secondary",
                label: "GitHub",
            };
        case "FIGMA":
        case "DESIGN":
            return {
                bg: "bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400",
                badgeVariant: "purple",
                label: "Figma",
            };
        case "DRIVE":
        case "GOOGLE_DRIVE":
        case "DATASET":
            return {
                bg: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400",
                badgeVariant: "success",
                label: "Google Drive",
            };
        case "DOCUMENTATION":
        case "DOCS":
            return {
                bg: "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400",
                badgeVariant: "default",
                label: "Documentation",
            };
        case "WEBSITE":
        case "LINK":
            return {
                bg: "bg-sky-50 text-sky-600 dark:bg-sky-950/60 dark:text-sky-400",
                badgeVariant: "outline",
                label: "Website",
            };
        default:
            return {
                bg: "bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400",
                badgeVariant: "warning",
                label: "Other",
            };
    }
}

function formatDate(dateStr) {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return null;
    return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(d);
}

const FILTER_CATEGORIES = [
    { key: "ALL", label: "All Resources" },
    { key: "GITHUB", label: "GitHub" },
    { key: "DESIGN", label: "Figma" },
    { key: "DATASET", label: "Google Drive" },
    { key: "DOCUMENTATION", label: "Documentation" },
    { key: "LINK", label: "Website" },
    { key: "OTHER", label: "Other" },
];

export default function TeamResources({
    resources = [],
    isLoading = false,
    isError = false,
    onAddResource,
    onEditResource,
    onDeleteResource,
    onRetry,
}) {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("ALL");
    const [copiedId, setCopiedId] = useState(null);

    // Filter logic
    const filteredResources = useMemo(() => {
        return resources.filter((res) => {
            // Category filter
            if (selectedCategory !== "ALL") {
                const normType = (res.resourceType || "").toUpperCase();
                if (selectedCategory === "GITHUB" && normType !== "GITHUB") return false;
                if (selectedCategory === "DESIGN" && normType !== "DESIGN" && normType !== "FIGMA") return false;
                if (
                    selectedCategory === "DATASET" &&
                    normType !== "DATASET" &&
                    normType !== "DRIVE" &&
                    normType !== "GOOGLE_DRIVE"
                )
                    return false;
                if (selectedCategory === "DOCUMENTATION" && normType !== "DOCUMENTATION" && normType !== "DOCS") return false;
                if (selectedCategory === "LINK" && normType !== "LINK" && normType !== "WEBSITE") return false;
                if (
                    selectedCategory === "OTHER" &&
                    ["GITHUB", "DESIGN", "FIGMA", "DATASET", "DRIVE", "GOOGLE_DRIVE", "DOCUMENTATION", "DOCS", "LINK", "WEBSITE"].includes(
                        normType
                    )
                )
                    return false;
            }

            // Search filter
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase();
                const title = (res.title || "").toLowerCase();
                const desc = (res.description || "").toLowerCase();
                const url = (res.resourceUrl || "").toLowerCase();
                return title.includes(q) || desc.includes(q) || url.includes(q);
            }

            return true;
        });
    }, [resources, selectedCategory, searchQuery]);

    // Copy link helper
    const handleCopyLink = (res) => {
        if (!res.resourceUrl) return;
        navigator.clipboard.writeText(res.resourceUrl);
        setCopiedId(res.id);
        toast.success("Link copied to clipboard!");
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <div className="space-y-6 w-full">
            {/* Top Bar Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/80 pb-5 dark:border-slate-800">
                <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Team Resources</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Central repository for code, design files, documentation, and project links.
                    </p>
                </div>

                <Button
                    type="button"
                    onClick={onAddResource}
                    className="rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-2 shadow-sm shrink-0 inline-flex items-center gap-1.5"
                >
                    <Plus className="size-4" /> Add Resource
                </Button>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                {/* Search Box */}
                <div className="relative w-full lg:max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search resources..."
                        className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-4 py-2 text-xs text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                    />
                </div>

                {/* Category Pills */}
                <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1">
                    {FILTER_CATEGORIES.map((cat) => {
                        const isActive = selectedCategory === cat.key;
                        const count =
                            cat.key === "ALL"
                                ? resources.length
                                : resources.filter((r) => {
                                      const t = (r.resourceType || "").toUpperCase();
                                      if (cat.key === "GITHUB") return t === "GITHUB";
                                      if (cat.key === "DESIGN") return t === "DESIGN" || t === "FIGMA";
                                      if (cat.key === "DATASET") return t === "DATASET" || t === "DRIVE" || t === "GOOGLE_DRIVE";
                                      if (cat.key === "DOCUMENTATION") return t === "DOCUMENTATION" || t === "DOCS";
                                      if (cat.key === "LINK") return t === "LINK" || t === "WEBSITE";
                                      return ![
                                          "GITHUB",
                                          "DESIGN",
                                          "FIGMA",
                                          "DATASET",
                                          "DRIVE",
                                          "GOOGLE_DRIVE",
                                          "DOCUMENTATION",
                                          "DOCS",
                                          "LINK",
                                          "WEBSITE",
                                      ].includes(t);
                                  }).length;

                        return (
                            <button
                                key={cat.key}
                                type="button"
                                onClick={() => setSelectedCategory(cat.key)}
                                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
                                    isActive
                                        ? "bg-slate-900 text-white dark:bg-indigo-600 dark:text-white shadow-xs"
                                        : "bg-slate-100 text-slate-600 hover:bg-slate-200/80 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-slate-800"
                                }`}
                            >
                                <span>{cat.label}</span>
                                <span
                                    className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                                        isActive
                                            ? "bg-white/20 text-white"
                                            : "bg-slate-200/80 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                                    }`}
                                >
                                    {count}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Error State */}
            {isError ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center text-rose-900 dark:border-rose-950 dark:bg-rose-950/40 dark:text-rose-300 space-y-3">
                    <div className="mx-auto flex size-11 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 dark:bg-rose-900 dark:text-rose-300">
                        <AlertCircle className="size-6" />
                    </div>
                    <div className="space-y-1">
                        <h4 className="text-sm font-bold">Failed to load team resources</h4>
                        <p className="text-xs text-rose-600/80 dark:text-rose-400">
                            There was an issue fetching resources from the server. Please check your connection and try again.
                        </p>
                    </div>
                    {onRetry && (
                        <Button
                            type="button"
                            size="sm"
                            onClick={onRetry}
                            className="bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs inline-flex items-center gap-1.5"
                        >
                            <RotateCcw className="size-3.5" /> Try Again
                        </Button>
                    )}
                </div>
            ) : isLoading ? (
                /* Loading Skeleton Grid */
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div
                            key={i}
                            className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4"
                        >
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <SkeletonBlock className="h-9 w-9 rounded-xl" />
                                    <SkeletonBlock className="h-5 w-20 rounded-full" />
                                </div>
                                <SkeletonBlock className="h-5 w-3/4" />
                                <SkeletonBlock className="h-10 w-full" />
                            </div>
                            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                <SkeletonBlock className="h-4 w-24" />
                                <SkeletonBlock className="h-7 w-16 rounded-lg" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : filteredResources.length > 0 ? (
                /* Cards Grid */
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    <AnimatePresence mode="popLayout">
                        {filteredResources.map((res) => {
                            const theme = getResourceTypeTheme(res.resourceType);
                            const formattedDate = formatDate(res.createdAt);

                            return (
                                <motion.div
                                    key={res.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.15 }}
                                >
                                    <Card className="group relative flex flex-col justify-between h-full border-slate-200/80 bg-white p-5 shadow-xs hover:shadow-md hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700 transition space-y-4">
                                        <div className="space-y-3">
                                            {/* Card Top Row: Type Icon & Actions */}
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className={`flex size-10 items-center justify-center rounded-xl font-bold shadow-2xs ${theme.bg}`}
                                                    >
                                                        {getResourceIcon(res.resourceType, "size-5")}
                                                    </div>
                                                    <div>
                                                        <Badge variant={theme.badgeVariant}>{theme.label}</Badge>
                                                    </div>
                                                </div>

                                                {/* Edit & Delete Action Buttons */}
                                                <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100 transition">
                                                    {onEditResource && (
                                                        <button
                                                            type="button"
                                                            onClick={() => onEditResource(res)}
                                                            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition"
                                                            title="Edit resource"
                                                        >
                                                            <Pencil className="size-3.5" />
                                                        </button>
                                                    )}
                                                    {onDeleteResource && (
                                                        <button
                                                            type="button"
                                                            onClick={() => onDeleteResource(res.id)}
                                                            className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/60 dark:hover:text-rose-400 transition"
                                                            title="Delete resource"
                                                        >
                                                            <Trash2 className="size-3.5" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Resource Title */}
                                            <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 leading-snug line-clamp-1">
                                                {res.title}
                                            </h4>

                                            {/* Description */}
                                            {res.description ? (
                                                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                                                    {res.description}
                                                </p>
                                            ) : (
                                                <p className="text-xs italic text-slate-400">No description provided</p>
                                            )}

                                            {/* Formatted URL bar with copy button */}
                                            {res.resourceUrl && (
                                                <div className="flex items-center justify-between rounded-xl bg-slate-50 p-2 text-xs border border-slate-100 dark:bg-slate-800/60 dark:border-slate-800/80">
                                                    <span className="truncate text-slate-600 dark:text-slate-300 font-mono text-[11px] max-w-[200px]">
                                                        {res.resourceUrl.replace(/^https?:\/\//i, "")}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleCopyLink(res)}
                                                        className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 p-1 rounded-md transition"
                                                        title="Copy URL"
                                                    >
                                                        {copiedId === res.id ? (
                                                            <Check className="size-3.5 text-emerald-500" />
                                                        ) : (
                                                            <Copy className="size-3.5" />
                                                        )}
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        {/* Card Footer: Metadata & Open Button */}
                                        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                            <div className="flex flex-col">
                                                <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                                                    {res.addedByName || "Teammate"}
                                                </span>
                                                {formattedDate && (
                                                    <span className="text-[10px] text-slate-400">{formattedDate}</span>
                                                )}
                                            </div>

                                            {res.resourceUrl ? (
                                                <a
                                                    href={res.resourceUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-950/70 dark:text-indigo-300 dark:hover:bg-indigo-900/80 transition"
                                                >
                                                    Open <ExternalLink className="size-3" />
                                                </a>
                                            ) : (
                                                <span className="text-xs text-slate-400">No URL</span>
                                            )}
                                        </div>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            ) : (
                /* Empty State */
                <Card className="border-dashed border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex flex-col items-center justify-center p-10 text-center space-y-4">
                        <div className="flex size-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                            <Link2 className="size-7" />
                        </div>
                        <div className="max-w-md space-y-1.5">
                            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                                {searchQuery || selectedCategory !== "ALL"
                                    ? "No matching resources found"
                                    : "No team resources added yet"}
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                {searchQuery || selectedCategory !== "ALL"
                                    ? "Try adjusting your search criteria or category filter."
                                    : "Share GitHub repository links, Figma designs, Google Drive folders, or project documentation with your team."}
                            </p>
                        </div>
                        {onAddResource && (
                            <Button
                                type="button"
                                size="sm"
                                onClick={onAddResource}
                                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-5 py-2 rounded-xl shadow-xs"
                            >
                                <Plus className="mr-1.5 size-4" /> Add First Resource
                            </Button>
                        )}
                    </div>
                </Card>
            )}
        </div>
    );
}
