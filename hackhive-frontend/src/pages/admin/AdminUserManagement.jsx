import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, Search, Shield, UserCheck, UserX, Users } from "lucide-react";

import { adminService } from "../../services/adminService";
import DashboardSection from "../../components/student-dashboard/DashboardSection";
import { DashboardPageSkeleton, EmptyState } from "../../components/student-dashboard/DashboardStates";
import { Button } from "../../components/ui/Button";
import { Card, CardContent } from "../../components/ui/Card";
import HackHiveSelect from "../../components/ui/HackHiveSelect";

export default function AdminUserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoadingId, setActionLoadingId] = useState(null);

    // Filters
    const [searchQuery, setSearchQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState("ALL");
    const [statusFilter, setStatusFilter] = useState("ALL");

    const loadUsers = useCallback(async () => {
        try {
            setLoading(true);
            const res = await adminService.getAllUsers();
            setUsers(Array.isArray(res) ? res : []);
        } catch {
            setUsers([]);
            toast.error("Failed to load platform users.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    const handleEnableUser = async (userId) => {
        try {
            setActionLoadingId(userId);
            const updated = await adminService.enableUser(userId);
            setUsers((prev) => prev.map((u) => (u.userId === userId ? updated : u)));
            toast.success("User account enabled successfully.");
        } catch {
            toast.error("Failed to enable user account.");
        } finally {
            setActionLoadingId(null);
        }
    };

    const handleDisableUser = async (userId) => {
        try {
            setActionLoadingId(userId);
            const updated = await adminService.disableUser(userId);
            setUsers((prev) => prev.map((u) => (u.userId === userId ? updated : u)));
            toast.success("User account disabled.");
        } catch {
            toast.error("Failed to disable user account.");
        } finally {
            setActionLoadingId(null);
        }
    };

    const filteredUsers = useMemo(() => {
        let list = [...users];

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            list = list.filter(
                (u) =>
                    (u.fullName && u.fullName.toLowerCase().includes(q)) ||
                    (u.email && u.email.toLowerCase().includes(q)) ||
                    (u.role && u.role.toLowerCase().includes(q))
            );
        }

        if (roleFilter !== "ALL") {
            list = list.filter((u) => (u.role || "").toUpperCase() === roleFilter);
        }

        if (statusFilter === "ENABLED") {
            list = list.filter((u) => Boolean(u.enabled));
        } else if (statusFilter === "DISABLED") {
            list = list.filter((u) => !u.enabled);
        }

        return list;
    }, [users, searchQuery, roleFilter, statusFilter]);

    if (loading) {
        return <DashboardPageSkeleton />;
    }

    return (
        <div className="space-y-8 pb-16">
            {/* Header Hero */}
            <Card className="overflow-hidden border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
                <CardContent className="p-6 sm:p-8">
                    <div className="space-y-1">
                        <span className="rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-rose-600 dark:bg-rose-950 dark:text-rose-400">
                            User Governance
                        </span>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
                            User Account Management
                        </h1>
                        <p className="max-w-2xl text-xs text-slate-500 dark:text-slate-400 leading-5">
                            Inspect registered platform users, view assigned roles, and manage account authorization status.
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Search & Filters */}
            <Card className="border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
                <CardContent className="p-4 sm:p-5">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div className="group relative flex-1 max-w-md">
                            <Search className="pointer-events-none absolute left-3.5 top-3 size-4 text-slate-400 group-focus-within:text-rose-600" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search user by name, email, or role..."
                                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-xs text-slate-900 outline-none focus:border-rose-500 focus:bg-white dark:border-slate-800 dark:bg-slate-800 dark:text-slate-100"
                            />
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs">
                            <div className="w-36">
                                <HackHiveSelect
                                    value={roleFilter}
                                    onChange={(e) => setRoleFilter(e.target.value)}
                                    options={[
                                        { value: "ALL", label: "All Roles" },
                                        { value: "STUDENT", label: "Student" },
                                        { value: "ORGANIZER", label: "Organizer" },
                                        { value: "ADMIN", label: "Admin" },
                                    ]}
                                    size="sm"
                                />
                            </div>

                            <div className="w-36">
                                <HackHiveSelect
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    options={[
                                        { value: "ALL", label: "All Statuses" },
                                        { value: "ENABLED", label: "Enabled" },
                                        { value: "DISABLED", label: "Disabled" },
                                    ]}
                                    size="sm"
                                />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Users Grid */}
            <DashboardSection
                id="users-list"
                eyebrow="Registry"
                title="System Accounts"
                description={`Showing ${filteredUsers.length} platform users.`}
            >
                {filteredUsers.length > 0 ? (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredUsers.map((u) => {
                            const initials = (u.fullName || u.email || "U")[0].toUpperCase();
                            const isEnabled = Boolean(u.enabled);

                            return (
                                <Card
                                    key={u.userId}
                                    className="flex flex-col justify-between border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900"
                                >
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300 uppercase">
                                                {u.role}
                                            </span>

                                            {isEnabled ? (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                                                    <CheckCircle2 className="size-3" /> Active
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                                                    Disabled
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-slate-900 font-bold text-xs text-white dark:bg-rose-600">
                                                {initials}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <h4 className="truncate text-xs font-bold text-slate-900 dark:text-slate-100">
                                                    {u.fullName || "Registered User"}
                                                </h4>
                                                <p className="truncate text-[11px] text-slate-500">{u.email}</p>
                                            </div>
                                        </div>

                                        {u.phoneNumber && (
                                            <p className="text-[11px] text-slate-400">Phone: {u.phoneNumber}</p>
                                        )}
                                    </div>

                                    {/* Action footer */}
                                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                                        {isEnabled ? (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDisableUser(u.userId)}
                                                disabled={actionLoadingId === u.userId}
                                                className="text-xs font-semibold text-rose-600 hover:bg-rose-50"
                                            >
                                                <UserX className="mr-1 size-3.5" /> Disable User
                                            </Button>
                                        ) : (
                                            <Button
                                                type="button"
                                                size="sm"
                                                onClick={() => handleEnableUser(u.userId)}
                                                disabled={actionLoadingId === u.userId}
                                                className="rounded-xl bg-emerald-600 text-xs font-bold text-white hover:bg-emerald-500"
                                            >
                                                <UserCheck className="mr-1 size-3.5" /> Enable User
                                            </Button>
                                        )}
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                ) : (
                    <Card className="border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
                        <CardContent className="p-8">
                            <EmptyState
                                icon={<Users className="size-6" />}
                                title="No users found"
                                description="No platform user accounts matched your search criteria."
                            />
                        </CardContent>
                    </Card>
                )}
            </DashboardSection>
        </div>
    );
}
