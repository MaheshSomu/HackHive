import { Users, Layers, IndianRupee, CheckCircle2 } from "lucide-react";
import { Card } from "../../ui/Card";
import { Badge } from "../../ui/Badge";

export default function RegistrationSummaryCards({ registrations = [], currentEvent }) {
    const totalCount = registrations.length;

    let confirmedCount = 0;
    let pendingPaymentCount = 0;
    let totalRevenue = 0;

    registrations.forEach((r) => {
        if (!r.registrationStatus || r.registrationStatus === "CONFIRMED") {
            confirmedCount++;
        } else if (r.registrationStatus === "PENDING_PAYMENT") {
            pendingPaymentCount++;
        }

        if (r.paymentStatus === "PAID" && r.amountPaid) {
            totalRevenue += Number(r.amountPaid) || 0;
        }
    });

    const isPaidEvent = currentEvent?.registrationType === "PAID";

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Total Registrations */}
            <Card className="border border-slate-200/80 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900 space-y-2">
                <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Total Applicants
                    </span>
                    <div className="flex size-8 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400">
                        <Users className="size-4" />
                    </div>
                </div>
                <div className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
                    {totalCount}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    Total student registrations
                </p>
            </Card>

            {/* Confirmed Signups */}
            <Card className="border border-slate-200/80 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900 space-y-2">
                <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Confirmed Signups
                    </span>
                    <div className="flex size-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                        <CheckCircle2 className="size-4" />
                    </div>
                </div>
                <div className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
                    {confirmedCount}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    {currentEvent?.maxParticipants ? `${confirmedCount} / ${currentEvent.maxParticipants} capacity filled` : "Unlimited Capacity"}
                </p>
            </Card>

            {/* Total Revenue / Payment Status */}
            <Card className="border border-slate-200/80 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900 space-y-2">
                <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        {isPaidEvent ? "Revenue Collected" : "Registration Fee"}
                    </span>
                    <div className="flex size-8 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                        <IndianRupee className="size-4" />
                    </div>
                </div>
                <div className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
                    {isPaidEvent ? `₹${totalRevenue}` : "FREE"}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    {isPaidEvent ? `Fee: ₹${currentEvent?.registrationFee || 0} per entry` : "Free Event"}
                </p>
            </Card>

            {/* Pending Payments */}
            <Card className="border border-slate-200/80 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900 space-y-2">
                <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Pending Payments
                    </span>
                    <div className="flex size-8 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
                        <Layers className="size-4" />
                    </div>
                </div>
                <div className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
                    {pendingPaymentCount}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate">
                    Unpaid checkout sessions
                </p>
            </Card>
        </div>
    );
}
