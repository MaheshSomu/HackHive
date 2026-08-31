import { Compass, UserCheck, Users, UploadCloud } from "lucide-react";

export default function JourneySection() {
    const steps = [
        {
            number: "01",
            icon: Compass,
            title: "Discover",
            description: "Find hackathons and events that match your interests.",
        },
        {
            number: "02",
            icon: UserCheck,
            title: "Register",
            description: "Join an event and secure your place.",
        },
        {
            number: "03",
            icon: Users,
            title: "Build",
            description: "Create your team, collaborate, and work on your project.",
        },
        {
            number: "04",
            icon: UploadCloud,
            title: "Submit",
            description: "Submit your finished project and showcase your work.",
        },
    ];

    return (
        <section id="journey" className="py-12 lg:py-16 bg-slate-50/60 dark:bg-slate-900/40 border-y border-slate-200/80 dark:border-slate-800/80">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
                {/* Header */}
                <div className="text-center max-w-2xl mx-auto space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                        From idea to submission.
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                        Everything you need to participate in a hackathon, connected in one flow.
                    </p>
                </div>

                {/* Connected Flow */}
                <div className="relative">
                    {/* Horizontal Connector Line for Desktop */}
                    <div className="hidden lg:block absolute top-6 left-24 right-24 h-0.5 bg-slate-200 dark:bg-slate-800 z-0" />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
                        {steps.map((step, idx) => {
                            const Icon = step.icon;
                            return (
                                <div key={idx} className="flex flex-col items-center text-center space-y-3">
                                    <div className="relative flex size-12 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 shadow-2xs">
                                        <Icon className="size-5 text-indigo-600 dark:text-indigo-400" />
                                        <span className="absolute -top-1 -right-1 flex size-4.5 items-center justify-center rounded-full bg-slate-900 text-[9px] font-bold text-white dark:bg-white dark:text-slate-900">
                                            {step.number}
                                        </span>
                                    </div>

                                    <div>
                                        <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                            {step.title}
                                        </h3>
                                        <p className="text-xs text-slate-600 dark:text-slate-400 font-normal leading-relaxed mt-1 max-w-xs">
                                            {step.description}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
