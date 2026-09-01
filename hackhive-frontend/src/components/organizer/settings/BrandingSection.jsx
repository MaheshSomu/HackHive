import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import {
    Sparkles,
    Image as ImageIcon,
    Save,
    Link as LinkIcon,
    Upload,
    Trash2,
    Loader2,
    CheckCircle2,
    AlertCircle,
} from "lucide-react";
import { Button } from "../../ui/Button";
import { organizerService } from "../../../services/organizerService";
import { getImageUrl } from "../../../utils/imageUtils";

export default function BrandingSection({
    profileData,
    onSave,
    saving,
    onProfileUpdated,
}) {
    const [logoUrl, setLogoUrl] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [localPreview, setLocalPreview] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [removing, setRemoving] = useState(false);
    const [uploadError, setUploadError] = useState("");
    const [imageError, setImageError] = useState(false);

    const fileInputRef = useRef(null);

    useEffect(() => {
        if (profileData) {
            setLogoUrl(profileData.logoUrl || "");
            setImageError(false);
            setUploadError("");
            setSelectedFile(null);
            setLocalPreview(null);
        }
    }, [profileData]);

    const isUrlDirty = (logoUrl || "") !== (profileData?.logoUrl || "");

    const handleFileSelect = (e) => {
        const file = e.target.files?.[0];
        setUploadError("");
        setImageError(false);

        if (!file) {
            return;
        }

        const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
        if (!allowedTypes.includes(file.type.toLowerCase())) {
            const errorMsg = "Only PNG, JPG, JPEG, and WebP images are supported.";
            setUploadError(errorMsg);
            toast.error(errorMsg);
            e.target.value = "";
            return;
        }

        const maxSize = 5 * 1024 * 1024; // 5 MB
        if (file.size > maxSize) {
            const errorMsg = "Image must be smaller than 5 MB.";
            setUploadError(errorMsg);
            toast.error(errorMsg);
            e.target.value = "";
            return;
        }

        setSelectedFile(file);
        const objectUrl = URL.createObjectURL(file);
        setLocalPreview(objectUrl);
    };

    const handleUploadLogo = async () => {
        if (!selectedFile) {
            const errorMsg = "Please select an image.";
            setUploadError(errorMsg);
            toast.error(errorMsg);
            return;
        }

        setUploading(true);
        setUploadError("");

        try {
            const updated = await organizerService.uploadLogo(selectedFile);
            toast.success("Organizer logo uploaded successfully.");
            setLogoUrl(updated.logoUrl || "");
            setSelectedFile(null);
            setLocalPreview(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
            if (onProfileUpdated) {
                onProfileUpdated(updated);
            }
        } catch (err) {
            console.error("Failed to upload logo:", err);
            const msg = err.response?.data?.message || "Failed to upload logo. Please try again.";
            setUploadError(msg);
            toast.error(msg);
        } finally {
            setUploading(false);
        }
    };

    const handleRemoveLogo = async () => {
        setRemoving(true);
        setUploadError("");

        try {
            const updated = await organizerService.removeLogo();
            toast.success("Organizer logo removed successfully.");
            setLogoUrl("");
            setSelectedFile(null);
            setLocalPreview(null);
            setImageError(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
            if (onProfileUpdated) {
                onProfileUpdated(updated);
            }
        } catch (err) {
            console.error("Failed to remove logo:", err);
            const msg = err.response?.data?.message || "Failed to remove logo. Please try again.";
            toast.error(msg);
        } finally {
            setRemoving(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedFile) {
            handleUploadLogo();
        } else if (isUrlDirty) {
            onSave({ logoUrl });
        }
    };

    const displayImageSrc = localPreview || (logoUrl ? getImageUrl(logoUrl) : null);

    const initials = (profileData?.organizationName || "O")
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    const currentLogoExists = Boolean(localPreview || (logoUrl && !imageError));

    return (
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-6">
            <div className="border-b border-slate-100 pb-4 dark:border-slate-800">
                <div className="flex items-center gap-2">
                    <Sparkles className="size-5 text-blue-600 dark:text-blue-400" />
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Organization Branding</h3>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Manage your public brand identity, logo mark, and visual representation.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
                {/* Logo Preview & Upload Control Section */}
                <div className="space-y-3">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                        Organization Logo Preview
                    </label>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-5 rounded-2xl bg-slate-50/80 border border-slate-200/60 dark:bg-slate-800/40 dark:border-slate-800">
                        {/* Preview Box */}
                        <div className="relative flex size-24 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 text-3xl font-black text-white shadow-md overflow-hidden ring-4 ring-white dark:ring-slate-900">
                            {displayImageSrc && !imageError ? (
                                <img
                                    src={displayImageSrc}
                                    alt="Logo preview"
                                    className="size-full object-cover"
                                    onError={() => setImageError(true)}
                                />
                            ) : (
                                <span>{initials}</span>
                            )}
                        </div>

                        {/* File Upload Controls & Specs */}
                        <div className="space-y-3 min-w-0 flex-1">
                            <div className="space-y-1">
                                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                                    <ImageIcon className="size-4 text-blue-600 dark:text-blue-400" /> Logo Graphic Specification
                                </h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
                                    Upload an image from your device or enter a direct URL. Recommended size is square (e.g. 512x512px).
                                </p>
                            </div>

                            {/* Upload Buttons */}
                            <div className="flex flex-wrap items-center gap-3 pt-1">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    accept="image/png, image/jpeg, image/jpg, image/webp"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                    id="organizer-logo-input"
                                    disabled={uploading || removing || saving}
                                />

                                <label
                                    htmlFor="organizer-logo-input"
                                    className="cursor-pointer flex items-center text-xs font-bold gap-1.5 px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                                >
                                    <Upload className="size-3.5 text-blue-600 dark:text-blue-400" />
                                    <span>{selectedFile ? "Change Selected File" : "Choose Image File"}</span>
                                </label>

                                {selectedFile && (
                                    <Button
                                        type="button"
                                        onClick={handleUploadLogo}
                                        disabled={uploading}
                                        size="sm"
                                        className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs gap-1.5 px-4 py-2 rounded-xl shadow-xs dark:bg-blue-600 dark:hover:bg-blue-500"
                                    >
                                        {uploading ? (
                                            <>
                                                <Loader2 className="size-3.5 animate-spin" />
                                                Uploading...
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="size-3.5" />
                                                Upload Logo
                                            </>
                                        )}
                                    </Button>
                                )}
                            </div>

                            <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                                PNG, JPG, JPEG, WebP · Max 5 MB
                            </p>

                            {selectedFile && !uploadError && (
                                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                                    <CheckCircle2 className="size-3.5" /> Selected: {selectedFile.name} ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
                                </p>
                            )}

                            {uploadError && (
                                <p className="text-xs text-rose-500 font-medium flex items-center gap-1">
                                    <AlertCircle className="size-3.5" /> {uploadError}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* OR Separator */}
                <div className="relative flex items-center justify-center my-4">
                    <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
                    <span className="absolute bg-white dark:bg-slate-900 px-3 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                        OR
                    </span>
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
                                setLocalPreview(null);
                                setSelectedFile(null);
                            }}
                            disabled={uploading || removing || saving}
                            placeholder="https://example.com/logo.png"
                            className="w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-xs text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 font-medium disabled:opacity-50"
                        />
                    </div>
                    {imageError && logoUrl && (
                        <p className="mt-1 text-xs text-rose-500 font-medium flex items-center gap-1">
                            <AlertCircle className="size-3.5" /> Failed to load image preview from this URL. Please verify the link.
                        </p>
                    )}
                </div>

                {/* Bottom Action Controls */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <Button
                            type="submit"
                            disabled={saving || uploading || removing || (!isUrlDirty && !selectedFile)}
                            size="sm"
                            className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs gap-1.5 px-6 py-2.5 rounded-xl shadow-xs disabled:opacity-50 disabled:cursor-not-allowed dark:bg-blue-600 dark:hover:bg-blue-500"
                        >
                            {uploading ? (
                                <>
                                    <Loader2 className="size-3.5 animate-spin" />
                                    Uploading...
                                </>
                            ) : saving ? (
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
                        {!isUrlDirty && !selectedFile && (
                            <span className="text-xs text-slate-400 font-medium">
                                No changes made yet
                            </span>
                        )}
                    </div>

                    {currentLogoExists && (
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleRemoveLogo}
                            disabled={uploading || removing || saving}
                            className="border-rose-200 text-rose-600 hover:bg-rose-50 dark:border-rose-950 dark:text-rose-400 dark:hover:bg-rose-950/40 font-bold text-xs gap-1.5 px-4 py-2.5 rounded-xl"
                        >
                            {removing ? (
                                <>
                                    <Loader2 className="size-3.5 animate-spin" />
                                    Removing...
                                </>
                            ) : (
                                <>
                                    <Trash2 className="size-3.5" />
                                    Remove Logo
                                </>
                            )}
                        </Button>
                    )}
                </div>
            </form>
        </div>
    );
}
