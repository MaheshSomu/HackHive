import { Calendar, UserCheck, Users, FolderGit2, UploadCloud, BarChart3 } from "lucide-react";

export default function CompletePlatformWorkflowSection() {
    const blocks = [
        { name: "Events", desc: "Discover and manage hackathons.", icon: Calendar },
        { name: "Registrations", desc: "Join and manage participation.", icon: UserCheck },
        { name: "Teams", desc: "Create and manage teams.", icon: Users },
        { name: "Projects", desc: "Build and organize project work.", icon: FolderGit2 },
        { name: "Submissions", desc: "Submit completed projects.", icon: UploadCloud },
        { name: "Analytics", desc: "Understand event performance.", icon: BarChart3 },
    ];

    return (
        <section className="py-16 lg:py-20 bg-white dark:bg-slate-950">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
                {/* Header */}
                <div className="text-center max-w-2xl mx-auto space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                        Built for the complete hackathon journey.
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                        From registration to final submission, HackHive keeps the entire experience connected.
                    </p>
                </div>

                {/* 6 Compact Clean Feature Blocks */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
                    {blocks.map((b, idx) => {
                        const Icon = b.icon;
                        return (
                            <div
                                key={idx}
                                className="flex items-start gap-3.5 p-4 rounded-xl border border-slate-200/80 bg-slate-50/60 dark:border-slate-800 dark:bg-slate-900/60 shadow-2xs"
                            >
                                <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400 shrink-0">
                                    <Icon className="size-4" />
                                </div>
                                <div className="space-y-0.5">
                                    <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                                        {b.name}
                                    </h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 font-normal leading-relaxed">
                                        {b.desc}
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
