import { Loader2 } from "lucide-react";

function AuthLoader({ label = "Loading authentication..." }) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,#f8fafc_0%,#ffffff_42%,#eef2ff_100%)] px-6">
            <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-3 shadow-sm">
                <Loader2 className="size-4 animate-spin text-indigo-600" />
                <span className="text-sm text-slate-600">{label}</span>
            </div>
        </div>
    );
}

export default AuthLoader;
