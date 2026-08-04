import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }) {
    return (
        <div
            className={cn(
                "animate-pulse rounded-xl bg-slate-200/80 dark:bg-slate-800/80",
                className
            )}
            {...props}
        />
    );
}

function SkeletonText({ lines = 3, className = "" }) {
    return (
        <div className={`space-y-2 ${className}`}>
            {Array.from({ length: lines }).map((_, i) => (
                <Skeleton
                    key={i}
                    className={`h-4 ${i === lines - 1 ? "w-2/3" : "w-full"}`}
                />
            ))}
        </div>
    );
}

function SkeletonCard({ className = "" }) {
    return (
        <div className={`space-y-4 rounded-2xl border border-slate-200/80 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 ${className}`}>
            <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="size-8 rounded-xl" />
            </div>
            <Skeleton className="h-8 w-1/2" />
            <SkeletonText lines={2} />
        </div>
    );
}

export { Skeleton, SkeletonText, SkeletonCard };
export default Skeleton;
