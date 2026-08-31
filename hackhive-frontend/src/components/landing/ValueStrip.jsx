import { Search, Users, MessageSquare, Send, Award } from "lucide-react";

export default function ValueStrip() {
    const capabilities = [
        {
            icon: Search,
            title: "Discover Events",
            desc: "Find national & university hackathons",
            color: "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60",
        },
        {
            icon: Users,
            title: "Build Teams",
            desc: "Match skills & recruit teammates",
            color: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60",
        },
        {
            icon: MessageSquare,
            title: "Collaborate",
            desc: "Real-time team chat & workspace",
            color: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60",
        },
        {
            icon: Send,
            title: "Submit Projects",
            desc: "Seamless code & repo submission",
            color: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60",
        },
        {
            icon: Award,
            title: "Showcase Skills",
            desc: "Verified profile & portfolio cards",
            color: "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60",
        },
    ];

    return (
        <section className="border-y border-slate-200/80 bg-slate-50/60 py-10 dark:border-slate-800/80 dark:bg-slate-900/40">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-8">
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                        One platform for the complete event journey
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    {capabilities.map((cap, idx) => {
                        const Icon = cap.icon;
                        return (
                            <div
                                key={idx}
                                className="flex items-center gap-3.5 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                            >
                                <div className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${cap.color}`}>
                                    <Icon className="size-5" />
                                </div>
                                <div className="min-w-0">
                                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                        {cap.title}
                                    </h4>
                                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                                        {cap.desc}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
