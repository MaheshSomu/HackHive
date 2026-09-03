import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, GraduationCap, Search, UserCheck, UserX } from "lucide-react";

import { adminService } from "../../services/adminService";
import DashboardSection from "../../components/student-dashboard/DashboardSection";
import { DashboardPageSkeleton, EmptyState } from "../../components/student-dashboard/DashboardStates";
import { Button } from "../../components/ui/Button";
import { Card, CardContent } from "../../components/ui/Card";

export default function AdminStudentManagement() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [actionLoadingId, setActionLoadingId] = useState(null);

    const loadStudents = useCallback(async () => {
        try {
            setLoading(true);
            const res = await adminService.getUsersByRole("STUDENT");
            setStudents(Array.isArray(res) ? res : []);
        } catch {
            setStudents([]);
            toast.error("Failed to load student directory.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadStudents();
    }, [loadStudents]);

    const handleEnable = async (id) => {
        try {
            setActionLoadingId(id);
            const updated = await adminService.enableUser(id);
            setStudents((prev) => prev.map((s) => (s.userId === id ? updated : s)));
            toast.success("Student account enabled.");
        } catch {
            toast.error("Failed to enable student.");
        } finally {
            setActionLoadingId(null);
        }
    };

    const handleDisable = async (id) => {
        try {
            setActionLoadingId(id);
            const updated = await adminService.disableUser(id);
            setStudents((prev) => prev.map((s) => (s.userId === id ? updated : s)));
            toast.success("Student account disabled.");
        } catch {
            toast.error("Failed to disable student.");
        } finally {
            setActionLoadingId(null);
        }
    };

    const filteredStudents = useMemo(() => {
        let list = [...students];
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            list = list.filter(
                (s) =>
                    (s.fullName && s.fullName.toLowerCase().includes(q)) ||
                    (s.email && s.email.toLowerCase().includes(q))
            );
        }
        return list;
    }, [students, searchQuery]);

    if (loading) {
        return <DashboardPageSkeleton />;
    }

    return (
        <div className="space-y-8 pb-16">
            <Card className="overflow-hidden border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
                <CardContent className="p-6 sm:p-8">
                    <div className="space-y-1">
                        <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                            Student Directory
                        </span>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
                            Student Management
                        </h1>
                        <p className="max-w-2xl text-xs text-slate-500 dark:text-slate-400 leading-5">
                            Browse all enrolled student accounts across colleges and universities.
                        </p>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
                <CardContent className="p-4 sm:p-5">
                    <div className="group relative max-w-md">
                        <Search className="pointer-events-none absolute left-3.5 top-3 size-4 text-slate-400 group-focus-within:text-blue-600" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search students by name or email..."
                            className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-xs text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:bg-white dark:border-slate-800 dark:bg-slate-800 dark:text-slate-100"
                        />
                    </div>
                </CardContent>
            </Card>

            <DashboardSection
                id="students-list"
                eyebrow="Students"
                title="Registered Students"
                description={`Total ${filteredStudents.length} student accounts.`}
            >
                {filteredStudents.length > 0 ? (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredStudents.map((st) => {
                            const initials = (st.fullName || st.email || "S")[0].toUpperCase();
                            const isEnabled = Boolean(st.enabled);

                            return (
                                <Card
                                    key={st.userId}
                                    className="flex flex-col justify-between border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900"
                                >
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                                                STUDENT
                                            </span>
                                            {isEnabled ? (
                                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                                                    <CheckCircle2 className="size-3" /> Active
                                                </span>
                                            ) : (
                                                <span className="text-[10px] font-bold text-rose-500">Disabled</span>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-blue-600 font-bold text-xs text-white">
                                                {initials}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <h4 className="truncate text-xs font-bold text-slate-900 dark:text-slate-100">
                                                    {st.fullName || "Student Account"}
                                                </h4>
                                                <p className="truncate text-[11px] text-slate-500">{st.email}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                                        {isEnabled ? (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDisable(st.userId)}
                                                disabled={actionLoadingId === st.userId}
                                                className="text-xs font-semibold text-rose-600 hover:bg-rose-50"
                                            >
                                                <UserX className="mr-1 size-3.5" /> Disable
                                            </Button>
                                        ) : (
                                            <Button
                                                type="button"
                                                size="sm"
                                                onClick={() => handleEnable(st.userId)}
                                                disabled={actionLoadingId === st.userId}
                                                className="rounded-xl bg-emerald-600 text-xs font-bold text-white hover:bg-emerald-500"
                                            >
                                                <UserCheck className="mr-1 size-3.5" /> Enable
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
                                icon={<GraduationCap className="size-6" />}
                                title="No student accounts found"
                                description="No student accounts match your filter."
                            />
                        </CardContent>
                    </Card>
                )}
            </DashboardSection>
        </div>
    );
}
