import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Building2, CheckCircle2, Globe, Mail, MapPin, Search, ShieldCheck } from "lucide-react";

import { adminService } from "../../services/adminService";
import DashboardSection from "../../components/student-dashboard/DashboardSection";
import { DashboardPageSkeleton, EmptyState } from "../../components/student-dashboard/DashboardStates";
import { Button } from "../../components/ui/Button";
import { Card, CardContent } from "../../components/ui/Card";

export default function AdminOrganizerManagement() {
    const [organizers, setOrganizers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const loadOrganizers = useCallback(async () => {
        try {
            setLoading(true);
            const res = await adminService.getAllOrganizers();
            setOrganizers(Array.isArray(res) ? res : []);
        } catch {
            setOrganizers([]);
            toast.error("Failed to load organizer directory.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadOrganizers();
    }, [loadOrganizers]);

    const filteredOrganizers = useMemo(() => {
        let list = [...organizers];
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            list = list.filter(
                (o) =>
                    (o.organizationName && o.organizationName.toLowerCase().includes(q)) ||
                    (o.fullName && o.fullName.toLowerCase().includes(q)) ||
                    (o.email && o.email.toLowerCase().includes(q)) ||
                    (o.location && o.location.toLowerCase().includes(q))
            );
        }
        return list;
    }, [organizers, searchQuery]);

    if (loading) {
        return <DashboardPageSkeleton />;
    }

    return (
        <div className="space-y-8 pb-16">
            <Card className="overflow-hidden border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
                <CardContent className="p-6 sm:p-8">
                    <div className="space-y-1">
                        <span className="rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-purple-600 dark:bg-purple-950 dark:text-purple-400">
                            Host Directory
                        </span>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
                            Organizer Profile Management
                        </h1>
                        <p className="max-w-2xl text-xs text-slate-500 dark:text-slate-400 leading-5">
                            Review host organization profiles, verification status, contact emails, and locations.
                        </p>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
                <CardContent className="p-4 sm:p-5">
                    <div className="group relative max-w-md">
                        <Search className="pointer-events-none absolute left-3.5 top-3 size-4 text-slate-400 group-focus-within:text-purple-600" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by organization, name, location..."
                            className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-xs text-slate-900 outline-none focus:border-purple-500 focus:bg-white dark:border-slate-800 dark:bg-slate-800 dark:text-slate-100"
                        />
                    </div>
                </CardContent>
            </Card>

            <DashboardSection
                id="organizers-list"
                eyebrow="Organizers"
                title="Registered Organizations"
                description={`Total ${filteredOrganizers.length} organizer profiles.`}
            >
                {filteredOrganizers.length > 0 ? (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredOrganizers.map((org) => (
                            <Card
                                key={org.organizerProfileId || org.userId}
                                className="flex flex-col justify-between border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900"
                            >
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="rounded-full bg-purple-50 px-2.5 py-0.5 text-[10px] font-bold text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                                            {org.organizationType || "Organization"}
                                        </span>

                                        {org.verified ? (
                                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950">
                                                <ShieldCheck className="size-3" /> Verified
                                            </span>
                                        ) : (
                                            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
                                                Pending Review
                                            </span>
                                        )}
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                                            {org.organizationName || org.fullName || "Host Organization"}
                                        </h4>
                                        <p className="text-xs text-slate-500">Lead: {org.fullName}</p>
                                    </div>

                                    <div className="space-y-1 text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
                                        <div className="flex items-center gap-1.5">
                                            <Mail className="size-3.5 text-slate-400 shrink-0" />
                                            <span className="truncate">{org.contactEmail || org.email}</span>
                                        </div>
                                        {org.location && (
                                            <div className="flex items-center gap-1.5">
                                                <MapPin className="size-3.5 text-slate-400 shrink-0" />
                                                <span className="truncate">{org.location}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card className="border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
                        <CardContent className="p-8">
                            <EmptyState
                                icon={<Building2 className="size-6" />}
                                title="No organizer profiles found"
                                description="No organizer profiles match your search."
                            />
                        </CardContent>
                    </Card>
                )}
            </DashboardSection>
        </div>
    );
}
