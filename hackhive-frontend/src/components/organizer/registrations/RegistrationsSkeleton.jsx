import { Skeleton } from "../../ui/Skeleton";

export default function RegistrationsSkeleton() {
    return (
        <div className="space-y-6 pb-16 w-full max-w-7xl mx-auto">
            {/* Header Hero Skeleton */}
            <Skeleton className="h-[140px] w-full rounded-2xl" />

            {/* Summary Cards Skeleton (4 Cards) */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-[110px] w-full rounded-2xl" />
                ))}
            </div>

            {/* Toolbar Skeleton */}
            <Skeleton className="h-[130px] w-full rounded-2xl" />

            {/* Table Skeleton */}
            <Skeleton className="h-[360px] w-full rounded-2xl" />
        </div>
    );
}
