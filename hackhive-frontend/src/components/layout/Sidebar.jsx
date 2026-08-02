import { motion } from "framer-motion";
import { ChevronRight, X } from "lucide-react";

import Logo from "./Logo";
import { cn } from "../../lib/utils";

function Sidebar({
    navItems = [],
    summary,
    activeId,
    onNavigate,
    onClose,
    variant = "desktop",
}) {
    const isMobile = variant === "mobile";

    return (
        <aside className={cn(
            "flex h-full flex-col bg-white",
            isMobile
                ? "w-[86vw] max-w-sm"
                : "sticky top-0 hidden lg:block lg:h-screen lg:w-80 lg:shrink-0"
        )}>
            <div className="flex h-full flex-col border-slate-200 bg-white lg:border-r">
                <div className="flex items-start justify-between gap-3 border-b border-slate-200 px-5 py-5">
                    <Logo tone="light" />

                    {isMobile && (
                        <button
                            type="button"
                            onClick={onClose}
                            className="inline-flex size-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
                            aria-label="Close navigation"
                        >
                            <X className="size-4" />
                        </button>
                    )}
                </div>

                <div className="flex-1 overflow-y-auto px-3 py-4">
                    <div className="px-2 pb-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                            Workspace
                        </p>
                    </div>

                    <nav className="space-y-1">
                        {navItems.map((item) => {
                            const isActive = activeId === item.id;

                            return (
                                <a
                                    key={item.id}
                                    href={`#${item.id}`}
                                    onClick={onNavigate}
                                    className={cn(
                                        "group flex items-start gap-3 rounded-2xl border px-3 py-3 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20",
                                        isActive
                                            ? "border-slate-900 bg-slate-950 text-white shadow-sm"
                                            : "border-transparent text-slate-600 hover:border-slate-200 hover:bg-slate-50 hover:text-slate-950"
                                    )}
                                >
                                    <span className={cn(
                                        "mt-0.5 rounded-xl border p-2 transition",
                                        isActive
                                            ? "border-white/10 bg-white/10 text-white"
                                            : "border-slate-200 bg-white text-slate-600 group-hover:text-slate-900"
                                    )}>
                                        <item.icon className="size-4" />
                                    </span>

                                    <span className="min-w-0 flex-1">
                                        <span className="flex items-center justify-between gap-3">
                                            <span className="text-sm font-medium">
                                                {item.label}
                                            </span>
                                            <ChevronRight
                                                className={cn(
                                                    "size-4 shrink-0 transition",
                                                    isActive ? "text-white/70" : "text-slate-300"
                                                )}
                                            />
                                        </span>

                                        <span className={cn(
                                            "mt-1 block text-xs leading-5",
                                            isActive ? "text-slate-300" : "text-slate-500"
                                        )}>
                                            {item.description}
                                        </span>
                                    </span>
                                </a>
                            );
                        })}
                    </nav>
                </div>

                {summary && (
                    <div className="border-t border-slate-200 p-4">
                        <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.28 }}
                            className="rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-[0_1px_2px_rgba(15,23,42,0.03)]"
                        >
                            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                                {summary.eyebrow}
                            </p>
                            <h3 className="mt-2 text-base font-semibold tracking-tight text-slate-950">
                                {summary.title}
                            </h3>
                            <p className="mt-1 text-sm leading-6 text-slate-500">
                                {summary.description}
                            </p>

                            {Array.isArray(summary.metrics) && summary.metrics.length > 0 && (
                                <div className="mt-4 grid gap-2">
                                    {summary.metrics.map((metric) => (
                                        <div
                                            key={metric.label}
                                            className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm"
                                        >
                                            <span className="text-slate-500">
                                                {metric.label}
                                            </span>
                                            <span className="font-medium text-slate-950">
                                                {metric.value}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </div>
        </aside>
    );
}

export default Sidebar;