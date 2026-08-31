import { Calendar, UserCheck, Users, Code, UploadCloud, BarChart2 } from "lucide-react";

export default function CompleteWorkflowSection() {
    const nodes = [
        { label: "EVENT", desc: "Creation & Discovery", icon: Calendar },
        { label: "REGISTRATION", desc: "Verification & Entry", icon: UserCheck },
        { label: "TEAM", desc: "Matching & Workspace", icon: Users },
        { label: "PROJECT", desc: "Code & Resources", icon: Code },
        { label: "SUBMISSION", desc: "Repository & Demos", icon: UploadCloud },
        { label: "ANALYTICS", desc: "Review & Metrics", icon: BarChart2 },
    ];

    return (
        <section className="py-16 lg:py-20 bg-white dark:bg-slate-950 border-t border-slate-200/80 dark:border-slate-800/80">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
                {/* Header */}
                <div className="text-center max-w-2xl mx-auto space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                        Everything Connected in One Place
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                        Every step of the hackathon lifecycle stays connected, making it easier for students to participate and organizers to manage their events.
                    </p>
                </div>

                {/* Horizontal Product Architecture Node Flow */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                    {nodes.map((node, idx) => {
                        const Icon = node.icon;
                        return (
                            <div
                                key={idx}
                                className="flex flex-col items-center text-center p-4 rounded-xl border border-slate-200 bg-slate-50/60 dark:border-slate-800 dark:bg-slate-900/60 space-y-2.5"
                            >
                                <div className="p-2.5 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                                    <Icon className="size-5" />
                                </div>
                                <div>
                                    <span className="text-[11px] font-bold tracking-wider uppercase text-slate-900 dark:text-white block">
                                        {node.label}
                                    </span>
                                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-normal mt-0.5">
                                        {node.desc}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
