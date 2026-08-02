import { AlertCircle, Inbox } from "lucide-react";

import { Card, CardContent } from "../ui/Card";

function EmptyState({ icon = <Inbox className="size-5" />, title, description, action }) {
    return (
        <Card className="border-dashed border-slate-200 bg-white">
            <CardContent className="flex flex-col items-start gap-4 p-6">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-slate-600">
                    {icon}
                </div>

                <div className="space-y-1">
                    <h3 className="text-base font-semibold text-slate-950">
                        {title}
                    </h3>
                    <p className="max-w-xl text-sm leading-6 text-slate-500">
                        {description}
                    </p>
                </div>

                {action}
            </CardContent>
        </Card>
    );
}

function SkeletonBlock({ className = "" }) {
    return <div className={`animate-pulse rounded-2xl bg-slate-200/70 ${className}`} />;
}

function DashboardPageSkeleton() {
    return (
        <div className="space-y-8">
            <SkeletonBlock className="h-[240px] w-full ring-1 ring-slate-200" />

            <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
                <SkeletonBlock className="h-[260px] w-full ring-1 ring-slate-200" />
                <SkeletonBlock className="h-[260px] w-full ring-1 ring-slate-200" />
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                <SkeletonBlock className="h-[132px] w-full ring-1 ring-slate-200" />
                <SkeletonBlock className="h-[132px] w-full ring-1 ring-slate-200" />
                <SkeletonBlock className="h-[132px] w-full ring-1 ring-slate-200" />
                <SkeletonBlock className="h-[132px] w-full ring-1 ring-slate-200" />
            </div>

            <SkeletonBlock className="h-[340px] w-full ring-1 ring-slate-200" />
            <SkeletonBlock className="h-[300px] w-full ring-1 ring-slate-200" />

            <div className="grid gap-5 xl:grid-cols-2">
                <SkeletonBlock className="h-[360px] w-full ring-1 ring-slate-200" />
                <SkeletonBlock className="h-[360px] w-full ring-1 ring-slate-200" />
            </div>
        </div>
    );
}

function DashboardErrorBanner({ message }) {
    return (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
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
