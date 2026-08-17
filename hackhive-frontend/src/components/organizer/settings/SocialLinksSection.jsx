import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Share2, Save, X, Loader2, AlertCircle } from "lucide-react";
import { Button } from "../../ui/Button";
import { organizerService } from "../../../services/organizerService";

const PLATFORMS = [
    { key: "LINKEDIN", label: "LinkedIn", placeholder: "https://linkedin.com/company/your-org" },
    { key: "GITHUB", label: "GitHub", placeholder: "https://github.com/your-org" },
    { key: "X", label: "X / Twitter", placeholder: "https://x.com/your-org" },
    { key: "INSTAGRAM", label: "Instagram", placeholder: "https://instagram.com/your-org" },
    { key: "FACEBOOK", label: "Facebook", placeholder: "https://facebook.com/your-org" },
];

export default function SocialLinksSection() {
    const [socialLinks, setSocialLinks] = useState({
        LINKEDIN: "",
        GITHUB: "",
        X: "",
        INSTAGRAM: "",
        FACEBOOK: "",
    });

    const [originalLinks, setOriginalLinks] = useState({
        LINKEDIN: "",
        GITHUB: "",
        X: "",
        INSTAGRAM: "",
        FACEBOOK: "",
    });

    const [linkIds, setLinkIds] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState({});

    const fetchSocialLinks = useCallback(async () => {
        setLoading(true);
        try {
            const data = await organizerService.getSocialLinks();
            const loadedMap = { LINKEDIN: "", GITHUB: "", X: "", INSTAGRAM: "", FACEBOOK: "" };
            const loadedIds = {};

            if (Array.isArray(data)) {
                data.forEach((item) => {
                    if (item.platform && loadedMap.hasOwnProperty(item.platform)) {
                        loadedMap[item.platform] = item.url || "";
                        loadedIds[item.platform] = item.id;
                    }
                });
            }

            setSocialLinks(loadedMap);
            setOriginalLinks(loadedMap);
            setLinkIds(loadedIds);
            setErrors({});
        } catch (err) {
            console.error("Failed to load social links:", err);
            toast.error("Failed to load social links.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSocialLinks();
    }, [fetchSocialLinks]);

    const isDirty = PLATFORMS.some(
        (p) => (socialLinks[p.key] || "").trim() !== (originalLinks[p.key] || "").trim()
    );

    const handleChange = (platformKey, value) => {
        setSocialLinks((prev) => ({
            ...prev,
            [platformKey]: value,
        }));
        if (errors[platformKey]) {
            setErrors((prev) => ({
                ...prev,
                [platformKey]: null,
            }));
        }
    };

    const handleClear = (platformKey) => {
        setSocialLinks((prev) => ({
            ...prev,
            [platformKey]: "",
        }));
        if (errors[platformKey]) {
            setErrors((prev) => ({
                ...prev,
                [platformKey]: null,
            }));
        }
    };

    const normalizeUrl = (url) => {
        if (!url || !url.trim()) return "";
        let trimmed = url.trim();
        if (!/^https?:\/\//i.test(trimmed)) {
            trimmed = `https://${trimmed}`;
        }
        return trimmed;
    };

    const validateUrl = (platformKey, url) => {
        if (!url || !url.trim()) return null;
        const normalized = normalizeUrl(url);
        try {
            const parsed = new URL(normalized);
            const host = parsed.hostname.toLowerCase();
            switch (platformKey) {
                case "LINKEDIN":
                    if (!host.includes("linkedin.com")) return "Must be a valid linkedin.com URL";
                    break;
                case "GITHUB":
                    if (!host.includes("github.com")) return "Must be a valid github.com URL";
                    break;
                case "X":
                    if (!host.includes("x.com") && !host.includes("twitter.com"))
                        return "Must be a valid x.com or twitter.com URL";
                    break;
                case "INSTAGRAM":
                    if (!host.includes("instagram.com")) return "Must be a valid instagram.com URL";
                    break;
                case "FACEBOOK":
                    if (!host.includes("facebook.com")) return "Must be a valid facebook.com URL";
                    break;
                default:
                    break;
            }
        } catch (e) {
            return "Invalid URL format.";
        }
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        // Validate all non-empty fields
        const newErrors = {};
        let hasErrors = false;
        PLATFORMS.forEach((p) => {
            const val = (socialLinks[p.key] || "").trim();
            if (val) {
                const err = validateUrl(p.key, val);
                if (err) {
                    newErrors[p.key] = err;
                    hasErrors = true;
                }
            }
        });

        if (hasErrors) {
            setErrors(newErrors);
            toast.error("Please fix invalid social link URLs before saving.");
            return;
        }

        setSaving(true);
        try {
            for (const p of PLATFORMS) {
                const currentVal = (socialLinks[p.key] || "").trim();
                const origVal = (originalLinks[p.key] || "").trim();
                const normalizedVal = normalizeUrl(currentVal);

                if (currentVal && normalizedVal !== origVal) {
                    await organizerService.saveSocialLink({
                        platform: p.key,
                        url: normalizedVal,
                    });
                } else if (!currentVal && origVal) {
                    if (linkIds[p.key]) {
                        await organizerService.deleteSocialLink(linkIds[p.key]);
                    } else {
                        await organizerService.deleteSocialLinkByPlatform(p.key);
                    }
                }
            }

            toast.success("Social links updated successfully.");
            await fetchSocialLinks();
        } catch (err) {
            console.error("Failed to save social links:", err);
            const msg = err.response?.data?.message || "Failed to update social links. Please try again.";
            toast.error(msg);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-6">
            <div className="border-b border-slate-100 pb-4 dark:border-slate-800 flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <Share2 className="size-5 text-purple-600 dark:text-purple-400" />
                        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Social Media Links</h3>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Connect your organization's social profiles to build community trust.
                    </p>
                </div>
            </div>

            {loading ? (
                <div className="space-y-5 max-w-2xl animate-pulse">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="space-y-1.5">
                            <div className="h-3 w-20 bg-slate-200 dark:bg-slate-800 rounded-md" />
                            <div className="h-10 w-full bg-slate-100 dark:bg-slate-800/60 rounded-2xl" />
                        </div>
                    ))}
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl">
                    {PLATFORMS.map((p) => {
                        const val = socialLinks[p.key] || "";
                        const err = errors[p.key];

                        return (
                            <div key={p.key}>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                                    {p.label}
                                </label>
                                <div className="relative">
                                    <input
                                        type="url"
                                        value={val}
                                        onChange={(e) => handleChange(p.key, e.target.value)}
                                        disabled={saving}
                                        placeholder={p.placeholder}
                                        className="w-full rounded-2xl border border-slate-200 bg-white pl-4 pr-10 py-2.5 text-xs text-slate-900 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 font-medium disabled:opacity-50"
                                    />
                                    {val && !saving && (
                                        <button
                                            type="button"
                                            onClick={() => handleClear(p.key)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors rounded-full"
                                            title="Clear field"
                                        >
                                            <X className="size-3.5" />
                                        </button>
                                    )}
                                </div>
                                {err && (
                                    <p className="mt-1 text-xs text-rose-500 font-medium flex items-center gap-1">
                                        <AlertCircle className="size-3.5" /> {err}
                                    </p>
                                )}
                            </div>
                        );
                    })}

                    <div className="pt-2 flex items-center gap-3">
                        <Button
                            type="submit"
                            disabled={saving || !isDirty}
                            size="sm"
                            className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs gap-1.5 px-6 py-2.5 rounded-xl shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {saving ? (
                                <>
                                    <Loader2 className="size-3.5 animate-spin" />
                                    Saving Changes...
                                </>
                            ) : (
                                <>
                                    <Save className="size-3.5" />
                                    Save Changes
                                </>
                            )}
                        </Button>
                        {!isDirty && (
                            <span className="text-xs text-slate-400 font-medium">
                                No changes made yet
                            </span>
                        )}
                    </div>
                </form>
            )}
        </div>
    );
}
