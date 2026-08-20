import { useState } from "react";
import { toast } from "sonner";
import { Sliders, Sun, Moon, Monitor, Globe, Clock, LayoutGrid, ListFilter, Check } from "lucide-react";
import HackHiveSelect from "../../ui/HackHiveSelect";

export default function StudentPreferencesSection() {
    const [theme, setTheme] = useState("system"); // 'light' | 'dark' | 'system'
    const [language, setLanguage] = useState("en-US");
    const [timezone, setTimezone] = useState("UTC+05:30");
    const [eventView, setEventView] = useState("grid"); // 'grid' | 'list' | 'upcoming'

    const handleThemeChange = (newTheme) => {
        setTheme(newTheme);
        toast.success(`Theme preference set to ${newTheme}`);
    };

    const handleLanguageChange = (e) => {
        setLanguage(e.target.value);
        toast.success("Language preference updated");
    };

    const handleTimezoneChange = (e) => {
        setTimezone(e.target.value);
        toast.success("Timezone preference updated");
    };

    const handleEventViewChange = (newView) => {
        setEventView(newView);
        toast.success(`Default event browsing view set to ${newView}`);
    };

    const themeOptions = [
        { id: "light", label: "Light Mode", icon: Sun, desc: "Clean bright interface" },
        { id: "dark", label: "Dark Mode", icon: Moon, desc: "Sleek dark theme" },
        { id: "system", label: "System Sync", icon: Monitor, desc: "Follow OS system mode" },
    ];

    const eventViewOptions = [
        { id: "grid", label: "Grid Cards", icon: LayoutGrid, desc: "Rich visual hackathon cards layout" },
        { id: "list", label: "Compact List", icon: ListFilter, desc: "High-density table format view" },
    ];

    return (
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-6">
            <div className="border-b border-slate-100 pb-4 dark:border-slate-800">
                <div className="flex items-center gap-2">
                    <Sliders className="size-5 text-indigo-600 dark:text-indigo-400" />
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Workspace Preferences</h3>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Personalize your interface appearance, regional localization, and event browsing defaults.
                </p>
            </div>

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
                                    onClick={() => handleThemeChange(opt.id)}
                                    className={`relative flex flex-col items-start p-4 rounded-2xl border text-left transition-all ${
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

                {/* Language Selection */}
                <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                        <Globe className="size-3.5 text-slate-400" />
                        <span>Language & Region</span>
                    </div>
                    <HackHiveSelect
                        label="Language"
                        value={language}
                        onChange={handleLanguageChange}
                        options={[
                            { value: "en-US", label: "English (United States)" },
                            { value: "en-GB", label: "English (United Kingdom)" },
                            { value: "es-ES", label: "Español (Spanish)" },
                            { value: "fr-FR", label: "Français (French)" },
                            { value: "de-DE", label: "Deutsch (German)" },
                        ]}
                    />
                </div>

                {/* Timezone Selection */}
                <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                        <Clock className="size-3.5 text-slate-400" />
                        <span>Display Timezone</span>
                    </div>
                    <HackHiveSelect
                        label="Timezone"
                        value={timezone}
                        onChange={handleTimezoneChange}
                        options={[
                            { value: "UTC+05:30", label: "(UTC+05:30) India Standard Time (IST)" },
                            { value: "UTC+00:00", label: "(UTC+00:00) Coordinated Universal Time (UTC / GMT)" },
                            { value: "UTC-05:00", label: "(UTC-05:00) Eastern Time (US & Canada)" },
                            { value: "UTC-08:00", label: "(UTC-08:00) Pacific Time (US & Canada)" },
                            { value: "UTC+01:00", label: "(UTC+01:00) Central European Time (CET)" },
                            { value: "UTC+09:00", label: "(UTC+09:00) Japan Standard Time (JST)" },
                        ]}
                    />
                </div>

                {/* Default Event Browsing / View Preference */}
                <div className="space-y-2 pt-2">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                        Default Event Browsing Preference
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {eventViewOptions.map((opt) => {
                            const Icon = opt.icon;
                            const isSelected = eventView === opt.id;
                            return (
                                <button
                                    key={opt.id}
                                    type="button"
                                    onClick={() => handleEventViewChange(opt.id)}
                                    className={`relative flex items-center gap-3 p-4 rounded-2xl border text-left transition-all ${
                                        isSelected
                                            ? "border-indigo-600 bg-indigo-50/50 dark:border-indigo-500 dark:bg-indigo-950/40 ring-2 ring-indigo-500/20"
                                            : "border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800/40 dark:hover:bg-slate-800/70"
                                    }`}
                                >
                                    <div
                                        className={`p-2.5 rounded-xl ${
                                            isSelected
                                                ? "bg-indigo-600 text-white"
                                                : "bg-white text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
                                        }`}
                                    >
                                        <Icon className="size-4" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center justify-between">
                                            <span>{opt.label}</span>
                                            {isSelected && <Check className="size-4 text-indigo-600 dark:text-indigo-400" />}
                                        </div>
                                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{opt.desc}</p>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
