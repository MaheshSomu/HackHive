import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { X, Link2, FileText, Globe, ExternalLink, AlertCircle } from "lucide-react";
import { Button } from "../ui/Button";

const RESOURCE_TYPE_OPTIONS = [
    { value: "GITHUB", label: "GitHub Repository", description: "Source code & repository links" },
    { value: "DESIGN", label: "Figma / Design", description: "UI design, wireframes, or prototypes" },
    { value: "DATASET", label: "Google Drive / Storage", description: "Shared drives, datasets, or cloud files" },
    { value: "DOCUMENTATION", label: "Documentation", description: "Notion pages, project docs, or specs" },
    { value: "LINK", label: "Website / Web Link", description: "External live sites or web tools" },
    { value: "OTHER", label: "Other Resource", description: "General references and miscellaneous items" },
];

export default function ResourceModal({
    isOpen,
    onClose,
    initialData = null,
    onSubmit,
    isLoading = false,
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
        if (isOpen) {
            if (initialData) {
                // Normalize existing type if needed
                let mappedType = initialData.resourceType || "GITHUB";
                const upper = mappedType.toUpperCase();
                if (upper === "FIGMA") mappedType = "DESIGN";
                else if (upper === "DRIVE" || upper === "GOOGLE_DRIVE") mappedType = "DATASET";
                else if (upper === "DOCS") mappedType = "DOCUMENTATION";
                else if (upper === "WEBSITE") mappedType = "LINK";

                reset({
                    title: initialData.title || "",
                    resourceUrl: initialData.resourceUrl || "",
                    resourceType: mappedType,
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
        }
    }, [initialData, reset, isOpen]);

    const handleFormSubmit = (data) => {
        let url = data.resourceUrl?.trim() || "";
        if (url && !/^https?:\/\//i.test(url)) {
            url = `https://${url}`;
        }

        const payload = {
            title: data.title.trim(),
            resourceUrl: url,
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
                        <div className="flex items-center gap-2.5">
                            <div className="flex size-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                                <Link2 className="size-4.5" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                                    {isEdit ? "Edit Team Resource" : "Add Team Resource"}
                                </h3>
                                <p className="text-[11px] text-slate-500">
                                    {isEdit ? "Update details for this shared resource" : "Share a repository, design link, or documentation"}
                                </p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                        >
                            <X className="size-4" />
                        </button>
                    </div>

                    {/* Body */}
                    <form id="resource-form" onSubmit={handleSubmit(handleFormSubmit)} className="flex-1 overflow-y-auto p-6 space-y-4">
                        {/* Resource Name */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                Resource Name <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                {...register("title", {
                                    required: "Resource name is required",
                                    maxLength: { value: 200, message: "Title cannot exceed 200 characters" },
                                })}
                                placeholder="e.g. Main GitHub Repository, Figma Design System..."
                                className={`w-full rounded-xl border p-2.5 text-xs text-slate-900 outline-none transition dark:text-slate-100 ${
                                    errors.title
                                        ? "border-rose-400 bg-rose-50/30 focus:border-rose-500 dark:border-rose-800 dark:bg-rose-950/20"
                                        : "border-slate-200 bg-slate-50 focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-800/80 dark:focus:bg-slate-800"
                                }`}
                            />
                            {errors.title && (
                                <p className="mt-1 flex items-center gap-1 text-[11px] font-medium text-rose-500">
                                    <AlertCircle className="size-3" /> {errors.title.message}
                                </p>
                            )}
                        </div>

                        {/* Resource Type & URL Grid */}
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                    Resource Type <span className="text-rose-500">*</span>
                                </label>
                                <select
                                    {...register("resourceType", { required: true })}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-semibold text-slate-900 outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-800 dark:text-slate-100 transition cursor-pointer"
                                >
                                    {RESOURCE_TYPE_OPTIONS.map((opt) => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                    URL / Web Link <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    {...register("resourceUrl", {
                                        required: "Resource URL is required",
                                        pattern: {
                                            value: /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/.*)?$/i,
                                            message: "Please enter a valid web URL (e.g. github.com/...)",
                                        },
                                        maxLength: { value: 1000, message: "URL cannot exceed 1000 characters" },
                                    })}
                                    placeholder="https://..."
                                    className={`w-full rounded-xl border p-2.5 text-xs text-slate-900 outline-none transition dark:text-slate-100 ${
                                        errors.resourceUrl
                                            ? "border-rose-400 bg-rose-50/30 focus:border-rose-500 dark:border-rose-800 dark:bg-rose-950/20"
                                            : "border-slate-200 bg-slate-50 focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-800/80 dark:focus:bg-slate-800"
                                    }`}
                                />
                                {errors.resourceUrl && (
                                    <p className="mt-1 flex items-center gap-1 text-[11px] font-medium text-rose-500">
                                        <AlertCircle className="size-3" /> {errors.resourceUrl.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                Description & Notes
                            </label>
                            <textarea
                                rows={3}
                                {...register("description", {
                                    maxLength: { value: 1000, message: "Description cannot exceed 1000 characters" },
                                })}
                                placeholder="Brief description of this resource for your teammates..."
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-100 transition resize-none"
                            />
                            {errors.description && (
                                <p className="mt-1 flex items-center gap-1 text-[11px] font-medium text-rose-500">
                                    <AlertCircle className="size-3" /> {errors.description.message}
                                </p>
                            )}
                        </div>
                    </form>

                    {/* Footer */}
                    <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50/80 px-6 py-4 dark:border-slate-800 dark:bg-slate-900/80">
                        <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            form="resource-form"
                            size="sm"
                            disabled={isLoading}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 shadow-sm"
                        >
                            {isLoading ? "Saving..." : isEdit ? "Update Resource" : "Add Resource"}
                        </Button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
