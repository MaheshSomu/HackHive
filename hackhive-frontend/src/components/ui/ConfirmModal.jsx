import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";
import { Button } from "./Button";

export function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title = "Confirm Action",
    description = "Are you sure you want to proceed with this action?",
    confirmText = "Confirm",
    cancelText = "Cancel",
    isDanger = false,
    isLoading = false,
}) {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
                />

                {/* Modal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 15 }}
                    transition={{ duration: 0.2 }}
                    className="relative flex flex-col w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl overflow-hidden dark:border-slate-800 dark:bg-slate-900 space-y-4"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div
                                className={`flex size-10 items-center justify-center rounded-2xl ${
                                    isDanger
                                        ? "bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400"
                                        : "bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400"
                                }`}
                            >
                                <AlertTriangle className="size-5" />
                            </div>
                            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{title}</h3>
                        </div>

                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                            <X className="size-4" />
                        </button>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-5">{description}</p>

                    <div className="flex items-center justify-end gap-3 pt-2">
                        <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
                            {cancelText}
                        </Button>
                        <Button
                            type="button"
                            size="sm"
                            disabled={isLoading}
                            onClick={onConfirm}
                            className={
                                isDanger
                                    ? "bg-rose-600 hover:bg-rose-500 text-white font-bold"
                                    : "bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
                            }
                        >
                            {isLoading ? "Processing..." : confirmText}
                        </Button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
