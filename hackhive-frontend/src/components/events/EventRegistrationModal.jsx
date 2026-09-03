import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
    Building2,
    Calendar,
    CheckCircle2,
    GraduationCap,
    Info,
    Loader2,
    Mail,
    Phone,
    Shield,
    Sparkles,
    User,
    UserCheck,
    UserPlus,
    Users,
    X,
} from "lucide-react";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { studentProfileService } from "../../services/studentProfileService";

export default function EventRegistrationModal({
    event,
    isOpen,
    onClose,
    onSubmit,
    loading = false,
    authUser,
}) {
    const [profile, setProfile] = useState(null);
    const [profileLoading, setProfileLoading] = useState(false);

    // Primary Participant Form State
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [college, setCollege] = useState("");
    const [branch, setBranch] = useState("");
    const [graduationYear, setGraduationYear] = useState("");

    // Team / Member Count State
    const [participantCount, setParticipantCount] = useState(1);
    const [members, setMembers] = useState([]);
    const [errorMsg, setErrorMsg] = useState("");

    const maxTeamSize = Math.max(1, event?.maxTeamSize || 1);
    const isTeamAllowed = maxTeamSize > 1;
    const isPaid = event?.registrationType === "PAID" && Number(event?.registrationFee) > 0;

    // Fetch Student Profile to pre-fill primary participant data
    useEffect(() => {
        if (!isOpen) return;

        let isMounted = true;
        const loadProfile = async () => {
            try {
                setProfileLoading(true);
                const p = await studentProfileService.getMyProfile();
                if (isMounted) {
                    setProfile(p);
                    setFullName(p.fullName || authUser?.fullName || "");
                    setEmail(p.email || authUser?.email || "");
                    setCollege(p.college || "");
                    setBranch(p.branch || "");
                    setGraduationYear(p.graduationYear || "");
                }
            } catch {
                if (isMounted) {
                    setFullName(authUser?.fullName || "");
                    setEmail(authUser?.email || "");
                }
            } finally {
                if (isMounted) setProfileLoading(false);
            }
        };

        loadProfile();
        setParticipantCount(1);
        setMembers([]);
        setErrorMsg("");

        return () => {
            isMounted = false;
        };
    }, [isOpen, authUser, event]);

    // Handle Participant Count change
    const handleParticipantCountChange = (newCount) => {
        const count = Math.max(1, Math.min(maxTeamSize, Number(newCount)));
        setParticipantCount(count);

        const neededAdditionalMembers = count - 1;
        setMembers((prev) => {
            const next = [...prev];
            while (next.length < neededAdditionalMembers) {
                next.push({
                    fullName: "",
                    email: "",
                    college: college || "",
                    branch: "",
                    graduationYear: "",
                    lookupStatus: "idle", // 'idle' | 'loading' | 'found' | 'not_found'
                    foundProfile: null,
                    isConfirmedMember: false,
                    studentProfileId: null,
                });
            }
            return next.slice(0, neededAdditionalMembers);
        });
    };

    // Update specific member field
    const handleMemberChange = (index, field, value) => {
        setMembers((prev) => {
            const next = [...prev];
            next[index] = { ...next[index], [field]: value };
            return next;
        });
    };

    // Check HackHive member lookup when email loses focus
    const handleMemberEmailBlur = async (index, memberEmail) => {
        const trimmedEmail = memberEmail ? memberEmail.trim() : "";
        if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
            return;
        }

        // Set lookup loading state
        setMembers((prev) => {
            const next = [...prev];
            next[index] = {
                ...next[index],
                lookupStatus: "loading",
            };
            return next;
        });

        try {
            const res = await studentProfileService.lookupStudentByEmail(trimmedEmail);
            setMembers((prev) => {
                const next = [...prev];
                if (res && res.exists) {
                    next[index] = {
                        ...next[index],
                        lookupStatus: "found",
                        foundProfile: res,
                    };
                } else {
                    next[index] = {
                        ...next[index],
                        lookupStatus: "not_found",
                        foundProfile: null,
                        studentProfileId: null,
                        isConfirmedMember: false,
                    };
                }
                return next;
            });
        } catch {
            setMembers((prev) => {
                const next = [...prev];
                next[index] = {
                    ...next[index],
                    lookupStatus: "not_found",
                    foundProfile: null,
                    studentProfileId: null,
                    isConfirmedMember: false,
                };
                return next;
            });
        }
    };

    // Confirm & Apply HackHive Member Profile
    const handleApplyMemberProfile = (index, foundProfile) => {
        if (!foundProfile) return;
        setMembers((prev) => {
            const next = [...prev];
            next[index] = {
                ...next[index],
                fullName: foundProfile.fullName || next[index].fullName,
                email: foundProfile.email || next[index].email,
                college: foundProfile.college || next[index].college || college,
                branch: foundProfile.branch || next[index].branch,
                graduationYear: foundProfile.graduationYear || next[index].graduationYear,
                studentProfileId: foundProfile.studentProfileId,
                isConfirmedMember: true,
            };
            return next;
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrorMsg("");

        // Validations
        if (!fullName.trim()) {
            setErrorMsg("Full Name is required.");
            return;
        }
        if (!email.trim()) {
            setErrorMsg("Email address is required.");
            return;
        }
        if (!phoneNumber.trim()) {
            setErrorMsg("Phone Number is required.");
            return;
        }

        // Validate Additional Members
        if (participantCount > 1) {
            for (let i = 0; i < participantCount - 1; i++) {
                const m = members[i];
                if (!m || !m.fullName.trim()) {
                    setErrorMsg(`Full Name is required for Member #${i + 2}.`);
                    return;
                }
                if (!m || !m.email.trim()) {
                    setErrorMsg(`Email Address is required for Member #${i + 2}.`);
                    return;
                }
            }
        }

        const payload = {
            fullName: fullName.trim(),
            email: email.trim(),
            phoneNumber: phoneNumber.trim(),
            college: college.trim(),
            branch: branch.trim(),
            graduationYear: graduationYear.trim(),
            participantCount,
            members: participantCount > 1 ? members.map((m) => ({
                fullName: m.fullName.trim(),
                email: m.email.trim(),
                college: m.college.trim() || college.trim(),
                branch: m.branch.trim(),
                graduationYear: m.graduationYear.trim(),
                studentProfileId: m.studentProfileId || null,
                isPrimary: false,
            })) : [],
        };

        onSubmit(payload);
    };

    if (!isOpen || !event) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
                />

                {/* Dialog Panel */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 15 }}
                    transition={{ duration: 0.2 }}
                    className="relative flex flex-col w-full max-w-2xl max-h-[90vh] rounded-3xl border border-slate-200 bg-white shadow-2xl overflow-hidden dark:border-slate-800 dark:bg-slate-900 z-10"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">
                        <div className="flex items-center gap-2">
                            <Badge variant="purple" className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                                Event Registration Form
                            </Badge>
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                        >
                            <X className="size-4" />
                        </button>
                    </div>

                    {/* Form Content */}
                    <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-y-auto">
                        <div className="p-6 space-y-6 flex-1">
                            {/* Event Overview Box */}
                            <div className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4 dark:border-indigo-950 dark:bg-indigo-950/30 space-y-2">
                                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                                    {event.title}
                                </h3>
                                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-slate-300 font-medium">
                                    <span className="flex items-center gap-1">
                                        <Building2 className="size-3.5 text-indigo-600" /> {event.collegeName || "Community Event"}
                                    </span>
                                    <span>•</span>
                                    <span>{event.eventMode || "Hybrid"}</span>
                                    <span>•</span>
                                    <span className="font-bold text-indigo-700 dark:text-indigo-400">
                                        {isPaid ? `Fee: ₹${event.registrationFee}` : "Free Event"}
                                    </span>
                                    {isTeamAllowed && (
                                        <>
                                            <span>•</span>
                                            <span className="flex items-center gap-1">
                                                <Users className="size-3.5 text-indigo-600" /> Team Size: 1-{maxTeamSize} Members
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>

                            {errorMsg && (
                                <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700 dark:border-rose-900 dark:bg-rose-950/50 dark:text-rose-300">
                                    {errorMsg}
                                </div>
                            )}

                            {/* Section 1: Primary Participant Information */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 border-b border-slate-100 pb-2 dark:border-slate-800">
                                    <User className="size-4 text-indigo-600 dark:text-indigo-400" />
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                        Primary Participant (You)
                                    </h4>
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                            Full Name <span className="text-rose-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            placeholder="Enter your full name"
                                            required
                                            className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-xs text-slate-900 outline-none focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-100"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                            Email Address <span className="text-rose-500">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="name@example.com"
                                            required
                                            className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-xs text-slate-900 outline-none focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-100"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                            Phone Number <span className="text-rose-500">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            value={phoneNumber}
                                            onChange={(e) => setPhoneNumber(e.target.value)}
                                            placeholder="+91 9876543210"
                                            required
                                            className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-xs text-slate-900 outline-none focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-100"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                            College / Institution
                                        </label>
                                        <input
                                            type="text"
                                            value={college}
                                            onChange={(e) => setCollege(e.target.value)}
                                            placeholder="Your college name"
                                            className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-xs text-slate-900 outline-none focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-100"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                            Branch / Department
                                        </label>
                                        <input
                                            type="text"
                                            value={branch}
                                            onChange={(e) => setBranch(e.target.value)}
                                            placeholder="e.g. Computer Science"
                                            className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-xs text-slate-900 outline-none focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-100"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                            Graduation Year
                                        </label>
                                        <input
                                            type="text"
                                            value={graduationYear}
                                            onChange={(e) => setGraduationYear(e.target.value)}
                                            placeholder="e.g. 2026"
                                            className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-xs text-slate-900 outline-none focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-100"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Team Members Selection (If Event Supports Team Size > 1) */}
                            {isTeamAllowed && (
                                <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Users className="size-4 text-indigo-600 dark:text-indigo-400" />
                                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                                Participation & Team Members
                                            </h4>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                                                Number of Members:
                                            </label>
                                            <select
                                                value={participantCount}
                                                onChange={(e) => handleParticipantCountChange(e.target.value)}
                                                className="h-9 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-bold text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-100"
                                            >
                                                {Array.from({ length: maxTeamSize }, (_, i) => i + 1).map((num) => (
                                                    <option key={num} value={num}>
                                                        {num} {num === 1 ? "Member (Individual)" : "Members"}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Dynamic Additional Member Cards */}
                                    {participantCount > 1 && (
                                        <div className="space-y-4 pt-2">
                                            {members.map((m, idx) => (
                                                <div
                                                    key={idx}
                                                    className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 space-y-3 dark:border-slate-800 dark:bg-slate-800/40"
                                                >
                                                    <div className="flex items-center justify-between border-b border-slate-200/60 pb-2 dark:border-slate-700/60">
                                                        <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                                                            Team Member #{idx + 2}
                                                        </span>
                                                        {m.isConfirmedMember ? (
                                                            <Badge variant="success" className="text-[10px] gap-1 px-2 py-0">
                                                                <CheckCircle2 className="size-3" /> HackHive Member
                                                            </Badge>
                                                        ) : (
                                                            <span className="text-[10px] font-semibold text-slate-400">Additional Participant</span>
                                                        )}
                                                    </div>

                                                    <div className="grid gap-3 sm:grid-cols-2">
                                                        <div>
                                                            <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                                                                Email Address <span className="text-rose-500">*</span>
                                                            </label>
                                                            <input
                                                                type="email"
                                                                value={m.email}
                                                                onChange={(e) => handleMemberChange(idx, "email", e.target.value)}
                                                                onBlur={(e) => handleMemberEmailBlur(idx, e.target.value)}
                                                                placeholder="teammate@example.com"
                                                                required
                                                                className="h-9 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-900 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                                                            />
                                                        </div>

                                                        <div>
                                                            <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                                                                Full Name <span className="text-rose-500">*</span>
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={m.fullName}
                                                                onChange={(e) => handleMemberChange(idx, "fullName", e.target.value)}
                                                                placeholder="Teammate full name"
                                                                required
                                                                className="h-9 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-900 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                                                            />
                                                        </div>

                                                        <div>
                                                            <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                                                                College
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={m.college}
                                                                onChange={(e) => handleMemberChange(idx, "college", e.target.value)}
                                                                placeholder="College name"
                                                                className="h-9 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-900 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                                                            />
                                                        </div>

                                                        <div>
                                                            <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                                                                Branch / Department
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={m.branch}
                                                                onChange={(e) => handleMemberChange(idx, "branch", e.target.value)}
                                                                placeholder="Branch"
                                                                className="h-9 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-900 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* HackHive Member Lookup Status Indicator */}
                                                    {m.lookupStatus === "loading" && (
                                                        <div className="flex items-center gap-2 rounded-xl border border-indigo-100 bg-indigo-50/50 p-2.5 text-xs text-indigo-700 dark:border-indigo-900/40 dark:bg-indigo-950/30 dark:text-indigo-300">
                                                            <Loader2 className="size-3.5 animate-spin text-indigo-600" />
                                                            <span>Checking HackHive account...</span>
                                                        </div>
                                                    )}

                                                    {m.lookupStatus === "found" && m.foundProfile && (
                                                        <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 p-3 space-y-2 dark:border-emerald-900/60 dark:bg-emerald-950/40">
                                                            <div className="flex items-center justify-between">
                                                                <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                                                                    <CheckCircle2 className="size-4 text-emerald-600" /> HackHive member found
                                                                </span>
                                                                {!m.isConfirmedMember ? (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleApplyMemberProfile(idx, m.foundProfile)}
                                                                        className="rounded-lg bg-emerald-600 px-2.5 py-1 text-[11px] font-bold text-white shadow-2xs hover:bg-emerald-500 transition-colors"
                                                                    >
                                                                        Use this member
                                                                    </button>
                                                                ) : (
                                                                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                                                                        ✓ Applied
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="text-xs text-slate-700 dark:text-slate-200 font-medium">
                                                                <span className="font-bold text-slate-900 dark:text-slate-100">{m.foundProfile.fullName}</span>
                                                                {m.foundProfile.college && <span className="text-slate-600 dark:text-slate-400"> • {m.foundProfile.college}</span>}
                                                                {m.foundProfile.branch && (
                                                                    <span className="text-slate-600 dark:text-slate-400"> ({m.foundProfile.branch}{m.foundProfile.graduationYear ? ` • ${m.foundProfile.graduationYear}` : ""})</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {m.lookupStatus === "not_found" && (
                                                        <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                                                            <Info className="size-3.5 text-slate-400 shrink-0" />
                                                            <span>No HackHive account found — Proceeding as external participant</span>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Footer Actions */}
                        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
                            <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={loading}>
                                Cancel
                            </Button>

                            <Button
                                type="submit"
                                size="sm"
                                disabled={loading}
                                className="rounded-xl bg-indigo-600 text-xs font-bold text-white hover:bg-indigo-500 disabled:opacity-50"
                            >
                                {loading ? (
                                    "Submitting..."
                                ) : isPaid ? (
                                    `Proceed to Payment (₹${event.registrationFee})`
                                ) : (
                                    "Complete Registration"
                                )}
                            </Button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
