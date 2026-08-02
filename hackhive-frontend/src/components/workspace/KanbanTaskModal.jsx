import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "../ui/Button";

export default function KanbanTaskModal({
    isOpen,
    onClose,
    initialData,
    members = [],
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
            description: "",
            status: "TODO",
            priority: "MEDIUM",
            assignedToStudentProfileId: "",
            dueDate: "",
        },
    });

    useEffect(() => {
        if (initialData) {
            reset({
                title: initialData.title || "",
                description: initialData.description || "",
                status: initialData.status || "TODO",
                priority: initialData.priority || "MEDIUM",
                assignedToStudentProfileId: initialData.assignedToStudentProfileId || "",
                dueDate: initialData.dueDate ? initialData.dueDate.slice(0, 16) : "",
            });
        } else {
            reset({
                title: "",
                description: "",
                status: "TODO",
                priority: "MEDIUM",
                assignedToStudentProfileId: "",
                dueDate: "",
            });
        }
    }, [initialData, reset, isOpen]);

    const handleFormSubmit = (data) => {
        const payload = {
            ...data,
            title: data.title.trim(),
            description: data.description?.trim() || "",
            assignedToStudentProfileId: data.assignedToStudentProfileId ? parseInt(data.assignedToStudentProfileId, 10) : null,
            dueDate: data.dueDate ? (data.dueDate.length === 16 ? `${data.dueDate}:00` : data.dueDate) : null,
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
                            {isEdit ? "Edit Task" : "Create New Kanban Task"}
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
                                Task Title *
                            </label>
                            <input
                                type="text"
                                {...register("title", { required: "Task title is required" })}
                                placeholder="e.g. Implement Auth REST Endpoints"
                                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-800 dark:text-slate-100"
                            />
                            {errors.title && <p className="mt-1 text-[11px] text-rose-500">{errors.title.message}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                Description
                            </label>
                            <textarea
                                rows={3}
                                {...register("description")}
                                placeholder="Task description, acceptance criteria, or technical notes..."
                                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-800 dark:text-slate-100"
                            />
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                    Status
                                </label>
                                <select
                                    {...register("status")}
                                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-800 dark:text-slate-100"
                                >
                                    <option value="BACKLOG">Backlog</option>
                                    <option value="TODO">To Do</option>
                                    <option value="IN_PROGRESS">In Progress</option>
                                    <option value="REVIEW">Review</option>
                                    <option value="COMPLETED">Completed</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                    Priority
                                </label>
                                <select
                                    {...register("priority")}
                                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-800 dark:text-slate-100"
                                >
                                    <option value="LOW">Low</option>
                                    <option value="MEDIUM">Medium</option>
                                    <option value="HIGH">High</option>
                                    <option value="URGENT">Urgent</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                    Assigned Member
                                </label>
                                <select
                                    {...register("assignedToStudentProfileId")}
                                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-800 dark:text-slate-100"
                                >
                                    <option value="">Unassigned</option>
                                    {members.map((m) => (
                                        <option key={m.studentProfileId || m.memberId} value={m.studentProfileId}>
                                            {m.fullName || m.email}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                    Due Date
                                </label>
                                <input
                                    type="datetime-local"
                                    {...register("dueDate")}
                                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-800 dark:text-slate-100"
                                />
                            </div>
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
                            {isLoading ? "Saving..." : isEdit ? "Update Task" : "Create Task"}
                        </Button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
