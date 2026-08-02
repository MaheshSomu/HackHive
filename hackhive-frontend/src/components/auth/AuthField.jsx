import { forwardRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const AuthField = forwardRef(function AuthField(
    {
        label,
        hint,
        error,
        icon,
        rightSlot,
        className,
        inputClassName,
        id,
        ...props
    },
    ref
) {
    return (
        <div className={cn("space-y-2", className)}>
            {label ? (
                <Label htmlFor={id} className="text-sm font-medium text-slate-700">
                    {label}
                </Label>
            ) : null}

            <div
                className={cn(
                    "flex h-14 items-center gap-3 rounded-2xl border bg-white px-4 transition focus-within:ring-4",
                    error
                        ? "border-rose-300 focus-within:border-rose-400 focus-within:ring-rose-100"
                        : "border-slate-200 focus-within:border-indigo-500 focus-within:ring-indigo-100"
                )}
            >
                {icon ? <div className="text-slate-400">{icon}</div> : null}

                <Input
                    ref={ref}
                    id={id}
                    className={cn(
                        "h-full border-0 bg-transparent px-0 text-sm shadow-none outline-none focus-visible:ring-0",
                        inputClassName
                    )}
                    {...props}
                />

                {rightSlot ? <div>{rightSlot}</div> : null}
            </div>

            {error ? (
                <p className="text-sm text-rose-600">{error}</p>
            ) : hint ? (
                <p className="text-sm text-slate-500">{hint}</p>
            ) : null}
        </div>
    );
});

export default AuthField;
