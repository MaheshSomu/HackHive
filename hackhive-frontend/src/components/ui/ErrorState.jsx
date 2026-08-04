import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "./Button";
import { Card, CardContent } from "./Card";

export function ErrorState({
    title = "Something went wrong",
    description = "An error occurred while loading this data. Please try again.",
    onRetry,
    isRetrying = false,
    className = "",
}) {
    return (
        <Card className={`border-rose-200/80 bg-rose-50/40 dark:border-rose-900/50 dark:bg-rose-950/20 ${className}`}>
            <CardContent className="flex flex-col items-center justify-center text-center p-8 space-y-4">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400">
                    <AlertCircle className="size-6" />
                </div>

                <div className="space-y-1 max-w-md">
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{title}</h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{description}</p>
                </div>

                {onRetry && (
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        isLoading={isRetrying}
                        onClick={onRetry}
                        className="mt-2 text-xs font-semibold border-rose-200 text-rose-700 hover:bg-rose-100/60 dark:border-rose-800 dark:text-rose-300 dark:hover:bg-rose-950/60"
                    >
                        {!isRetrying && <RefreshCw className="mr-1.5 size-3.5" />}
                        Retry
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}

export function ErrorBanner({ message, onRetry, className = "" }) {
    return (
        <div className={`rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs sm:text-sm text-rose-900 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300 ${className}`}>
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                    <AlertCircle className="size-4 shrink-0 text-rose-600 dark:text-rose-400" />
                    <p className="truncate font-medium">{message}</p>
                </div>
                {onRetry && (
                    <button
                        type="button"
                        onClick={onRetry}
                        className="shrink-0 font-bold underline underline-offset-2 hover:text-rose-950 dark:hover:text-rose-200"
                    >
                        Retry
                    </button>
                )}
            </div>
        </div>
    );
}

export default ErrorState;
