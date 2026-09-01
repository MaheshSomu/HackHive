import { useCallback, useEffect, useMemo, useState } from "react";
import { FolderGit2, AlertCircle, RotateCcw } from "lucide-react";
import { organizerService } from "../../services/organizerService";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import HackHiveSelect from "../../components/ui/HackHiveSelect";
import OrganizerProjectSubmissions from "../../components/organizer/projectSubmission/OrganizerProjectSubmissions";
import RegistrationsSkeleton from "../../components/organizer/registrations/RegistrationsSkeleton";

export default function OrganizerProjectSubmissionsPage() {
    const [events, setEvents] = useState([]);
    const [selectedEventId, setSelectedEventId] = useState("");
    const [eventsLoading, setEventsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    const loadEvents = useCallback(async () => {
        try {
            setEventsLoading(true);
            setIsError(false);
            const res = await organizerService.getMyEvents();
            const list = Array.isArray(res) ? res : [];
            setEvents(list);
            if (list.length > 0) {
                setSelectedEventId(String(list[0].id));
            }
        } catch (err) {
            console.error("Failed to load organizer events for submissions:", err);
            setIsError(true);
            setEvents([]);
        } finally {
            setEventsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadEvents();
    }, [loadEvents]);

    const eventOptions = useMemo(() => {
        return events.map((e) => ({
            value: String(e.id),
            label: e.title || `Event #${e.id}`,
        }));
    }, [events]);

    if (eventsLoading) {
        return <RegistrationsSkeleton />;
    }

    return (
        <div className="space-y-6 pb-20 w-full max-w-7xl mx-auto text-slate-900 dark:text-slate-100">
            {/* Header Hero */}
            <Card className="border-slate-200/80 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="space-y-1">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-0.5 text-xs font-bold uppercase tracking-wider text-slate-800 dark:bg-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                            <FolderGit2 className="size-3.5 text-blue-600 dark:text-blue-400" />
                            PROJECT SUBMISSIONS
                        </span>
                        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
                            Organizer Project Submissions
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-normal leading-relaxed">
                            Review, inspect, and evaluate finalized student project submissions for your events.
                        </p>
                    </div>

                    {events.length > 0 && (
                        <div className="min-w-[220px]">
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                                Select Event
                            </label>
                            <HackHiveSelect
                                value={selectedEventId}
                                onChange={(e) => setSelectedEventId(e.target.value)}
                                options={eventOptions}
                            />
                        </div>
                    )}
                </div>
            </Card>

            {isError ? (
                <Card className="border-rose-200 bg-rose-50/50 p-6 text-center text-xs text-rose-700 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-400 shadow-2xs">
                    <AlertCircle className="mx-auto size-6 text-rose-500 mb-2" />
                    <p>Failed to load events for project submissions.</p>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mt-3"
                        onClick={loadEvents}
                    >
                        <RotateCcw className="mr-1.5 size-3.5" /> Retry Loading Events
                    </Button>
                </Card>
            ) : events.length === 0 ? (
                <Card className="border-dashed border-slate-200 bg-white p-12 text-center shadow-2xs dark:border-slate-800 dark:bg-slate-900">
                    <FolderGit2 className="mx-auto size-10 text-slate-400 mb-3" />
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                        No Published Events Found
                    </h3>
                    <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
                        Create and publish a hackathon event to start receiving team project submissions.
                    </p>
                </Card>
            ) : (
                <OrganizerProjectSubmissions selectedEventId={selectedEventId} />
            )}
        </div>
    );
}
