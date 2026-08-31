import { Briefcase, GraduationCap, Code2, Award, FileText, Globe, CheckCircle, Sparkles, ExternalLink } from "lucide-react";

export default function ProfileShowcaseSection() {
    return (
        <section className="py-20 lg:py-28 bg-white dark:bg-slate-950">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    
                    {/* Left Copy Column */}
                    <div className="lg:col-span-5 space-y-6">
                        <span className="rounded-full bg-purple-50 px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-widest text-purple-600 dark:bg-purple-950/70 dark:text-purple-300">
                            Student Developer Identity
                        </span>

                        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                            More Than Just Events.
                        </h2>

                        <p className="text-base text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                            HackHive empowers you to transform event participation into a living, verified professional profile that highlights your skills, projects, and hackathon victories.
                        </p>

                        <div className="grid grid-cols-2 gap-4 pt-2">
                            <div className="flex items-center gap-3 rounded-2xl bg-slate-50 dark:bg-slate-900 p-3.5 border border-slate-200/80 dark:border-slate-800">
                                <div className="p-2 rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                                    <Code2 className="size-4" />
                                </div>
                                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Verified Skills</span>
                            </div>

                            <div className="flex items-center gap-3 rounded-2xl bg-slate-50 dark:bg-slate-900 p-3.5 border border-slate-200/80 dark:border-slate-800">
                                <div className="p-2 rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                                    <Briefcase className="size-4" />
                                </div>
                                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Project Portfolio</span>
                            </div>

                            <div className="flex items-center gap-3 rounded-2xl bg-slate-50 dark:bg-slate-900 p-3.5 border border-slate-200/80 dark:border-slate-800">
                                <div className="p-2 rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
                                    <Award className="size-4" />
                                </div>
                                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Certifications</span>
                            </div>

                            <div className="flex items-center gap-3 rounded-2xl bg-slate-50 dark:bg-slate-900 p-3.5 border border-slate-200/80 dark:border-slate-800">
                                <div className="p-2 rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-950 dark:text-purple-400">
                                    <FileText className="size-4" />
                                </div>
                                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Resume & Links</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Visual Profile Card Mock */}
                    <div className="lg:col-span-7 relative">
                        <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 opacity-20 blur-xl dark:opacity-30" />

                        <div className="relative rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-2xl dark:border-slate-800 dark:bg-slate-900 space-y-6">
                            {/* Profile Header */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
                                <div className="flex items-center gap-4">
                                    <div className="relative flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 text-xl font-black text-white shadow-md">
                                        MS
                                        <span className="absolute -bottom-1 -right-1 flex size-5 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900">
                                            <CheckCircle className="size-3 text-white" />
                                        </span>
                                    </div>

                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-xl font-black text-slate-900 dark:text-white">
                                                Mahesh Somu
                                            </h3>
                                            <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-[10px] font-extrabold text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                                                Full Stack Engineer
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                                            <span className="flex items-center gap-1">
                                                <GraduationCap className="size-3.5 text-indigo-500" />
                                                Computer Science B.Tech
                                            </span>
                                            <span>•</span>
                                            <span className="flex items-center gap-1">
                                                <Globe className="size-3.5 text-indigo-500" />
                                                github.com/somumahesh
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
                                    <span className="inline-flex items-center gap-1 rounded-xl bg-slate-100 dark:bg-slate-800 px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                                        <FileText className="size-3.5 text-indigo-500" /> Resume Verified
                                    </span>
                                </div>
                            </div>

                            {/* Skills Showcase */}
                            <div className="space-y-2">
                                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                                    Verified Skill Tags
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {["React.js", "Java Spring Boot", "Tailwind CSS", "Node.js", "PostgreSQL", "REST APIs", "Docker", "Git"].map((skill, idx) => (
                                        <span key={idx} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Featured Hackathon Project Card */}
                            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-5 dark:border-slate-800 dark:bg-slate-800/50 space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Sparkles className="size-4 text-amber-500" />
                                        <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                                            Featured Hackathon Submission
                                        </span>
                                    </div>
                                    <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                        1st Place Winner 🏆
                                    </span>
                                </div>

                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                                            HackHive Platform & Developer Hub
                                        </h4>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                                            Built a complete web platform connecting students with university hackathons and real-time team collaboration.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200/60 dark:border-slate-700/60 font-semibold text-slate-600 dark:text-slate-400">
                                    <span>Team HackHive (4 Members)</span>
                                    <span className="text-indigo-600 dark:text-indigo-400 flex items-center gap-1 cursor-pointer">
                                        View Demo <ExternalLink className="size-3" />
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
