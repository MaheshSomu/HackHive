import React, { useState, useRef, useEffect, useId, useMemo } from "react";
import { ChevronDown, Check, Search } from "lucide-react";
import { Label } from "./label";

const HackHiveSelect = React.forwardRef(function HackHiveSelect(
    {
        id,
        name,
        label,
        error,
        helperText,
        required = false,
        disabled = false,
        searchable = false,
        placeholder = "Select an option",
        searchPlaceholder = "Search...",
        value,
        onChange,
        options = [],
        children,
        className = "",
        containerClassName = "",
        size = "md", // sm | md | lg
        ...props
    },
    ref
) {
    const generatedId = useId();
    const selectId = id || generatedId;

    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [focusedIndex, setFocusedIndex] = useState(-1);

    const containerRef = useRef(null);
    const searchInputRef = useRef(null);

    // Normalize options array from either options prop or children (<option>)
    const parsedOptions = useMemo(() => {
        if (options && options.length > 0) {
            return options.map((opt) =>
                typeof opt === "object" && opt !== null
                    ? { value: String(opt.value), label: String(opt.label ?? opt.value), disabled: Boolean(opt.disabled) }
                    : { value: String(opt), label: String(opt), disabled: false }
            );
        }
        if (children) {
            return React.Children.map(children, (child) => {
                if (!React.isValidElement(child)) return null;
                const val = child.props.value !== undefined ? child.props.value : child.props.children;
                return {
                    value: String(val),
                    label: String(child.props.children || val),
                    disabled: Boolean(child.props.disabled),
                };
            }).filter(Boolean);
        }
        return [];
    }, [options, children]);

    // Filter options when searchable
    const filteredOptions = useMemo(() => {
        if (!searchable || !searchTerm.trim()) return parsedOptions;
        const term = searchTerm.toLowerCase();
        return parsedOptions.filter((opt) => opt.label.toLowerCase().includes(term));
    }, [parsedOptions, searchable, searchTerm]);

    // Current selected option object
    const selectedOption = useMemo(() => {
        return parsedOptions.find((opt) => String(opt.value) === String(value));
    }, [parsedOptions, value]);

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Focus search input when dropdown opens
    useEffect(() => {
        if (isOpen && searchable && searchInputRef.current) {
            searchInputRef.current.focus();
        }
        if (!isOpen) {
            setSearchTerm("");
            setFocusedIndex(-1);
        }
    }, [isOpen, searchable]);

    // Handle selection
    const handleSelect = (optValue, disabledOpt) => {
        if (disabledOpt || disabled) return;
        setIsOpen(false);
        if (onChange) {
            // Provide synthetic event object for full backwards compatibility
            const syntheticEvent = {
                target: {
                    name,
                    id: selectId,
                    value: optValue,
                },
            };
            onChange(syntheticEvent);
        }
    };

    // Keyboard Navigation
    const handleKeyDown = (e) => {
        if (disabled) return;

        if (e.key === "Escape") {
            setIsOpen(false);
            return;
        }

        if (e.key === "ArrowDown") {
            e.preventDefault();
            if (!isOpen) {
                setIsOpen(true);
                setFocusedIndex(0);
            } else {
                setFocusedIndex((prev) => (prev < filteredOptions.length - 1 ? prev + 1 : 0));
            }
            return;
        }

        if (e.key === "ArrowUp") {
            e.preventDefault();
            if (!isOpen) {
                setIsOpen(true);
                setFocusedIndex(filteredOptions.length - 1);
            } else {
                setFocusedIndex((prev) => (prev > 0 ? prev - 1 : filteredOptions.length - 1));
            }
            return;
        }

        if ((e.key === "Enter" || e.key === " ") && !searchable) {
            e.preventDefault();
            if (!isOpen) {
                setIsOpen(true);
            } else if (focusedIndex >= 0 && focusedIndex < filteredOptions.length) {
                const opt = filteredOptions[focusedIndex];
                handleSelect(opt.value, opt.disabled);
            }
            return;
        }
    };

    const sizeClasses = {
        sm: "h-8 text-xs px-3 rounded-lg",
        md: "h-10 text-sm px-3.5 rounded-xl",
        lg: "h-11 text-sm px-4 rounded-xl",
    };

    return (
        <div ref={containerRef} className={`relative space-y-1.5 ${containerClassName}`}>
            {label && (
                <Label htmlFor={selectId} className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {label}
                    {required && <span className="ml-1 text-rose-500">*</span>}
                </Label>
            )}

            <div className="relative">
                {/* Trigger Button */}
                <button
                    ref={ref}
                    id={selectId}
                    type="button"
                    role="combobox"
                    aria-expanded={isOpen}
                    aria-haspopup="listbox"
                    aria-invalid={Boolean(error)}
                    disabled={disabled}
                    onClick={() => !disabled && setIsOpen((prev) => !prev)}
                    onKeyDown={handleKeyDown}
                    className={`
                        flex w-full items-center justify-between text-left border bg-white shadow-2xs transition-all duration-150 outline-none select-none
                        dark:bg-slate-900 dark:text-slate-100
                        ${sizeClasses[size] || sizeClasses.md}
                        ${
                            disabled
                                ? "cursor-not-allowed bg-slate-100 text-slate-400 border-slate-200 dark:bg-slate-800/60 dark:border-slate-800 dark:text-slate-500"
                                : error
                                ? "border-rose-500 ring-2 ring-rose-500/20 text-slate-900 dark:text-slate-100"
                                : isOpen
                                ? "border-purple-500 ring-2 ring-purple-500/20 text-slate-900 dark:text-slate-100"
                                : "border-slate-200 hover:border-purple-300 text-slate-800 dark:border-slate-800 dark:hover:border-purple-700"
                        }
                        ${className}
                    `}
                    {...props}
                >
                    <span className={`truncate ${!selectedOption ? "text-slate-400 dark:text-slate-500 font-normal" : "font-medium"}`}>
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
                    <ChevronDown
                        className={`ml-2 size-4 shrink-0 text-slate-400 dark:text-slate-500 transition-transform duration-200 ${
                            isOpen ? "rotate-180 text-purple-600 dark:text-purple-400" : ""
                        }`}
                    />
                </button>

                {/* Dropdown Floating Panel */}
                {isOpen && (
                    <div
                        role="listbox"
                        className="absolute left-0 right-0 top-full z-50 mt-1.5 max-h-60 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg dark:border-slate-800 dark:bg-slate-900 animate-in fade-in-50 zoom-in-95 duration-100"
                    >
                        {/* Optional Search Bar */}
                        {searchable && (
                            <div className="sticky top-0 z-10 bg-white pb-1.5 dark:bg-slate-900">
                                <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 dark:border-slate-800 dark:bg-slate-800">
                                    <Search className="size-3.5 text-slate-400 shrink-0" />
                                    <input
                                        ref={searchInputRef}
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder={searchPlaceholder}
                                        className="w-full bg-transparent text-xs font-normal text-slate-800 outline-none placeholder:text-slate-400 dark:text-slate-200"
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Options List */}
                        {filteredOptions.length > 0 ? (
                            <div className="space-y-0.5">
                                {filteredOptions.map((opt, idx) => {
                                    const isSelected = selectedOption && String(selectedOption.value) === String(opt.value);
                                    const isFocused = focusedIndex === idx;

                                    return (
                                        <div
                                            key={opt.value}
                                            role="option"
                                            aria-selected={isSelected}
                                            onClick={() => handleSelect(opt.value, opt.disabled)}
                                            onMouseEnter={() => setFocusedIndex(idx)}
                                            className={`
                                                flex items-center justify-between w-full px-3 py-2 text-xs rounded-lg transition-colors cursor-pointer select-none text-left
                                                ${
                                                    opt.disabled
                                                        ? "opacity-50 cursor-not-allowed text-slate-400"
                                                        : isSelected
                                                        ? "bg-purple-50 text-purple-700 font-semibold dark:bg-purple-950/60 dark:text-purple-300"
                                                        : isFocused
                                                        ? "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100"
                                                        : "text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800/60"
                                                }
                                            `}
                                        >
                                            <span className="truncate">{opt.label}</span>
                                            {isSelected && <Check className="size-3.5 text-purple-600 dark:text-purple-400 shrink-0 ml-2" />}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="px-3 py-3 text-center text-xs text-slate-400 dark:text-slate-500 font-normal">
                                No options found
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Error or Helper text */}
            {error ? (
                <p className="text-xs font-medium text-rose-500">{error}</p>
            ) : helperText ? (
                <p className="text-xs text-slate-500 dark:text-slate-400 font-normal">{helperText}</p>
            ) : null}
        </div>
    );
});

export { HackHiveSelect };
export default HackHiveSelect;
