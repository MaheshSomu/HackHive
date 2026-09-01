import { X, Mail, Phone, GraduationCap, Building2, Layers, Globe, FileText, Sparkles, CheckCircle2, ExternalLink, Users, CreditCard } from "lucide-react";
import { Badge } from "../../ui/Badge";
import { Button } from "../../ui/Button";

export default function RegistrationDrawer({ isOpen, onClose, student }) {
    if (!isOpen || !student) return null;

    const name = student.fullName || student.studentName || "Student Applicant";
    const email = student.email || student.studentEmail || "N/A";
    const initials = name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    const participantCount = student.participantCount || 1;
    const members = Array.isArray(student.members) ? student.members : [];

    return (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs flex justify-end transition-opacity animate-in fade-in duration-200">
            {/* Backdrop click dismiss */}
            <div className="absolute inset-0" onClick={onClose} />

            {/* Slide-over Drawer Panel */}
            <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col h-full z-10 overflow-y-auto p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                        <Badge variant="navy" className="px-2.5 py-0.5 text-[10px] font-bold">
                            Applicant & Registration Details
                        </Badge>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
                    >
                        <X className="size-4" />
                    </button>
                </div>

                {/* Profile Hero Header */}
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50/80 border border-slate-200/60 dark:bg-slate-800/40 dark:border-slate-800">
                    <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-xl font-black text-white shadow-md">
                        {initials}
                    </div>
                    <div className="space-y-0.5 min-w-0">
                        <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 truncate">
                            {name}
                        </h3>
                        <p className="text-xs text-slate-500 truncate">{email}</p>
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                            <Badge variant={student.registrationStatus === "CONFIRMED" || !student.registrationStatus ? "success" : "warning"} className="gap-1 text-[10px] px-2 py-0">
                                <CheckCircle2 className="size-3" /> {student.registrationStatus || "CONFIRMED"}
                            </Badge>
                            <Badge variant="secondary" className="text-[10px] px-2 py-0">
                                {participantCount > 1 ? `${participantCount} Participants` : "Individual Entry"}
                            </Badge>
                        </div>
                    </div>
                </div>

                {/* Registration & Payment Info */}
                <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Registration & Payment Overview
                    </h4>
                    <div className="p-4 rounded-2xl bg-slate-50/50 border border-slate-100 dark:bg-slate-800/20 dark:border-slate-800 space-y-2 text-xs">
                        <div className="flex justify-between items-center">
                            <span className="text-slate-500 font-medium">Application Registration ID:</span>
                            <span className="font-bold text-slate-900 dark:text-slate-100">
                                #{student.registrationId || student.id || "N/A"}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-slate-500 font-medium">Registration Type:</span>
                            <span className="font-bold text-slate-900 dark:text-slate-100">
                                {student.registrationType || "FREE"}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-slate-500 font-medium">Registration Status:</span>
                            <span className={`font-bold ${student.registrationStatus === "CONFIRMED" || !student.registrationStatus ? "text-emerald-600" : "text-amber-600"}`}>
                                {student.registrationStatus || "CONFIRMED"}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-slate-500 font-medium">Payment Status:</span>
                            <span className={`font-bold ${student.paymentStatus === "PAID" ? "text-indigo-600" : student.paymentStatus === "PENDING" ? "text-amber-600" : "text-slate-600"}`}>
                                {student.paymentStatus || "NOT_APPLICABLE"}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-slate-500 font-medium">Amount Paid:</span>
                            <span className="font-extrabold text-slate-900 dark:text-slate-100">
                                ₹{student.amountPaid != null ? student.amountPaid : 0}
                            </span>
                        </div>
                        {student.paidAt && (
                            <div className="flex justify-between items-center">
                                <span className="text-slate-500 font-medium">Paid Timestamp:</span>
                                <span className="font-medium text-slate-700 dark:text-slate-300">
                                    {new Date(student.paidAt).toLocaleString()}
                                </span>
                            </div>
                        )}
                        {student.registrationType === "PAID" && (
                            <>
                                <div className="flex justify-between items-center border-t border-slate-100 pt-2 dark:border-slate-800">
                                    <span className="text-slate-500 font-medium">Razorpay Order ID:</span>
                                    <span className="font-mono text-[11px] text-slate-700 dark:text-slate-300">
                                        {student.razorpayOrderId || "Not available"}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-500 font-medium">Razorpay Payment ID:</span>
                                    <span className="font-mono text-[11px] text-indigo-600 font-bold">
                                        {student.razorpayPaymentId || "Not available"}
                                    </span>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Primary Participant Information */}
                <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Primary Participant Details
                    </h4>
                    <div className="p-4 rounded-2xl bg-slate-50/50 border border-slate-100 dark:bg-slate-800/20 dark:border-slate-800 space-y-3 text-xs">
                        <div className="flex items-center gap-3">
                            <Mail className="size-4 text-blue-600 shrink-0" />
                            <span className="font-semibold text-slate-900 dark:text-slate-100 truncate">{email}</span>
                        </div>

                        {student.phoneNumber && (
                            <div className="flex items-center gap-3">
                                <Phone className="size-4 text-blue-600 shrink-0" />
                                <span className="font-medium text-slate-800 dark:text-slate-200">{student.phoneNumber}</span>
                            </div>
                        )}

                        <div className="flex items-start gap-3">
                            <Building2 className="size-4 text-blue-600 shrink-0 mt-0.5" />
                            <div>
                                <span className="text-[11px] font-bold text-slate-400 block">Institution / College</span>
                                <span className="font-semibold text-slate-900 dark:text-slate-100">{student.college || "Not specified"}</span>
                            </div>
                        </div>

                        {student.branch && (
                            <div className="flex items-start gap-3">
                                <GraduationCap className="size-4 text-blue-600 shrink-0 mt-0.5" />
                                <div>
                                    <span className="text-[11px] font-bold text-slate-400 block">Branch & Department</span>
                                    <span className="font-semibold text-slate-900 dark:text-slate-100">{student.branch}</span>
                                </div>
                            </div>
                        )}

                        {student.graduationYear && (
                            <div className="flex items-start gap-3">
                                <Sparkles className="size-4 text-blue-600 shrink-0 mt-0.5" />
                                <div>
                                    <span className="text-[11px] font-bold text-slate-400 block">Graduation Year</span>
                                    <span className="font-semibold text-slate-900 dark:text-slate-100">{student.graduationYear}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Team / All Registered Members List */}
                {members.length > 0 && (
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                Participating Members ({members.length})
                            </h4>
                        </div>

                        <div className="space-y-2">
                            {members.map((m, idx) => {
                                const isHackHiveMember = Boolean(m.isHackHiveMember || m.studentProfileId || m.isPrimary);
                                return (
                                    <div
                                        key={m.id || idx}
                                        className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs dark:bg-slate-800/40 dark:border-slate-800 space-y-1.5 text-xs"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="font-bold text-slate-900 dark:text-slate-100">
                                                {m.fullName}
                                            </span>
                                            <div className="flex items-center gap-1">
                                                {m.isPrimary && (
                                                    <span className="rounded bg-blue-100 px-2 py-0.5 text-[9px] font-bold text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                                                        Primary
                                                    </span>
                                                )}
                                                {isHackHiveMember ? (
                                                    <span className="rounded bg-emerald-100 px-2 py-0.5 text-[9px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                                                        ✓ HackHive Member
                                                    </span>
                                                ) : (
                                                    <span className="rounded bg-slate-100 px-2 py-0.5 text-[9px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                                                        External Participant
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <p className="text-[11px] text-slate-500 font-medium">{m.email}</p>
                                        <div className="flex flex-wrap gap-2 text-[10px] text-slate-400 pt-0.5">
                                            {m.college && <span>College: {m.college}</span>}
                                            {m.branch && <span>• Branch: {m.branch}</span>}
                                            {m.graduationYear && <span>• Grad: {m.graduationYear}</span>}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Team Entry Information */}
                {student.teamName && (
                    <div className="space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                            Team Workspace Info
                        </h4>
                        <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 dark:bg-blue-950/30 dark:border-blue-900/60 flex items-center gap-3">
                            <Layers className="size-5 text-blue-600 shrink-0" />
                            <div>
                                <span className="text-[11px] font-bold text-blue-700 dark:text-blue-300 block">Formed Workspace</span>
                                <span className="text-sm font-extrabold text-slate-900 dark:text-slate-100">{student.teamName}</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Footer Action */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-auto">
                    <Button
                        type="button"
                        onClick={onClose}
                        className="w-full bg-slate-900 text-white dark:bg-slate-800 hover:bg-slate-800 text-xs font-bold py-2.5 rounded-xl"
                    >
                        Close Details
                    </Button>
                </div>
            </div>
        </div>
    );
}
