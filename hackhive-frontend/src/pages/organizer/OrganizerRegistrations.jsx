import { useCallback, useEffect, useMemo, useState } from "react";
import { UserCheck, AlertCircle, RotateCcw, Building2, Calendar } from "lucide-react";
import { toast } from "sonner";

import { organizerService } from "../../services/organizerService";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";

import RegistrationSummaryCards from "../../components/organizer/registrations/RegistrationSummaryCards";
import RegistrationToolbar from "../../components/organizer/registrations/RegistrationToolbar";
import RegistrationTable from "../../components/organizer/registrations/RegistrationTable";
import RegistrationDrawer from "../../components/organizer/registrations/RegistrationDrawer";
import RegistrationsSkeleton from "../../components/organizer/registrations/RegistrationsSkeleton";

export default function OrganizerRegistrations() {
    const [events, setEvents] = useState([]);
    const [selectedEventId, setSelectedEventId] = useState("");
    const [registrations, setRegistrations] = useState([]);
    
    // API loading states
    const [eventsLoading, setEventsLoading] = useState(true);
    const [registrationsLoading, setRegistrationsLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    // Search and filter states
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [typeFilter, setTypeFilter] = useState("ALL");

    // Selected student drawer state
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    // 1. Fetch Organizer Events on Mount
    useEffect(() => {
        let isMounted = true;
        const loadEvents = async () => {
            try {
                setEventsLoading(true);
                const res = await organizerService.getMyEvents();
                if (isMounted) {
                    const list = Array.isArray(res) ? res : [];
                    setEvents(list);
                    if (list.length > 0) {
                        setSelectedEventId(String(list[0].id));
                    }
                }
            } catch (err) {
                console.error("Failed to load organizer events:", err);
                if (isMounted) setEvents([]);
            } finally {
                if (isMounted) setEventsLoading(false);
            }
        };
        loadEvents();
        return () => {
            isMounted = false;
        };
    }, []);

    // 2. Fetch registrations whenever selectedEventId changes
    const loadRegistrations = useCallback(async (eventId) => {
        if (!eventId) return;
        try {
            setRegistrationsLoading(true);
            setIsError(false);
            const res = await organizerService.getEventRegistrations(eventId);
            setRegistrations(Array.isArray(res) ? res : []);
        } catch (err) {
            console.error("Failed to fetch event registrations:", err);
            setIsError(true);
            setRegistrations([]);
        } finally {
            setRegistrationsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (selectedEventId) {
            loadRegistrations(selectedEventId);
        }
    }, [selectedEventId, loadRegistrations]);

    // Current selected event object
    const currentEvent = useMemo(() => {
        return events.find((e) => String(e.id) === String(selectedEventId));
    }, [events, selectedEventId]);

    // 3. Filtered registrations list
    const filteredRegistrations = useMemo(() => {
        let list = [...registrations];

        // Search filter (Primary Name, Email, College, or Additional Team Members)
        if (searchQuery.trim()) {
            const q = searchQuery.trim().toLowerCase();
            list = list.filter((r) => {
                const memberMatch =
                    Array.isArray(r.members) &&
                    r.members.some(
                        (member) =>
                            (member.fullName || "").toLowerCase().includes(q) ||
                            (member.email || "").toLowerCase().includes(q)
                    );

                return (
                    (r.fullName && r.fullName.toLowerCase().includes(q)) ||
                    (r.studentName && r.studentName.toLowerCase().includes(q)) ||
                    (r.email && r.email.toLowerCase().includes(q)) ||
                    (r.studentEmail && r.studentEmail.toLowerCase().includes(q)) ||
                    (r.college && r.college.toLowerCase().includes(q)) ||
                    memberMatch
                );
            });
        }

        // Type filter (Individual vs Team Entry)
        if (typeFilter !== "ALL") {
            if (typeFilter === "TEAM") {
                list = list.filter((r) => Boolean(r.teamName || r.isTeam));
            } else if (typeFilter === "INDIVIDUAL") {
                list = list.filter((r) => !r.teamName && !r.isTeam);
            }
        }

        // Status filter (CONFIRMED vs PENDING)
        if (statusFilter !== "ALL") {
            list = list.filter((r) => {
                const status = (r.registrationStatus || r.status || "CONFIRMED").toUpperCase();
                return status.includes(statusFilter.toUpperCase());
            });
        }

        return list;
    }, [registrations, searchQuery, statusFilter, typeFilter]);

    // Export Financial & Registration Audit CSV Handler
    const handleExportCSV = () => {
        if (filteredRegistrations.length === 0) {
            toast.error("No registrations to export.");
            return;
        }

        const headers = [
            "Registration ID",
            "Student Name",
            "Email",
            "Phone Number",
            "College",
            "Branch",
            "Graduation Year",
            "Participant Count",
            "Member Names",
            "Member Emails",
            "Member Account Types",
            "Event Title",
            "Registration Type",
            "Registration Status",
            "Payment Status",
            "Amount Paid (INR)",
            "Razorpay Order ID",
            "Razorpay Payment ID",
            "Paid Timestamp"
        ];
        const csvRows = [headers.join(",")];

        filteredRegistrations.forEach((r) => {
            const membersList = Array.isArray(r.members) ? r.members : [];
            const memberNamesStr = membersList.map((m) => m.fullName).join(" | ");
            const memberEmailsStr = membersList.map((m) => m.email).join(" | ");
            const memberTypesStr = membersList.map((m) => (m.isHackHiveMember || m.studentProfileId || m.isPrimary ? "HackHive Member" : "External Participant")).join(" | ");

            const row = [
                `"${r.registrationId || r.id || ""}"`,
                `"${(r.fullName || r.studentName || "").replace(/"/g, '""')}"`,
                `"${(r.email || r.studentEmail || "").replace(/"/g, '""')}"`,
                `"${(r.phoneNumber || "").replace(/"/g, '""')}"`,
                `"${(r.college || "").replace(/"/g, '""')}"`,
                `"${(r.branch || "").replace(/"/g, '""')}"`,
                `"${(r.graduationYear || "").replace(/"/g, '""')}"`,
                `"${r.participantCount || 1}"`,
                `"${memberNamesStr.replace(/"/g, '""')}"`,
                `"${memberEmailsStr.replace(/"/g, '""')}"`,
                `"${memberTypesStr.replace(/"/g, '""')}"`,
                `"${(currentEvent?.title || "").replace(/"/g, '""')}"`,
                `"${(r.registrationType || currentEvent?.registrationType || "FREE").replace(/"/g, '""')}"`,
                `"${(r.registrationStatus || "CONFIRMED").replace(/"/g, '""')}"`,
                `"${(r.paymentStatus || "NOT_APPLICABLE").replace(/"/g, '""')}"`,
                `"${r.amountPaid != null ? r.amountPaid : 0}"`,
                `"${(r.razorpayOrderId || "").replace(/"/g, '""')}"`,
                `"${(r.razorpayPaymentId || "").replace(/"/g, '""')}"`,
                `"${r.paidAt ? new Date(r.paidAt).toISOString() : ""}"`,
            ];
            csvRows.push(row.join(","));
        });

        const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `financial_audit_event_${selectedEventId}_${Date.now()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Financial & Registration audit report exported as CSV!");
    };

    // Open Student Drawer
    const handleViewDetails = (student) => {
        setSelectedStudent(student);
        setIsDrawerOpen(true);
    };

    if (eventsLoading) {
        return <RegistrationsSkeleton />;
    }

    return (
        <div className="space-y-6 pb-20 w-full max-w-7xl mx-auto text-slate-900 dark:text-slate-100">
            {/* Header Hero */}
            <Card className="border-slate-200/80 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
                <div className="space-y-1">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-3 py-0.5 text-xs font-bold uppercase tracking-wider text-purple-700 dark:bg-purple-950/80 dark:text-purple-300 border border-purple-100 dark:border-purple-900/60">
                        <UserCheck className="size-3.5 text-purple-600" />
                        Event Registrations
                    </span>
                    <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
                        Event Applicants & Registrations
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-normal leading-relaxed">
                        Manage student signups, inspect applicant details, and monitor registration rosters for your published events.
                    </p>
                </div>
            </Card>

            {/* Error Banner */}
            {isError ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50/80 p-6 text-center text-rose-900 dark:border-rose-950 dark:bg-rose-950/40 dark:text-rose-300 space-y-3 shadow-2xs">
                    <div className="mx-auto flex size-10 items-center justify-center rounded-xl bg-rose-100 text-rose-600 dark:bg-rose-900 dark:text-rose-300">
                        <AlertCircle className="size-5" />
                    </div>
                    <div className="space-y-1 max-w-md mx-auto">
                        <h4 className="text-sm font-bold">Unable to load event registrations</h4>
                        <p className="text-xs text-rose-600/80 dark:text-rose-400 font-medium">
                            There was an error communicating with the server to fetch applicant records for this event.
                        </p>
                    </div>
                    <Button
                        type="button"
                        size="sm"
                        onClick={() => loadRegistrations(selectedEventId)}
                        className="bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs inline-flex items-center gap-2 px-4 py-2 rounded-xl"
                    >
                        <RotateCcw className="size-3.5" /> Retry Fetching
                    </Button>
                </div>
            ) : (
                <>
                    {/* Summary Cards */}
                    <RegistrationSummaryCards
                        registrations={registrations}
                        currentEvent={currentEvent}
                    />

                    {/* Toolbar (Event Selector, Search, Filters, Export) */}
                    <RegistrationToolbar
                        events={events}
                        selectedEventId={selectedEventId}
                        onSelectEvent={setSelectedEventId}
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        statusFilter={statusFilter}
                        onStatusFilterChange={setStatusFilter}
                        typeFilter={typeFilter}
                        onTypeFilterChange={setTypeFilter}
                        onExportCSV={handleExportCSV}
                        totalResults={filteredRegistrations.length}
                    />

                    {/* Main Content Area */}
                    {registrationsLoading ? (
                        <div className="p-12 text-center rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 space-y-3 shadow-2xs">
                            <div className="size-8 border-3 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" />
                            <p className="text-xs font-semibold text-slate-500">Loading registrations list...</p>
                        </div>
                    ) : filteredRegistrations.length > 0 ? (
                        /* Registrations Management Table */
                        <RegistrationTable
                            registrations={filteredRegistrations}
                            onViewDetails={handleViewDetails}
                        />
                    ) : (
                        /* Empty State */
                        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center space-y-4 dark:border-slate-800 dark:bg-slate-900 shadow-2xs">
                            <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400">
                                <UserCheck className="size-6" />
                            </div>
                            <div className="space-y-1 max-w-sm mx-auto">
                                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                                    {events.length === 0
                                        ? "No published events found"
                                        : "No registrations yet for this event"}
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
                                    {events.length === 0
                                        ? "Create your first hackathon event to start accepting student registrations."
                                        : "Students who sign up for this event will appear in this management table automatically."}
                                </p>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* View Details Drawer */}
            <RegistrationDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                student={selectedStudent}
            />
        </div>
    );
}
