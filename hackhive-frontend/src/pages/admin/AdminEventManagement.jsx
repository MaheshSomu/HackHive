import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Calendar, CalendarDays, Clock, MapPin, Search, Trash2, Users } from "lucide-react";

import { adminService } from "../../services/adminService";
import DashboardSection from "../../components/student-dashboard/DashboardSection";
import { DashboardPageSkeleton, EmptyState } from "../../components/student-dashboard/DashboardStates";
import { Button } from "../../components/ui/Button";
import { Card, CardContent } from "../../components/ui/Card";
import HackHiveSelect from "../../components/ui/HackHiveSelect";

function formatDate(dateString) {
    if (!dateString) return "TBD";
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return "TBD";
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(date);
}

export default function AdminEventManagement() {
    const [hackathons, setHackathons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [modeFilter, setModeFilter] = useState("ALL");
    const [actionLoadingId, setActionLoadingId] = useState(null);

    const loadHackathons = useCallback(async () => {
        try {
            setLoading(true);
            const res = await adminService.getAllHackathons();
            setHackathons(Array.isArray(res) ? res : []);
        } catch {
            setHackathons([]);
            toast.error("Failed to load hackathons list.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadHackathons();
    }, [loadHackathons]);

    const handleDelete = async (id) => {
        try {
            setActionLoadingId(id);
            await adminService.deleteHackathon(id);
            setHackathons((prev) => prev.filter((h) => h.hackathonId !== id && h.id !== id));
            toast.success("Hackathon deleted from platform.");
        } catch {
            toast.error("Failed to delete hackathon.");
        } finally {
            setActionLoadingId(null);
        }
    };

    const filteredHackathons = useMemo(() => {
        let list = [...hackathons];
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            list = list.filter(
                (h) =>
                    (h.title && h.title.toLowerCase().includes(q)) ||
                    (h.organizationName && h.organizationName.toLowerCase().includes(q)) ||
                    (h.location && h.location.toLowerCase().includes(q))
            );
        }
        if (modeFilter !== "ALL") {
            list = list.filter((h) => (h.mode || "").toUpperCase() === modeFilter);
        }
        return list;
    }, [hackathons, searchQuery, modeFilter]);

    if (loading) {
        return <DashboardPageSkeleton />;
    }

    return (
        <div className="space-y-8 pb-16">
            <Card className="overflow-hidden border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
                <CardContent className="p-6 sm:p-8">
                    <div className="space-y-1">
                        <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                            Global Events
                        </span>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
                            Hackathon Event Oversight
                        </h1>
                        <p className="max-w-2xl text-xs text-slate-500 dark:text-slate-400 leading-5">
                            Supervise all published hackathons across the platform. Inspect event timelines, modes, and remove non-compliant listings.
                        </p>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
                <CardContent className="p-4 sm:p-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="group relative flex-1 max-w-md">
                            <Search className="pointer-events-none absolute left-3.5 top-3 size-4 text-slate-400 group-focus-within:text-emerald-600" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search hackathon by title, organizer, location..."
                                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-xs text-slate-900 outline-none focus:border-emerald-500 focus:bg-white dark:border-slate-800 dark:bg-slate-800 dark:text-slate-100"
                            />
                        </div>

                        <div className="w-36">
                            <HackHiveSelect
                                value={modeFilter}
                                onChange={(e) => setModeFilter(e.target.value)}
                                options={[
                                    { value: "ALL", label: "All Modes" },
                                    { value: "ONLINE", label: "Online" },
                                    { value: "OFFLINE", label: "Offline" },
                                    { value: "HYBRID", label: "Hybrid" },
                                ]}
                                size="sm"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <DashboardSection
                id="hackathons-list"
                eyebrow="Hackathons"
                title="All Platform Events"
                description={`Total ${filteredHackathons.length} hackathons.`}
            >
                {filteredHackathons.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {filteredHackathons.map((h) => {
                            const hId = h.hackathonId || h.id;

                            return (
                                <Card
                                    key={hId}
                                    className="group flex flex-col justify-between overflow-hidden border-slate-200/80 bg-white transition hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900"
                                >
                                    <div>
                                        <div className="relative h-36 w-full overflow-hidden bg-slate-900">
                                            {h.bannerUrl ? (
                                                <img
                                                    src={h.bannerUrl}
                                                    alt={h.title}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-800 to-emerald-800 p-4 text-white">
                                                    <h3 className="line-clamp-1 text-base font-bold">{h.title}</h3>
                                                </div>
                                            )}

                                            <div className="absolute top-3 right-3">
                                                <span className="rounded-full border border-white/20 bg-slate-950/50 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur-xs">
                                                    {h.mode || "Hybrid"}
                                                </span>
                                            </div>
                                        </div>

                                        <CardContent className="p-5 space-y-3">
                                            <div>
                                                <h3 className="line-clamp-1 text-base font-bold text-slate-900 dark:text-slate-100">
                                                    {h.title}
                                                </h3>
                                                <p className="text-xs text-indigo-600 font-semibold dark:text-indigo-400">
                                                    Host: {h.organizationName || h.organizerName || "Organizer"}
                                                </p>
                                            </div>

                                            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs text-slate-500 dark:border-slate-800">
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar className="size-3.5 text-slate-400 shrink-0" />
                                                    <span className="truncate">Starts: {formatDate(h.startDate)}</span>
                                                </div>

                                                <div className="flex items-center gap-1.5">
                                                    <MapPin className="size-3.5 text-slate-400 shrink-0" />
                                                    <span className="truncate">{h.location || "Online"}</span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </div>

                                    <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-900/60">
                                        <span className="text-[11px] font-semibold text-slate-500">
                                            ID: #{hId}
                                        </span>

                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDelete(hId)}
                                            disabled={actionLoadingId === hId}
                                            className="text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                                        >
                                            <Trash2 className="mr-1 size-3.5" /> Delete Event
                                        </Button>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                ) : (
                    <Card className="border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
                        <CardContent className="p-8">
                            <EmptyState
                                icon={<CalendarDays className="size-6" />}
                                title="No hackathons found"
                                description="No hackathon events match your search criteria."
                            />
                        </CardContent>
                    </Card>
                )}
            </DashboardSection>
        </div>
    );
}
