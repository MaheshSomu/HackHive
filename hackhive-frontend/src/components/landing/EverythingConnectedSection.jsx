import { Calendar, UserCheck, Users, FolderGit2, UploadCloud, BarChart3 } from "lucide-react";

export default function EverythingConnectedSection() {
    const modules = [
        { name: "Events", desc: "Discover and organize hackathons.", icon: Calendar },
        { name: "Registrations", desc: "Manage event participation.", icon: UserCheck },
        { name: "Teams", desc: "Create and manage hackathon teams.", icon: Users },
        { name: "Projects", desc: "Build and organize project details.", icon: FolderGit2 },
        { name: "Submissions", desc: "Submit completed projects.", icon: UploadCloud },
        { name: "Analytics", desc: "Track event performance and participation.", icon: BarChart3 },
    ];

    return (
        <section className="py-16 lg:py-20 bg-slate-50/60 dark:bg-slate-900/40 border-y border-slate-200/80 dark:border-slate-800/80">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
                {/* Header */}
                <div className="text-center max-w-2xl mx-auto space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                        Everything Connected in One Place
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                        A unified platform where every stage of the hackathon experience stays connected.
                    </p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
                    {modules.map((m, idx) => {
                        const Icon = m.icon;
                        return (
                            <div
                                key={idx}
                                className="flex items-start gap-3.5 p-4 rounded-xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-2xs"
                            >
                                <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400 shrink-0">
                                    <Icon className="size-4" />
                                </div>
                                <div className="space-y-0.5">
                                    <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                                        {m.name}
                                    </h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 font-normal leading-relaxed">
                                        {m.desc}
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
