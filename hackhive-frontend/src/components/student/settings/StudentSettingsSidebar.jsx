import { User, ShieldCheck, Bell, Sliders, Shield, AlertTriangle } from "lucide-react";

export default function StudentSettingsSidebar({ activeSection, setActiveSection }) {
    const navItems = [
        { id: "account", label: "Account", icon: User, description: "Profile info & email authority" },
        { id: "security", label: "Security", icon: ShieldCheck, description: "Password & auth provider" },
        { id: "notifications", label: "Notifications", icon: Bell, description: "Event & team alerts" },
        { id: "preferences", label: "Preferences", icon: Sliders, description: "Theme, language & display" },
        { id: "privacy", label: "Privacy", icon: Shield, description: "Directory visibility & recruiter access" },
        { id: "danger", label: "Danger Zone", icon: AlertTriangle, description: "Session logout & delete account", isDanger: true },
    ];

    return (
        <aside className="w-full lg:w-64 shrink-0">
            <div className="sticky top-20 rounded-3xl border border-slate-200/80 bg-white p-3 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-2 flex items-center justify-between">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        Settings Navigation
                    </span>
                </div>

                <nav className="space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeSection === item.id;

                        let activeClass = "bg-indigo-600 text-white shadow-md shadow-indigo-500/20";
                        if (item.isDanger && isActive) {
                            activeClass = "bg-rose-600 text-white shadow-md shadow-rose-500/20";
                        }

                        let inactiveClass = "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-100";
                        if (item.isDanger && !isActive) {
                            inactiveClass = "text-rose-600/90 hover:bg-rose-50 hover:text-rose-700 dark:text-rose-400 dark:hover:bg-rose-950/30";
                        }

                        return (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => setActiveSection(item.id)}
                                className={`group flex w-full items-center gap-3 rounded-2xl px-3.5 py-3 text-xs font-bold transition-all text-left ${
                                    isActive ? activeClass : inactiveClass
                                }`}
                            >
                                <Icon
                                    className={`size-4 shrink-0 transition-transform group-hover:scale-110 ${
                                        isActive
                                            ? "text-white"
                                            : item.isDanger
                                            ? "text-rose-500 dark:text-rose-400"
                                            : "text-slate-400 dark:text-slate-500"
                                    }`}
                                />
                                <div className="truncate flex-1 min-w-0">
                                    <div className="truncate">{item.label}</div>
                                </div>
                            </button>
                        );
                    })}
                </nav>
            </div>
        </aside>
    );
}
