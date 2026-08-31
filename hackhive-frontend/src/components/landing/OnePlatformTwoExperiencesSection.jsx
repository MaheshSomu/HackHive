import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";

export default function OnePlatformTwoExperiencesSection() {
    const studentList = [
        "Discover hackathons",
        "Register for events",
        "Find or create teams",
        "Build projects",
        "Submit your work",
        "Showcase your achievements",
    ];

    const organizerList = [
        "Create hackathons",
        "Manage registrations",
        "Manage teams and participants",
        "Review submissions",
        "Track event performance",
        "Manage the event lifecycle",
    ];

    return (
        <section className="py-16 lg:py-20 bg-white dark:bg-slate-950">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
                {/* Header */}
                <div className="text-center max-w-2xl mx-auto space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                        One platform. Two experiences.
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                        Built for the people who participate and the people who make hackathons happen.
                    </p>
                </div>

                {/* Two Equal Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Card 1 — Students */}
                    <div className="rounded-xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900 space-y-6 flex flex-col justify-between shadow-2xs">
                        <div className="space-y-4">
                            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                                FOR STUDENTS
                            </span>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                                Student Experience
                            </h3>

                            <ul className="space-y-3 pt-2">
                                {studentList.map((item, idx) => (
                                    <li key={idx} className="flex items-center gap-3 text-sm font-medium text-slate-700 dark:text-slate-300">
                                        <span className="flex size-4.5 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                                            <Check className="size-3" />
                                        </span>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                            <Link
                                to="/register"
                                className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
                            >
                                <span>Explore as a Student</span>
                                <ArrowRight className="size-4" />
                            </Link>
                        </div>
                    </div>

                    {/* Card 2 — Organizers */}
                    <div className="rounded-xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900 space-y-6 flex flex-col justify-between shadow-2xs">
                        <div className="space-y-4">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                FOR ORGANIZERS
                            </span>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                                Organizer Operations
                            </h3>

                            <ul className="space-y-3 pt-2">
                                {organizerList.map((item, idx) => (
                                    <li key={idx} className="flex items-center gap-3 text-sm font-medium text-slate-700 dark:text-slate-300">
                                        <span className="flex size-4.5 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                            <Check className="size-3" />
                                        </span>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                            <Link
                                to="/register"
                                className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-900 hover:text-indigo-600 dark:text-white dark:hover:text-indigo-400 transition-colors"
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
