import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Moon, Sun, Menu, X, ArrowRight, LayoutDashboard, Hexagon } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import { getDashboardPath } from "../../utils/authRoutes";
import { Button } from "../ui/Button";

export default function LandingNavbar() {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isDark, setIsDark] = useState(() => {
        if (typeof window !== "undefined") {
            return document.documentElement.classList.contains("dark");
        }
        return false;
    });
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const toggleTheme = () => {
        const root = document.documentElement;
        if (root.classList.contains("dark")) {
            root.classList.remove("dark");
            localStorage.setItem("theme", "light");
            setIsDark(false);
        } else {
            root.classList.add("dark");
            localStorage.setItem("theme", "dark");
            setIsDark(true);
        }
    };

    const handleNavClick = (e, targetId) => {
        e.preventDefault();
        setMobileMenuOpen(false);
        const element = document.getElementById(targetId);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    const handleEventsClick = (e) => {
        e.preventDefault();
        setMobileMenuOpen(false);
        if (isAuthenticated && user?.role === "STUDENT") {
            navigate("/student/events");
        } else if (isAuthenticated && user?.role === "ORGANIZER") {
            navigate("/organizer/events");
        } else {
            navigate("/login");
        }
    };

    return (
        <header
            className={`sticky top-0 z-50 transition-colors duration-200 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xs ${
                scrolled
                    ? "border-b border-slate-200/90 dark:border-slate-800/90 shadow-2xs"
                    : "border-b border-slate-200/60 dark:border-slate-800/60"
            }`}
        >
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Brand Logo & Name */}
                <Link to="/" className="flex items-center gap-2.5 focus:outline-none">
                    <div className="flex size-9 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-xs">
                        <Hexagon size={18} strokeWidth={2.5} />
                    </div>
                    <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                        HackHive
                    </span>
                </Link>

                {/* Center Nav Links */}
                <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600 dark:text-slate-400">
                    <a
                        href="#home"
                        onClick={(e) => handleNavClick(e, "home")}
                        className="hover:text-indigo-600 dark:hover:text-white transition-colors"
                    >
                        Home
                    </a>
                    <button
                        type="button"
                        onClick={handleEventsClick}
                        className="hover:text-indigo-600 dark:hover:text-white transition-colors cursor-pointer"
                    >
                        Events
                    </button>
                    <a
                        href="#how-it-works"
                        onClick={(e) => handleNavClick(e, "how-it-works")}
                        className="hover:text-indigo-600 dark:hover:text-white transition-colors"
                    >
                        How It Works
                    </a>
                    <a
                        href="#about"
                        onClick={(e) => handleNavClick(e, "about")}
                        className="hover:text-indigo-600 dark:hover:text-white transition-colors"
                    >
                        About
                    </a>
                </nav>

                {/* Right Side Actions */}
                <div className="hidden md:flex items-center gap-3">
                    <button
                        type="button"
                        onClick={toggleTheme}
                        aria-label="Toggle theme"
                        className="flex size-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                        {isDark ? <Sun className="size-4 text-amber-400" /> : <Moon className="size-4 text-indigo-600" />}
                    </button>

                    {isAuthenticated && user ? (
                        <Button
                            type="button"
                            variant="primary"
                            size="sm"
                            onClick={() => navigate(getDashboardPath(user.role))}
                            className="rounded-lg font-semibold text-xs gap-1.5"
                        >
                            <LayoutDashboard className="size-3.5" />
                            <span>Go to Dashboard</span>
                        </Button>
                    ) : (
                        <>
                            <Link to="/login">
                                <Button type="button" variant="ghost" size="sm" className="font-semibold text-xs text-slate-700 dark:text-slate-300">
                                    Sign In
                                </Button>
                            </Link>
                            <Link to="/register">
                                <Button type="button" variant="primary" size="sm" className="rounded-lg font-semibold text-xs gap-1">
                                    <span>Get Started</span>
                                    <ArrowRight className="size-3" />
                                </Button>
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Menu */}
                <div className="flex md:hidden items-center gap-2">
                    <button
                        type="button"
                        onClick={toggleTheme}
                        aria-label="Toggle theme"
                        className="flex size-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 cursor-pointer"
                    >
                        {isDark ? <Sun className="size-4 text-amber-400" /> : <Moon className="size-4 text-indigo-600" />}
                    </button>
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Toggle navigation menu"
                        className="flex size-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 cursor-pointer"
                    >
                        {mobileMenuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation Drawer */}
            {mobileMenuOpen && (
                <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-6 shadow-md dark:border-slate-800 dark:bg-slate-950 space-y-4">
                    <nav className="flex flex-col space-y-1 text-sm font-medium">
                        <a
                            href="#home"
                            onClick={(e) => handleNavClick(e, "home")}
                            className="rounded-lg px-3 py-2 text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900"
                        >
                            Home
                        </a>
                        <button
                            type="button"
                            onClick={handleEventsClick}
                            className="text-left rounded-lg px-3 py-2 text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900"
                        >
                            Events
                        </button>
                        <a
                            href="#how-it-works"
                            onClick={(e) => handleNavClick(e, "how-it-works")}
                            className="rounded-lg px-3 py-2 text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900"
                        >
                            How It Works
                        </a>
                        <a
                            href="#about"
                            onClick={(e) => handleNavClick(e, "about")}
                            className="rounded-lg px-3 py-2 text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900"
                        >
                            About
                        </a>
                    </nav>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
                        {isAuthenticated && user ? (
                            <Button
                                type="button"
                                variant="primary"
                                onClick={() => {
                                    setMobileMenuOpen(false);
                                    navigate(getDashboardPath(user.role));
                                }}
                                className="w-full justify-center rounded-lg font-semibold py-2"
                            >
                                <LayoutDashboard className="size-4 mr-2" />
                                Go to Dashboard
                            </Button>
                        ) : (
                            <>
                                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                                    <Button type="button" variant="outline" className="w-full justify-center rounded-lg font-semibold py-2">
                                        Sign In
                                    </Button>
                                </Link>
                                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                                    <Button type="button" variant="primary" className="w-full justify-center rounded-lg font-semibold py-2">
                                        Get Started
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}
