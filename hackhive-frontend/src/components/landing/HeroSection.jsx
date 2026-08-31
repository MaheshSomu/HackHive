import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Compass, UserCheck, Users, UploadCloud, ArrowDown } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import { Button } from "../ui/Button";

export default function HeroSection() {
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();

    const handleExploreClick = () => {
        if (isAuthenticated && user?.role === "STUDENT") {
            navigate("/student/events");
        } else if (isAuthenticated && user?.role === "ORGANIZER") {
            navigate("/organizer/events");
        } else {
            navigate("/login");
        }
    };

    return (
        <section id="home" className="relative pt-12 pb-16 lg:pt-20 lg:pb-24 overflow-hidden bg-white dark:bg-slate-950">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
                    
                    {/* Left Copy */}
                    <div className="lg:col-span-6 space-y-6 text-left">
                        {/* Eyebrow */}
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                            THE HACKATHON PLATFORM
                        </span>

                        {/* Main Headline */}
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-950 dark:text-white leading-[1.1]">
                            Discover Hackathons. <br />
                            Build Teams. <br />
                            <span className="text-indigo-600 dark:text-indigo-400">Ship Ideas.</span>
                        </h1>

                        {/* Supporting Text */}
                        <p className="max-w-xl text-base sm:text-lg text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
                            HackHive connects students and hackathon organizers in one place — from discovering opportunities and building teams to creating projects and submitting them.
                        </p>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap items-center gap-3 pt-1">
                            <Button
                                type="button"
                                variant="primary"
                                size="lg"
                                onClick={handleExploreClick}
                                className="rounded-lg font-semibold gap-2 px-6 py-3 text-sm"
                            >
                                <span>Explore Hackathons</span>
                                <ArrowRight className="size-4" />
                            </Button>

                            <Link to="/register">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="lg"
                                    className="rounded-lg border-slate-300 text-slate-800 dark:border-slate-700 dark:text-slate-200 font-semibold px-6 py-3 text-sm"
                                >
                                    Get Started
                                </Button>
                            </Link>
                        </div>

                        {/* Sub-text below buttons */}
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                            One platform for the complete hackathon journey.
                        </p>
                    </div>

                    {/* Right Side Visual: Realistic Hackathon Journey UI Diagram */}
                    <div className="lg:col-span-6">
                        <div className="rounded-xl border border-slate-200/90 bg-slate-50/80 p-6 sm:p-8 dark:border-slate-800 dark:bg-slate-900/60 shadow-2xs space-y-5">
                            {/* Panel Header */}
                            <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4">
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                                    Hackathon Journey
                                </span>
                                <span className="rounded bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800 px-2 py-0.5 text-[10px] font-semibold text-indigo-600 dark:text-indigo-300">
                                    WORKFLOW DIAGRAM
                                </span>
                            </div>

                            {/* 4 Connected Product Nodes */}
                            <div className="space-y-3">
                                {/* 01 Discover */}
                                <div className="flex items-center justify-between p-3.5 rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs font-mono font-bold text-slate-400">01</span>
                                        <div className="p-1.5 rounded-md bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                                            <Compass className="size-4" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-900 dark:text-white">Discover</p>
                                            <p className="text-[11px] text-slate-500 dark:text-slate-400">Find an opportunity</p>
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-semibold text-slate-400 uppercase">Available</span>
                                </div>

                                <div className="flex justify-center text-slate-300 dark:text-slate-700 py-0.5">
                                    <ArrowDown className="size-3.5" />
                                </div>

                                {/* 02 Register */}
                                <div className="flex items-center justify-between p-3.5 rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs font-mono font-bold text-slate-400">02</span>
                                        <div className="p-1.5 rounded-md bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                                            <UserCheck className="size-4" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-900 dark:text-white">Register</p>
                                            <p className="text-[11px] text-slate-500 dark:text-slate-400">Join the event</p>
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">Confirmed</span>
                                </div>

                                <div className="flex justify-center text-slate-300 dark:text-slate-700 py-0.5">
                                    <ArrowDown className="size-3.5" />
                                </div>

                                {/* 03 Build */}
                                <div className="flex items-center justify-between p-3.5 rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs font-mono font-bold text-slate-400">03</span>
                                        <div className="p-1.5 rounded-md bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                                            <Users className="size-4" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-900 dark:text-white">Build</p>
                                            <p className="text-[11px] text-slate-500 dark:text-slate-400">Team + Project</p>
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400">In Progress</span>
                                </div>

                                <div className="flex justify-center text-slate-300 dark:text-slate-700 py-0.5">
                                    <ArrowDown className="size-3.5" />
                                </div>

                                {/* 04 Submit */}
                                <div className="flex items-center justify-between p-3.5 rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs font-mono font-bold text-slate-400">04</span>
                                        <div className="p-1.5 rounded-md bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                                            <UploadCloud className="size-4" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-900 dark:text-white">Submit</p>
                                            <p className="text-[11px] text-slate-500 dark:text-slate-400">Final project</p>
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 font-bold">Ready</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
