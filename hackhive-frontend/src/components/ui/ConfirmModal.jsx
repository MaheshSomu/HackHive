import * as React from "react";
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
    React.useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape" && isOpen && !isLoading) {
                onClose();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, isLoading, onClose]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true" aria-labelledby="confirm-modal-title" aria-describedby="confirm-modal-description">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={isLoading ? undefined : onClose}
                    className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
                />

                {/* Modal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 15 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="relative flex flex-col w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl overflow-hidden dark:border-slate-800 dark:bg-slate-900 space-y-4"
                >
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <div
                                className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${
                                    isDanger
                                        ? "bg-rose-50 text-rose-600 dark:bg-rose-950/80 dark:text-rose-400"
                                        : "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/80 dark:text-indigo-400"
                                }`}
                            >
                                <AlertTriangle className="size-5" />
                            </div>
                            <h3 id="confirm-modal-title" className="text-base font-bold text-slate-900 dark:text-slate-100">{title}</h3>
                        </div>

                        <button
                            type="button"
                            aria-label="Close dialog"
                            onClick={onClose}
                            disabled={isLoading}
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:hover:bg-slate-800 dark:text-slate-500 dark:hover:text-slate-300 transition-colors"
                        >
                            <X className="size-4" />
                        </button>
                    </div>

                    <p id="confirm-modal-description" className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{description}</p>

                    <div className="flex items-center justify-end gap-2.5 pt-2">
                        <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
                            {cancelText}
                        </Button>
                        <Button
                            type="button"
                            size="sm"
                            variant={isDanger ? "destructive" : "default"}
                            isLoading={isLoading}
                            onClick={onConfirm}
                        >
                            {confirmText}
                        </Button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}

export default ConfirmModal;

