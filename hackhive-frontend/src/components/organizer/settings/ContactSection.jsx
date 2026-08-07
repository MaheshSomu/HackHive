import { useState, useEffect } from "react";
import { Mail, Phone, Globe, Save } from "lucide-react";
import { Button } from "../../ui/Button";

export default function ContactSection({ profileData, onSave, saving }) {
    const [formData, setFormData] = useState({
        contactEmail: "",
        contactPhone: "",
        websiteUrl: "",
    });

    useEffect(() => {
        if (profileData) {
            setFormData({
                contactEmail: profileData.contactEmail || "",
                contactPhone: profileData.contactPhone || "",
                websiteUrl: profileData.websiteUrl || "",
            });
        }
    }, [profileData]);

    const isDirty =
        (formData.contactEmail || "") !== (profileData?.contactEmail || "") ||
        (formData.contactPhone || "") !== (profileData?.contactPhone || "") ||
        (formData.websiteUrl || "") !== (profileData?.websiteUrl || "");

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-6">
            <div className="border-b border-slate-100 pb-4 dark:border-slate-800">
                <div className="flex items-center gap-2">
                    <Mail className="size-5 text-purple-600 dark:text-purple-400" />
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Contact Information</h3>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Public communication channels displayed on your hackathons and organizer landing page.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl">
                {/* Contact Email */}
                <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        Contact Email
                    </label>
                    <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                        <input
                            type="email"
                            value={formData.contactEmail}
                            onChange={(e) => setFormData((f) => ({ ...f, contactEmail: e.target.value }))}
                            placeholder="e.g. contact@gdsc.com"
                            className="w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-xs text-slate-900 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 font-medium"
                        />
                    </div>
                </div>

                {/* Contact Phone */}
                <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        Contact Phone
                    </label>
                    <div className="relative">
                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                        <input
                            type="tel"
                            value={formData.contactPhone}
                            onChange={(e) => setFormData((f) => ({ ...f, contactPhone: e.target.value }))}
                            placeholder="e.g. +91 98765 43210"
                            className="w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-xs text-slate-900 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 font-medium"
                        />
                    </div>
                </div>

                {/* Website URL */}
                <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        Website URL
                    </label>
                    <div className="relative">
                        <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                        <input
                            type="url"
                            value={formData.websiteUrl}
                            onChange={(e) => setFormData((f) => ({ ...f, websiteUrl: e.target.value }))}
                            placeholder="e.g. https://www.gdsc.com"
                            className="w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-xs text-slate-900 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 font-medium"
                        />
                    </div>
                </div>

                {/* Submit Action Bar */}
                <div className="pt-2 flex items-center gap-3">
                    <Button
                        type="submit"
                        disabled={saving || !isDirty}
                        size="sm"
                        className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs gap-1.5 px-6 py-2.5 rounded-xl shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
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
