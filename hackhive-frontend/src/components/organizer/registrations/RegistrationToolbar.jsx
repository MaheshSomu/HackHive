import { Search, Download, Calendar, Filter } from "lucide-react";
import { Button } from "../../ui/Button";

export default function RegistrationToolbar({
    events = [],
    selectedEventId,
    onSelectEvent,
    searchQuery,
    onSearchChange,
    statusFilter,
    onStatusFilterChange,
    typeFilter,
    onTypeFilterChange,
    onExportCSV,
    totalResults = 0,
}) {
    return (
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
            {/* Top Row: Event Selector dropdown & Export button */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
                {/* Event Selector */}
                <div className="flex items-center gap-3 flex-1 max-w-xl">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400">
                        <Calendar className="size-4.5" />
                    </div>
                    <div className="flex-1 space-y-0.5">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                            Active Event Context
                        </label>
                        {events.length > 0 ? (
                            <select
                                value={selectedEventId}
                                onChange={(e) => onSelectEvent(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2 text-xs font-bold text-slate-900 outline-none focus:border-purple-500 focus:bg-white dark:border-slate-800 dark:bg-slate-800 dark:text-slate-100 cursor-pointer"
                            >
                                {events.map((evt) => (
                                    <option key={evt.id} value={evt.id}>
                                        {evt.title} ({evt.eventMode || "Hybrid"})
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <p className="text-xs text-slate-400 font-medium">No published events found.</p>
                        )}
                    </div>
                </div>

                {/* Export CSV Button */}
                <div className="shrink-0">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={totalResults === 0}
                        onClick={onExportCSV}
                        className="text-xs font-semibold gap-1.5 rounded-xl border-slate-200 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 disabled:opacity-50"
                    >
                        <Download className="size-3.5 text-purple-600 dark:text-purple-400" /> Export CSV
                    </Button>
                </div>
            </div>

            {/* Bottom Row: Search Input & Filter Controls */}
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                {/* Search Bar */}
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Search applicant by student name, email, or college..."
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/80 pl-10 pr-4 py-2 text-xs text-slate-900 font-medium outline-none transition focus:border-purple-500 focus:bg-white dark:border-slate-800 dark:bg-slate-800 dark:text-slate-100"
                    />
                </div>

                {/* Filter Dropdowns */}
                <div className="flex flex-wrap items-center gap-3">
                    {/* Status Filter */}
                    <div className="flex items-center gap-1.5 text-xs">
                        <span className="text-slate-400 font-medium text-[11px]">Status:</span>
                        <select
                            value={statusFilter}
                            onChange={(e) => onStatusFilterChange(e.target.value)}
                            className="rounded-xl border border-slate-200 bg-slate-50/80 px-2.5 py-1.5 text-xs font-semibold text-slate-700 outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 cursor-pointer"
                        >
                            <option value="ALL">All Statuses</option>
                            <option value="CONFIRMED">Confirmed</option>
                            <option value="PENDING">Pending</option>
                        </select>
                    </div>

                    {/* Registration Type Filter */}
                    <div className="flex items-center gap-1.5 text-xs">
                        <span className="text-slate-400 font-medium text-[11px]">Type:</span>
                        <select
                            value={typeFilter}
                            onChange={(e) => onTypeFilterChange(e.target.value)}
                            className="rounded-xl border border-slate-200 bg-slate-50/80 px-2.5 py-1.5 text-xs font-semibold text-slate-700 outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 cursor-pointer"
                        >
                            <option value="ALL">All Types</option>
                            <option value="INDIVIDUAL">Individual</option>
                            <option value="TEAM">Team Entry</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
}
