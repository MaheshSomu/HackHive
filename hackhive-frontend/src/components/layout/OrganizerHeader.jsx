import { useEffect, useRef, useState } from "react";
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
import { organizerService } from "../../services/organizerService";
import { getImageUrl } from "../../utils/imageUtils";
import NotificationCenter from "../notifications/NotificationCenter";
import GlobalSearchModal from "../search/GlobalSearchModal";

const routeTitleMap = {
    "/organizer/dashboard": "Dashboard",
    "/organizer/profile": "Profile",
    "/organizer/events": "Manage Events",
    "/organizer/registrations": "Registrations",
    "/organizer/analytics": "Analytics",
    "/organizer/settings": "Settings",
};

export default function OrganizerHeader({
    isSidebarCollapsed,
    onToggleSidebar,
    onOpenMobileSidebar,
}) {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [profile, setProfile] = useState(null);

    const currentTitle = routeTitleMap[location.pathname] || "Dashboard";

    useEffect(() => {
        let isMounted = true;
        organizerService
            .getProfile()
            .then((data) => {
                if (isMounted && data) {
                    setProfile(data);
                }
            })
            .catch(() => {
                // Ignore silent fetch error, will fallback to auth user info
            });
        return () => {
            isMounted = false;
        };
    }, []);

    const orgName = profile?.organizationName || user?.fullName || "Organizer";
    const initials = orgName
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
                        className="inline-flex size-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-100 lg:hidden dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800"
                        aria-label="Open mobile menu"
                    >
                        <Menu className="size-5" />
                    </button>

                    <button
                        type="button"
                        onClick={onToggleSidebar}
                        className="hidden size-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-100 lg:inline-flex dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800"
                        title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                    >
                        {isSidebarCollapsed ? <PanelLeft className="size-5" /> : <PanelLeftClose className="size-5" />}
                    </button>

                    <nav className="flex items-center gap-1.5 text-sm font-medium">
                        <span className="text-slate-400 dark:text-slate-500">Organizer</span>
                        <ChevronRight className="size-4 text-slate-300 dark:text-slate-600" />
                        <span className="font-semibold text-slate-900 dark:text-slate-100">
                            {currentTitle}
                        </span>
                    </nav>
                </div>

                {/* Search */}
                <div className="hidden max-w-xs flex-1 px-4 sm:block md:max-w-sm">
                    <button
                        type="button"
                        onClick={() => setIsSearchOpen(true)}
                        className="group relative flex h-9 w-full items-center rounded-lg border border-slate-200 bg-slate-50/50 pl-9 pr-12 text-left text-xs text-slate-400 transition hover:border-slate-300 hover:bg-white dark:border-slate-800 dark:bg-slate-800/50 dark:hover:border-slate-700"
                    >
                        <Search className="pointer-events-none absolute left-3 size-4 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                        <span>Search organizer portal (⌘K)...</span>
                        <kbd className="pointer-events-none absolute right-2.5 rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 dark:border-slate-700 dark:bg-slate-800">
                            ⌘K
                        </kbd>
                    </button>
                </div>

                {/* User Profile & Dropdown Area */}
                <div className="relative flex items-center gap-3">
                    <NotificationCenter />

                    {/* Organizer Profile Clickable Trigger */}
                    <button
                        type="button"
                        onClick={() => setIsMenuOpen((prev) => !prev)}
                        className="group flex items-center gap-2.5 rounded-xl border border-transparent p-1.5 text-left transition hover:border-slate-200 hover:bg-slate-100/70 focus:outline-hidden dark:hover:border-slate-800 dark:hover:bg-slate-800/70"
                        aria-expanded={isMenuOpen}
                        aria-haspopup="true"
                    >
                        {/* Logo or Initials */}
                        <div className="relative flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 font-bold text-xs text-white shadow-xs overflow-hidden ring-2 ring-blue-100 dark:ring-blue-950/60">
                            {profile?.logoUrl ? (
                                <img
                                    src={getImageUrl(profile.logoUrl)}
                                    alt={orgName}
                                    className="size-full object-cover"
                                    onError={(e) => {
                                        e.currentTarget.style.display = "none";
                                    }}
                                />
                            ) : null}
                            <span className={profile?.logoUrl ? "hidden" : "block"}>{initials}</span>
                        </div>

                        {/* Name and Role */}
                        <div className="hidden text-left md:block">
                            <p className="max-w-[130px] truncate text-xs font-semibold text-slate-900 group-hover:text-blue-600 dark:text-slate-100 dark:group-hover:text-blue-400">
                                {orgName}
                            </p>
                            <p className="max-w-[130px] truncate text-[10px] font-semibold text-blue-600 dark:text-blue-400">
                                ORGANIZER
                            </p>
                        </div>

                        <ChevronDown className={`size-4 text-slate-400 transition-transform duration-200 ${isMenuOpen ? "rotate-180 text-blue-600 dark:text-blue-400" : ""}`} />
                    </button>

                    {/* Professional Dropdown Menu */}
                    {isMenuOpen && (
                        <>
                            {/* Backdrop overlay for closing on click outside */}
                            <div
                                onClick={() => setIsMenuOpen(false)}
                                className="fixed inset-0 z-40"
                            />

                            <div className="absolute right-0 top-12 z-50 w-64 rounded-2xl border border-slate-200/90 bg-white p-2 shadow-xl dark:border-slate-800 dark:bg-slate-900">
                                {/* Header / Identity Card */}
                                <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
                                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 font-bold text-sm text-white shadow-xs overflow-hidden">
                                        {profile?.logoUrl ? (
                                            <img
                                                src={getImageUrl(profile.logoUrl)}
                                                alt={orgName}
                                                className="size-full object-cover"
                                                onError={(e) => {
                                                    e.currentTarget.style.display = "none";
                                                }}
                                            />
                                        ) : null}
                                        <span className={profile?.logoUrl ? "hidden" : "block"}>{initials}</span>
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-xs font-bold text-slate-900 dark:text-slate-100">
                                            {orgName}
                                        </p>
                                        <p className="truncate text-[10px] font-medium text-slate-500 dark:text-slate-400">
                                            {user?.email || "Organizer"}
                                        </p>
                                    </div>
                                </div>

                                <div className="my-1.5 h-px bg-slate-100 dark:bg-slate-800" />

                                {/* Options */}
                                <div className="space-y-0.5">
                                    <button
                                        type="button"
                                        onClick={() => handleNavigate("/organizer/profile")}
                                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                                    >
                                        <User className="size-4 text-blue-600 dark:text-blue-400 shrink-0" />
                                        <span>View Profile</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => handleNavigate("/organizer/settings")}
                                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                                    >
                                        <Settings className="size-4 text-slate-400 shrink-0" />
                                        <span>Settings</span>
                                    </button>
                                </div>

                                <div className="my-1.5 h-px bg-slate-100 dark:bg-slate-800" />

                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-semibold text-rose-600 hover:bg-rose-50 transition dark:text-rose-400 dark:hover:bg-rose-950/40"
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

