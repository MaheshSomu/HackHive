import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";

export default function StudentOrganizerSection() {
    const studentList = [
        "Discover hackathons",
        "Register for events",
        "Find or build teams",
        "Collaborate",
        "Submit projects",
        "Showcase achievements",
    ];

    const organizerList = [
        "Create events",
        "Manage registrations",
        "Manage participants",
        "Review project submissions",
        "Track event analytics",
        "Manage the complete event lifecycle",
    ];

    return (
        <section className="py-16 lg:py-24 bg-slate-50/60 dark:bg-slate-900/40 border-t border-slate-200/80 dark:border-slate-800/80">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                        Platform Roles
                    </span>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                        Built for Students & Organizers
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                        HackHive connects student developers with event hosts under a single unified platform.
                    </p>
                </div>

                {/* 2 Clean Columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* For Students */}
                    <div className="rounded-xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900 space-y-6 flex flex-col justify-between">
                        <div className="space-y-4">
                            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                                Participant Platform
                            </span>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                                For Students
                            </h3>

                            <ul className="space-y-3 pt-2">
                                {studentList.map((item, idx) => (
                                    <li key={idx} className="flex items-center gap-3 text-sm font-medium text-slate-700 dark:text-slate-300">
                                        <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                                            <Check className="size-3.5" />
                                        </span>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                            <Link
                                to="/register"
                                className="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                            >
                                <span>Explore as a Student</span>
                                <ArrowRight className="size-4" />
                            </Link>
                        </div>
                    </div>

                    {/* For Organizers */}
                    <div className="rounded-xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900 space-y-6 flex flex-col justify-between">
                        <div className="space-y-4">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                Event Operations
                            </span>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                                For Organizers
                            </h3>

                            <ul className="space-y-3 pt-2">
                                {organizerList.map((item, idx) => (
                                    <li key={idx} className="flex items-center gap-3 text-sm font-medium text-slate-700 dark:text-slate-300">
                                        <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                            <Check className="size-3.5" />
                                        </span>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                            <Link
                                to="/register"
                                className="inline-flex items-center gap-2 text-sm font-bold text-slate-900 hover:text-indigo-600 dark:text-white dark:hover:text-indigo-400"
                            >
                                <span>Host an Event</span>
                                <ArrowRight className="size-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
