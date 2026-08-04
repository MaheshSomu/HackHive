import * as React from "react";
import { ChevronDown } from "lucide-react";
import { Label } from "./label";

const Select = React.forwardRef(function Select(
    {
        id,
        label,
        error,
        helperText,
        required = false,
        className = "",
        containerClassName = "",
        options = [],
        children,
        ...props
    },
    ref
) {
    const generatedId = React.useId();
    const selectId = id || generatedId;

    return (
        <div className={`space-y-1.5 ${containerClassName}`}>
            {label && (
                <Label htmlFor={selectId} className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {label}
                    {required && <span className="ml-1 text-rose-500">*</span>}
                </Label>
            )}
            <div className="relative flex items-center">
                <select
                    ref={ref}
                    id={selectId}
                    aria-invalid={Boolean(error)}
                    className={`
                        h-10 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-3.5 pr-10 text-sm text-slate-900 shadow-2xs transition-all duration-200 outline-none cursor-pointer
                        focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500/20
                        disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-60
                        aria-invalid:border-rose-500 aria-invalid:ring-2 aria-invalid:ring-rose-500/20
                        dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:focus-visible:border-indigo-400 dark:focus-visible:ring-indigo-400/20 dark:aria-invalid:border-rose-500
                        ${className}
                    `}
                    {...props}
                >
                    {options.length > 0
                        ? options.map((opt) => (
                              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                                  {opt.label}
                              </option>
                          ))
                        : children}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 size-4 text-slate-400 dark:text-slate-500" />
            </div>
            {error ? (
                <p className="text-xs font-medium text-rose-500">{error}</p>
            ) : helperText ? (
                <p className="text-xs text-slate-500 dark:text-slate-400">{helperText}</p>
            ) : null}
        </div>
    );
});

export { Select };
export default Select;
