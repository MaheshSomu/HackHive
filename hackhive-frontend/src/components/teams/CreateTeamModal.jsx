import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Calendar, Check, Layers, Users, X, Globe, Building2 } from "lucide-react";
import { Button } from "../ui/Button";
import HackHiveSelect from "../ui/HackHiveSelect";

export default function CreateTeamModal({
    isOpen,
    onClose,
    events = [],
    onCreateTeam,
    isLoading,
}) {
    const [step, setStep] = useState(1);
    const [eventTypeChoice, setEventTypeChoice] = useState("HACKHIVE"); // 'HACKHIVE' | 'EXTERNAL'

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        control,
        formState: { errors },
        reset,
    } = useForm({
        defaultValues: {
            name: "",
            description: "",
            maxMembers: 4,
            eventId: events[0]?.id || "",
            skills: "",
            externalEventName: "",
            externalOrganizerName: "",
            externalEventDate: "",
            externalDescription: "",
        },
    });

    const formData = watch();

    const handleClose = () => {
        reset();
        setStep(1);
        setEventTypeChoice("HACKHIVE");
        onClose();
    };

    const handleNextStep = (e) => {
        e.preventDefault();
        if (!formData.name?.trim()) return;
        setStep(2);
    };

    const handleFinalSubmit = (data) => {
        if (eventTypeChoice === "EXTERNAL") {
            if (!data.externalEventName?.trim() || !data.externalOrganizerName?.trim()) {
                return;
            }
            const payload = {
                name: data.name.trim(),
                description: data.description?.trim() || "",
                eventType: "EXTERNAL",
                externalEventName: data.externalEventName.trim(),
                externalOrganizerName: data.externalOrganizerName.trim(),
                externalEventDate: data.externalEventDate?.trim() || "",
                externalDescription: data.externalDescription?.trim() || "",
                maxMembers: parseInt(data.maxMembers, 10) || 4,
            };
            onCreateTeam(payload);
        } else {
            const payload = {
                name: data.name.trim(),
                description: data.description?.trim() || "",
                eventType: "HACKHIVE",
                eventId: parseInt(data.eventId, 10),
                maxMembers: parseInt(data.maxMembers, 10) || 4,
            };
            onCreateTeam(payload);
        }
    };

    if (!isOpen) return null;

    const selectedEvent = events.find((e) => String(e.id) === String(formData.eventId));
    const isSubmitDisabled =
        isLoading ||
        (eventTypeChoice === "HACKHIVE" && !formData.eventId) ||
        (eventTypeChoice === "EXTERNAL" && (!formData.externalEventName?.trim() || !formData.externalOrganizerName?.trim()));

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

                {/* Dialog Content */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 15 }}
                    transition={{ duration: 0.2 }}
                    className="relative flex flex-col w-full max-w-xl max-h-[90vh] rounded-3xl border border-slate-200 bg-white shadow-2xl overflow-hidden dark:border-slate-800 dark:bg-slate-900"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                                Step {step} of 2
                            </span>
                            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                                {step === 1 ? "Team & Workspace Details" : "Choose Event & Review"}
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

                    {/* Multi-step Form Body */}
                    <div className="flex-1 overflow-y-auto p-6">
                        {step === 1 ? (
                            <form className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                        Team Name *
                                    </label>
                                    <input
                                        type="text"
                                        {...register("name", { required: "Team name is required" })}
                                        placeholder="e.g. ByteCraft Studio"
                                        className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-800 dark:text-slate-100"
                                    />
                                    {errors.name && (
                                        <p className="mt-1 text-[11px] text-rose-500">{errors.name.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                        Description & Goal
                                    </label>
                                    <textarea
                                        rows={3}
                                        {...register("description")}
                                        placeholder="Describe what your team plans to build and what contributors you're looking for..."
                                        className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-800 dark:text-slate-100"
                                    />
                                </div>

                                <div className="grid gap-3 sm:grid-cols-2">
                                    <Controller
                                        name="maxMembers"
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }) => (
                                            <HackHiveSelect
                                                label="Maximum Members *"
                                                value={field.value}
                                                onChange={(e) => field.onChange(e.target.value)}
                                                options={[
                                                    { value: 2, label: "2 Members" },
                                                    { value: 3, label: "3 Members" },
                                                    { value: 4, label: "4 Members" },
                                                    { value: 5, label: "5 Members" },
                                                    { value: 6, label: "6 Members" },
                                                ]}
                                            />
                                        )}
                                    />

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                            Required Skills / Tags
                                        </label>
                                        <input
                                            type="text"
                                            {...register("skills")}
                                            placeholder="e.g. React, Node, AI/ML, Figma"
                                            className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-800 dark:text-slate-100"
                                        />
                                    </div>
                                </div>
                            </form>
                        ) : (
                            <form onSubmit={handleSubmit(handleFinalSubmit)} className="space-y-5">
                                {/* Event Type Choice Selector */}
                                <div className="space-y-2">
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                        Event Type Selection *
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setEventTypeChoice("HACKHIVE")}
                                            className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border text-xs font-bold transition ${
                                                eventTypeChoice === "HACKHIVE"
                                                    ? "border-indigo-600 bg-indigo-50/80 text-indigo-700 dark:border-indigo-500 dark:bg-indigo-950/60 dark:text-indigo-300 shadow-2xs"
                                                    : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400"
                                            }`}
                                        >
                                            <Calendar className="size-5 mb-1 text-indigo-600 dark:text-indigo-400" />
                                            <span>HackHive Event</span>
                                            <span className="text-[10px] font-normal opacity-80 mt-0.5">Listed on HackHive platform</span>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => setEventTypeChoice("EXTERNAL")}
                                            className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border text-xs font-bold transition ${
                                                eventTypeChoice === "EXTERNAL"
                                                    ? "border-indigo-600 bg-indigo-50/80 text-indigo-700 dark:border-indigo-500 dark:bg-indigo-950/60 dark:text-indigo-300 shadow-2xs"
                                                    : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400"
                                            }`}
                                        >
                                            <Globe className="size-5 mb-1 text-emerald-600 dark:text-emerald-400" />
                                            <span>External Event</span>
                                            <span className="text-[10px] font-normal opacity-80 mt-0.5">College or outside hackathon</span>
                                        </button>
                                    </div>
                                </div>

                                {/* HackHive Event Selector */}
                                {eventTypeChoice === "HACKHIVE" && (
                                    <div>
                                        {events.length > 0 ? (
                                            <Controller
                                                name="eventId"
                                                control={control}
                                                rules={{ required: eventTypeChoice === "HACKHIVE" ? "Event selection is required" : false }}
                                                render={({ field }) => (
                                                    <HackHiveSelect
                                                        label="Select Target Event *"
                                                        value={field.value}
                                                        onChange={(e) => field.onChange(e.target.value)}
                                                        options={events.map((evt) => ({
                                                            value: evt.id,
                                                            label: `${evt.title} (${evt.eventMode || "Hybrid"})`,
                                                        }))}
                                                        searchable={events.length > 3}
                                                        searchPlaceholder="Search events..."
                                                    />
                                                )}
                                            />
                                        ) : (
                                            <div className="mt-1 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/40">
                                                No events found. Please create or browse an event first.
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* External Event Fields */}
                                {eventTypeChoice === "EXTERNAL" && (
                                    <div className="space-y-3.5 p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-800/30">
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                                Event / Hackathon Name *
                                            </label>
                                            <input
                                                type="text"
                                                {...register("externalEventName", {
                                                    required: eventTypeChoice === "EXTERNAL" ? "Event name is required" : false,
                                                })}
                                                placeholder="e.g. TechFest Hackathon 2026"
                                                className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-900 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                                            />
                                            {errors.externalEventName && (
                                                <p className="mt-1 text-[11px] text-rose-500">{errors.externalEventName.message}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                                Organizer / College Name *
                                            </label>
                                            <input
                                                type="text"
                                                {...register("externalOrganizerName", {
                                                    required: eventTypeChoice === "EXTERNAL" ? "Organizer name is required" : false,
                                                })}
                                                placeholder="e.g. ABC Institute of Technology"
                                                className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-900 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                                            />
                                            {errors.externalOrganizerName && (
                                                <p className="mt-1 text-[11px] text-rose-500">{errors.externalOrganizerName.message}</p>
                                            )}
                                        </div>

                                        <div className="grid gap-3 sm:grid-cols-2">
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                                    Event Date (optional)
                                                </label>
                                                <input
                                                    type="text"
                                                    {...register("externalEventDate")}
                                                    placeholder="e.g. Oct 15-17, 2026"
                                                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-900 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                                    Description / Link (optional)
                                                </label>
                                                <input
                                                    type="text"
                                                    {...register("externalDescription")}
                                                    placeholder="e.g. National Level Inter-College Event"
                                                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-900 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Review Box */}
                                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 space-y-3 dark:border-slate-800 dark:bg-slate-800/40">
                                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Team Summary Review</p>
                                    <div className="space-y-1">
                                        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{formData.name}</h4>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">{formData.description || "No description provided."}</p>
                                    </div>
                                    <div className="flex flex-wrap gap-3 text-xs text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                                        <div><span className="font-semibold">Type:</span> {eventTypeChoice === "EXTERNAL" ? "External Event" : "HackHive Event"}</div>
                                        <div><span className="font-semibold">Max Members:</span> {formData.maxMembers}</div>
                                        {eventTypeChoice === "HACKHIVE" && selectedEvent && (
                                            <div><span className="font-semibold">Event:</span> {selectedEvent.title}</div>
                                        )}
                                        {eventTypeChoice === "EXTERNAL" && formData.externalEventName && (
                                            <div><span className="font-semibold">External Event:</span> {formData.externalEventName}</div>
                                        )}
                                    </div>
                                </div>
                            </form>
                        )}
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
                        {step === 2 ? (
                            <Button type="button" variant="outline" size="sm" onClick={() => setStep(1)}>
                                <ArrowLeft className="mr-1 size-3.5" /> Back
                            </Button>
                        ) : (
                            <Button type="button" variant="outline" size="sm" onClick={handleClose}>
                                Cancel
                            </Button>
                        )}

                        {step === 1 ? (
                            <Button
                                type="button"
                                size="sm"
                                disabled={!formData.name?.trim()}
                                onClick={handleNextStep}
                                className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold"
                            >
                                Continue <ArrowRight className="ml-1 size-3.5" />
                            </Button>
                        ) : (
                            <Button
                                type="button"
                                size="sm"
                                disabled={isSubmitDisabled}
                                onClick={handleSubmit(handleFinalSubmit)}
                                className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 dark:bg-indigo-600 dark:hover:bg-indigo-500"
                            >
                                {isLoading ? "Creating Team..." : "Create Team Workspace"}
                            </Button>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
