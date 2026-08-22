import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Calendar, Check, X } from "lucide-react";
import { Button } from "../ui/Button";
import HackHiveSelect from "../ui/HackHiveSelect";

export default function OrganizerEventModal({
    isOpen,
    onClose,
    initialData,
    onSubmit,
    isLoading,
}) {
    const isEdit = Boolean(initialData);
    const [step, setStep] = useState(1);

    const {
        register,
        handleSubmit,
        watch,
        reset,
        control,
        formState: { errors },
    } = useForm({
        defaultValues: {
            title: "",
            description: "",
            location: "",
            eventMode: "HYBRID",
            startDate: "",
            endDate: "",
            registrationStartDate: "",
            registrationEndDate: "",
            minTeamSize: 1,
            maxTeamSize: 4,
            eligibility: "Open for all students",
            bannerUrl: "",
            collegeName: "",
            registrationType: "FREE",
            registrationFee: 0,
        },
    });

    useEffect(() => {
        if (initialData) {
            reset({
                title: initialData.title || "",
                description: initialData.description || "",
                location: initialData.location || "",
                eventMode: initialData.eventMode || "HYBRID",
                startDate: initialData.startDate ? initialData.startDate.slice(0, 16) : "",
                endDate: initialData.endDate ? initialData.endDate.slice(0, 16) : "",
                registrationStartDate: initialData.registrationStartDate ? initialData.registrationStartDate.slice(0, 16) : "",
                registrationEndDate: initialData.registrationEndDate ? initialData.registrationEndDate.slice(0, 16) : "",
                minTeamSize: initialData.minTeamSize || 1,
                maxTeamSize: initialData.maxTeamSize || 4,
                eligibility: initialData.eligibility || "Open for all students",
                bannerUrl: initialData.bannerUrl || "",
                collegeName: initialData.collegeName || "",
                registrationType: initialData.registrationType || "FREE",
                registrationFee: initialData.registrationFee !== undefined && initialData.registrationFee !== null ? initialData.registrationFee : 0,
            });
        } else {
            reset({
                title: "",
                description: "",
                location: "",
                eventMode: "HYBRID",
                startDate: "",
                endDate: "",
                registrationStartDate: "",
                registrationEndDate: "",
                minTeamSize: 1,
                maxTeamSize: 4,
                eligibility: "Open for all students",
                bannerUrl: "",
                collegeName: "",
                registrationType: "FREE",
                registrationFee: 0,
            });
        }
        setStep(1);
    }, [initialData, reset, isOpen]);

    const formData = watch();

    const handleClose = () => {
        setStep(1);
        onClose();
    };

    const handleFinalSubmit = (data) => {
        const formatISO = (val) => (val ? (val.length === 16 ? `${val}:00` : val) : null);
        const isPaid = data.registrationType === "PAID";
        const fee = isPaid ? parseFloat(data.registrationFee) || 0 : 0;

        const payload = {
            ...data,
            title: data.title.trim(),
            location: data.location.trim(),
            startDate: formatISO(data.startDate),
            endDate: formatISO(data.endDate),
            registrationStartDate: formatISO(data.registrationStartDate),
            registrationEndDate: formatISO(data.registrationEndDate),
            minTeamSize: parseInt(data.minTeamSize, 10) || 1,
            maxTeamSize: parseInt(data.maxTeamSize, 10) || 4,
            registrationType: data.registrationType || "FREE",
            registrationFee: fee,
        };
        onSubmit(payload);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={handleClose}
                    className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
                />

                {/* Content */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 15 }}
                    transition={{ duration: 0.2 }}
                    className="relative flex flex-col w-full max-w-2xl max-h-[90vh] rounded-3xl border border-slate-200 bg-white shadow-2xl overflow-hidden dark:border-slate-800 dark:bg-slate-900"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                                Step {step} of 5
                            </span>
                            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                                {isEdit ? "Edit Hackathon Event" : "Create New Hackathon Event"}
                            </h3>
                        </div>
                        <button
                            type="button"
                            onClick={handleClose}
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                            <X className="size-4" />
                        </button>
                    </div>

                    {/* Step Body */}
                    <div className="flex-1 overflow-y-auto p-6">
                        {step === 1 && (
                            <div className="space-y-4">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Step 1: Basic Information</h4>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                        Event Title *
                                    </label>
                                    <input
                                        type="text"
                                        {...register("title", { required: "Event title is required" })}
                                        placeholder="e.g. HackHive Global 2026"
                                        className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 outline-none focus:border-purple-500 focus:bg-white dark:border-slate-800 dark:bg-slate-800 dark:text-slate-100"
                                    />
                                    {errors.title && <p className="mt-1 text-[11px] text-rose-500">{errors.title.message}</p>}
                                </div>

                                <div className="grid gap-3 sm:grid-cols-2">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                            Host / College Name
                                        </label>
                                        <input
                                            type="text"
                                            {...register("collegeName")}
                                            placeholder="e.g. Stanford University"
                                            className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 outline-none focus:border-purple-500 focus:bg-white dark:border-slate-800 dark:bg-slate-800 dark:text-slate-100"
                                        />
                                    </div>

                                    <Controller
                                        name="eventMode"
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }) => (
                                            <HackHiveSelect
                                                label="Event Mode *"
                                                value={field.value}
                                                onChange={(e) => field.onChange(e.target.value)}
                                                options={[
                                                    { value: "ONLINE", label: "Online" },
                                                    { value: "OFFLINE", label: "Offline" },
                                                    { value: "HYBRID", label: "Hybrid" },
                                                ]}
                                            />
                                        )}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                        Location / Venue *
                                    </label>
                                    <input
                                        type="text"
                                        {...register("location", { required: "Location is required" })}
                                        placeholder="e.g. Virtual via Discord / Main Auditorium, Building 4"
                                        className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 outline-none focus:border-purple-500 focus:bg-white dark:border-slate-800 dark:bg-slate-800 dark:text-slate-100"
                                    />
                                    {errors.location && <p className="mt-1 text-[11px] text-rose-500">{errors.location.message}</p>}
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-4">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Step 2: Event Details & Banner</h4>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                        Description & Overview
                                    </label>
                                    <textarea
                                        rows={4}
                                        {...register("description")}
                                        placeholder="Detailed event description, themes, and goals..."
                                        className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 outline-none focus:border-purple-500 focus:bg-white dark:border-slate-800 dark:bg-slate-800 dark:text-slate-100"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                        Banner Image URL
                                    </label>
                                    <input
                                        type="url"
                                        {...register("bannerUrl")}
                                        placeholder="https://images.unsplash.com/..."
                                        className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 outline-none focus:border-purple-500 focus:bg-white dark:border-slate-800 dark:bg-slate-800 dark:text-slate-100"
                                    />
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-4">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Step 3: Rules, Pricing & Team Sizes</h4>

                                {/* Pricing Section */}
                                <div className="space-y-2 rounded-2xl border border-slate-200/80 bg-slate-50/60 p-3.5 dark:border-slate-800 dark:bg-slate-800/40">
                                    <label className="block text-xs font-bold text-slate-900 dark:text-slate-100">
                                        Registration Type *
                                    </label>
                                    <div className="flex items-center gap-4">
                                        <label className="flex items-center gap-2 text-xs font-medium cursor-pointer text-slate-700 dark:text-slate-300">
                                            <input
                                                type="radio"
                                                value="FREE"
                                                {...register("registrationType")}
                                                className="size-4 text-purple-600 focus:ring-purple-500"
                                            />
                                            <span>Free Event</span>
                                        </label>
                                        <label className="flex items-center gap-2 text-xs font-medium cursor-pointer text-slate-700 dark:text-slate-300">
                                            <input
                                                type="radio"
                                                value="PAID"
                                                {...register("registrationType")}
                                                className="size-4 text-purple-600 focus:ring-purple-500"
                                            />
                                            <span>Paid Event</span>
                                        </label>
                                    </div>

                                    {formData.registrationType === "PAID" && (
                                        <div className="pt-2">
                                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                                Registration Fee (₹) *
                                            </label>
                                            <div className="relative mt-1">
                                                <span className="pointer-events-none absolute left-3 top-2 text-xs font-bold text-slate-400">
                                                    ₹
                                                </span>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    min="1"
                                                    {...register("registrationFee", {
                                                        required: formData.registrationType === "PAID" ? "Registration fee is required for paid events" : false,
                                                        min: { value: 0.01, message: "Fee must be greater than 0" },
                                                    })}
                                                    placeholder="e.g. 500"
                                                    className="w-full rounded-xl border border-slate-200 bg-white pl-7 pr-3 py-2 text-xs text-slate-900 outline-none focus:border-purple-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                                                />
                                            </div>
                                            {errors.registrationFee && (
                                                <p className="mt-1 text-[11px] text-rose-500">{errors.registrationFee.message}</p>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                        Eligibility Criteria
                                    </label>
                                    <input
                                        type="text"
                                        {...register("eligibility")}
                                        placeholder="e.g. Open to undergraduate and graduate students"
                                        className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 outline-none focus:border-purple-500 focus:bg-white dark:border-slate-800 dark:bg-slate-800 dark:text-slate-100"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                        Max Participants (Capacity Limit - Optional)
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        {...register("maxParticipants", { min: { value: 1, message: "Must be at least 1" } })}
                                        placeholder="e.g. 100 (Leave blank for unlimited)"
                                        className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 outline-none focus:border-purple-500 focus:bg-white dark:border-slate-800 dark:bg-slate-800 dark:text-slate-100"
                                    />
                                    {errors.maxParticipants && (
                                        <p className="mt-1 text-[11px] text-rose-500">{errors.maxParticipants.message}</p>
                                    )}
                                </div>

                                <div className="grid gap-3 sm:grid-cols-2">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                            Min Team Size
                                        </label>
                                        <input
                                            type="number"
                                            {...register("minTeamSize", { min: 1 })}
                                            className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 outline-none focus:border-purple-500 focus:bg-white dark:border-slate-800 dark:bg-slate-800 dark:text-slate-100"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                            Max Team Size
                                        </label>
                                        <input
                                            type="number"
                                            {...register("maxTeamSize", { min: 1 })}
                                            className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 outline-none focus:border-purple-500 focus:bg-white dark:border-slate-800 dark:bg-slate-800 dark:text-slate-100"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 4 && (
                            <div className="space-y-4">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Step 4: Timeline & Dates</h4>
                                <div className="grid gap-3 sm:grid-cols-2">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                            Registration Start Date
                                        </label>
                                        <input
                                            type="datetime-local"
                                            {...register("registrationStartDate")}
                                            className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 outline-none focus:border-purple-500 focus:bg-white dark:border-slate-800 dark:bg-slate-800 dark:text-slate-100"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                            Registration Deadline *
                                        </label>
                                        <input
                                            type="datetime-local"
                                            {...register("registrationEndDate", { required: "Registration deadline is required" })}
                                            className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 outline-none focus:border-purple-500 focus:bg-white dark:border-slate-800 dark:bg-slate-800 dark:text-slate-100"
                                        />
                                        {errors.registrationEndDate && <p className="mt-1 text-[11px] text-rose-500">{errors.registrationEndDate.message}</p>}
                                    </div>
                                </div>

                                <div className="grid gap-3 sm:grid-cols-2">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                            Hackathon Start Date *
                                        </label>
                                        <input
                                            type="datetime-local"
                                            {...register("startDate", { required: "Start date is required" })}
                                            className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 outline-none focus:border-purple-500 focus:bg-white dark:border-slate-800 dark:bg-slate-800 dark:text-slate-100"
                                        />
                                        {errors.startDate && <p className="mt-1 text-[11px] text-rose-500">{errors.startDate.message}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                            Hackathon End Date *
                                        </label>
                                        <input
                                            type="datetime-local"
                                            {...register("endDate", { required: "End date is required" })}
                                            className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 outline-none focus:border-purple-500 focus:bg-white dark:border-slate-800 dark:bg-slate-800 dark:text-slate-100"
                                        />
                                        {errors.endDate && <p className="mt-1 text-[11px] text-rose-500">{errors.endDate.message}</p>}
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 5 && (
                            <div className="space-y-4">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Step 5: Review & Publish</h4>
                                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 space-y-2 dark:border-slate-800 dark:bg-slate-800/40">
                                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{formData.title || "Untitled Event"}</h3>
                                    <p className="text-xs text-slate-500">{formData.description || "No description."}</p>
                                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                                        <div><span className="font-semibold">Mode:</span> {formData.eventMode}</div>
                                        <div><span className="font-semibold">Location:</span> {formData.location}</div>
                                        <div><span className="font-semibold">Team Size:</span> {formData.minTeamSize}-{formData.maxTeamSize}</div>
                                        <div><span className="font-semibold">Host:</span> {formData.collegeName || "N/A"}</div>
                                        <div><span className="font-semibold">Registration:</span> {formData.registrationType === "PAID" ? `PAID (₹${formData.registrationFee || 0})` : "FREE"}</div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer Controls */}
                    <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
                        {step > 1 ? (
                            <Button type="button" variant="outline" size="sm" onClick={() => setStep((s) => s - 1)}>
                                <ArrowLeft className="mr-1 size-3.5" /> Back
                            </Button>
                        ) : (
                            <Button type="button" variant="outline" size="sm" onClick={handleClose}>
                                Cancel
                            </Button>
                        )}

                        {step < 5 ? (
                            <Button
                                type="button"
                                size="sm"
                                onClick={() => setStep((s) => s + 1)}
                                className="bg-purple-600 hover:bg-purple-500 text-white font-semibold"
                            >
                                Next <ArrowRight className="ml-1 size-3.5" />
                            </Button>
                        ) : (
                            <Button
                                type="button"
                                size="sm"
                                disabled={isLoading}
                                onClick={handleSubmit(handleFinalSubmit)}
                                className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-6"
                            >
                                {isLoading ? "Submitting..." : isEdit ? "Update Event" : "Publish Event"}
                            </Button>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
