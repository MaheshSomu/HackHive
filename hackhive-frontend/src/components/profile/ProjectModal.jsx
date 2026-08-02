import { useForm } from "react-hook-form";
import ProfileModal from "./ProfileModal";
import { Button } from "../ui/Button";

export default function ProjectModal({ isOpen, onClose, initialData, onSubmit, isLoading }) {
    const isEdit = Boolean(initialData);

    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            title: initialData?.title || "",
            description: initialData?.description || "",
            techStack: initialData?.techStack || "",
            githubUrl: initialData?.githubUrl || "",
            liveUrl: initialData?.liveUrl || "",
            startDate: initialData?.startDate || "",
            endDate: initialData?.endDate || "",
        },
    });

    return (
        <ProfileModal isOpen={isOpen} onClose={onClose} title={isEdit ? "Edit Project" : "Add Project"}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Project Title *
                    </label>
                    <input
                        type="text"
                        {...register("title", { required: "Project title is required" })}
                        placeholder="e.g. HackHive Workspace App"
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-800 dark:text-slate-100"
                    />
                    {errors.title && (
                        <p className="mt-1 text-[11px] text-rose-500">{errors.title.message}</p>
                    )}
                </div>

                <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Tech Stack
                    </label>
                    <input
                        type="text"
                        {...register("techStack")}
                        placeholder="e.g. React, Node.js, Tailwind, PostgreSQL"
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-800 dark:text-slate-100"
                    />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                            GitHub Repository URL
                        </label>
                        <input
                            type="url"
                            {...register("githubUrl")}
                            placeholder="https://github.com/..."
                            className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-800 dark:text-slate-100"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                            Live Demo / Website URL
                        </label>
                        <input
                            type="url"
                            {...register("liveUrl")}
                            placeholder="https://myproject.com"
                            className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-800 dark:text-slate-100"
                        />
                    </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                            Start Date
                        </label>
                        <input
                            type="date"
                            {...register("startDate")}
                            className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-800 dark:text-slate-100"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                            End Date
                        </label>
                        <input
                            type="date"
                            {...register("endDate")}
                            className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-800 dark:text-slate-100"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Description
                    </label>
                    <textarea
                        rows={3}
                        {...register("description")}
                        placeholder="Key features, problems solved, and achievements of this project..."
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-800 dark:text-slate-100"
                    />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={onClose} size="sm">
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading} size="sm">
                        {isLoading ? "Saving..." : isEdit ? "Update Project" : "Add Project"}
                    </Button>
                </div>
            </form>
        </ProfileModal>
    );
}
