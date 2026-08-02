import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
    Bell,
    Calendar,
    Check,
    CheckCheck,
    Clock,
    ShieldAlert,
    Trash2,
    UserCheck,
    Users,
    X,
} from "lucide-react";
import { useNotifications } from "../../context/NotificationContext";

export default function NotificationCenter() {
    const [isOpen, setIsOpen] = useState(false);
    const {
        notifications,
        unreadCount,
        loading,
        filter,
        setFilter,
        markAsRead,
        markAllAsRead,
        removeNotification,
    } = useNotifications();

    return (
        <div className="relative">
            {/* Bell Icon Trigger */}
            <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                className="relative flex size-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-100 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800"
                title="Notifications"
                aria-label="Open notifications"
            >
                <Bell className="size-4.5" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-rose-600 font-extrabold text-[9px] text-white shadow-xs animate-pulse">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </button>

            {/* Notification Dropdown Menu */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Overlay backdrop */}
                        <div
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 z-40"
                        />

                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.15 }}
                            className="absolute right-0 top-12 z-50 flex w-80 sm:w-96 flex-col rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden dark:border-slate-800 dark:bg-slate-900"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-800">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                                        Notifications
                                    </h3>
                                    {unreadCount > 0 && (
                                        <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                                            {unreadCount} unread
                                        </span>
                                    )}
                                </div>

                                <div className="flex items-center gap-2">
                                    {unreadCount > 0 && (
                                        <button
                                            type="button"
                                            onClick={markAllAsRead}
                                            className="text-[11px] font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
                                        >
                                            Mark all read
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => setIsOpen(false)}
                                        className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                                    >
                                        <X className="size-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Filter Tabs */}
                            <div className="flex items-center gap-1 border-b border-slate-100 bg-slate-50/50 p-2 dark:border-slate-800 dark:bg-slate-800/40">
                                <button
                                    type="button"
                                    onClick={() => setFilter("ALL")}
                                    className={`rounded-lg px-3 py-1 text-[11px] font-bold transition ${
                                        filter === "ALL"
                                            ? "bg-white text-slate-900 shadow-2xs dark:bg-slate-800 dark:text-slate-100"
                                            : "text-slate-500 hover:text-slate-900"
                                    }`}
                                >
                                    All
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFilter("UNREAD")}
                                    className={`rounded-lg px-3 py-1 text-[11px] font-bold transition ${
                                        filter === "UNREAD"
                                            ? "bg-white text-slate-900 shadow-2xs dark:bg-slate-800 dark:text-slate-100"
                                            : "text-slate-500 hover:text-slate-900"
                                    }`}
                                >
                                    Unread
                                </button>
                            </div>

                            {/* List */}
                            <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                                {loading ? (
                                    <div className="p-4 space-y-2">
                                        <div className="h-10 w-full animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
                                        <div className="h-10 w-full animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
                                    </div>
                                ) : notifications.length > 0 ? (
                                    notifications.map((item) => (
                                        <div
                                            key={item.id}
                                            className={`group relative flex items-start gap-3 p-3.5 transition ${
                                                item.read
                                                    ? "bg-white dark:bg-slate-900"
                                                    : "bg-indigo-50/40 dark:bg-indigo-950/20"
                                            }`}
                                        >
                                            <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                                                {item.type === "event" ? (
                                                    <Calendar className="size-4" />
                                                ) : item.type === "team" ? (
                                                    <Users className="size-4" />
                                                ) : item.type === "system" ? (
                                                    <ShieldAlert className="size-4" />
                                                ) : (
                                                    <Bell className="size-4" />
                                                )}
                                            </div>

                                            <div className="min-w-0 flex-1 space-y-0.5">
                                                <div className="flex items-center justify-between gap-1">
                                                    <h4 className="truncate text-xs font-bold text-slate-900 dark:text-slate-100">
                                                        {item.title}
                                                    </h4>
                                                    <span className="text-[9px] text-slate-400">{item.timestamp}</span>
                                                </div>

                                                <p className="text-[11px] text-slate-500 leading-4">{item.description}</p>
                                            </div>

                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                                                {!item.read && (
                                                    <button
                                                        type="button"
                                                        onClick={() => markAsRead(item.id)}
                                                        className="text-slate-400 hover:text-indigo-600 p-0.5"
                                                        title="Mark as read"
                                                    >
                                                        <Check className="size-3.5" />
                                                    </button>
                                                )}
                                                <button
                                                    type="button"
                                                    onClick={() => removeNotification(item.id)}
                                                    className="text-slate-400 hover:text-rose-600 p-0.5"
                                                    title="Dismiss"
                                                >
                                                    <Trash2 className="size-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-8 text-center space-y-2">
                                        <Bell className="mx-auto size-6 text-slate-300 dark:text-slate-600" />
                                        <p className="text-xs font-semibold text-slate-500">No notifications</p>
                                        <p className="text-[11px] text-slate-400">You are all caught up!</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
