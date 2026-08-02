import { useForm } from "react-hook-form";
import ProfileModal from "./ProfileModal";
import { Button } from "../ui/Button";

export default function CertificationModal({ isOpen, onClose, initialData, onSubmit, isLoading }) {
    const isEdit = Boolean(initialData);

    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            name: initialData?.name || "",
            issuingOrganization: initialData?.issuingOrganization || "",
            issueDate: initialData?.issueDate || "",
            expirationDate: initialData?.expirationDate || "",
            credentialId: initialData?.credentialId || "",
            credentialUrl: initialData?.credentialUrl || "",
        },
    });

    return (
        <ProfileModal isOpen={isOpen} onClose={onClose} title={isEdit ? "Edit Certification" : "Add Certification"}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Certification Name *
                    </label>
                    <input
                        type="text"
                        {...register("name", { required: "Certification name is required" })}
                        placeholder="e.g. AWS Certified Solutions Architect"
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-800 dark:text-slate-100"
                    />
                    {errors.name && (
                        <p className="mt-1 text-[11px] text-rose-500">{errors.name.message}</p>
                    )}
                </div>

                <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Issuing Organization *
                    </label>
                    <input
                        type="text"
                        {...register("issuingOrganization", { required: "Issuing organization is required" })}
                        placeholder="e.g. Amazon Web Services, Coursera, Meta"
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-800 dark:text-slate-100"
                    />
                    {errors.issuingOrganization && (
                        <p className="mt-1 text-[11px] text-rose-500">{errors.issuingOrganization.message}</p>
                    )}
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                            Issue Date
                        </label>
                        <input
                            type="date"
                            {...register("issueDate")}
                            className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-800 dark:text-slate-100"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                            Expiration Date
                        </label>
                        <input
                            type="date"
                            {...register("expirationDate")}
                            className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-800 dark:text-slate-100"
                        />
                    </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                            Credential ID
                        </label>
                        <input
                            type="text"
                            {...register("credentialId")}
                            placeholder="e.g. ABC-123456"
                            className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-800 dark:text-slate-100"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                            Credential Verification URL
                        </label>
                        <input
                            type="url"
                            {...register("credentialUrl")}
                            placeholder="https://..."
                            className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-800 dark:text-slate-100"
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={onClose} size="sm">
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading} size="sm">
                        {isLoading ? "Saving..." : isEdit ? "Update Certification" : "Add Certification"}
                    </Button>
                </div>
            </form>
        </ProfileModal>
    );
}
