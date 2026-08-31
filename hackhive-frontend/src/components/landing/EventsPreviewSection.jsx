import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Calendar, Building2, MapPin, ArrowRight, Users, Clock } from "lucide-react";
import { eventService } from "../../services/eventService";
import useAuth from "../../hooks/useAuth";
import { Button } from "../ui/Button";

function formatDate(dateString) {
    if (!dateString) return "TBD";
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return "TBD";
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(date);
}

export default function EventsPreviewSection() {
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        let isMounted = true;
        const fetchEvents = async () => {
            setLoading(true);
            setError(false);
            try {
                const res = await eventService.getAllEvents();
                if (!isMounted) return;
                const items = Array.isArray(res) ? res : res?.content || res?.data || [];
                setEvents(items.slice(0, 3));
            } catch (err) {
                console.error("Failed to load landing preview events:", err);
                if (isMounted) setError(true);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchEvents();
        return () => {
            isMounted = false;
        };
    }, []);

    const handleViewEvent = () => {
        if (isAuthenticated && user?.role === "STUDENT") {
            navigate("/student/events");
        } else {
            navigate("/login");
        }
    };

    return (
        <section id="events" className="py-16 lg:py-24 bg-white dark:bg-slate-950">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-10">
                    <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                            Upcoming Hackathons
                        </span>
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl mt-1">
                            Your Next Challenge Starts Here
                        </h2>
                        <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mt-1">
                            Explore upcoming hackathons and find one that matches your interests.
                        </p>
                    </div>

                    <Button
                        type="button"
                        variant="ghost"
                        onClick={handleViewEvent}
                        className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 font-semibold gap-1.5 p-0"
                    >
                        <span>View All Events</span>
                        <ArrowRight className="size-4" />
                    </Button>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[1, 2, 3].map((n) => (
                            <div key={n} className="rounded-xl border border-slate-200 bg-slate-50 p-6 space-y-4 animate-pulse dark:border-slate-800 dark:bg-slate-900">
                                <div className="h-36 rounded-lg bg-slate-200 dark:bg-slate-800" />
                                <div className="h-5 w-3/4 rounded bg-slate-200 dark:bg-slate-800" />
                                <div className="h-4 w-1/2 rounded bg-slate-200 dark:bg-slate-800" />
                                <div className="h-9 rounded-lg bg-slate-200 dark:bg-slate-800" />
                            </div>
                        ))}
                    </div>
                ) : error || events.length === 0 ? (
                    <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-10 text-center space-y-3 dark:border-slate-800 dark:bg-slate-900/50 max-w-xl mx-auto">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">
                            Your next challenge starts here.
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-normal leading-relaxed">
                            Explore upcoming hackathons and find one that matches your interests.
                        </p>
                        <Link to={isAuthenticated ? "/student/events" : "/login"}>
                            <Button type="button" variant="primary" size="sm" className="rounded-lg font-semibold mt-2">
                                Explore Portal Events
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {events.map((event) => (
                            <div
                                key={event.id}
                                className="group flex flex-col justify-between rounded-xl border border-slate-200 bg-white overflow-hidden shadow-2xs hover:border-slate-300 hover:shadow-md transition-all dark:border-slate-800 dark:bg-slate-900"
                            >
                                <div>
                                    {/* Event Banner */}
                                    <div className="relative h-36 w-full overflow-hidden bg-slate-900">
                                        {event.bannerUrl ? (
                                            <img
                                                src={event.bannerUrl}
                                                alt={event.title}
                                                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center bg-gradient-to-r from-indigo-700 to-slate-900 p-4 text-white">
                                                <span className="text-base font-bold line-clamp-1">{event.title}</span>
                                            </div>
                                        )}

                                        {/* Status & Mode pills */}
                                        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                                            <span className="rounded-md bg-slate-950/80 border border-white/20 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-xs">
                                                {event.eventMode || "Online"}
                                            </span>
                                            <span className="rounded-md bg-indigo-600/90 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-xs">
                                                {event.registrationType === "PAID" && Number(event.registrationFee) > 0
                                                    ? `₹${event.registrationFee}`
                                                    : "Free"}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Body */}
                                    <div className="p-5 space-y-3">
                                        <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-indigo-600 transition-colors">
                                            {event.title}
                                        </h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed font-normal">
                                            {event.description || "Join this hackathon, form a team, and showcase your real project submission."}
                                        </p>

                                        <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 font-medium">
                                            <div className="flex items-center gap-2 truncate">
                                                <Building2 className="size-3.5 text-indigo-500 shrink-0" />
                                                <span className="truncate">{event.collegeName || "HackHive Event"}</span>
                                            </div>
                                            <div className="flex items-center gap-2 truncate">
                                                <Calendar className="size-3.5 text-indigo-500 shrink-0" />
                                                <span>Starts: {formatDate(event.startDate)}</span>
                                            </div>
                                            <div className="flex items-center gap-2 truncate">
                                                <Users className="size-3.5 text-indigo-500 shrink-0" />
                                                <span>Team Size: {event.minTeamSize || 1}-{event.maxTeamSize || 4} Members</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Footer CTA */}
                                <div className="p-5 pt-0">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={handleViewEvent}
                                        className="w-full justify-center rounded-lg font-semibold text-xs py-2 border-slate-200 text-slate-800 dark:border-slate-700 dark:text-slate-200 hover:bg-slate-50"
                                    >
                                        View Event
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
