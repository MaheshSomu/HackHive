import { useState, useMemo } from "react";
import { ArrowUpDown, Eye, ChevronLeft, ChevronRight, User, Layers } from "lucide-react";
import { Card } from "../../ui/Card";
import { Badge } from "../../ui/Badge";
import { Button } from "../../ui/Button";

export default function RegistrationTable({ registrations = [], onViewDetails }) {
    const [sortField, setSortField] = useState("fullName");
    const [sortDirection, setSortDirection] = useState("asc");
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
        } else {
            setSortField(field);
            setSortDirection("asc");
        }
    };

    // Sorted Registrations
    const sortedRegistrations = useMemo(() => {
        const list = [...registrations];
        list.sort((a, b) => {
            let valA = a[sortField] || a.studentName || "";
            let valB = b[sortField] || b.studentName || "";

            if (typeof valA === "string") valA = valA.toLowerCase();
            if (typeof valB === "string") valB = valB.toLowerCase();

            if (valA < valB) return sortDirection === "asc" ? -1 : 1;
            if (valA > valB) return sortDirection === "asc" ? 1 : -1;
            return 0;
        });
        return list;
    }, [registrations, sortField, sortDirection]);

    // Paginated list
    const totalPages = Math.ceil(sortedRegistrations.length / pageSize) || 1;
    const paginatedList = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return sortedRegistrations.slice(start, start + pageSize);
    }, [sortedRegistrations, currentPage, pageSize]);

    return (
        <Card className="rounded-2xl border border-slate-200/80 bg-white shadow-2xs dark:border-slate-800 dark:bg-slate-900 overflow-hidden space-y-0">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                    <thead>
                        <tr className="border-b border-slate-100 bg-slate-50/60 dark:border-slate-800 dark:bg-slate-800/40 text-slate-400 font-bold uppercase tracking-wider text-[10px] sticky top-0 backdrop-blur-md">
                            <th className="py-3 px-4 w-12 text-center">#</th>
                            <th className="py-3 px-4">
                                <button
                                    type="button"
                                    onClick={() => handleSort("fullName")}
                                    className="flex items-center gap-1.5 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                                >
                                    <span>Student Name</span>
                                    <ArrowUpDown className="size-3" />
                                </button>
                            </th>
                            <th className="py-3 px-4">
                                <button
                                    type="button"
                                    onClick={() => handleSort("college")}
                                    className="flex items-center gap-1.5 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                                >
                                    <span>College & Branch</span>
                                    <ArrowUpDown className="size-3" />
                                </button>
                            </th>
                            <th className="py-3 px-4">
                                <button
                                    type="button"
                                    onClick={() => handleSort("email")}
                                    className="flex items-center gap-1.5 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                                >
                                    <span>Email Address</span>
                                    <ArrowUpDown className="size-3" />
                                </button>
                            </th>
                            <th className="py-3 px-4 text-center">Type / Team</th>
                            <th className="py-3 px-4 text-center">Grad Year</th>
                            <th className="py-3 px-4 text-center">Registration Status</th>
                            <th className="py-3 px-4 text-center">Payment Info</th>
                            <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {paginatedList.map((reg, index) => {
                            const name = reg.fullName || reg.studentName || "Student Applicant";
                            const email = reg.email || reg.studentEmail || "No email";
                            const initials = name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()
                                .slice(0, 2);

                            const rowIndex = (currentPage - 1) * pageSize + index + 1;
                            const isConfirmed = !reg.registrationStatus || reg.registrationStatus === "CONFIRMED";
                            const isPaidEvent = reg.registrationType === "PAID";
                            const isPaid = reg.paymentStatus === "PAID";

                            return (
                                <tr
                                    key={reg.registrationId || index}
                                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                                >
                                    <td className="py-3.5 px-4 text-center text-slate-400 font-medium text-[11px]">
                                        {rowIndex}
                                    </td>

                                    <td className="py-3.5 px-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-blue-600 font-bold text-xs text-white shadow-2xs">
                                                {initials}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="font-bold text-slate-900 dark:text-slate-100 truncate">
                                                    {name}
                                                </div>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="py-3.5 px-4">
                                        <div className="space-y-0.5">
                                            <div className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                                                {reg.college || "Unspecified College"}
                                            </div>
                                            {reg.branch && (
                                                <div className="text-[11px] text-slate-400 truncate">
                                                    {reg.branch}
                                                </div>
                                            )}
                                        </div>
                                    </td>

                                    <td className="py-3.5 px-4 font-medium text-slate-600 dark:text-slate-400 truncate">
                                        {email}
                                    </td>

                                    <td className="py-3.5 px-4 text-center">
                                        {reg.teamName ? (
                                            <Badge variant="navy" className="gap-1 px-2.5 py-0.5 text-[10px] font-bold">
                                                <Layers className="size-3" /> {reg.teamName}
                                            </Badge>
                                        ) : reg.participantCount && reg.participantCount > 1 ? (
                                            <Badge variant="navy" className="gap-1 px-2.5 py-0.5 text-[10px] font-bold">
                                                <Layers className="size-3" /> {reg.participantCount} Members
                                            </Badge>
                                        ) : (
                                            <Badge variant="secondary" className="gap-1 px-2.5 py-0.5 text-[10px] font-medium">
                                                <User className="size-3" /> Individual
                                            </Badge>
                                        )}
                                    </td>

                                    <td className="py-3.5 px-4 text-center font-semibold text-slate-700 dark:text-slate-300">
                                        {reg.graduationYear || "N/A"}
                                    </td>

                                    <td className="py-3.5 px-4 text-center">
                                        {isConfirmed ? (
                                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                                                Confirmed
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                                                Payment Pending
                                            </span>
                                        )}
                                    </td>

                                    <td className="py-3.5 px-4 text-center">
                                        {isPaidEvent ? (
                                            isPaid ? (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-2.5 py-0.5 text-[10px] font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                                                    PAID (₹{reg.amountPaid || 0})
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                                                    UNPAID
                                                </span>
                                            )
                                        ) : (
                                            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                                                FREE (₹0)
                                            </span>
                                        )}
                                    </td>

                                    <td className="py-3.5 px-4 text-right">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => onViewDetails(reg)}
                                            className="text-xs font-bold gap-1 px-3 py-1 rounded-xl border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900 hover:border-slate-300 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                                        >
                                            <Eye className="size-3.5" /> View
                                        </Button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls Footer */}
            <div className="flex items-center justify-between p-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 font-medium">
                <div>
                    Showing <strong className="text-slate-900 dark:text-slate-100">{(currentPage - 1) * pageSize + 1}</strong> to{" "}
                    <strong className="text-slate-900 dark:text-slate-100">
                        {Math.min(currentPage * pageSize, sortedRegistrations.length)}
                    </strong>{" "}
                    of <strong className="text-slate-900 dark:text-slate-100">{sortedRegistrations.length}</strong> applicants
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        className="p-1.5 rounded-xl border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 disabled:opacity-40"
                    >
                        <ChevronLeft className="size-4" />
                    </Button>

                    <span className="text-xs font-semibold px-2">
                        Page {currentPage} of {totalPages}
                    </span>

                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={currentPage >= totalPages}
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        className="p-1.5 rounded-xl border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 disabled:opacity-40"
                    >
                        <ChevronRight className="size-4" />
                    </Button>
                </div>
            </div>
        </Card>
    );
}
