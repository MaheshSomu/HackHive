import { useForm, Controller } from "react-hook-form";
import ProfileModal from "./ProfileModal";
import { Button } from "../ui/Button";
import HackHiveSelect from "../ui/HackHiveSelect";

export default function SkillModal({ isOpen, onClose, initialData, onSubmit, isLoading }) {
    const isEdit = Boolean(initialData);

    const { register, handleSubmit, control, formState: { errors } } = useForm({
        defaultValues: {
            skillName: initialData?.skillName || "",
            skillLevel: initialData?.skillLevel || "INTERMEDIATE",
        },
    });

    return (
        <ProfileModal isOpen={isOpen} onClose={onClose} title={isEdit ? "Edit Skill" : "Add Skill"}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Skill Name *
                    </label>
                    <input
                        type="text"
                        {...register("skillName", { required: "Skill name is required" })}
                        placeholder="e.g. React.js, Python, Figma"
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 outline-none focus:border-blue-500 focus:bg-white dark:border-slate-800 dark:bg-slate-800 dark:text-slate-100"
                    />
                    {errors.skillName && (
                        <p className="mt-1 text-[11px] text-rose-500">{errors.skillName.message}</p>
                    )}
                </div>

                <Controller
                    name="skillLevel"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                        <HackHiveSelect
                            label="Skill Level *"
                            value={field.value}
                            onChange={(e) => field.onChange(e.target.value)}
                            options={[
                                { value: "BEGINNER", label: "Beginner" },
                                { value: "INTERMEDIATE", label: "Intermediate" },
                                { value: "ADVANCED", label: "Advanced" },
                                { value: "EXPERT", label: "Expert" },
                            ]}
                        />
                    )}
                />

                <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={onClose} size="sm">
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading} size="sm">
                        {isLoading ? "Saving..." : isEdit ? "Update Skill" : "Add Skill"}
                    </Button>
                </div>
            </form>
        </ProfileModal>
    );
}
