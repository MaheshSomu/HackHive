import { useState, useEffect } from "react";
import { Sparkles, Image as ImageIcon, Save, Link as LinkIcon } from "lucide-react";
import { Button } from "../../ui/Button";

export default function BrandingSection({ profileData, onSave, saving }) {
    const [logoUrl, setLogoUrl] = useState("");
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        if (profileData) {
            setLogoUrl(profileData.logoUrl || "");
            setImageError(false);
        }
    }, [profileData]);

    const isDirty = (logoUrl || "") !== (profileData?.logoUrl || "");

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ logoUrl });
    };

    const initials = (profileData?.organizationName || "O")
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    return (
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-6">
            <div className="border-b border-slate-100 pb-4 dark:border-slate-800">
                <div className="flex items-center gap-2">
                    <Sparkles className="size-5 text-purple-600 dark:text-purple-400" />
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Organization Branding</h3>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Manage your public brand identity, logo mark, and visual representation.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
                {/* Logo Preview & Upload Section */}
                <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                        Organization Logo Preview
                    </label>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-5 rounded-2xl bg-slate-50/80 border border-slate-200/60 dark:bg-slate-800/40 dark:border-slate-800">
                        {/* Preview Box */}
                        <div className="relative flex size-24 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 text-3xl font-black text-white shadow-md overflow-hidden ring-4 ring-white dark:ring-slate-900">
                            {logoUrl && !imageError ? (
                                <img
                                    src={logoUrl}
                                    alt="Logo preview"
                                    className="size-full object-cover"
                                    onError={() => setImageError(true)}
                                />
                            ) : (
                                <span>{initials}</span>
                            )}
                        </div>

                        {/* Instructions */}
                        <div className="space-y-1 min-w-0">
                            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                                <ImageIcon className="size-4 text-purple-600" /> Logo Graphic Specification
                            </h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
                                Provide a direct image URL (PNG, JPG, SVG). Recommended resolution is 512x512px square format for optimal display across event cards and navigation headers.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Logo URL Input Field */}
                <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        Logo Image URL
                    </label>
                    <div className="relative">
                        <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                        <input
                            type="url"
                            value={logoUrl}
                            onChange={(e) => {
                                setLogoUrl(e.target.value);
                                setImageError(false);
                            }}
                            placeholder="https://example.com/logo.png"
                            className="w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-xs text-slate-900 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 font-medium"
                        />
                    </div>
                    {imageError && (
                        <p className="mt-1 text-xs text-rose-500 font-medium">
                            Failed to load image preview from this URL. Please verify the link.
                        </p>
                    )}
                </div>

                {/* Save Action */}
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
