import { useForm } from "react-hook-form";
import ProfileModal from "./ProfileModal";
import { Button } from "../ui/Button";

export default function EducationModal({ isOpen, onClose, initialData, onSubmit, isLoading }) {
    const isEdit = Boolean(initialData);

    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            institution: initialData?.institution || "",
            degree: initialData?.degree || "",
            fieldOfStudy: initialData?.fieldOfStudy || "",
            startYear: initialData?.startYear || new Date().getFullYear(),
            endYear: initialData?.endYear || "",
            cgpa: initialData?.cgpa ?? "",
            description: initialData?.description || "",
        },
    });

    const handleSave = (data) => {
        const payload = {
            ...data,
            startYear: parseInt(data.startYear, 10),
            endYear: data.endYear ? parseInt(data.endYear, 10) : null,
            cgpa: data.cgpa ? parseFloat(data.cgpa) : null,
        };
        onSubmit(payload);
    };

    return (
        <ProfileModal isOpen={isOpen} onClose={onClose} title={isEdit ? "Edit Education" : "Add Education"}>
            <form onSubmit={handleSubmit(handleSave)} className="space-y-4">
                <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Institution / University *
                    </label>
                    <input
                        type="text"
                        {...register("institution", { required: "Institution is required" })}
                        placeholder="e.g. MIT, Stanford, IIT"
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-800 dark:text-slate-100"
                    />
                    {errors.institution && (
                        <p className="mt-1 text-[11px] text-rose-500">{errors.institution.message}</p>
                    )}
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                            Degree *
                        </label>
                        <input
                            type="text"
                            {...register("degree", { required: "Degree is required" })}
                            placeholder="e.g. B.Tech, B.S."
                            className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-800 dark:text-slate-100"
                        />
                        {errors.degree && (
                            <p className="mt-1 text-[11px] text-rose-500">{errors.degree.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                            Field of Study
                        </label>
                        <input
                            type="text"
                            {...register("fieldOfStudy")}
                            placeholder="e.g. Computer Science"
                            className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-800 dark:text-slate-100"
                        />
                    </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                            Start Year *
                        </label>
                        <input
                            type="number"
                            {...register("startYear", { required: true })}
                            placeholder="2022"
                            className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-800 dark:text-slate-100"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                            End Year (or Expected)
                        </label>
                        <input
                            type="number"
                            {...register("endYear")}
                            placeholder="2026"
                            className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-800 dark:text-slate-100"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                            CGPA / Grade
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            {...register("cgpa")}
                            placeholder="3.8 or 8.9"
                            className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-800 dark:text-slate-100"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Description / Activities
                    </label>
                    <textarea
                        rows={2}
                        {...register("description")}
                        placeholder="Key coursework, honors, societies..."
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-800 dark:text-slate-100"
                    />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={onClose} size="sm">
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading} size="sm">
                        {isLoading ? "Saving..." : isEdit ? "Update Education" : "Add Education"}
                    </Button>
                </div>
            </form>
        </ProfileModal>
    );
}
