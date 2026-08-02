import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

function DashboardLayout({
    children,
    navItems = [],
    summary,
    user,
    title = "Student Dashboard",
    subtitle = "Your work, priorities, and team activity in one calm workspace.",
    actions = [],
    activeId,
    activeLabel,
    dateLabel,
}) {
    const [mobileNavOpen, setMobileNavOpen] = useState(false);

    useEffect(() => {
        if (!mobileNavOpen) {
            document.body.style.overflow = "";
            return undefined;
        }

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                setMobileNavOpen(false);
            }
        };

        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = "";
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [mobileNavOpen]);

    const closeMobileNav = () => {
        setMobileNavOpen(false);
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            <div className="mx-auto flex min-h-screen max-w-[1600px]">
                <Sidebar
                    navItems={navItems}
                    summary={summary}
                    activeId={activeId}
                    variant="desktop"
                />

                <div className="min-w-0 flex-1">
                    <Navbar
                        title={title}
                        subtitle={subtitle}
                        user={user}
                        actions={actions}
                        onMenuClick={() => setMobileNavOpen(true)}
                        activeLabel={activeLabel}
                        dateLabel={dateLabel}
                    />

                    <main className="min-w-0">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.2 }}
                            className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8"
                        >
                            {children}
                        </motion.div>
                    </main>
                </div>
            </div>

            <AnimatePresence>
                {mobileNavOpen && (
                    <>
                        <motion.button
                            type="button"
                            aria-label="Close navigation overlay"
                            className="fixed inset-0 z-40 bg-slate-950/30 backdrop-blur-[2px] lg:hidden"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closeMobileNav}
                        />

                        <motion.div
                            className="fixed inset-y-0 left-0 z-50 lg:hidden"
                            initial={{ x: -320, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -320, opacity: 0 }}
                            transition={{ duration: 0.24, ease: "easeOut" }}
                        >
                            <Sidebar
                                navItems={navItems}
                                summary={summary}
                                activeId={activeId}
                                variant="mobile"
                                onNavigate={closeMobileNav}
                                onClose={closeMobileNav}
                            />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}

export default DashboardLayout;