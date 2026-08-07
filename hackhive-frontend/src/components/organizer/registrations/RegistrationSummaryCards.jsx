import { Users, Layers, User, CheckCircle2 } from "lucide-react";
import { Card } from "../../ui/Card";
import { Badge } from "../../ui/Badge";

export default function RegistrationSummaryCards({ registrations = [], currentEvent }) {
    const totalCount = registrations.length;

    // Derived statistics from registrations list
    let teamParticipantsCount = 0;
    let individualParticipantsCount = 0;

    registrations.forEach((r) => {
        if (r.teamName || r.isTeam) {
            teamParticipantsCount++;
        } else {
            individualParticipantsCount++;
        }
    });

    const getEventStatus = () => {
        if (!currentEvent) return { label: "No Event Selected", variant: "secondary" };
        const now = Date.now();
        const start = currentEvent.startDate ? new Date(currentEvent.startDate).getTime() : 0;
        const end = currentEvent.endDate ? new Date(currentEvent.endDate).getTime() : 0;

        if (start > 0 && now < start) return { label: "Registration Open", variant: "purple" };
        if (start > 0 && now >= start && (end === 0 || now <= end)) return { label: "Event Active", variant: "success" };
        if (end > 0 && now > end) return { label: "Event Closed", variant: "secondary" };
        return { label: "Active", variant: "success" };
    };

    const statusConfig = getEventStatus();

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Total Registrations */}
            <Card className="border border-slate-200/80 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900 space-y-2">
                <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Total Registrations
                    </span>
                    <div className="flex size-8 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400">
                        <Users className="size-4" />
                    </div>
                </div>
                <div className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
                    {totalCount}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    Total applicants for selected event
                </p>
            </Card>

            {/* Teams Registered */}
            <Card className="border border-slate-200/80 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900 space-y-2">
                <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Teams Registered
                    </span>
                    <div className="flex size-8 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                        <Layers className="size-4" />
                    </div>
                </div>
                <div className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
                    {teamParticipantsCount}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    Team participant entries
                </p>
            </Card>

            {/* Individual Participants */}
            <Card className="border border-slate-200/80 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900 space-y-2">
                <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Individual Participants
                    </span>
                    <div className="flex size-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                        <User className="size-4" />
                    </div>
                </div>
                <div className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
                    {individualParticipantsCount}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    Solo student signups
                </p>
            </Card>

            {/* Registration Status */}
            <Card className="border border-slate-200/80 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900 space-y-2">
                <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Registration Status
                    </span>
                    <div className="flex size-8 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                        <CheckCircle2 className="size-4" />
                    </div>
                </div>
                <div className="pt-1">
                    <Badge variant={statusConfig.variant} className="px-3 py-1 text-xs font-bold">
                        {statusConfig.label}
                    </Badge>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate">
                    {currentEvent ? currentEvent.title : "Select an event"}
                </p>
            </Card>
        </div>
    );
}
