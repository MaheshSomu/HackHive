import { Share2, Lock } from "lucide-react";
import { Badge } from "../../ui/Badge";
import { Button } from "../../ui/Button";

export default function SocialLinksSection() {
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
                <Badge variant="warning" className="gap-1 px-3 py-1 text-xs font-extrabold uppercase tracking-wider">
                    <Lock className="size-3" /> Coming Soon
                </Badge>
            </div>

            <div className="space-y-5 max-w-2xl opacity-75">
                {/* LinkedIn */}
                <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        LinkedIn
                    </label>
                    <input
                        type="url"
                        disabled
                        placeholder="https://linkedin.com/company/your-org"
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-500 cursor-not-allowed dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-400"
                    />
                </div>

                {/* GitHub */}
                <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        GitHub
                    </label>
                    <input
                        type="url"
                        disabled
                        placeholder="https://github.com/your-org"
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-500 cursor-not-allowed dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-400"
                    />
                </div>

                {/* Twitter / X */}
                <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        Twitter / X
                    </label>
                    <input
                        type="url"
                        disabled
                        placeholder="https://x.com/your-org"
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-500 cursor-not-allowed dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-400"
                    />
                </div>

                {/* Instagram */}
                <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        Instagram
                    </label>
                    <input
                        type="url"
                        disabled
                        placeholder="https://instagram.com/your-org"
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-500 cursor-not-allowed dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-400"
                    />
                </div>

                {/* Facebook */}
                <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        Facebook
                    </label>
                    <input
                        type="url"
                        disabled
                        placeholder="https://facebook.com/your-org"
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-500 cursor-not-allowed dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-400"
                    />
                </div>

                {/* Disabled Save Action */}
                <div className="pt-2 flex items-center gap-3">
                    <Button
                        type="button"
                        disabled
                        size="sm"
                        className="bg-slate-300 text-slate-500 dark:bg-slate-800 dark:text-slate-500 font-bold text-xs px-6 py-2.5 rounded-xl cursor-not-allowed"
                    >
                        Save Changes
                    </Button>
                    <span className="text-xs text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1">
                        🔒 Social profile integration is coming soon in the next release.
                    </span>
                </div>
            </div>
        </div>
    );
}
