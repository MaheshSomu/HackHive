import * as React from "react";
import { Input } from "./input";
import { Label } from "./label";

function InputField({
    id,
    label,
    type = "text",
    placeholder,
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
            <Input
                id={inputId}
                type={type}
                placeholder={placeholder}
                aria-invalid={Boolean(error)}
                className={className}
                {...props}
            />
            {error ? (
                <p className="text-xs text-rose-500 font-medium">{error}</p>
            ) : helperText ? (
                <p className="text-xs text-slate-500 dark:text-slate-400">{helperText}</p>
            ) : null}
        </div>
    );
}

export default InputField;
export { InputField };