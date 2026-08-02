import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "../ui/Button";

export default function ResourceModal({
    isOpen,
    onClose,
    initialData,
    onSubmit,
    isLoading,
}) {
    const isEdit = Boolean(initialData);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            title: "",
            resourceUrl: "",
            resourceType: "GITHUB",
            description: "",
        },
    });

    useEffect(() => {
        if (initialData) {
            reset({
                title: initialData.title || "",
                resourceUrl: initialData.resourceUrl || "",
                resourceType: initialData.resourceType || "GITHUB",
                description: initialData.description || "",
            });
        } else {
            reset({
                title: "",
                resourceUrl: "",
                resourceType: "GITHUB",
                description: "",
            });
        }
    }, [initialData, reset, isOpen]);

    const handleFormSubmit = (data) => {
        const payload = {
            title: data.title.trim(),
            resourceUrl: data.resourceUrl?.trim() || "",
            resourceType: data.resourceType,
            description: data.description?.trim() || "",
        };
        onSubmit(payload);
    };

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

                {/* Dialog Content */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 15 }}
                    transition={{ duration: 0.2 }}
                    className="relative flex flex-col w-full max-w-lg max-h-[90vh] rounded-3xl border border-slate-200 bg-white shadow-2xl overflow-hidden dark:border-slate-800 dark:bg-slate-900"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">
                        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                            {isEdit ? "Edit Team Resource" : "Add Team Resource"}
                        </h3>
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                            <X className="size-4" />
                        </button>
                    </div>

                    {/* Body */}
                    <form onSubmit={handleSubmit(handleFormSubmit)} className="flex-1 overflow-y-auto p-6 space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                Resource Title *
                            </label>
                            <input
                                type="text"
                                {...register("title", { required: "Resource title is required" })}
                                placeholder="e.g. GitHub Main Repository / Figma Wireframes"
                                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-800 dark:text-slate-100"
                            />
                            {errors.title && <p className="mt-1 text-[11px] text-rose-500">{errors.title.message}</p>}
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                    Resource Type *
                                </label>
                                <select
                                    {...register("resourceType", { required: true })}
                                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-800 dark:text-slate-100 font-semibold"
                                >
                                    <option value="GITHUB">GitHub Repository</option>
                                    <option value="FIGMA">Figma Design</option>
                                    <option value="DRIVE">Google Drive</option>
                                    <option value="DOCS">Documentation</option>
                                    <option value="LINK">Reference Link</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                    URL / Link
                                </label>
                                <input
                                    type="url"
                                    {...register("resourceUrl")}
                                    placeholder="https://github.com/..."
                                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-800 dark:text-slate-100"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                Description & Notes
                            </label>
                            <textarea
                                rows={3}
                                {...register("description")}
                                placeholder="Brief description of this resource for teammates..."
                                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-800 dark:text-slate-100"
                            />
                        </div>
                    </form>

                    {/* Footer */}
                    <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
                        <Button type="button" variant="outline" size="sm" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            size="sm"
                            disabled={isLoading}
                            onClick={handleSubmit(handleFormSubmit)}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6"
                        >
                            {isLoading ? "Saving..." : isEdit ? "Update Resource" : "Add Resource"}
                        </Button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
