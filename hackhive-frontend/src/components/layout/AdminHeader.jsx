import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    ChevronRight,
    LogOut,
    Menu,
    PanelLeft,
    PanelLeftClose,
    Search,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";
import NotificationCenter from "../notifications/NotificationCenter";
import GlobalSearchModal from "../search/GlobalSearchModal";

const routeTitleMap = {
    "/admin/dashboard": "Dashboard",
    "/admin/users": "User Management",
    "/admin/students": "Student Management",
    "/admin/organizers": "Organizer Management",
    "/admin/events": "Event Management",
    "/admin/reports": "Reports",
    "/admin/settings": "Settings",
};

export default function AdminHeader({
    isSidebarCollapsed,
    onToggleSidebar,
    onOpenMobileSidebar,
}) {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const currentTitle = routeTitleMap[location.pathname] || "Dashboard";

    const initials = (user?.fullName || user?.email || "Admin")
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setIsSearchOpen((prev) => !prev);
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
                        <span className="text-slate-400 dark:text-slate-500">Admin Control</span>
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
                        <Search className="pointer-events-none absolute left-3 size-4 text-slate-400 group-hover:text-rose-600 dark:group-hover:text-rose-400" />
                        <span>Search system registry (⌘K)...</span>
                        <kbd className="pointer-events-none absolute right-2.5 rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 dark:border-slate-700 dark:bg-slate-800">
                            ⌘K
                        </kbd>
                    </button>
                </div>

                {/* User Profile */}
                <div className="flex items-center gap-3">
                    <NotificationCenter />
                    <div className="flex items-center gap-2.5">
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-rose-600 to-red-600 font-bold text-xs text-white shadow-xs">
                            {initials}
                        </div>

                        <div className="hidden text-left md:block">
                            <p className="max-w-[120px] truncate text-xs font-semibold text-slate-900 dark:text-slate-100">
                                {user?.fullName || "Administrator"}
                            </p>
                            <p className="max-w-[120px] truncate text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase">
                                ADMINISTRATOR
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleLogout}
                        className="inline-flex size-8 items-center justify-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition dark:hover:bg-rose-950/40"
                        title="Logout"
                    >
                        <LogOut className="size-4" />
                    </button>
                </div>
            </header>

            <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </>
    );
}
