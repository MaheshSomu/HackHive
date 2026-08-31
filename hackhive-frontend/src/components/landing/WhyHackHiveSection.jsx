import { ArrowRight, ArrowDown, Calendar, UserCheck, Users, FolderGit2, UploadCloud } from "lucide-react";

export default function WhyHackHiveSection() {
    const workflowItems = [
        { name: "EVENTS", icon: Calendar, highlight: false },
        { name: "REGISTRATIONS", icon: UserCheck, highlight: false },
        { name: "TEAMS", icon: Users, highlight: false },
        { name: "PROJECTS", icon: FolderGit2, highlight: false },
        { name: "SUBMISSIONS", icon: UploadCloud, highlight: true },
    ];

    return (
        <section id="about" className="py-16 lg:py-20 bg-slate-50/60 dark:bg-slate-900/40 border-y border-slate-200/80 dark:border-slate-800/80">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
                    
                    {/* Left Copy (col-span-5) */}
                    <div className="lg:col-span-5 space-y-4">
                        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
                            Everything stays connected.
                        </h2>
                        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
                            Instead of jumping between event listings, registration forms, team chats, project documents, and submission systems, HackHive keeps the hackathon journey connected in one platform.
                        </p>
                    </div>

                    {/* Right Connected Workflow Panel (col-span-7) */}
                    <div className="lg:col-span-7">
                        <div className="rounded-xl border border-slate-200/90 bg-white p-4 sm:p-5 lg:p-6 dark:border-slate-800 dark:bg-slate-900 shadow-2xs space-y-5">
                            
                            {/* Desktop Horizontal Workflow: Exactly 1 Row, flex-nowrap, NO scrollbar, NO overflow */}
                            <div className="hidden sm:flex items-center justify-between flex-nowrap gap-1 md:gap-1.5 overflow-visible py-1">
                                {workflowItems.map((item, idx) => {
                                    const Icon = item.icon;
                                    return (
                                        <div key={idx} className="flex items-center gap-1 md:gap-1.5 shrink-0">
                                            <div
                                                className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg text-[10px] sm:text-[11px] lg:text-xs font-bold whitespace-nowrap border shrink-0 ${
                                                    item.highlight
                                                        ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-800"
                                                        : "bg-indigo-50/80 text-indigo-700 border-indigo-100 dark:bg-indigo-950/80 dark:text-indigo-300 dark:border-indigo-800"
                                                }`}
                                            >
                                                <Icon className="size-3 sm:size-3.5 shrink-0" />
                                                <span>{item.name}</span>
                                            </div>

                                            {idx < workflowItems.length - 1 && (
                                                <ArrowRight className="size-3 sm:size-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Mobile Vertical Flow */}
                            <div className="flex sm:hidden flex-col items-center gap-2 py-1">
                                {workflowItems.map((item, idx) => {
                                    const Icon = item.icon;
                                    return (
                                        <div key={idx} className="flex flex-col items-center gap-2 w-full max-w-xs">
                                            <div
                                                className={`flex items-center justify-center gap-2 w-full px-4 py-2 rounded-lg text-xs font-bold border ${
                                                    item.highlight
                                                        ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-800"
                                                        : "bg-indigo-50/80 text-indigo-700 border-indigo-100 dark:bg-indigo-950/80 dark:text-indigo-300 dark:border-indigo-800"
                                                }`}
                                            >
                                                <Icon className="size-4 shrink-0" />
                                                <span>{item.name}</span>
                                            </div>

                                            {idx < workflowItems.length - 1 && (
                                                <ArrowDown className="size-3.5 text-slate-400 dark:text-slate-500" />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Sub-line */}
                            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
                                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                                    One connected platform workflow.
                                </span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
