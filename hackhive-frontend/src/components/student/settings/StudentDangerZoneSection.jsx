import { useState } from "react";
import { toast } from "sonner";
import { AlertTriangle, LogOut, UserX, ShieldAlert } from "lucide-react";
import { Button } from "../../ui/Button";
import { ConfirmModal } from "../../ui/ConfirmModal";
import useAuth from "../../../hooks/useAuth";
import { studentProfileService } from "../../../services/studentProfileService";
import { getApiErrorMessage } from "../../../utils/apiError";

export default function StudentDangerZoneSection() {
    const { logout } = useAuth();

    // Modal state controls
    const [logoutModalOpen, setLogoutModalOpen] = useState(false);
    const [deactivateModalOpen, setDeactivateModalOpen] = useState(false);
    const [isDeactivating, setIsDeactivating] = useState(false);

    const handleConfirmLogout = () => {
        setLogoutModalOpen(false);
        toast.info("Signing out of your HackHive student session...");
        setTimeout(() => {
            logout();
        }, 300);
    };

    const handleConfirmDeactivateAccount = async () => {
        setIsDeactivating(true);
        try {
            await studentProfileService.deactivateAccount();
            toast.success("Your student account has been deactivated.");
            setDeactivateModalOpen(false);
            setTimeout(() => {
                logout();
            }, 500);
        } catch (err) {
            console.error("Failed to deactivate account:", err);
            toast.error(getApiErrorMessage(err, "Failed to deactivate account. Please try again."));
        } finally {
            setIsDeactivating(false);
        }
    };

    return (
        <>
            <div className="rounded-3xl border border-rose-200 bg-rose-50/40 p-6 shadow-xs dark:border-rose-900/50 dark:bg-rose-950/20 space-y-6">
                <div className="border-b border-rose-100 pb-4 dark:border-rose-900/60">
                    <div className="flex items-center gap-2">
                        <AlertTriangle className="size-5 text-rose-600 dark:text-rose-400" />
                        <h3 className="text-lg font-bold text-rose-950 dark:text-rose-200">Danger Zone</h3>
                    </div>
                    <p className="text-xs text-rose-700/80 dark:text-rose-300/80 mt-1">
                        Irreversible account management actions and session termination security controls.
                    </p>
                </div>

                <div className="space-y-4 max-w-2xl">
                    {/* Logout / Session Action */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-rose-200/80 dark:bg-slate-900 dark:border-rose-900/40">
                        <div className="flex items-center gap-3">
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
                                <LogOut className="size-5" />
                            </div>
                            <div className="space-y-0.5">
                                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                                    Sign Out Active Sessions
                                </h4>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                                    End current browser session and clear stored local authentication tokens.
                                </p>
                            </div>
                        </div>

                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setLogoutModalOpen(true)}
                            className="border-amber-200 text-amber-800 hover:bg-amber-50 dark:border-amber-900/60 dark:text-amber-300 dark:hover:bg-amber-950/40 font-bold text-xs shrink-0"
                        >
                            Sign Out Session
                        </Button>
                    </div>

                    {/* Deactivate Account Action */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-rose-200/80 dark:bg-slate-900 dark:border-rose-900/40">
                        <div className="flex items-center gap-3">
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-600 dark:bg-rose-950/80 dark:text-rose-400">
                                <UserX className="size-5" />
                            </div>
                            <div className="space-y-0.5">
                                <h4 className="text-xs font-bold text-rose-950 dark:text-rose-200">
                                    Deactivate Student Account
                                </h4>
                                <p className="text-[11px] text-rose-700/80 dark:text-rose-300/80 font-medium">
                                    Disable your account login and terminate active workspace sessions.
                                </p>
                            </div>
                        </div>

                        <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => setDeactivateModalOpen(true)}
                            className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shrink-0 gap-1.5"
                        >
                            <UserX className="size-3.5" />
                            Deactivate Account
                        </Button>
                    </div>

                    {/* Warning Notice Box */}
                    <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-rose-100/60 border border-rose-200 dark:bg-rose-950/40 dark:border-rose-900/60 text-rose-900 dark:text-rose-200 text-xs">
                        <ShieldAlert className="size-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                        <p className="leading-relaxed text-[11px] font-medium">
                            Account deactivation disables login access immediately while retaining hackathon event integrity and submission records for organizers and teammates.
                        </p>
                    </div>
                </div>
            </div>

            {/* Logout Confirmation Modal */}
            <ConfirmModal
                isOpen={logoutModalOpen}
                onClose={() => setLogoutModalOpen(false)}
                onConfirm={handleConfirmLogout}
                title="Sign Out of Session?"
                description="Are you sure you want to sign out? You will need to log back in with your credentials to access your student dashboard."
                confirmText="Sign Out"
                cancelText="Cancel"
                isDanger={false}
            />

            {/* Account Deactivation Confirmation Modal */}
            <ConfirmModal
                isOpen={deactivateModalOpen}
                onClose={() => setDeactivateModalOpen(false)}
                onConfirm={handleConfirmDeactivateAccount}
                title="Deactivate Student Account?"
                description="Deactivating your account will disable your login access and terminate active sessions immediately. Your profile details, event registrations, and hackathon history will be retained securely for event integrity. Are you sure you want to proceed?"
                confirmText="Deactivate Account"
                cancelText="Cancel"
                isDanger={true}
                isLoading={isDeactivating}
            />
        </>
    );
}
