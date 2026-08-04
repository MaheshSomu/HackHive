import * as React from "react";
import { Label } from "./label";

function TextField({
    id,
    label,
    icon,
    error,
    helperText,
    required = false,
    className = "",
    containerClassName = "",
    ...props
}) {
    const generatedId = React.useId();
    const inputId = id || generatedId;

    return (
        <div className={`space-y-1.5 ${containerClassName}`}>
            {label && (
                <Label htmlFor={inputId} className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {label}
                    {required && <span className="ml-1 text-rose-500">*</span>}
                </Label>
            )}
            <div
                className={`
                    flex items-center gap-2.5 rounded-xl border bg-white px-3 py-2 text-sm shadow-2xs transition-all duration-200
                    border-slate-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20
                    dark:border-slate-800 dark:bg-slate-900 dark:focus-within:border-indigo-400 dark:focus-within:ring-indigo-400/20
                    ${error ? "border-rose-500 focus-within:border-rose-500 focus-within:ring-rose-500/20 dark:border-rose-500" : ""}
                `}
            >
                {icon && <div className="text-slate-400 dark:text-slate-500 shrink-0">{icon}</div>}
                <input
                    id={inputId}
                    aria-invalid={Boolean(error)}
                    className={`
                        w-full bg-transparent text-slate-900 placeholder:text-slate-400 outline-none text-sm
                        dark:text-slate-100 dark:placeholder:text-slate-500 disabled:cursor-not-allowed
                        ${className}
                    `}
                    {...props}
                />
            </div>
            {error ? (
                <p className="text-xs font-medium text-rose-500">{error}</p>
            ) : helperText ? (
                <p className="text-xs text-slate-500 dark:text-slate-400">{helperText}</p>
            ) : null}
        </div>
    );
}

export default TextField;
export { TextField };