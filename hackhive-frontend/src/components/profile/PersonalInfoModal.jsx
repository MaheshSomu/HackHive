import { useForm } from "react-hook-form";
import ProfileModal from "./ProfileModal";
import { Button } from "../ui/Button";

export default function PersonalInfoModal({ isOpen, onClose, initialData, onSubmit, isLoading }) {
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            bio: initialData?.bio || "",
            university: initialData?.university || "",
            college: initialData?.college || "",
            degree: initialData?.degree || "",
            branch: initialData?.branch || "",
            graduationYear: initialData?.graduationYear || "",
            cgpa: initialData?.cgpa ?? "",
            location: initialData?.location || "",
        },
    });

    const handleSave = (data) => {
        const payload = {
            ...data,
            cgpa: data.cgpa ? parseFloat(data.cgpa) : null,
        };
        onSubmit(payload);
    };

    return (
        <ProfileModal isOpen={isOpen} onClose={onClose} title="Edit Personal Information">
            <form onSubmit={handleSubmit(handleSave)} className="space-y-4">
                <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Bio
                    </label>
                    <textarea
                        rows={3}
                        {...register("bio", { maxLength: 500 })}
                        placeholder="Tell hackathons and teammates a bit about yourself..."
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-indigo-500"
                    />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                            University
                        </label>
                        <input
                            type="text"
                            {...register("university")}
                            placeholder="e.g. Stanford University"
                            className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-800 dark:text-slate-100"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                            College / Institute
                        </label>
                        <input
                            type="text"
                            {...register("college")}
                            placeholder="e.g. School of Engineering"
                            className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-800 dark:text-slate-100"
                        />
                    </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                            Degree
                        </label>
                        <input
                            type="text"
                            {...register("degree")}
                            placeholder="e.g. Bachelor of Technology"
                            className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-800 dark:text-slate-100"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                            Branch / Major
                        </label>
                        <input
                            type="text"
                            {...register("branch")}
                            placeholder="e.g. Computer Science"
                            className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-800 dark:text-slate-100"
                        />
                    </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                            Graduation Year
                        </label>
                        <input
                            type="text"
                            {...register("graduationYear")}
                            placeholder="2026"
                            className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-800 dark:text-slate-100"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                            CGPA (0 - 10)
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            {...register("cgpa", { min: 0, max: 10 })}
                            placeholder="8.5"
                            className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-800 dark:text-slate-100"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                            Location
                        </label>
                        <input
                            type="text"
                            {...register("location")}
                            placeholder="City, Country"
                            className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-800 dark:text-slate-100"
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={onClose} size="sm">
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading} size="sm">
                        {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            </form>
        </ProfileModal>
    );
}
