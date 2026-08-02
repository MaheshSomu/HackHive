import { Search, X } from "lucide-react";

export function SearchBar({
    value,
    onChange,
    placeholder = "Search...",
    className = "",
    onClear,
}) {
    return (
        <div className={`group relative flex items-center ${className}`}>
            <Search className="pointer-events-none absolute left-3.5 size-4 text-slate-400 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400" />
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-9 text-xs text-slate-900 placeholder-slate-400 outline-none transition focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-800 dark:text-slate-100"
            />
            {value && (
                <button
                    type="button"
                    onClick={() => {
                        onChange("");
                        if (onClear) onClear();
                    }}
                    className="absolute right-3 rounded-full p-0.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 dark:hover:bg-slate-700"
                >
                    <X className="size-3.5" />
                </button>
            )}
        </div>
    );
}
