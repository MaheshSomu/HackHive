import { motion } from "framer-motion";

import { cn } from "../../lib/utils";

function DashboardSection({
    id,
    eyebrow,
    title,
    description,
    action,
    children,
    className = "",
}) {
    return (
        <section
            id={id}
            className={cn("scroll-mt-28 space-y-5", className)}
        >
            {(title || description || eyebrow || action) && (
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div className="max-w-2xl space-y-2">
                        {eyebrow && (
                            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                                {eyebrow}
                            </p>
                        )}

                        {title && (
                            <h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                                {title}
                            </h2>
                        )}

                        {description && (
                            <p className="max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
                                {description}
                            </p>
                        )}
                    </div>

                    {action}
                </div>
            )}

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.35, ease: "easeOut" }}
            >
                {children}
            </motion.div>
        </section>
    );
}

export default DashboardSection;
