import { X, Mail, Phone, GraduationCap, Building2, Layers, Globe, FileText, Sparkles, CheckCircle2, ExternalLink } from "lucide-react";
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

    return (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs flex justify-end transition-opacity animate-in fade-in duration-200">
            {/* Backdrop click dismiss */}
            <div className="absolute inset-0" onClick={onClose} />

            {/* Slide-over Drawer Panel */}
            <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col h-full z-10 overflow-y-auto p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                        <Badge variant="purple" className="px-2.5 py-0.5 text-[10px] font-bold">
                            Applicant Profile
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
                    <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 text-xl font-black text-white shadow-md">
                        {initials}
                    </div>
                    <div className="space-y-0.5 min-w-0">
                        <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 truncate">
                            {name}
                        </h3>
                        <p className="text-xs text-slate-500 truncate">{email}</p>
                        <Badge variant="success" className="gap-1 text-[10px] px-2 py-0">
                            <CheckCircle2 className="size-3" /> Confirmed Signup
                        </Badge>
                    </div>
                </div>

                {/* Academic Information */}
                <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Academic Details
                    </h4>
                    <div className="p-4 rounded-2xl bg-slate-50/50 border border-slate-100 dark:bg-slate-800/20 dark:border-slate-800 space-y-3 text-xs">
                        <div className="flex items-start gap-3">
                            <Building2 className="size-4 text-purple-600 shrink-0 mt-0.5" />
                            <div>
                                <span className="text-[11px] font-bold text-slate-400 block">Institution / College</span>
                                <span className="font-semibold text-slate-900 dark:text-slate-100">{student.college || "Not specified"}</span>
                            </div>
                        </div>

                        {student.branch && (
                            <div className="flex items-start gap-3">
                                <GraduationCap className="size-4 text-purple-600 shrink-0 mt-0.5" />
                                <div>
                                    <span className="text-[11px] font-bold text-slate-400 block">Branch & Major</span>
                                    <span className="font-semibold text-slate-900 dark:text-slate-100">{student.branch}</span>
                                </div>
                            </div>
                        )}

                        {student.graduationYear && (
                            <div className="flex items-start gap-3">
                                <Sparkles className="size-4 text-purple-600 shrink-0 mt-0.5" />
                                <div>
                                    <span className="text-[11px] font-bold text-slate-400 block">Graduation Year</span>
                                    <span className="font-semibold text-slate-900 dark:text-slate-100">{student.graduationYear}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Contact & Links */}
                <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Contact & Links
                    </h4>
                    <div className="p-4 rounded-2xl bg-slate-50/50 border border-slate-100 dark:bg-slate-800/20 dark:border-slate-800 space-y-3 text-xs">
                        <div className="flex items-center gap-3">
                            <Mail className="size-4 text-purple-600 shrink-0" />
                            <span className="font-medium text-slate-800 dark:text-slate-200 truncate">{email}</span>
                        </div>

                        {student.phoneNumber && (
                            <div className="flex items-center gap-3">
                                <Phone className="size-4 text-purple-600 shrink-0" />
                                <span className="font-medium text-slate-800 dark:text-slate-200">{student.phoneNumber}</span>
                            </div>
                        )}

                        {student.githubUrl && (
                            <div className="flex items-center gap-3">
                                <Globe className="size-4 text-slate-600 shrink-0" />
                                <a
                                    href={student.githubUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="font-semibold text-purple-600 hover:underline truncate flex items-center gap-1"
                                >
                                    GitHub Profile <ExternalLink className="size-3" />
                                </a>
                            </div>
                        )}

                        {student.linkedinUrl && (
                            <div className="flex items-center gap-3">
                                <Globe className="size-4 text-blue-600 shrink-0" />
                                <a
                                    href={student.linkedinUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="font-semibold text-purple-600 hover:underline truncate flex items-center gap-1"
                                >
                                    LinkedIn Profile <ExternalLink className="size-3" />
                                </a>
                            </div>
                        )}

                        {student.resumeUrl && (
                            <div className="flex items-center gap-3">
                                <FileText className="size-4 text-rose-500 shrink-0" />
                                <a
                                    href={student.resumeUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="font-semibold text-purple-600 hover:underline truncate flex items-center gap-1"
                                >
                                    View Attached Resume <ExternalLink className="size-3" />
                                </a>
                            </div>
                        )}
                    </div>
                </div>

                {/* Team Entry Information */}
                {student.teamName && (
                    <div className="space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                            Team Info
                        </h4>
                        <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100 dark:bg-purple-950/30 dark:border-purple-900/60 flex items-center gap-3">
                            <Layers className="size-5 text-purple-600 shrink-0" />
                            <div>
                                <span className="text-[11px] font-bold text-purple-700 dark:text-purple-300 block">Formed Team</span>
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
                        Close Drawer
                    </Button>
                </div>
            </div>
        </div>
    );
}
