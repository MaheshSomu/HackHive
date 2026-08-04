import { Search, X } from "lucide-react";

export function SearchBar({
    value = "",
    onChange,
    placeholder = "Search...",
    className = "",
    onClear,
    disabled = false,
    ...props
}) {
    return (
        <div className={`group relative flex items-center w-full ${className}`}>
            <Search className="pointer-events-none absolute left-3.5 size-4 text-slate-400 transition-colors group-focus-within:text-indigo-600 dark:text-slate-500 dark:group-focus-within:text-indigo-400" />
            <input
                type="text"
                value={value}
                disabled={disabled}
                onChange={(e) => onChange && onChange(e.target.value)}
                placeholder={placeholder}
                aria-label={placeholder}
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/80 pl-10 pr-9 text-xs sm:text-sm text-slate-900 placeholder-slate-400 outline-none transition-all duration-200 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-indigo-400 dark:focus:bg-slate-900 dark:focus:ring-indigo-400/20"
                {...props}
            />
            {value && (
                <button
                    type="button"
                    aria-label="Clear search input"
                    onClick={() => {
                        if (onChange) onChange("");
                        if (onClear) onClear();
                    }}
                    className="absolute right-3 rounded-full p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                >
                    <X className="size-3.5" />
                </button>
            )}
        </div>
    );
}

export default SearchBar;

