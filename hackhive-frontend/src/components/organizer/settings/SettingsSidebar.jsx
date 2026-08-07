import { Building2, Mail, Sparkles, Share2, Bell, ShieldCheck } from "lucide-react";

export default function SettingsSidebar({ activeSection, setActiveSection }) {
    const navItems = [
        { id: "general", label: "General", icon: Building2, description: "Basic organization details" },
        { id: "contact", label: "Contact", icon: Mail, description: "Public email, phone & website" },
        { id: "branding", label: "Branding", icon: Sparkles, description: "Logo & visual identity" },
        { id: "social", label: "Social Links", icon: Share2, description: "Social media profiles" },
        { id: "notifications", label: "Notifications", icon: Bell, description: "Alerts & event preferences" },
        { id: "security", label: "Security", icon: ShieldCheck, description: "Auth provider & password" },
    ];

    return (
        <aside className="w-full lg:w-64 shrink-0">
            <div className="sticky top-6 rounded-3xl border border-slate-200/80 bg-white p-3 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-2">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        Settings Menu
                    </span>
                </div>

                <nav className="space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeSection === item.id;

                        return (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => setActiveSection(item.id)}
                                className={`group flex w-full items-center gap-3 rounded-2xl px-3.5 py-3 text-xs font-bold transition-all text-left ${
                                    isActive
                                        ? "bg-purple-600 text-white shadow-md shadow-purple-500/20"
                                        : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-100"
                                }`}
                            >
                                <Icon
                                    className={`size-4 shrink-0 transition-transform group-hover:scale-110 ${
                                        isActive ? "text-white" : "text-slate-400 dark:text-slate-500"
                                    }`}
                                />
                                <div className="truncate">
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
