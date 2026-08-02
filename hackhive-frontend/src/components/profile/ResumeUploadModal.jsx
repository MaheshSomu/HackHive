import { useState } from "react";
import ProfileModal from "./ProfileModal";
import { Button } from "../ui/Button";
import { UploadCloud, FileText } from "lucide-react";

export default function ResumeUploadModal({ isOpen, onClose, onUpload, isLoading }) {
    const [file, setFile] = useState(null);
    const [error, setError] = useState("");

    const handleFileChange = (e) => {
        const selected = e.target.files?.[0];
        if (selected) {
            if (selected.size > 5 * 1024 * 1024) {
                setError("File size must be under 5MB");
                setFile(null);
                return;
            }
            setError("");
            setFile(selected);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!file) {
            setError("Please select a file to upload");
            return;
        }
        onUpload(file);
    };

    return (
        <ProfileModal isOpen={isOpen} onClose={onClose} title="Upload Resume">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-6 text-center dark:border-slate-800 dark:bg-slate-800/40">
                    <UploadCloud className="size-10 text-indigo-500 mb-2" />
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                        Upload your latest Resume (PDF or DOCX)
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">Maximum file size: 5MB</p>

                    <input
                        type="file"
                        id="resumeFileInput"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        className="hidden"
                    />

                    <label
                        htmlFor="resumeFileInput"
                        className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-white px-4 py-2 text-xs font-medium text-slate-700 border border-slate-200 shadow-2xs hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                    >
                        <FileText className="size-4 text-indigo-600" />
                        <span>{file ? file.name : "Select Resume File"}</span>
                    </label>
                </div>

                {error && <p className="text-xs text-rose-500">{error}</p>}

                <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={onClose} size="sm">
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading || !file} size="sm">
                        {isLoading ? "Uploading..." : "Upload Resume"}
                    </Button>
                </div>
            </form>
        </ProfileModal>
    );
}
