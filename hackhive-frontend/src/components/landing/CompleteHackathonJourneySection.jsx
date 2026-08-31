import { Compass, UserCheck, Users, Code2, UploadCloud, Award } from "lucide-react";

export default function CompleteHackathonJourneySection() {
    const steps = [
        { title: "Discover", desc: "Find hackathons & events", icon: Compass },
        { title: "Register", desc: "Secure entry & status", icon: UserCheck },
        { title: "Team", desc: "Match skills & recruit", icon: Users },
        { title: "Build", desc: "Collaborate in workspace", icon: Code2 },
        { title: "Submit", desc: "Link repos & demo videos", icon: UploadCloud },
        { title: "Showcase", desc: "Build verified portfolio", icon: Award },
    ];

    return (
        <section className="py-16 lg:py-20 bg-white dark:bg-slate-950">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
                {/* Header */}
                <div className="text-center max-w-2xl mx-auto space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                        From Discovery to Final Submission
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                        HackHive connects every important step of the hackathon experience.
                    </p>
                </div>

                {/* Horizontal Journey Nodes */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                    {steps.map((item, idx) => {
                        const Icon = item.icon;
                        return (
                            <div
                                key={idx}
                                className="flex flex-col items-center text-center p-4 rounded-xl border border-slate-200 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-900/60 space-y-2"
                            >
                                <div className="p-2.5 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                                    <Icon className="size-5" />
                                </div>
                                <span className="text-xs font-bold text-slate-900 dark:text-white">
                                    {item.title}
                                </span>
                                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-normal">
                                    {item.desc}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
