import { useForm, Controller } from "react-hook-form";
import ProfileModal from "./ProfileModal";
import { Button } from "../ui/Button";
import HackHiveSelect from "../ui/HackHiveSelect";

export default function ExperienceModal({ isOpen, onClose, initialData, onSubmit, isLoading }) {
    const isEdit = Boolean(initialData);

    const { register, handleSubmit, watch, control, formState: { errors } } = useForm({
        defaultValues: {
            company: initialData?.company || "",
            role: initialData?.role || "",
            employmentType: initialData?.employmentType || "Full-time",
            location: initialData?.location || "",
            startDate: initialData?.startDate || "",
            endDate: initialData?.endDate || "",
            currentlyWorking: initialData?.currentlyWorking ?? false,
            description: initialData?.description || "",
        },
    });

    const isCurrentlyWorking = watch("currentlyWorking");

    const handleSave = (data) => {
        const payload = {
            ...data,
            endDate: isCurrentlyWorking ? null : data.endDate || null,
        };
        onSubmit(payload);
    };

    return (
        <ProfileModal isOpen={isOpen} onClose={onClose} title={isEdit ? "Edit Experience" : "Add Experience"}>
            <form onSubmit={handleSubmit(handleSave)} className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                            Role / Title *
                        </label>
                        <input
                            type="text"
                            {...register("role", { required: "Role is required" })}
                            placeholder="e.g. Software Engineer Intern"
                            className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-800 dark:text-slate-100"
                        />
                        {errors.role && (
                            <p className="mt-1 text-[11px] text-rose-500">{errors.role.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                            Company / Organization *
                        </label>
                        <input
                            type="text"
                            {...register("company", { required: "Company is required" })}
                            placeholder="e.g. Google, Stripe"
                            className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-800 dark:text-slate-100"
                        />
                        {errors.company && (
                            <p className="mt-1 text-[11px] text-rose-500">{errors.company.message}</p>
                        )}
                    </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                        <Controller
                            name="employmentType"
                            control={control}
                            render={({ field }) => (
                                <HackHiveSelect
                                    label="Employment Type"
                                    value={field.value}
                                    onChange={(e) => field.onChange(e.target.value)}
                                    options={[
                                        { value: "Full-time", label: "Full-time" },
                                        { value: "Part-time", label: "Part-time" },
                                        { value: "Internship", label: "Internship" },
                                        { value: "Contract", label: "Contract" },
                                        { value: "Freelance", label: "Freelance" },
                                    ]}
                                />
                            )}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                            Location
                        </label>
                        <input
                            type="text"
                            {...register("location")}
                            placeholder="e.g. Remote / New York, NY"
                            className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-800 dark:text-slate-100"
                        />
                    </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                            Start Date *
                        </label>
                        <input
                            type="date"
                            {...register("startDate", { required: "Start date is required" })}
                            className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-800 dark:text-slate-100"
                        />
                        {errors.startDate && (
                            <p className="mt-1 text-[11px] text-rose-500">{errors.startDate.message}</p>
                        )}
                    </div>

                    {!isCurrentlyWorking && (
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
                    )}
                </div>

                <div className="flex items-center gap-2 pt-1">
                    <input
                        type="checkbox"
                        id="currentlyWorking"
                        {...register("currentlyWorking")}
                        className="size-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label htmlFor="currentlyWorking" className="text-xs font-medium text-slate-700 dark:text-slate-300">
                        I am currently working in this role
                    </label>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Description / Responsibilities
                    </label>
                    <textarea
                        rows={3}
                        {...register("description")}
                        placeholder="Key accomplishments, tools used, key project results..."
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-800 dark:text-slate-100"
                    />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={onClose} size="sm">
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading} size="sm">
                        {isLoading ? "Saving..." : isEdit ? "Update Experience" : "Add Experience"}
                    </Button>
                </div>
            </form>
        </ProfileModal>
    );
}
