import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Sliders, Sun, Moon, Monitor, Check, AlertCircle, RotateCcw, Loader2 } from "lucide-react";
import { Button } from "../../ui/Button";
import studentWorkspacePreferenceService from "../../../services/studentWorkspacePreferenceService";
import { getApiErrorMessage } from "../../../utils/apiError";

function applyThemeDom(themeMode) {
    if (typeof window === "undefined") return;
    const root = document.documentElement;

    if (themeMode === "dark") {
        root.classList.add("dark");
    } else if (themeMode === "light") {
        root.classList.remove("dark");
    } else {
        const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        if (systemPrefersDark) {
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
        }
    }
}

export default function StudentPreferencesSection() {
    const [theme, setTheme] = useState("system");
    const [loading, setLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [saving, setSaving] = useState(false);

    const fetchPreferences = useCallback(async () => {
        setLoading(true);
        setIsError(false);
        try {
            const data = await studentWorkspacePreferenceService.getPreferences();
            if (data && data.theme) {
                setTheme(data.theme);
                applyThemeDom(data.theme);
            }
        } catch (err) {
            console.error("Failed to load theme preference:", err);
            setIsError(true);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPreferences();
    }, [fetchPreferences]);

    const handleThemeChange = async (newTheme) => {
        if (theme === newTheme || saving) return;

        const previousTheme = theme;
        setTheme(newTheme);
        applyThemeDom(newTheme);
        setSaving(true);

        try {
            const res = await studentWorkspacePreferenceService.updatePreferences({ theme: newTheme });
            if (res && res.theme) {
                setTheme(res.theme);
                applyThemeDom(res.theme);
            }
            toast.success(`Interface theme set to ${newTheme}`);
        } catch (err) {
            console.error("Failed to save theme preference:", err);
            setTheme(previousTheme);
            applyThemeDom(previousTheme);
            toast.error(getApiErrorMessage(err, "Failed to save theme preference."));
        } finally {
            setSaving(false);
        }
    };

    const themeOptions = [
        { id: "light", label: "Light Mode", icon: Sun, desc: "Clean bright interface" },
        { id: "dark", label: "Dark Mode", icon: Moon, desc: "Sleek dark theme" },
        { id: "system", label: "System Sync", icon: Monitor, desc: "Follow OS system mode" },
    ];

    return (
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-6">
            <div className="border-b border-slate-100 pb-4 dark:border-slate-800">
                <div className="flex items-center gap-2">
                    <Sliders className="size-5 text-indigo-600 dark:text-indigo-400" />
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Workspace Preferences</h3>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Personalize your interface appearance and visual theme mode.
                </p>
            </div>

            {isError ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50/80 p-6 text-center text-rose-900 dark:border-rose-950 dark:bg-rose-950/40 dark:text-rose-300 space-y-3 shadow-xs">
                    <div className="mx-auto flex size-10 items-center justify-center rounded-xl bg-rose-100 text-rose-600 dark:bg-rose-900 dark:text-rose-300">
                        <AlertCircle className="size-5" />
                    </div>
                    <div className="space-y-1 max-w-sm mx-auto">
                        <h4 className="text-xs font-bold">Failed to load theme preference</h4>
                        <p className="text-[11px] text-rose-600/80 dark:text-rose-400 leading-relaxed font-medium">
                            Unable to retrieve your theme preference from the server.
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
                <div className="space-y-6 max-w-2xl">
                    {/* Theme Preference Selection */}
                    <div className="space-y-2">
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                            Interface Theme Mode
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {themeOptions.map((opt) => {
                                const Icon = opt.icon;
                                const isSelected = theme === opt.id;
                                return (
                                    <button
                                        key={opt.id}
                                        type="button"
                                        disabled={saving}
                                        onClick={() => handleThemeChange(opt.id)}
                                        className={`relative flex flex-col items-start p-4 rounded-2xl border text-left transition-all disabled:opacity-60 disabled:cursor-not-allowed ${
                                            isSelected
                                                ? "border-indigo-600 bg-indigo-50/50 dark:border-indigo-500 dark:bg-indigo-950/40 ring-2 ring-indigo-500/20"
                                                : "border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800/40 dark:hover:bg-slate-800/70"
                                        }`}
                                    >
                                        <div className="flex items-center justify-between w-full mb-2">
                                            <div
                                                className={`p-2 rounded-xl ${
                                                    isSelected
                                                        ? "bg-indigo-600 text-white"
                                                        : "bg-white text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
                                                }`}
                                            >
                                                <Icon className="size-4" />
                                            </div>
                                            {isSelected && <Check className="size-4 text-indigo-600 dark:text-indigo-400" />}
                                        </div>
                                        <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{opt.label}</span>
                                        <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{opt.desc}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
