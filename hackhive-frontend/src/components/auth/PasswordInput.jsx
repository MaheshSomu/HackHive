import { forwardRef, useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import AuthField from "./AuthField";

const PasswordInput = forwardRef(function PasswordInput(
    { className, inputClassName, error, label, hint, id, ...props },
    ref
) {
    const [show, setShow] = useState(false);

    return (
        <AuthField
            ref={ref}
            id={id}
            label={label}
            hint={hint}
            error={error}
            icon={<Lock size={18} />}
            type={show ? "text" : "password"}
            inputClassName={inputClassName}
            className={className}
            rightSlot={
                <button
                    type="button"
                    onClick={() => setShow((current) => !current)}
                    className={cn(
                        "flex items-center text-slate-400 transition hover:text-indigo-600"
                    )}
                    aria-label={show ? "Hide password" : "Show password"}
                >
                    {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
            }
            {...props}
        />
    );
});

export default PasswordInput;