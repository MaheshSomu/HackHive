import { NavLink, useNavigate } from "react-router-dom";
import {
    BarChart3,
    CalendarDays,
    ChevronLeft,
    ChevronRight,
    FolderGit2,
    Hexagon,
    LayoutDashboard,
    LogOut,
    Settings,
    UserCheck,
    X,
} from "lucide-react";

import { cn } from "../../lib/utils";
import useAuth from "../../hooks/useAuth";

const organizerNavItems = [
    { name: "Dashboard", href: "/organizer/dashboard", icon: LayoutDashboard },
    { name: "Manage Events", href: "/organizer/events", icon: CalendarDays },
    { name: "Registrations", href: "/organizer/registrations", icon: UserCheck },
    { name: "Project Submissions", href: "/organizer/project-submissions", icon: FolderGit2 },
    { name: "Analytics", href: "/organizer/analytics", icon: BarChart3 },
    { name: "Settings", href: "/organizer/settings", icon: Settings },
];

export default function OrganizerSidebar({
    isCollapsed = false,
    onToggleCollapse,
    variant = "desktop",
    onClose,
}) {
    const navigate = useNavigate();
    const { logout, user } = useAuth();
    const isMobile = variant === "mobile";

    const handleLogout = () => {
        logout();
        navigate("/");
        if (onClose) onClose();
    };

    return (
        <aside
            className={cn(
                "flex h-full flex-col border-r border-slate-200 bg-white transition-all duration-300 dark:border-slate-800 dark:bg-slate-900",
                isMobile ? "w-72" : isCollapsed ? "w-20" : "w-64"
            )}
        >
            {/* Header / Brand */}
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 px-4 dark:border-slate-800">
                <div className="flex items-center gap-3 overflow-hidden">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 shadow-md shadow-purple-500/20">
                        <Hexagon className="size-5 text-white" strokeWidth={2.5} />
                    </div>

                    {(!isCollapsed || isMobile) && (
                        <div className="flex min-w-0 flex-1 items-center justify-between">
                            <div className="truncate">
                                <h2 className="truncate text-base font-bold tracking-tight text-slate-900 dark:text-slate-100">
                                    HackHive
                                </h2>
                                <p className="truncate text-[10px] font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                                    Organizer Portal
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {isMobile && (
                    <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex size-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-400"
                        aria-label="Close sidebar"
                    >
                        <X className="size-4" />
                    </button>
                )}
            </div>

            {/* Navigation */}
            <div className="flex flex-1 flex-col overflow-y-auto px-3 py-4">
                {(!isCollapsed || isMobile) && (
                    <div className="mb-2 px-3">
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                            Management
                        </p>
                    </div>
                )}

                <nav className="space-y-1">
                    {organizerNavItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <NavLink
                                key={item.name}
                                to={item.href}
                                onClick={isMobile ? onClose : undefined}
                                className={({ isActive }) =>
                                    cn(
                                        "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium transition-all duration-150 outline-none",
                                        isCollapsed && !isMobile
                                            ? "justify-center px-0 py-3"
                                            : "justify-start",
                                        isActive
                                            ? "bg-purple-50/90 text-purple-700 font-bold shadow-xs dark:bg-purple-950/50 dark:text-purple-300"
                                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-100"
                                    )
                                }
                                title={isCollapsed && !isMobile ? item.name : undefined}
                            >
                                {({ isActive }) => (
                                    <>
                                        {isActive && (
                                            <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-purple-600 dark:bg-purple-500" />
                                        )}

                                        <Icon
                                            className={cn(
                                                "size-4.5 shrink-0 transition-transform duration-150 group-hover:scale-105",
                                                isActive
                                                    ? "text-purple-600 dark:text-purple-400"
                                                    : "text-slate-400 group-hover:text-slate-600 dark:text-slate-500"
                                            )}
                                        />

                                        {(!isCollapsed || isMobile) && (
                                            <span className="truncate">{item.name}</span>
                                        )}
                                    </>
                                )}
                            </NavLink>
                        );
                    })}
                </nav>

                <div className="my-4 border-t border-slate-100 dark:border-slate-800" />

                {/* Logout */}
                <div className="space-y-1">
                    <button
                        type="button"
                        onClick={handleLogout}
                        className={cn(
                            "group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium text-slate-600 transition-all duration-150 hover:bg-rose-50 hover:text-rose-600 dark:text-slate-400 dark:hover:bg-rose-950/40",
                            isCollapsed && !isMobile ? "justify-center px-0 py-3" : "justify-start"
                        )}
                        title={isCollapsed && !isMobile ? "Logout" : undefined}
                    >
                        <LogOut className="size-4.5 shrink-0 text-slate-400 group-hover:text-rose-600" />
                        {(!isCollapsed || isMobile) && <span>Logout</span>}
                    </button>
                </div>
            </div>

            {/* Sidebar Footer */}
            <div className="border-t border-slate-200 p-3 dark:border-slate-800">
                {(!isCollapsed || isMobile) ? (
                    <div className="flex items-center justify-between rounded-xl bg-slate-50 p-2.5 dark:bg-slate-800/50">
                        <div className="flex items-center gap-2.5 min-w-0">
                            <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-purple-900 font-bold text-[10px] text-white">
                                {(user?.fullName || user?.email || "O")[0].toUpperCase()}
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-xs font-semibold text-slate-900 dark:text-slate-100">
                                    {user?.fullName || "Organizer"}
                                </p>
                                <p className="truncate text-[10px] text-slate-500">Host Control</p>
                            </div>
                        </div>

                        {!isMobile && onToggleCollapse && (
                            <button
                                type="button"
                                onClick={onToggleCollapse}
                                className="inline-flex size-6 items-center justify-center rounded-md text-slate-400 hover:bg-slate-200 hover:text-slate-700"
                                title="Collapse Sidebar"
                            >
                                <ChevronLeft className="size-4" />
                            </button>
                        )}
                    </div>
                ) : (
                    <button
                        type="button"
                        onClick={onToggleCollapse}
                        className="flex w-full items-center justify-center rounded-xl p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                        title="Expand Sidebar"
                    >
                        <ChevronRight className="size-4" />
                    </button>
                )}
            </div>
        </aside>
    );
}
