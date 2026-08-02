import { Bell, CalendarDays, Menu, Search } from "lucide-react";

import { Button } from "../ui/Button";

function Navbar({
    title,
    subtitle,
    user,
    dateLabel,
    actions = [],
    onMenuClick,
    activeLabel,
}) {
    const initials = (user?.fullName || user?.email || "HH")
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    return (
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-slate-50/90 backdrop-blur">
            <div className="mx-auto flex min-h-20 w-full max-w-7xl items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
                <div className="flex min-w-0 flex-1 items-center gap-3">
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={onMenuClick}
                        className="shrink-0 rounded-full border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 lg:hidden"
                        aria-label="Open navigation"
                    >
                        <Menu className="size-4" />
                    </Button>

                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                            <h1 className="truncate text-base font-semibold tracking-tight text-slate-950 sm:text-lg">
                                {title}
                            </h1>
                            {activeLabel && (
                                <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-slate-500">
                                    {activeLabel}
                                </span>
                            )}
                        </div>
                        <p className="mt-1 truncate text-sm leading-6 text-slate-500">
                            {subtitle}
                        </p>
                    </div>
                </div>

                <div className="hidden items-center gap-2 md:flex">
                    <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500">
                        <CalendarDays className="size-4 text-slate-400" />
                        <span>{dateLabel}</span>
                    </div>

                    <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500">
                        <Bell className="size-4 text-slate-400" />
                        <span>{user?.role || "STUDENT"}</span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {actions.map((action, index) => (
                        <div key={index} className="hidden sm:block">
                            {action}
                        </div>
                    ))}

                    <div className="hidden items-center gap-3 rounded-full border border-slate-200 bg-white px-3 py-2 sm:flex">
                        <span className="flex size-9 items-center justify-center rounded-full bg-slate-950 text-sm font-semibold text-white">
                            {initials}
                        </span>
                        <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-slate-950">
                                {user?.fullName}
                            </p>
                            <p className="truncate text-xs text-slate-500">
                                {user?.email}
                            </p>
                        </div>
                    </div>

                    <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500 xl:flex">
                        <Search className="size-4 text-slate-400" />
                        <span className="max-w-40 truncate">Search dashboard</span>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Navbar;