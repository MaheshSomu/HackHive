import { useForm, Controller } from "react-hook-form";
import ProfileModal from "./ProfileModal";
import { Button } from "../ui/Button";
import HackHiveSelect from "../ui/HackHiveSelect";

export default function SocialLinkModal({ isOpen, onClose, initialData, onSubmit, isLoading }) {
    const isEdit = Boolean(initialData);

    const { register, handleSubmit, control, formState: { errors } } = useForm({
        defaultValues: {
            platform: initialData?.platform || "GitHub",
            url: initialData?.url || "",
        },
    });

    return (
        <ProfileModal isOpen={isOpen} onClose={onClose} title={isEdit ? "Edit Social Link" : "Add Social Link"}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Controller
                    name="platform"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                        <HackHiveSelect
                            label="Platform *"
                            value={field.value}
                            onChange={(e) => field.onChange(e.target.value)}
                            options={[
                                { value: "GitHub", label: "GitHub" },
                                { value: "LinkedIn", label: "LinkedIn" },
                                { value: "Portfolio", label: "Portfolio / Personal Site" },
                                { value: "LeetCode", label: "LeetCode" },
                                { value: "Codeforces", label: "Codeforces" },
                                { value: "Twitter", label: "Twitter / X" },
                                { value: "Other", label: "Other" },
                            ]}
                        />
                    )}
                />

                <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Profile URL *
                    </label>
                    <input
                        type="url"
                        {...register("url", { required: "URL is required" })}
                        placeholder="https://..."
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 outline-none focus:border-blue-500 focus:bg-white dark:border-slate-800 dark:bg-slate-800 dark:text-slate-100"
                    />
                    {errors.url && (
                        <p className="mt-1 text-[11px] text-rose-500">{errors.url.message}</p>
                    )}
                </div>

                <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={onClose} size="sm">
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading} size="sm">
                        {isLoading ? "Saving..." : isEdit ? "Update Link" : "Add Link"}
                    </Button>
                </div>
            </form>
        </ProfileModal>
    );
}
