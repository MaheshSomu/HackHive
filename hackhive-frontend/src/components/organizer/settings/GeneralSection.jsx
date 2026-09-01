import { useState, useEffect } from "react";
import { Building2, MapPin, Save, AlertCircle, Sparkles } from "lucide-react";
import { Button } from "../../ui/Button";

export default function GeneralSection({ profileData, onSave, saving }) {
    const [formData, setFormData] = useState({
        organizationName: "",
        organizationType: "",
        description: "",
        location: "",
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (profileData) {
            setFormData({
                organizationName: profileData.organizationName || "",
                organizationType: profileData.organizationType || "",
                description: profileData.description || "",
                location: profileData.location || "",
            });
        }
    }, [profileData]);

    // Check if form was modified compared to incoming profileData
    const isDirty =
        (formData.organizationName || "") !== (profileData?.organizationName || "") ||
        (formData.organizationType || "") !== (profileData?.organizationType || "") ||
        (formData.description || "") !== (profileData?.description || "") ||
        (formData.location || "") !== (profileData?.location || "");

    const validate = () => {
        const newErrors = {};
        if (!formData.organizationName || !formData.organizationName.trim()) {
            newErrors.organizationName = "Organization Name is required.";
        }
        if (formData.description && formData.description.length > 1000) {
            newErrors.description = "Description cannot exceed 1000 characters.";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;
        onSave(formData);
    };

    const descriptionLength = formData.description ? formData.description.length : 0;

    return (
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-6">
            <div className="border-b border-slate-100 pb-4 dark:border-slate-800">
                <div className="flex items-center gap-2">
                    <Building2 className="size-5 text-blue-600 dark:text-blue-400" />
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">General Information</h3>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Manage your primary organization brand details, institution type, and summary overview.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl">
                {/* Organization Name */}
                <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        Organization Name <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                        <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                        <input
                            type="text"
                            required
                            value={formData.organizationName}
                            onChange={(e) => {
                                setFormData((f) => ({ ...f, organizationName: e.target.value }));
                                if (errors.organizationName) setErrors((err) => ({ ...err, organizationName: null }));
                            }}
                            placeholder="e.g. Google Developer Student Clubs / Tech Corp"
                            className={`w-full rounded-2xl border bg-white pl-10 pr-4 py-2.5 text-xs text-slate-900 outline-none transition focus:ring-2 focus:ring-blue-500/20 dark:bg-slate-900 dark:text-slate-100 font-semibold ${
                                errors.organizationName
                                    ? "border-rose-500 focus:border-rose-500"
                                    : "border-slate-200 focus:border-blue-500 dark:border-slate-800"
                            }`}
                        />
                    </div>
                    {errors.organizationName && (
                        <p className="mt-1 text-xs text-rose-500 flex items-center gap-1 font-medium">
                            <AlertCircle className="size-3" />
                            {errors.organizationName}
                        </p>
                    )}
                </div>

                {/* Organization Type & Location */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                            Organization Type
                        </label>
                        <input
                            type="text"
                            value={formData.organizationType}
                            onChange={(e) => setFormData((f) => ({ ...f, organizationType: e.target.value }))}
                            placeholder="e.g. Student Chapter / Enterprise / Non-Profit"
                            className="w-full rounded-2xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 font-medium"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                            Location <span className="text-slate-400 font-normal">(Optional)</span>
                        </label>
                        <div className="relative">
                            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                            <input
                                type="text"
                                value={formData.location}
                                onChange={(e) => setFormData((f) => ({ ...f, location: e.target.value }))}
                                placeholder="e.g. Hyderabad, India"
                                className="w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-xs text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 font-medium"
                            />
                        </div>
                    </div>
                </div>

                {/* Organization Description */}
                <div>
                    <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                            Description
                        </label>
                        <span
                            className={`text-[11px] font-medium ${
                                descriptionLength > 1000 ? "text-rose-500 font-bold" : "text-slate-400"
                            }`}
                        >
                            {descriptionLength} / 1000
                        </span>
                    </div>
                    <textarea
                        rows={4}
                        value={formData.description}
                        onChange={(e) => {
                            setFormData((f) => ({ ...f, description: e.target.value }));
                            if (errors.description && e.target.value.length <= 1000) {
                                setErrors((err) => ({ ...err, description: null }));
                            }
                        }}
                        placeholder="Provide a compelling overview of your organization's mission, background, and hackathon initiatives..."
                        className={`w-full rounded-2xl border bg-white p-3.5 text-xs text-slate-900 outline-none transition focus:ring-2 focus:ring-blue-500/20 dark:bg-slate-900 dark:text-slate-100 resize-none font-normal leading-relaxed ${
                            errors.description
                                ? "border-rose-500 focus:border-rose-500"
                                : "border-slate-200 focus:border-blue-500 dark:border-slate-800"
                        }`}
                    />
                    {errors.description && (
                        <p className="mt-1 text-xs text-rose-500 flex items-center gap-1 font-medium">
                            <AlertCircle className="size-3" />
                            {errors.description}
                        </p>
                    )}
                </div>

                {/* Submit Action Bar */}
                <div className="pt-2 flex items-center gap-3">
                    <Button
                        type="submit"
                        disabled={saving || !isDirty}
                        size="sm"
                        className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs gap-1.5 px-6 py-2.5 rounded-xl shadow-xs disabled:opacity-50 disabled:cursor-not-allowed dark:bg-blue-600 dark:hover:bg-blue-500"
                    >
                        <Save className="size-3.5" />
                        {saving ? "Saving Changes..." : "Save Changes"}
                    </Button>
                    {!isDirty && (
                        <span className="text-xs text-slate-400 font-medium">
                            No changes made yet
                        </span>
                    )}
                </div>
            </form>
        </div>
    );
}
