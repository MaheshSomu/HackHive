import { useState } from "react";
import { Users, BarChart3, CheckCircle2, ShieldCheck, FolderGit2, Calendar, FileText } from "lucide-react";

export default function ProductShowcaseSection() {
    const [activeTab, setActiveTab] = useState("student");

    return (
        <section id="about" className="py-16 lg:py-20 bg-slate-50/60 dark:bg-slate-900/40 border-t border-slate-200/80 dark:border-slate-800/80">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
                {/* Header */}
                <div className="text-center max-w-2xl mx-auto space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                        Built for the Complete Hackathon Journey
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                        From registration to final submission, HackHive keeps the entire experience connected.
                    </p>
                </div>

                {/* Tab Switcher */}
                <div className="flex items-center justify-center gap-2">
                    <button
                        type="button"
                        onClick={() => setActiveTab("student")}
                        className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                            activeTab === "student"
                                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800"
                        }`}
                    >
                        <Users className="size-4" />
                        <span>Student Experience</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab("organizer")}
                        className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                            activeTab === "organizer"
                                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800"
                        }`}
                    >
                        <BarChart3 className="size-4" />
                        <span>Organizer Experience</span>
                    </button>
                </div>

                {/* Product Frame Showcase */}
                <div className="rounded-xl border border-slate-200 bg-slate-900 text-white shadow-xl dark:border-slate-800 overflow-hidden max-w-5xl mx-auto">
                    {/* Window Control Header */}
                    <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950 border-b border-slate-800 text-xs">
                        <div className="flex items-center gap-2">
                            <div className="size-2.5 rounded-full bg-slate-700" />
                            <div className="size-2.5 rounded-full bg-slate-700" />
                            <div className="size-2.5 rounded-full bg-slate-700" />
                            <span className="ml-2 font-mono text-slate-400 text-[11px]">
                                {activeTab === "student"
                                    ? "hackhive.app/student/workspace/team-alpha"
                                    : "hackhive.app/organizer/dashboard/analytics"}
                            </span>
                        </div>
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                            Real Product Screen
                        </span>
                    </div>

                    {/* Content Views */}
                    {activeTab === "student" ? (
                        <div className="p-6 md:p-8 space-y-6 bg-slate-900">
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                                <div>
                                    <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                                        <Calendar className="size-3.5 text-indigo-400" />
                                        <span>Annual Student Tech Summit</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-white mt-1">
                                        Team Workspace & Final Submission
                                    </h3>
                                </div>

                                <span className="rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1 text-xs font-semibold flex items-center gap-1.5">
                                    <CheckCircle2 className="size-3.5" /> Submission Confirmed
                                </span>
                            </div>

                            {/* Cards Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
                                <div className="rounded-lg bg-slate-950 p-4 border border-slate-800 space-y-2">
                                    <div className="flex items-center gap-2 text-indigo-400 font-semibold">
                                        <FolderGit2 className="size-4" />
                                        <span>GitHub Repository</span>
                                    </div>
                                    <p className="font-mono text-slate-300 truncate">github.com/hackhive/project-alpha</p>
                                    <span className="inline-block text-[10px] text-slate-400">Branch: main (commit #8c2a9f)</span>
                                </div>

                                <div className="rounded-lg bg-slate-950 p-4 border border-slate-800 space-y-2">
                                    <div className="flex items-center justify-between font-semibold text-slate-300">
                                        <span>Team Roster</span>
                                        <span>3 Members</span>
                                    </div>
                                    <div className="space-y-1 text-slate-400">
                                        <p>• Mahesh S. (Full Stack Lead)</p>
                                        <p>• Alex K. (Frontend)</p>
                                        <p>• Priya P. (Backend)</p>
                                    </div>
                                </div>

                                <div className="rounded-lg bg-slate-950 p-4 border border-slate-800 space-y-2">
                                    <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                                        <ShieldCheck className="size-4" />
                                        <span>Evaluation Pipeline</span>
                                    </div>
                                    <p className="text-slate-300">Submitted & Verified</p>
                                    <span className="inline-block text-[10px] text-slate-400">Ready for Jury Assessment</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="p-6 md:p-8 space-y-6 bg-slate-900">
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                                <div>
                                    <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                                        <FileText className="size-3.5 text-indigo-400" />
                                        <span>Organizer Operations Panel</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-white mt-1">
                                        Event Registrations & Submission Review
                                    </h3>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
                                <div className="rounded-lg bg-slate-950 p-4 border border-slate-800 space-y-1">
                                    <p className="text-slate-400 font-medium">Confirmed Registrations</p>
                                    <p className="text-2xl font-bold text-white">128</p>
                                    <p className="text-[10px] text-slate-500">Student & Team Check-ins</p>
                                </div>

                                <div className="rounded-lg bg-slate-950 p-4 border border-slate-800 space-y-1">
                                    <p className="text-slate-400 font-medium">Project Submissions</p>
                                    <p className="text-2xl font-bold text-indigo-400">42</p>
                                    <p className="text-[10px] text-slate-500">Repos & Demo Videos Attached</p>
                                </div>

                                <div className="rounded-lg bg-slate-950 p-4 border border-slate-800 space-y-1">
                                    <p className="text-slate-400 font-medium">Review Matrix Status</p>
                                    <p className="text-2xl font-bold text-emerald-400">Active</p>
                                    <p className="text-[10px] text-slate-500">Jury Evaluation Assigned</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
