import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

export function Drawer({
    isOpen,
    onClose,
    title,
    subtitle,
    children,
    footer,
    size = "md", // 'sm' | 'md' | 'lg' | 'xl'
    position = "right", // 'right' | 'left'
    className = "",
}) {
    React.useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape" && isOpen) {
                onClose();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const sizeClasses = {
        sm: "max-w-xs",
        md: "max-w-md",
        lg: "max-w-lg",
        xl: "max-w-xl",
    };

    const isRight = position === "right";

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
                />

                <div className={`fixed inset-y-0 ${isRight ? "right-0" : "left-0"} flex max-w-full pl-10`}>
                    <motion.div
                        initial={{ x: isRight ? "100%" : "-100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: isRight ? "100%" : "-100%" }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className={`w-screen ${sizeClasses[size] || sizeClasses.md} flex flex-col bg-white shadow-2xl dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 ${className}`}
                    >
                        {(title || onClose) && (
                            <div className="flex items-center justify-between border-b border-slate-100 p-5 dark:border-slate-800">
                                <div className="space-y-0.5 min-w-0 flex-1">
                                    {title && <h3 className="truncate text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">{title}</h3>}
                                    {subtitle && <p className="truncate text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>}
                                </div>

                                <button
                                    type="button"
                                    aria-label="Close drawer"
                                    onClick={onClose}
                                    className="ml-3 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:hover:bg-slate-800 dark:text-slate-500 dark:hover:text-slate-300 transition-colors"
                                >
                                    <X className="size-4" />
                                </button>
                            </div>
                        )}

                        <div className="flex-1 overflow-y-auto p-5">{children}</div>

                        {footer && (
                            <div className="border-t border-slate-100 p-4 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-end gap-2">
                                {footer}
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </AnimatePresence>
    );
}

export default Drawer;
