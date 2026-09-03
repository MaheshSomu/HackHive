import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Building2, Mail, MapPin, Search, ShieldCheck, ShieldOff } from "lucide-react";

import { adminService } from "../../services/adminService";
import DashboardSection from "../../components/student-dashboard/DashboardSection";
import { DashboardPageSkeleton, EmptyState } from "../../components/student-dashboard/DashboardStates";
import { Button } from "../../components/ui/Button";
import { Card, CardContent } from "../../components/ui/Card";
import { Modal } from "../../components/ui/Modal";

export default function AdminOrganizerManagement() {
    const [organizers, setOrganizers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [actionLoadingId, setActionLoadingId] = useState(null);
    const [confirmModal, setConfirmModal] = useState(null); // { organizer, type: 'verify' | 'unverify' }

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

    const handleOpenConfirm = (organizer, type) => {
        setConfirmModal({ organizer, type });
    };

    const handleConfirmAction = async () => {
        if (!confirmModal || !confirmModal.organizer) return;
        const { organizer, type } = confirmModal;
        const profileId = organizer.organizerProfileId;

        if (actionLoadingId === profileId) return;

        try {
            setActionLoadingId(profileId);
            if (type === "verify") {
                const updated = await adminService.verifyOrganizer(profileId);
                setOrganizers((prev) =>
                    prev.map((o) =>
                        o.organizerProfileId === profileId
                            ? { ...o, ...updated, verified: true }
                            : o
                    )
                );
                toast.success("Organizer verified successfully.");
            } else {
                const updated = await adminService.unverifyOrganizer(profileId);
                setOrganizers((prev) =>
                    prev.map((o) =>
                        o.organizerProfileId === profileId
                            ? { ...o, ...updated, verified: false }
                            : o
                    )
                );
                toast.success("Organizer verification revoked.");
            }
            setConfirmModal(null);
        } catch (err) {
            const errorMsg =
                err?.response?.data?.message ||
                (type === "verify"
                    ? "Failed to verify organizer."
                    : "Failed to revoke organizer verification.");
            toast.error(errorMsg);
        } finally {
            setActionLoadingId(null);
        }
    };

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

    const isProcessingConfirm = actionLoadingId !== null && confirmModal?.organizer?.organizerProfileId === actionLoadingId;

    return (
        <div className="space-y-8 pb-16">
            <Card className="overflow-hidden border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
                <CardContent className="p-6 sm:p-8">
                    <div className="space-y-1">
                        <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-blue-700 dark:bg-blue-950 dark:text-blue-300">
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
                        <Search className="pointer-events-none absolute left-3.5 top-3 size-4 text-slate-400 group-focus-within:text-blue-600" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by organization, name, location..."
                            className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-xs text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:bg-white dark:border-slate-800 dark:bg-slate-800 dark:text-slate-100"
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
                        {filteredOrganizers.map((org) => {
                            const isBusy = actionLoadingId === org.organizerProfileId;
                            return (
                                <Card
                                    key={org.organizerProfileId || org.userId}
                                    className="flex flex-col justify-between border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900"
                                >
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                                {org.organizationType || "Organization"}
                                            </span>

                                            {org.verified ? (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200/60 dark:border-blue-900/40">
                                                    <ShieldCheck className="size-3 text-blue-600 dark:text-blue-400" /> Verified Host
                                                </span>
                                            ) : (
                                                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
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

                                    {/* Action Footer */}
                                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                                        {org.verified ? (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleOpenConfirm(org, "unverify")}
                                                disabled={isBusy}
                                                className="text-xs font-semibold text-slate-600 hover:text-rose-600 hover:bg-rose-50 dark:text-slate-300 dark:hover:text-rose-400 dark:hover:bg-rose-950/40"
                                            >
                                                <ShieldOff className="mr-1.5 size-3.5 text-rose-500" /> Revoke Verification
                                            </Button>
                                        ) : (
                                            <Button
                                                type="button"
                                                size="sm"
                                                onClick={() => handleOpenConfirm(org, "verify")}
                                                disabled={isBusy}
                                                className="rounded-xl bg-blue-600 text-xs font-bold text-white hover:bg-blue-500 shadow-xs active:bg-blue-700"
                                            >
                                                <ShieldCheck className="mr-1.5 size-3.5" /> Verify Host
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
                                icon={<Building2 className="size-6" />}
                                title="No organizer profiles found"
                                description="No organizer profiles match your search."
                            />
                        </CardContent>
                    </Card>
                )}
            </DashboardSection>

            {/* Confirmation Dialog */}
            <Modal
                isOpen={Boolean(confirmModal)}
                onClose={() => !isProcessingConfirm && setConfirmModal(null)}
                title={confirmModal?.type === "verify" ? "Verify Organizer?" : "Revoke Verification?"}
                description={
                    confirmModal?.type === "verify"
                        ? "This will mark this organizer as a verified HackHive host and display the Verified Host badge to users."
                        : "This will remove the HackHive Verified Host badge from this organizer."
                }
                maxWidth="max-w-md"
                footer={
                    <>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setConfirmModal(null)}
                            disabled={isProcessingConfirm}
                            className="text-xs font-semibold rounded-xl border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            size="sm"
                            disabled={isProcessingConfirm}
                            isLoading={isProcessingConfirm}
                            onClick={handleConfirmAction}
                            className={
                                confirmModal?.type === "verify"
                                    ? "rounded-xl bg-blue-600 text-xs font-bold text-white hover:bg-blue-500 shadow-xs active:bg-blue-700"
                                    : "rounded-xl bg-rose-600 text-xs font-bold text-white hover:bg-rose-500 shadow-xs active:bg-rose-700"
                            }
                        >
                            {confirmModal?.type === "verify" ? "Verify Host" : "Revoke Verification"}
                        </Button>
                    </>
                }
            >
                <div className="py-2">
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                        Target Organization:{" "}
                        <strong className="text-slate-900 dark:text-slate-100 font-bold">
                            {confirmModal?.organizer?.organizationName || confirmModal?.organizer?.fullName || "Organizer"}
                        </strong>
                    </p>
                </div>
            </Modal>
        </div>
    );
}
