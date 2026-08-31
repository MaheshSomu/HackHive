import { Link, useNavigate } from "react-router-dom";
import { Hexagon } from "lucide-react";
import useAuth from "../../hooks/useAuth";

export default function LandingFooter() {
    const currentYear = new Date().getFullYear();
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();

    const handleScrollTo = (e, id) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    const handleEventsClick = (e) => {
        e.preventDefault();
        if (isAuthenticated && user?.role === "STUDENT") {
            navigate("/student/events");
        } else if (isAuthenticated && user?.role === "ORGANIZER") {
            navigate("/organizer/events");
        } else {
            navigate("/login");
        }
    };

    return (
        <footer className="border-t border-slate-200 bg-white py-12 dark:border-slate-800 dark:bg-slate-950">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="md:col-span-1 space-y-3">
                        <div className="flex items-center gap-2.5">
                            <div className="flex size-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
                                <Hexagon size={18} strokeWidth={2.5} />
                            </div>
                            <span className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                                HackHive
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-normal leading-relaxed">
                            The complete hackathon platform for students and organizers.
                        </p>
                    </div>

                    {/* Navigation */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                            Navigation
                        </h4>
                        <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400 font-medium">
                            <li>
                                <a href="#home" onClick={(e) => handleScrollTo(e, "home")} className="hover:text-indigo-600 dark:hover:text-white transition-colors">
                                    Home
                                </a>
                            </li>
                            <li>
                                <button type="button" onClick={handleEventsClick} className="hover:text-indigo-600 dark:hover:text-white transition-colors cursor-pointer">
                                    Events
                                </button>
                            </li>
                            <li>
                                <a href="#how-it-works" onClick={(e) => handleScrollTo(e, "how-it-works")} className="hover:text-indigo-600 dark:hover:text-white transition-colors">
                                    How It Works
                                </a>
                            </li>
                            <li>
                                <a href="#about" onClick={(e) => handleScrollTo(e, "about")} className="hover:text-indigo-600 dark:hover:text-white transition-colors">
                                    About
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Account */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                            Account
                        </h4>
                        <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400 font-medium">
                            <li>
                                <Link to="/login" className="hover:text-indigo-600 dark:hover:text-white transition-colors">
                                    Sign In
                                </Link>
                            </li>
                            <li>
                                <Link to="/register" className="hover:text-indigo-600 dark:hover:text-white transition-colors">
                                    Get Started
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Organizer */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                            Organizer
                        </h4>
                        <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400 font-medium">
                            <li>
                                <Link to="/register" className="hover:text-indigo-600 dark:hover:text-white transition-colors">
                                    Host an Event
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Line */}
                <div className="pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 dark:text-slate-500 font-normal gap-4">
                    <p>© {currentYear} HackHive. All rights reserved.</p>
                    <p>Discover hackathons, build teams, and ship projects.</p>
                </div>
            </div>
        </footer>
    );
}
