import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";

export default function AdminLayout() {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
        try {
            const saved = localStorage.getItem("admin_sidebar_collapsed");
            return saved ? JSON.parse(saved) : false;
        } catch {
            return false;
        }
    });

    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    const toggleSidebarCollapse = () => {
        setIsSidebarCollapsed((prev) => {
            const next = !prev;
            try {
                localStorage.setItem("admin_sidebar_collapsed", JSON.stringify(next));
            } catch {
                // ignore
            }
            return next;
        });
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape" && isMobileSidebarOpen) {
                setIsMobileSidebarOpen(false);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isMobileSidebarOpen]);

    return (
        <div className="flex h-screen w-full overflow-hidden bg-slate-50 font-sans text-slate-900 dark:bg-slate-950 dark:text-slate-100">
            {/* Desktop Sidebar */}
            <div className="hidden lg:flex lg:shrink-0">
                <AdminSidebar
                    isCollapsed={isSidebarCollapsed}
                    onToggleCollapse={toggleSidebarCollapse}
                    variant="desktop"
                />
            </div>

            {/* Mobile Drawer */}
            <AnimatePresence>
                {isMobileSidebarOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            onClick={() => setIsMobileSidebarOpen(false)}
                            className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-xs lg:hidden"
                        />

                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 250 }}
                            className="fixed inset-y-0 left-0 z-50 flex lg:hidden"
                        >
                            <AdminSidebar
                                variant="mobile"
                                onClose={() => setIsMobileSidebarOpen(false)}
                            />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <div className="flex flex-1 flex-col min-w-0 h-screen overflow-hidden">
                <AdminHeader
                    isSidebarCollapsed={isSidebarCollapsed}
                    onToggleSidebar={toggleSidebarCollapse}
                    onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
                />

                <main className="flex-1 overflow-y-auto bg-slate-50/50 p-4 sm:p-6 lg:p-8 dark:bg-slate-950/50">
                    <div className="mx-auto max-w-7xl">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
