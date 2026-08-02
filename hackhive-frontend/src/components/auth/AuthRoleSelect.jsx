import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const ROLES = [
    {
        value: "STUDENT",
        title: "Student",
        description: "Discover events, teams, and projects.",
    },
    {
        value: "ORGANIZER",
        title: "Organizer",
        description: "Create and manage hackathons.",
    },
];

function AuthRoleSelect({ value, onChange, error }) {
    return (
        <div className="space-y-3">
            <div>
                <p className="text-sm font-medium text-slate-700">Role</p>
                <p className="mt-1 text-sm text-slate-500">
                    Choose the experience that matches your account.
                </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
                {ROLES.map((role) => {
                    const active = value === role.value;

                    return (
                        <button
                            key={role.value}
                            type="button"
                            onClick={() => onChange(role.value)}
                            className={cn(
                                "group rounded-2xl border p-4 text-left transition focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-100",
                                active
                                    ? "border-indigo-500 bg-indigo-50 shadow-sm"
                                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                            )}
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <p className="font-semibold text-slate-900">
                                        {role.title}
                                    </p>
                                    <p className="mt-1 text-sm leading-6 text-slate-500">
                                        {role.description}
                                    </p>
                                </div>

                                <span
                                    className={cn(
                                        "mt-1 flex size-5 items-center justify-center rounded-full border",
                                        active
                                            ? "border-indigo-500 bg-indigo-600 text-white"
                                            : "border-slate-300 text-transparent"
                                    )}
                                >
                                    <Check className="size-3.5" />
                                </span>
                            </div>
                        </button>
                    );
                })}
            </div>

            {error ? <p className="text-sm text-rose-600">{error}</p> : null}
        </div>
    );
}

export default AuthRoleSelect;
