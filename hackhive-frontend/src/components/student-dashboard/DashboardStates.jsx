import { AlertCircle } from "lucide-react";
import { EmptyState } from "../ui/EmptyState";
import { Skeleton } from "../ui/Skeleton";

function SkeletonBlock({ className = "" }) {
    return <Skeleton className={`rounded-2xl ${className}`} />;
}

function DashboardPageSkeleton() {
    return (
        <div className="space-y-8">
            <SkeletonBlock className="h-[240px] w-full" />

            <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
                <SkeletonBlock className="h-[260px] w-full" />
                <SkeletonBlock className="h-[260px] w-full" />
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                <SkeletonBlock className="h-[132px] w-full" />
                <SkeletonBlock className="h-[132px] w-full" />
                <SkeletonBlock className="h-[132px] w-full" />
                <SkeletonBlock className="h-[132px] w-full" />
            </div>

            <SkeletonBlock className="h-[340px] w-full" />
            <SkeletonBlock className="h-[300px] w-full" />

            <div className="grid gap-5 xl:grid-cols-2">
                <SkeletonBlock className="h-[360px] w-full" />
                <SkeletonBlock className="h-[360px] w-full" />
            </div>
        </div>
    );
}

function DashboardErrorBanner({ message }) {
    return (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300">
            <div className="flex items-start gap-3">
                <AlertCircle className="mt-0.5 size-4 shrink-0" />
                <p>{message}</p>
            </div>
        </div>
    );
}

export {
    EmptyState,
    SkeletonBlock,
    DashboardPageSkeleton,
    DashboardErrorBanner,
};

