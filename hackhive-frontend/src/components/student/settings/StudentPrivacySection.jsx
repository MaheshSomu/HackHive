import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Shield, Eye, Search, Code, Mail, Info, AlertCircle, RotateCcw, Loader2 } from "lucide-react";
import { Button } from "../../ui/Button";
import studentPrivacyPreferenceService from "../../../services/studentPrivacyPreferenceService";
import { getApiErrorMessage } from "../../../utils/apiError";

export default function StudentPrivacySection() {
    const [privacy, setPrivacy] = useState({
        publicProfile: true,
        organizerDiscovery: true,
        showSkillsToOrganizers: true,
        contactEmailVisibility: false,
    });

    const [loading, setLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [updatingKey, setUpdatingKey] = useState(null);

    const fetchPreferences = useCallback(async () => {
        setLoading(true);
        setIsError(false);
        try {
            const data = await studentPrivacyPreferenceService.getPreferences();
            if (data) {
                setPrivacy({
                    publicProfile: Boolean(data.publicProfile),
                    organizerDiscovery: Boolean(data.organizerDiscovery),
                    showSkillsToOrganizers: Boolean(data.showSkillsToOrganizers),
                    contactEmailVisibility: Boolean(data.contactEmailVisibility),
                });
            }
        } catch (err) {
            console.error("Failed to load student privacy preferences:", err);
            setIsError(true);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPreferences();
    }, [fetchPreferences]);

    const toggleSetting = async (key, label) => {
        if (updatingKey) return; // Prevent race conditions

        const previousState = { ...privacy };
        const nextValue = !privacy[key];
        const updatedPayload = {
            ...privacy,
            [key]: nextValue,
        };

        setPrivacy(updatedPayload);
        setUpdatingKey(key);

        try {
            const res = await studentPrivacyPreferenceService.updatePreferences(updatedPayload);
            if (res) {
                setPrivacy({
                    publicProfile: Boolean(res.publicProfile),
                    organizerDiscovery: Boolean(res.organizerDiscovery),
                    showSkillsToOrganizers: Boolean(res.showSkillsToOrganizers),
                    contactEmailVisibility: Boolean(res.contactEmailVisibility),
                });
            }
            toast.success(`${label} preference ${nextValue ? "enabled" : "disabled"}`);
        } catch (err) {
            console.error("Failed to update privacy preference:", err);
            setPrivacy(previousState);
            toast.error(getApiErrorMessage(err, "Failed to update privacy setting. Please try again."));
        } finally {
            setUpdatingKey(null);
        }
    };

    const privacyItems = [
        {
            key: "publicProfile",
            label: "Public Student Profile",
            description: "Allow your student profile page to be viewable publicly via link.",
            explanation: "When enabled, anyone with your profile link can view your bio, education, and hackathon achievements.",
            icon: Eye,
        },
        {
            key: "organizerDiscovery",
            label: "Allow Organizers to Discover My Profile",
            description: "Index your profile in HackHive organizer talent discovery tools.",
            explanation: "Enables event hosts to invite you to hackathons and match you with relevant opportunities.",
            icon: Search,
        },
        {
            key: "showSkillsToOrganizers",
            label: "Show Skills & Portfolio to Organizers",
            description: "Display technical skills, GitHub links, and past submission projects to hackathon hosts.",
            explanation: "Shares your skill tags, resume summary, and repository links with registered event organizers.",
            icon: Code,
        },
        {
            key: "contactEmailVisibility",
            label: "Show Email Address to Teammates",
            description: "Make your email address visible to accepted teammates in your team workspace.",
            explanation: "When disabled, teammates can only message you through in-app channels and team chat.",
            icon: Mail,
        },
    ];

    return (
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-6">
            <div className="border-b border-slate-100 pb-4 dark:border-slate-800">
                <div className="flex items-center gap-2">
                    <Shield className="size-5 text-indigo-600 dark:text-indigo-400" />
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Privacy & Visibility</h3>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Control who can discover your profile, view technical skills, and access your contact details.
                </p>
            </div>

            {isError ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50/80 p-6 text-center text-rose-900 dark:border-rose-950 dark:bg-rose-950/40 dark:text-rose-300 space-y-3 shadow-xs">
                    <div className="mx-auto flex size-10 items-center justify-center rounded-xl bg-rose-100 text-rose-600 dark:bg-rose-900 dark:text-rose-300">
                        <AlertCircle className="size-5" />
                    </div>
                    <div className="space-y-1 max-w-sm mx-auto">
                        <h4 className="text-xs font-bold">Failed to load privacy preferences</h4>
                        <p className="text-[11px] text-rose-600/80 dark:text-rose-400 leading-relaxed font-medium">
                            Unable to retrieve your privacy settings from the server.
                        </p>
                    </div>
                    <Button
                        type="button"
                        size="sm"
                        onClick={fetchPreferences}
                        className="bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs inline-flex items-center gap-2 px-4 py-2 rounded-xl"
                    >
                        <RotateCcw className="size-3.5" /> Retry
                    </Button>
                </div>
            ) : loading ? (
                <div className="p-8 text-center space-y-3">
                    <Loader2 className="size-6 animate-spin text-indigo-600 dark:text-indigo-400 mx-auto" />
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Loading preferences...</p>
                </div>
            ) : (
                <div className="space-y-4 max-w-2xl">
                    {privacyItems.map((item) => {
                        const Icon = item.icon;
                        const isChecked = privacy[item.key];
                        const isUpdating = updatingKey === item.key;

                        return (
                            <div
                                key={item.key}
                                className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800/40 dark:hover:bg-slate-800/60 transition-colors space-y-3"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-start gap-3 min-w-0">
                                        <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-white border border-slate-200/80 shadow-2xs text-indigo-600 dark:bg-slate-800 dark:border-slate-700 dark:text-indigo-400">
                                            <Icon className="size-4" />
                                        </div>
                                        <div className="space-y-0.5 min-w-0">
                                            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                                                {item.label}
                                            </h4>
                                            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                                                {item.description}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Custom Toggle Switch */}
                                    <button
                                        type="button"
                                        role="switch"
                                        aria-checked={isChecked}
                                        aria-label={item.label}
                                        disabled={Boolean(updatingKey)}
                                        onClick={() => toggleSetting(item.key, item.label)}
                                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed ${
                                            isChecked ? "bg-indigo-600" : "bg-slate-200 dark:bg-slate-700"
                                        }`}
                                    >
                                        <span
                                            className={`pointer-events-none flex items-center justify-center size-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                                                isChecked ? "translate-x-5" : "translate-x-0"
                                            }`}
                                        >
                                            {isUpdating && <Loader2 className="size-3 animate-spin text-indigo-600" />}
                                        </span>
                                    </button>
                                </div>

                                {/* Clear Explanation Box */}
                                <div className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-100/70 dark:bg-slate-800/80 text-[11px] text-slate-600 dark:text-slate-300">
                                    <Info className="size-3.5 text-indigo-500 shrink-0 mt-0.5" />
                                    <span>{item.explanation}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
