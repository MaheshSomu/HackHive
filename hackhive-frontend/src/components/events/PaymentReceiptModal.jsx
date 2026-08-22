import { X, Printer, CheckCircle2, ShieldCheck, IndianRupee, Calendar, FileText } from "lucide-react";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";

export default function PaymentReceiptModal({ isOpen, onClose, registration, event }) {
    if (!isOpen || !registration) return null;

    const studentName = registration.fullName || registration.studentName || "Student Participant";
    const studentEmail = registration.email || registration.studentEmail || "N/A";
    const eventTitle = event?.title || registration.eventTitle || "Hackathon Event";
    const amountPaid = registration.amountPaid != null ? registration.amountPaid : (event?.registrationFee || 0);
    const paidAtFormatted = registration.paidAt ? new Date(registration.paidAt).toLocaleString() : "Confirmed";

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
            {/* Backdrop Dismiss */}
            <div className="absolute inset-0" onClick={onClose} />

            {/* Receipt Modal Card */}
            <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden z-10 p-6 space-y-6 print:shadow-none print:border-none print:p-0 print:m-0">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800 print:hidden">
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="size-5 text-indigo-600 dark:text-indigo-400" />
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                            Official Payment Receipt
                        </span>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
                    >
                        <X className="size-4" />
                    </button>
                </div>

                {/* Printable Content Header */}
                <div className="text-center space-y-2 border-b border-slate-100 pb-5 dark:border-slate-800">
                    <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 mb-1">
                        <CheckCircle2 className="size-6" />
                    </div>
                    <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
                        Payment Successful & Confirmed
                    </h2>
                    <p className="text-xs text-slate-500 font-medium">
                        HackHive Official Event Registration Receipt
                    </p>
                </div>

                {/* Receipt Data Table */}
                <div className="space-y-4 text-xs">
                    {/* Event & Student Details */}
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 dark:bg-slate-800/40 dark:border-slate-800 space-y-2.5">
                        <div className="flex justify-between items-center">
                            <span className="text-slate-400 font-semibold">Event Name:</span>
                            <span className="font-extrabold text-slate-900 dark:text-slate-100 truncate max-w-[220px]">
                                {eventTitle}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-slate-400 font-semibold">Participant:</span>
                            <span className="font-bold text-slate-800 dark:text-slate-200">
                                {studentName}
                            </span>
                        </div>
                        {studentEmail && (
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400 font-semibold">Email:</span>
                                <span className="font-medium text-slate-600 dark:text-slate-400">
                                    {studentEmail}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Transaction Breakdown */}
                    <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 dark:bg-indigo-950/20 dark:border-indigo-900/40 space-y-2.5">
                        <div className="flex justify-between items-center">
                            <span className="text-slate-500 font-semibold">Amount Paid:</span>
                            <span className="text-lg font-black text-indigo-700 dark:text-indigo-400 flex items-center">
                                ₹{amountPaid}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-slate-500 font-semibold">Payment Status:</span>
                            <Badge variant="success" className="px-2.5 py-0.5 text-[10px] font-extrabold">
                                PAID
                            </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-slate-500 font-semibold">Registration ID:</span>
                            <span className="font-mono text-slate-700 dark:text-slate-300">
                                #{registration.registrationId || registration.id || "N/A"}
                            </span>
                        </div>
                        {registration.razorpayOrderId && (
                            <div className="flex justify-between items-center">
                                <span className="text-slate-500 font-semibold">Razorpay Order ID:</span>
                                <span className="font-mono text-[11px] text-slate-600 dark:text-slate-400 truncate max-w-[200px]">
                                    {registration.razorpayOrderId}
                                </span>
                            </div>
                        )}
                        {registration.razorpayPaymentId && (
                            <div className="flex justify-between items-center">
                                <span className="text-slate-500 font-semibold">Razorpay Payment ID:</span>
                                <span className="font-mono text-[11px] text-slate-600 dark:text-slate-400 truncate max-w-[200px]">
                                    {registration.razorpayPaymentId}
                                </span>
                            </div>
                        )}
                        <div className="flex justify-between items-center border-t border-indigo-100 pt-2 dark:border-indigo-900/40">
                            <span className="text-slate-500 font-semibold">Paid Timestamp:</span>
                            <span className="font-medium text-slate-700 dark:text-slate-300">
                                {paidAtFormatted}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center justify-between pt-2 print:hidden">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={onClose}
                        className="rounded-xl text-xs font-bold"
                    >
                        Close
                    </Button>
                    <Button
                        type="button"
                        size="sm"
                        onClick={handlePrint}
                        className="rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold gap-1.5 px-4"
                    >
                        <Printer className="size-4" /> Print Receipt
                    </Button>
                </div>
            </div>
        </div>
    );
}
