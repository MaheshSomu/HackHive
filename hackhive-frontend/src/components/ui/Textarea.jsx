import * as React from "react";
import { Label } from "./label";

const Textarea = React.forwardRef(function Textarea(
    {
        id,
        label,
        error,
        helperText,
        required = false,
        className = "",
        containerClassName = "",
        rows = 4,
        ...props
    },
    ref
) {
    const generatedId = React.useId();
    const textareaId = id || generatedId;

    return (
        <div className={`space-y-1.5 ${containerClassName}`}>
            {label && (
                <Label htmlFor={textareaId} className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {label}
                    {required && <span className="ml-1 text-rose-500">*</span>}
                </Label>
            )}
            <textarea
                ref={ref}
                id={textareaId}
                rows={rows}
                aria-invalid={Boolean(error)}
                className={`
                    w-full min-h-[80px] rounded-xl border border-slate-200 bg-white p-3.5 text-sm text-slate-900 shadow-2xs transition-all duration-200 outline-none
                    placeholder:text-slate-400 focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500/20
                    disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-60
                    aria-invalid:border-rose-500 aria-invalid:ring-2 aria-invalid:ring-rose-500/20
                    dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus-visible:border-indigo-400 dark:focus-visible:ring-indigo-400/20 dark:aria-invalid:border-rose-500
                    ${className}
                `}
                {...props}
            />
            {error ? (
                <p className="text-xs font-medium text-rose-500">{error}</p>
            ) : helperText ? (
                <p className="text-xs text-slate-500 dark:text-slate-400">{helperText}</p>
            ) : null}
        </div>
    );
});

export { Textarea };
export default Textarea;
