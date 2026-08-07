import { Skeleton } from "../../ui/Skeleton";

export default function OrganizerDashboardSkeleton() {
    return (
        <div className="space-y-8 pb-16">
            {/* Hero Skeleton */}
            <Skeleton className="h-[200px] w-full rounded-3xl" />

            {/* 6 Stat Cards Grid Skeleton */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                {Array.from({ length: 6 }).map((_, idx) => (
                    <Skeleton key={idx} className="h-[120px] w-full rounded-3xl" />
                ))}
            </div>

            {/* Quick Actions Skeleton */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, idx) => (
                    <Skeleton key={idx} className="h-[130px] w-full rounded-3xl" />
                ))}
            </div>

            {/* Two Column Layout Skeleton */}
            <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="space-y-8">
                    <Skeleton className="h-[320px] w-full rounded-3xl" />
                    <Skeleton className="h-[260px] w-full rounded-3xl" />
                </div>
                <div className="space-y-8">
                    <Skeleton className="h-[240px] w-full rounded-3xl" />
                    <Skeleton className="h-[240px] w-full rounded-3xl" />
                    <Skeleton className="h-[220px] w-full rounded-3xl" />
                </div>
            </div>
        </div>
    );
}
