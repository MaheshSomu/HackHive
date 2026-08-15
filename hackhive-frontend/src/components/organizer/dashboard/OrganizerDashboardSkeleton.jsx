import { Skeleton } from "../../ui/Skeleton";

export default function OrganizerDashboardSkeleton() {
    return (
        <div className="space-y-8 pb-16 w-full max-w-7xl mx-auto">
            {/* Hero Skeleton */}
            <Skeleton className="h-[140px] w-full rounded-xl" />

            {/* Overview Skeleton (5 KPI Cards) */}
            <div className="space-y-4">
                <Skeleton className="h-6 w-28 rounded-md" />
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                    {Array.from({ length: 5 }).map((_, idx) => (
                        <Skeleton key={idx} className="h-[110px] w-full rounded-xl" />
                    ))}
                </div>
            </div>

            {/* Quick Actions Skeleton (4 Tiles) */}
            <div className="space-y-4">
                <Skeleton className="h-6 w-32 rounded-md" />
                <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, idx) => (
                        <Skeleton key={idx} className="h-[60px] w-full rounded-xl" />
                    ))}
                </div>
            </div>

            {/* Upcoming Events Skeleton */}
            <div className="space-y-4">
                <Skeleton className="h-6 w-36 rounded-md" />
                <div className="space-y-3">
                    <Skeleton className="h-[84px] w-full rounded-xl" />
                    <Skeleton className="h-[84px] w-full rounded-xl" />
                </div>
            </div>

            {/* Recent Activity Skeleton */}
            <div className="space-y-4">
                <Skeleton className="h-6 w-32 rounded-md" />
                <Skeleton className="h-[140px] w-full rounded-xl" />
            </div>
        </div>
    );
}
