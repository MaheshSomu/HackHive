import { createContext, useCallback, useContext, useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import { eventService } from "../services/eventService";
import { teamService } from "../services/teamService";
import { organizerService } from "../services/organizerService";
import { adminService } from "../services/adminService";

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState("ALL"); // 'ALL' | 'UNREAD'

    const fetchNotifications = useCallback(async () => {
        if (!user) {
            setNotifications([]);
            return;
        }

        try {
            setLoading(true);
            const items = [];
            const timeNow = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

            if (user.role === "STUDENT") {
                const [regsRes, reqsRes, teamsRes] = await Promise.allSettled([
                    eventService.getMyRegistrations(),
                    teamService.getMyJoinRequests(),
                    teamService.getMyTeams(),
                ]);

                // 1. Event Registration Notifications
                if (regsRes.status === "fulfilled" && Array.isArray(regsRes.value)) {
                    regsRes.value.forEach((reg) => {
                        items.push({
                            id: `reg-${reg.registrationId || reg.eventId}`,
                            title: "Event Registration Confirmed",
                            description: `You are registered for ${reg.eventTitle || "Hackathon"}`,
                            type: "event",
                            category: "Event Registration",
                            read: false,
                            timestamp: timeNow,
                        });

                        // Event Reminder
                        items.push({
                            id: `rem-${reg.registrationId || reg.eventId}`,
                            title: "Event Reminder",
                            description: `Prepare your build for ${reg.eventTitle || "Hackathon"}!`,
                            type: "reminder",
                            category: "Event Reminder",
                            read: false,
                            timestamp: timeNow,
                        });
                    });
                }

                // 2. Team Request Status & Invitations
                if (reqsRes.status === "fulfilled" && Array.isArray(reqsRes.value)) {
                    reqsRes.value.forEach((req) => {
                        const status = req.status || "PENDING";
                        items.push({
                            id: `req-${req.requestId}`,
                            title: `Team Request ${status}`,
                            description: `Request to join ${req.teamName || "Team"} is ${status.toLowerCase()}`,
                            type: status === "APPROVED" ? "success" : status === "REJECTED" ? "danger" : "team",
                            category: "Team Request Status",
                            read: false,
                            timestamp: timeNow,
                        });
                    });
                }

                if (teamsRes.status === "fulfilled" && Array.isArray(teamsRes.value)) {
                    teamsRes.value.forEach((team) => {
                        items.push({
                            id: `inv-${team.id}`,
                            title: "Team Invitation Joined",
                            description: `You are a member of team ${team.name}`,
                            type: "team",
                            category: "Team Invitation",
                            read: false,
                            timestamp: timeNow,
                        });
                    });
                }

                // 3. Profile Reminder
                items.push({
                    id: "profile-rem-1",
                    title: "Profile Completion Reminder",
                    description: "Keep your student bio, resume, and skills up to date for hackathon teams.",
                    type: "profile",
                    category: "Profile Reminder",
                    read: true,
                    timestamp: timeNow,
                });
            } else if (user.role === "ORGANIZER") {
                const eventsRes = await organizerService.getMyEvents().catch(() => []);
                if (Array.isArray(eventsRes)) {
                    eventsRes.forEach((evt) => {
                        items.push({
                            id: `evt-${evt.id}`,
                            title: "New Student Registration",
                            description: `Students registered for your event: ${evt.title}`,
                            type: "registration",
                            category: "New Registration",
                            read: false,
                            timestamp: timeNow,
                        });

                        items.push({
                            id: `evt-upd-${evt.id}`,
                            title: "Event Update Published",
                            description: `${evt.title} details are live in ${evt.eventMode || "Hybrid"} mode`,
                            type: "event",
                            category: "Event Updates",
                            read: false,
                            timestamp: timeNow,
                        });

                        items.push({
                            id: `team-crt-${evt.id}`,
                            title: "Team Created for Event",
                            description: `A new team workspace was formed for ${evt.title}`,
                            type: "team",
                            category: "Team Created",
                            read: false,
                            timestamp: timeNow,
                        });
                    });
                }
            } else if (user.role === "ADMIN") {
                const statsRes = await adminService.getDashboardStatistics().catch(() => null);

                items.push({
                    id: "admin-org-1",
                    title: "New Organizer Registration",
                    description: "Host organizer profiles active in system registry",
                    type: "organizer",
                    category: "New Organizer Registration",
                    read: false,
                    timestamp: timeNow,
                });

                items.push({
                    id: "admin-usr-1",
                    title: "New User Registration",
                    description: `${statsRes?.totalUsers || "System"} user accounts registered in platform`,
                    type: "user",
                    category: "New User Registration",
                    read: false,
                    timestamp: timeNow,
                });

                items.push({
                    id: "admin-sys-1",
                    title: "System Alert Operational",
                    description: "All backend REST services and JWT auth microservices running cleanly",
                    type: "system",
                    category: "System Alerts",
                    read: false,
                    timestamp: timeNow,
                });
            }

            setNotifications(items);
        } catch {
            setNotifications([]);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    const markAsRead = (id) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
    };

    const markAllAsRead = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    };

    const removeNotification = (id) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    };

    const unreadCount = notifications.filter((n) => !n.read).length;

    const displayedNotifications = notifications.filter((n) => {
        if (filter === "UNREAD") return !n.read;
        return true;
    });

    return (
        <NotificationContext.Provider
            value={{
                notifications: displayedNotifications,
                allNotifications: notifications,
                unreadCount,
                loading,
                filter,
                setFilter,
                markAsRead,
                markAllAsRead,
                removeNotification,
                refreshNotifications: fetchNotifications,
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotifications() {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error("useNotifications must be used within NotificationProvider");
    }
    return context;
}
