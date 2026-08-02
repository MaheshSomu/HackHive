import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
    Calendar,
    ChevronRight,
    Clock,
    History,
    Search,
    Shield,
    Sparkles,
    Users,
    X,
} from "lucide-react";

import useAuth from "../../hooks/useAuth";
import { eventService } from "../../services/eventService";
import { teamService } from "../../services/teamService";
import { organizerService } from "../../services/organizerService";
import { adminService } from "../../services/adminService";

export default function GlobalSearchModal({ isOpen, onClose }) {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState([]);
    const [recentSearches, setRecentSearches] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem("hackhive_recent_searches") || "[]");
        } catch {
            return [];
        }
    });

    // Keyboard shortcut to close (ESC)
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape" && isOpen) {
                onClose();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    // Live search query handler
    useEffect(() => {
        if (!query.trim() || !user) {
            setResults([]);
            return;
        }

        const timer = setTimeout(async () => {
            setLoading(true);
            const searchResults = [];
            const term = query.toLowerCase().trim();

            try {
                if (user.role === "STUDENT") {
                    const [eventsRes, teamsRes] = await Promise.allSettled([
                        eventService.getAllEvents(),
                        teamService.getOpenTeams(),
                    ]);

                    if (eventsRes.status === "fulfilled" && Array.isArray(eventsRes.value)) {
                        eventsRes.value
                            .filter((e) => e.title?.toLowerCase().includes(term) || e.collegeName?.toLowerCase().includes(term))
                            .slice(0, 4)
                            .forEach((e) => {
                                searchResults.push({
                                    id: `evt-${e.id}`,
                                    title: e.title,
                                    subtitle: e.collegeName || e.eventMode || "Hackathon Event",
                                    type: "Event",
                                    path: "/student/events",
                                });
                            });
                    }

                    if (teamsRes.status === "fulfilled" && Array.isArray(teamsRes.value)) {
                        teamsRes.value
                            .filter((t) => t.name?.toLowerCase().includes(term) || t.eventTitle?.toLowerCase().includes(term))
                            .slice(0, 4)
                            .forEach((t) => {
                                searchResults.push({
                                    id: `team-${t.id}`,
                                    title: t.name,
                                    subtitle: `${t.eventTitle || "Hackathon"} • ${t.currentMembers}/${t.maxMembers} members`,
                                    type: "Team",
                                    path: "/student/teams",
                                });
                            });
                    }
                } else if (user.role === "ORGANIZER") {
                    const myEvents = await organizerService.getMyEvents().catch(() => []);
                    if (Array.isArray(myEvents)) {
                        myEvents
                            .filter((e) => e.title?.toLowerCase().includes(term))
                            .slice(0, 5)
                            .forEach((e) => {
                                searchResults.push({
                                    id: `org-evt-${e.id}`,
                                    title: e.title,
                                    subtitle: `${e.eventMode || "Hybrid"} • Registered: ${e.registeredCount || 0}`,
                                    type: "Event",
                                    path: "/organizer/events",
                                });
                            });
                    }
                } else if (user.role === "ADMIN") {
                    const [usersRes, hackathonsRes] = await Promise.allSettled([
                        adminService.getUsers(),
                        adminService.getHackathons(),
                    ]);

                    if (usersRes.status === "fulfilled" && Array.isArray(usersRes.value)) {
                        usersRes.value
                            .filter((u) => u.fullName?.toLowerCase().includes(term) || u.email?.toLowerCase().includes(term))
                            .slice(0, 4)
                            .forEach((u) => {
                                searchResults.push({
                                    id: `usr-${u.userId}`,
                                    title: u.fullName || u.email,
                                    subtitle: `${u.email} • Role: ${u.role}`,
                                    type: "User",
                                    path: "/admin/users",
                                });
                            });
                    }

                    if (hackathonsRes.status === "fulfilled" && Array.isArray(hackathonsRes.value)) {
                        hackathonsRes.value
                            .filter((h) => h.title?.toLowerCase().includes(term))
                            .slice(0, 4)
                            .forEach((h) => {
                                searchResults.push({
                                    id: `admin-h-${h.id}`,
                                    title: h.title,
                                    subtitle: h.collegeName || "Hackathon Event",
                                    type: "Event",
                                    path: "/admin/events",
                                });
                            });
                    }
                }

                setResults(searchResults);
            } catch {
                setResults([]);
            } finally {
                setLoading(false);
            }
        }, 200);

        return () => clearTimeout(timer);
    }, [query, user]);

    const handleSelectResult = (item) => {
        // Save to recent searches
        const updatedRecent = [
            item.title,
            ...recentSearches.filter((s) => s !== item.title),
        ].slice(0, 5);
        setRecentSearches(updatedRecent);
        try {
            localStorage.setItem("hackhive_recent_searches", JSON.stringify(updatedRecent));
        } catch {
            // silent catch
        }

        onClose();
        navigate(item.path);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
                />

                {/* Search Dialog */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.15 }}
                    className="relative flex flex-col w-full max-w-xl rounded-3xl border border-slate-200 bg-white shadow-2xl overflow-hidden dark:border-slate-800 dark:bg-slate-900"
                >
                    {/* Search Input Bar */}
                    <div className="flex items-center border-b border-slate-200 px-4 py-3 dark:border-slate-800">
                        <Search className="size-5 text-indigo-600 dark:text-indigo-400 mr-3 shrink-0" />
                        <input
                            type="text"
                            autoFocus
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search events, teams, users, or workspace resources..."
                            className="h-9 w-full bg-transparent text-sm text-slate-900 placeholder-slate-400 outline-none dark:text-slate-100"
                        />
                        {query && (
                            <button
                                type="button"
                                onClick={() => setQuery("")}
                                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                            >
                                <X className="size-4" />
                            </button>
                        )}
                        <kbd className="ml-2 hidden rounded border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-bold text-slate-400 sm:inline-block dark:border-slate-700 dark:bg-slate-800">
                            ESC
                        </kbd>
                    </div>

                    {/* Content Body */}
                    <div className="max-h-96 overflow-y-auto p-4 space-y-3">
                        {loading ? (
                            <div className="p-6 text-center space-y-2">
                                <div className="mx-auto size-5 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
                                <p className="text-xs text-slate-400">Searching workspace registry...</p>
                            </div>
                        ) : query.trim() ? (
                            results.length > 0 ? (
                                <div className="space-y-1">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2">
                                        Search Results ({results.length})
                                    </span>
                                    {results.map((item) => (
                                        <div
                                            key={item.id}
                                            onClick={() => handleSelectResult(item)}
                                            className="group flex items-center justify-between rounded-xl p-3 cursor-pointer hover:bg-indigo-50/60 dark:hover:bg-indigo-950/30 transition"
                                        >
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                                                    {item.type === "Event" ? (
                                                        <Calendar className="size-4" />
                                                    ) : item.type === "Team" ? (
                                                        <Users className="size-4" />
                                                    ) : (
                                                        <Shield className="size-4" />
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <h4 className="truncate text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                                                        {item.title}
                                                    </h4>
                                                    <p className="truncate text-[11px] text-slate-500">{item.subtitle}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                                                    {item.type}
                                                </span>
                                                <ChevronRight className="size-4 text-slate-300 group-hover:text-indigo-600 dark:text-slate-600" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-8 text-center space-y-2">
                                    <Search className="mx-auto size-6 text-slate-300 dark:text-slate-600" />
                                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300">No matching results found</p>
                                    <p className="text-[11px] text-slate-400">Try searching for a different keyword or event title.</p>
                                </div>
                            )
                        ) : (
                            /* Recent Searches */
                            recentSearches.length > 0 && (
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between px-2">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                                            <History className="size-3" /> Recent Searches
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setRecentSearches([]);
                                                localStorage.removeItem("hackhive_recent_searches");
                                            }}
                                            className="text-[10px] text-slate-400 hover:text-slate-600"
                                        >
                                            Clear
                                        </button>
                                    </div>

                                    <div className="flex flex-wrap gap-1.5 px-2">
                                        {recentSearches.map((term) => (
                                            <button
                                                key={term}
                                                type="button"
                                                onClick={() => setQuery(term)}
                                                className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 dark:bg-slate-800 dark:text-slate-300"
                                            >
                                                {term}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
