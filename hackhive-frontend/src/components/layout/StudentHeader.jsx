import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    ChevronDown,
    ChevronRight,
    LogOut,
    Menu,
    PanelLeft,
    PanelLeftClose,
    Search,
    Settings,
    User,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";
import NotificationCenter from "../notifications/NotificationCenter";
import GlobalSearchModal from "../search/GlobalSearchModal";

const routeTitleMap = {
    "/student/dashboard": "Dashboard",
    "/student/profile": "Profile",
    "/student/events": "Events",
    "/student/teams": "Teams",
    "/student/workspace": "Workspace",
    "/student/settings": "Settings",
};

export default function StudentHeader({
    isSidebarCollapsed,
    onToggleSidebar,
    onOpenMobileSidebar,
}) {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const currentTitle = routeTitleMap[location.pathname] || "Dashboard";

    const initials = (user?.fullName || user?.email || "Student")
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    const handleLogout = () => {
        setIsMenuOpen(false);
        logout();
        navigate("/");
    };

    const handleNavigate = (path) => {
        setIsMenuOpen(false);
        navigate(path);
    };

    // Keyboard shortcut (⌘K or Ctrl+K) and Escape key handler
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setIsSearchOpen((prev) => !prev);
            }
            if (e.key === "Escape") {
                setIsMenuOpen(false);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    return (
        <>
            <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/80 px-4 sm:px-6 backdrop-blur-md transition-all dark:border-slate-800 dark:bg-slate-900/80">
                {/* Left Section */}
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={onOpenMobileSidebar}
                        className="inline-flex size-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-100 lg:hidden dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-indigo-500"
                        aria-label="Open mobile menu"
                    >
                        <Menu className="size-5" />
                    </button>

                    <button
                        type="button"
                        onClick={onToggleSidebar}
                        className="hidden size-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-100 lg:inline-flex dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-indigo-500"
                        title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                    >
                        {isSidebarCollapsed ? <PanelLeft className="size-5" /> : <PanelLeftClose className="size-5" />}
                    </button>

                    <nav className="flex items-center gap-1.5 text-sm font-medium" aria-label="Breadcrumb">
                        <span className="text-slate-400 dark:text-slate-500">Student</span>
                        <ChevronRight className="size-4 text-slate-300 dark:text-slate-600" />
                        <span className="font-semibold text-slate-900 dark:text-slate-100">
                            {currentTitle}
                        </span>
                    </nav>
                </div>

                {/* Center Search Input Trigger */}
                <div className="hidden max-w-xs flex-1 px-4 sm:block md:max-w-sm">
                    <button
                        type="button"
                        onClick={() => setIsSearchOpen(true)}
                        className="group relative flex h-9 w-full items-center rounded-lg border border-slate-200 bg-slate-50/50 pl-9 pr-12 text-left text-xs text-slate-400 transition hover:border-slate-300 hover:bg-white dark:border-slate-800 dark:bg-slate-800/50 dark:hover:border-slate-700 focus-visible:ring-2 focus-visible:ring-indigo-500"
                    >
                        <Search className="pointer-events-none absolute left-3 size-4 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400" />
                        <span>Search workspace (⌘K)...</span>
                        <kbd className="pointer-events-none absolute right-2.5 rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 dark:border-slate-700 dark:bg-slate-800">
                            ⌘K
                        </kbd>
                    </button>
                </div>

                {/* Right Section: Notifications & Student User Profile Dropdown */}
                <div className="relative flex items-center gap-3">
                    <NotificationCenter />
                    <div className="h-6 w-px bg-slate-200 dark:bg-slate-800" />

                    {/* Interactive Profile Dropdown Trigger */}
                    <button
                        type="button"
                        onClick={() => setIsMenuOpen((prev) => !prev)}
                        className="group flex items-center gap-2.5 rounded-xl border border-transparent p-1.5 text-left transition hover:border-slate-200 hover:bg-slate-100/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:hover:border-slate-800 dark:hover:bg-slate-800/70"
                        aria-expanded={isMenuOpen}
                        aria-haspopup="true"
                        aria-label="User profile menu"
                    >
                        {/* Student Avatar / Initials */}
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-600 to-indigo-500 font-semibold text-xs text-white shadow-xs overflow-hidden ring-2 ring-indigo-100 dark:ring-indigo-950/60">
                            {user?.avatarUrl ? (
                                <img
                                    src={user.avatarUrl}
                                    alt={user?.fullName || "Student"}
                                    className="size-full object-cover"
                                    onError={(e) => {
                                        e.currentTarget.style.display = "none";
                                    }}
                                />
                            ) : null}
                            <span className={user?.avatarUrl ? "hidden" : "block"}>{initials}</span>
                        </div>

                        {/* Student Details */}
                        <div className="hidden text-left md:block">
                            <p className="max-w-[120px] truncate text-xs font-semibold text-slate-900 group-hover:text-indigo-600 dark:text-slate-100 dark:group-hover:text-indigo-400">
                                {user?.fullName || "Student User"}
                            </p>
                            <p className="max-w-[120px] truncate text-[11px] text-slate-500 dark:text-slate-400">
                                {user?.email || "student@hackhive.com"}
                            </p>
                        </div>

                        <ChevronDown className={`size-4 text-slate-400 transition-transform duration-200 ${isMenuOpen ? "rotate-180 text-indigo-600 dark:text-indigo-400" : ""}`} />
                    </button>

                    {/* Student User Dropdown Menu */}
                    {isMenuOpen && (
                        <>
                            {/* Backdrop overlay for closing on click outside */}
                            <div
                                onClick={() => setIsMenuOpen(false)}
                                className="fixed inset-0 z-40"
                            />

                            <div className="absolute right-0 top-12 z-50 w-64 rounded-2xl border border-slate-200/90 bg-white p-2 shadow-xl dark:border-slate-800 dark:bg-slate-900">
                                {/* Header / Identity Summary */}
                                <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
                                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-600 to-indigo-500 font-semibold text-sm text-white shadow-xs overflow-hidden">
                                        {user?.avatarUrl ? (
                                            <img
                                                src={user.avatarUrl}
                                                alt={user?.fullName || "Student"}
                                                className="size-full object-cover"
                                                onError={(e) => {
                                                    e.currentTarget.style.display = "none";
                                                }}
                                            />
                                        ) : null}
                                        <span className={user?.avatarUrl ? "hidden" : "block"}>{initials}</span>
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-xs font-bold text-slate-900 dark:text-slate-100">
                                            {user?.fullName || "Student User"}
                                        </p>
                                        <p className="truncate text-[10px] font-medium text-slate-500 dark:text-slate-400">
                                            {user?.email || "student@hackhive.com"}
                                        </p>
                                    </div>
                                </div>

                                <div className="my-1.5 h-px bg-slate-100 dark:bg-slate-800" />

                                {/* Menu Items */}
                                <div className="space-y-0.5">
                                    <button
                                        type="button"
                                        onClick={() => handleNavigate("/student/profile")}
                                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition dark:text-slate-200 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-300 focus-visible:ring-2 focus-visible:ring-indigo-500"
                                    >
                                        <User className="size-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                                        <span>View Profile</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => handleNavigate("/student/settings")}
                                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition dark:text-slate-200 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-300 focus-visible:ring-2 focus-visible:ring-indigo-500"
                                    >
                                        <Settings className="size-4 text-slate-400 shrink-0" />
                                        <span>Settings</span>
                                    </button>
                                </div>

                                <div className="my-1.5 h-px bg-slate-100 dark:bg-slate-800" />

                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-semibold text-rose-600 hover:bg-rose-50 transition dark:text-rose-400 dark:hover:bg-rose-950/40 focus-visible:ring-2 focus-visible:ring-rose-500"
                                >
                                    <LogOut className="size-4 shrink-0" />
                                    <span>Logout</span>
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </header>

            <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </>
    );
}
