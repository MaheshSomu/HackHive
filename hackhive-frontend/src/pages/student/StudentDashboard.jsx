import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Activity,
    BadgeCheck,
    Bell,
    CalendarDays,
    FolderGit2,
    Rocket,
    Sparkles,
    Users2,
} from "lucide-react";

import useAuth from "../../hooks/useAuth";
import { getCurrentUser } from "../../services/authService";
import { studentDashboardService } from "../../services/studentDashboardService";
import { Button } from "../../components/ui/Button";
import { Card, CardContent } from "../../components/ui/Card";
import DashboardSection from "../../components/student-dashboard/DashboardSection";
import {
    DashboardErrorBanner,
    DashboardPageSkeleton,
    EmptyState,
} from "../../components/student-dashboard/DashboardStates";
import {
    HackathonCard,
    NotificationItem,
    ProfileCompletionCard,
    QuickActionCard,
    StatCard,
    TeamCard,
    TimelineItem,
} from "../../components/student-dashboard/DashboardBlocks";

const initialDashboardState = {
    loading: true,
    error: "",
    currentUser: null,
    profile: null,
    events: [],
    registrations: [],
    teams: [],
    resume: null,
    skills: [],
    projects: [],
    certifications: [],
    education: [],
    experiences: [],
    socialLinks: [],
};

function isFilled(value) {
    if (typeof value === "string") {
        return value.trim().length > 0;
    }
    return Boolean(value);
}

function toDate(value) {
    if (!value) return null;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
}

function formatLongDate(date = new Date()) {
    return new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
    }).format(date);
}

function formatCompactDate(value) {
    const date = toDate(value);
    if (!date) return "Not listed";
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
    }).format(date);
}

function getDayDifference(value) {
    const target = toDate(value);
    if (!target) return null;

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const targetDate = new Date(target);
    targetDate.setHours(0, 0, 0, 0);

    return Math.round((targetDate.getTime() - startOfToday.getTime()) / 86400000);
}

function formatCountdown(value) {
    const days = getDayDifference(value);
    if (days === null) return "Soon";
    if (days < 0) return "Closed";
    if (days === 0) return "Today";
    return `${days} day${days === 1 ? "" : "s"}`;
}

function deriveDifficulty(event) {
    if (isFilled(event?.eligibility)) return event.eligibility;
    if (event?.maxTeamSize <= 2) return "Focused";
    if (event?.maxTeamSize <= 4) return "Balanced";
    return "Open format";
}

function StudentDashboard() {
    const { user: authUser } = useAuth();
    const navigate = useNavigate();
    const [dashboard, setDashboard] = useState(initialDashboardState);

    useEffect(() => {
        let isMounted = true;

        const loadDashboard = async () => {
            const requests = [
                ["currentUser", getCurrentUser()],
                ["profile", studentDashboardService.getProfile()],
                ["events", studentDashboardService.getEvents()],
                ["registrations", studentDashboardService.getRegistrations()],
                ["teams", studentDashboardService.getTeams()],
                ["resume", studentDashboardService.getResume()],
                ["skills", studentDashboardService.getSkills()],
                ["projects", studentDashboardService.getProjects()],
                ["certifications", studentDashboardService.getCertifications()],
                ["education", studentDashboardService.getEducation()],
                ["experiences", studentDashboardService.getExperiences()],
                ["socialLinks", studentDashboardService.getSocialLinks()],
            ];

            const results = await Promise.allSettled(requests.map(([, promise]) => promise));

            if (!isMounted) return;

            const nextState = {
                ...initialDashboardState,
                loading: false,
            };

            const failedPanels = [];

            results.forEach((result, index) => {
                const [key] = requests[index];

                if (result.status === "fulfilled") {
                    const data = result.value;
                    nextState[key] = data?.data ?? data ?? (Array.isArray(initialDashboardState[key]) ? [] : null);
                } else {
                    failedPanels.push(key);
                    nextState[key] = Array.isArray(initialDashboardState[key]) ? [] : null;
                }
            });

            const criticalFailures = failedPanels.filter(
                (p) => p === "profile" || p === "currentUser"
            );
            if (criticalFailures.length > 0) {
                nextState.error = "Could not fetch complete student profile. Showing available workspace details.";
            }

            setDashboard(nextState);
        };

        loadDashboard();

        return () => {
            isMounted = false;
        };
    }, []);

    const activeUser = dashboard.currentUser || authUser;
    const profile = dashboard.profile || {};
    const studentName = profile.fullName || activeUser?.fullName || activeUser?.email?.split("@")[0] || "Student";

    const registeredEventIds = useMemo(() => {
        const regs = Array.isArray(dashboard.registrations) ? dashboard.registrations : [];
        return new Set(regs.map((registration) => registration.eventId));
    }, [dashboard.registrations]);

    const profileChecklist = useMemo(() => {
        const resume = dashboard.resume || {};
        const skills = Array.isArray(dashboard.skills) ? dashboard.skills : [];
        const projects = Array.isArray(dashboard.projects) ? dashboard.projects : [];
        const certs = Array.isArray(dashboard.certifications) ? dashboard.certifications : [];
        const edu = Array.isArray(dashboard.education) ? dashboard.education : [];
        const exp = Array.isArray(dashboard.experiences) ? dashboard.experiences : [];
        const social = Array.isArray(dashboard.socialLinks) ? dashboard.socialLinks : [];

        return [
            { label: "Bio", complete: isFilled(profile.bio) },
            { label: "University", complete: isFilled(profile.university) },
            { label: "College", complete: isFilled(profile.college) },
            { label: "Degree", complete: isFilled(profile.degree) },
            { label: "Branch", complete: isFilled(profile.branch) },
            { label: "Graduation year", complete: isFilled(profile.graduationYear) },
            { label: "Location", complete: isFilled(profile.location) },
            { label: "GitHub", complete: isFilled(profile.githubUrl) },
            { label: "LinkedIn", complete: isFilled(profile.linkedinUrl) },
            { label: "Portfolio", complete: isFilled(profile.portfolioUrl) },
            { label: "Resume", complete: isFilled(resume.resumeUrl || profile.resumeUrl) },
            { label: "Skills", complete: skills.length > 0 },
            { label: "Projects", complete: projects.length > 0 },
            { label: "Certificates", complete: certs.length > 0 },
            { label: "Education", complete: edu.length > 0 },
            { label: "Experience", complete: exp.length > 0 },
            { label: "Social links", complete: social.length > 0 },
        ];
    }, [
        profile,
        dashboard.resume,
        dashboard.skills,
        dashboard.projects,
        dashboard.certifications,
        dashboard.education,
        dashboard.experiences,
        dashboard.socialLinks,
    ]);

    const profileCompletion = useMemo(() => {
        const completeCount = profileChecklist.filter((item) => item.complete).length;
        const completion = Math.round((completeCount / profileChecklist.length) * 100);
        const missingItems = profileChecklist
            .filter((item) => !item.complete)
            .map((item) => item.label);

        return {
            completion,
            missingItems,
            missingCount: missingItems.length,
        };
    }, [profileChecklist]);

    const openHackathons = useMemo(() => {
        const events = Array.isArray(dashboard.events) ? dashboard.events : [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return events
            .filter((event) => {
                const registrationStart = toDate(event.registrationStartDate);
                const registrationEnd = toDate(event.registrationEndDate);
                const eventStart = toDate(event.startDate);

                if (registrationStart) registrationStart.setHours(0, 0, 0, 0);
                if (registrationEnd) registrationEnd.setHours(0, 0, 0, 0);
                if (eventStart) eventStart.setHours(0, 0, 0, 0);

                const canStart = registrationStart ? registrationStart <= today : true;
                const canEnd = registrationEnd ? registrationEnd >= today : true;
                const notStarted = eventStart ? eventStart >= today : true;

                return canStart && canEnd && notStarted;
            })
            .sort((left, right) => {
                const leftDate = toDate(left.registrationEndDate) || toDate(left.startDate) || new Date(0);
                const rightDate = toDate(right.registrationEndDate) || toDate(right.startDate) || new Date(0);
                return leftDate - rightDate;
            })
            .slice(0, 4)
            .map((event) => {
                const registrationEnd = event.registrationEndDate || event.startDate;
                const isRegistered = registeredEventIds.has(event.id);

                return {
                    id: event.id,
                    title: event.title,
                    description: event.description || "Details are available in the event page.",
                    location: event.location || event.collegeName || "Location not listed",
                    mode: event.eventMode || "Hybrid",
                    daysRemaining: formatCountdown(registrationEnd),
                    registrationDeadline: registrationEnd,
                    registrationDeadlineText: formatCompactDate(registrationEnd),
                    registrationLabel: isRegistered
                        ? "Registered"
                        : registrationEnd
                            ? `Closes ${formatCompactDate(registrationEnd)}`
                            : "Open for registration",
                    statusLabel: isRegistered ? "Registered" : "Open now",
                    prize: event.prizePool || "TBD",
                    difficulty: deriveDifficulty(event),
                };
            });
    }, [dashboard.events, registeredEventIds]);

    const teamPreview = useMemo(() => {
        const teams = Array.isArray(dashboard.teams) ? dashboard.teams : [];
        return teams.slice(0, 3).map((team) => ({
            id: team.id,
            name: team.name,
            description: team.description || "A workspace for your team build.",
            eventTitle: team.eventTitle || "Hackathon team",
            leaderName: team.leaderName || "Team lead",
            memberCount: team.currentMembers || 1,
            maxMembers: team.maxMembers || 4,
            open: Boolean(team.open),
            leaderId: team.leaderId,
        }));
    }, [dashboard.teams]);

    const todayTasks = useMemo(() => {
        const tasks = [];

        if (profileCompletion.completion < 100) {
            tasks.push({
                title: "Complete your profile",
                description: `${profileCompletion.missingCount} profile sections still need attention.`,
            });
        }

        if (openHackathons[0]) {
            tasks.push({
                title: "Review open hackathons",
                description: openHackathons[0].registrationDeadlineText === "Not listed"
                    ? `${openHackathons[0].title} is open for registration right now.`
                    : `${openHackathons[0].title} closes ${openHackathons[0].registrationDeadlineText.toLowerCase()}.`,
            });
        }

        if (teamPreview[0]) {
            tasks.push({
                title: "Check team workspace",
                description: `${teamPreview[0].name} has ${teamPreview[0].memberCount}/${teamPreview[0].maxMembers} members assigned.`,
            });
        }

        return tasks.slice(0, 3);
    }, [openHackathons, profileCompletion, teamPreview]);

    const activityItems = useMemo(() => {
        const items = [];
        const regs = Array.isArray(dashboard.registrations) ? dashboard.registrations : [];
        const skills = Array.isArray(dashboard.skills) ? dashboard.skills : [];
        const projects = Array.isArray(dashboard.projects) ? dashboard.projects : [];
        const certs = Array.isArray(dashboard.certifications) ? dashboard.certifications : [];

        if (regs[0]) {
            items.push({
                tone: "accent",
                icon: <CalendarDays className="size-4" />,
                title: "Registered for event",
                description: `Registered for ${regs[0].eventTitle || "Hackathon"}.`,
                meta: "Events",
            });
        }

        if (skills[0]) {
            items.push({
                tone: "success",
                icon: <Sparkles className="size-4" />,
                title: "Added skill",
                description: `Added ${skills[0].skillName}${skills[0].skillLevel ? ` • ${skills[0].skillLevel}` : ""}.`,
                meta: "Skills",
            });
        }

        if (teamPreview[0]) {
            items.push({
                tone: "default",
                icon: <Users2 className="size-4" />,
                title: teamPreview[0].leaderId === activeUser?.userId ? "Team Created" : "Team Joined",
                description: `${teamPreview[0].name} workspace is active.`,
                meta: "Teams",
            });
        }

        if (projects[0]) {
            items.push({
                tone: "default",
                icon: <Rocket className="size-4" />,
                title: "Added project",
                description: `${projects[0].title} added to portfolio.`,
                meta: "Projects",
            });
        }

        if (certs[0]) {
            items.push({
                tone: "success",
                icon: <BadgeCheck className="size-4" />,
                title: "Added certification",
                description: `${certs[0].name} added to profile.`,
                meta: "Certifications",
            });
        }

        return items.slice(0, 4);
    }, [dashboard.certifications, dashboard.projects, dashboard.registrations, dashboard.skills, teamPreview, activeUser?.userId]);

    const notifications = useMemo(() => {
        const items = [];

        if (profileCompletion.completion < 100) {
            items.push({
                tone: "warning",
                title: "Profile incomplete",
                description: `${profileCompletion.missingCount} sections are missing from your profile.`,
                meta: `${profileCompletion.completion}%`,
            });
        }

        if (!dashboard.resume || !isFilled(dashboard.resume.resumeUrl)) {
            items.push({
                tone: "accent",
                title: "Upload resume",
                description: "Add your resume to complete your application readiness.",
                meta: "Action",
            });
        }

        openHackathons
            .filter((event) => {
                const days = getDayDifference(event.registrationDeadline);
                return days !== null && days >= 0 && days <= 3;
            })
            .slice(0, 2)
            .forEach((event) => {
                items.push({
                    tone: "warning",
                    title: `${event.title} closing soon`,
                    description: `Registration ends ${event.registrationLabel.toLowerCase()}.`,
                    meta: event.daysRemaining,
                });
            });

        return items.slice(0, 4);
    }, [dashboard.resume, openHackathons, profileCompletion]);

    const currentDateLabel = useMemo(() => formatLongDate(new Date()), []);

    if (dashboard.loading) {
        return <DashboardPageSkeleton />;
    }

    return (
        <div className="space-y-8 pb-12">
            {dashboard.error && (
                <DashboardErrorBanner message={dashboard.error} />
            )}

            {/* Overview / Hero Section */}
            <section id="overview" className="scroll-mt-24">
                <Card className="overflow-hidden border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
                    <CardContent className="p-6 lg:p-8">
                        <div className="grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
                            <div className="space-y-6">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-400">
                                        Welcome back
                                    </span>
                                    <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
                                        {currentDateLabel}
                                    </span>
                                </div>

                                <div className="space-y-3">
                                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-slate-100">
                                        {studentName}
                                    </h1>

                                    <p className="max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-400">
                                        {profileCompletion.completion < 100
                                            ? `You have ${openHackathons.length} open hackathon${openHackathons.length === 1 ? "" : "s"} and ${teamPreview.length} team workspace${teamPreview.length === 1 ? "" : "s"} active.`
                                            : "Your student profile is up to date. Track your events, teams, and workspace activity below."}
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-3 pt-2">
                                    <Button
                                        type="button"
                                        onClick={() => navigate("/student/profile")}
                                        className="h-10 rounded-xl bg-slate-900 px-5 text-xs font-medium text-white hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500"
                                    >
                                        Manage Profile
                                    </Button>

                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => navigate("/student/events")}
                                        className="h-10 rounded-xl border-slate-200 bg-white px-5 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                                    >
                                        Browse Hackathons
                                    </Button>

                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={() => navigate("/student/teams")}
                                        className="h-10 rounded-xl px-5 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                                    >
                                        My Teams
                                    </Button>
                                </div>
                            </div>

                            {/* Today's Focus Box */}
                            <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5 dark:border-slate-800 dark:bg-slate-800/40">
                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                                    Today&apos;s Focus
                                </p>

                                {todayTasks.length > 0 ? (
                                    <div className="mt-4 space-y-3">
                                        {todayTasks.map((task) => (
                                            <div
                                                key={task.title}
                                                className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs dark:border-slate-800 dark:bg-slate-900"
                                            >
                                                <span className="mt-0.5 rounded-lg border border-slate-200 bg-slate-50 p-1.5 text-indigo-600 dark:border-slate-800 dark:bg-slate-800 dark:text-indigo-400">
                                                    <Sparkles className="size-4" />
                                                </span>

                                                <div className="min-w-0">
                                                    <h3 className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                                                        {task.title}
                                                    </h3>
                                                    <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                                                        {task.description}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50/80 p-4 text-xs text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300">
                                        You are all set for today! Check back later for team updates or incoming hackathon announcements.
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </section>

            {/* Profile Overview Section */}
            <DashboardSection
                id="profile"
                eyebrow="Profile"
                title="Profile & Quick Stats"
                description="Monitor your profile completion rate and active workspace metrics."
            >
                <div className="grid gap-5 xl:grid-cols-[1fr_1fr]">
                    <ProfileCompletionCard
                        completion={profileCompletion.completion}
                        summary={
                            profileCompletion.missingCount > 0
                                ? `${profileCompletion.missingCount} section${profileCompletion.missingCount === 1 ? "" : "s"} missing from your profile.`
                                : "Your core profile sections are complete."
                        }
                        missingItems={profileCompletion.missingItems.slice(0, 6)}
                        onCompleteProfile={() => navigate("/student/profile")}
                    />

                    <div className="grid gap-4 sm:grid-cols-2">
                        <StatCard
                            label="Registered Events"
                            value={Array.isArray(dashboard.registrations) ? dashboard.registrations.length : 0}
                            hint="Events you have signed up for"
                            icon={<CalendarDays className="size-5" />}
                        />
                        <StatCard
                            label="My Teams"
                            value={Array.isArray(dashboard.teams) ? dashboard.teams.length : 0}
                            hint="Active team workspaces"
                            icon={<Users2 className="size-5" />}
                        />
                        <StatCard
                            label="Projects"
                            value={Array.isArray(dashboard.projects) ? dashboard.projects.length : 0}
                            hint="Projects in your portfolio"
                            icon={<FolderGit2 className="size-5" />}
                        />
                        <StatCard
                            label="Certificates"
                            value={Array.isArray(dashboard.certifications) ? dashboard.certifications.length : 0}
                            hint="Verified achievements"
                            icon={<BadgeCheck className="size-5" />}
                        />
                    </div>
                </div>
            </DashboardSection>

            {/* Hackathons Section */}
            <DashboardSection
                id="hackathons"
                eyebrow="Hackathons"
                title="Open Hackathons"
                description="Explore active hackathons open for student registrations."
            >
                {openHackathons.length > 0 ? (
                    <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
                        {openHackathons.map((event) => (
                            <HackathonCard
                                key={event.id}
                                event={event}
                                onOpen={() => navigate("/student/events")}
                            />
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        icon={<CalendarDays className="size-5" />}
                        title="No open hackathons right now"
                        description="There are currently no active hackathon registrations available. Check back soon for upcoming events."
                        action={
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => navigate("/student/events")}
                                className="rounded-xl border-slate-200 bg-white text-xs text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                            >
                                View All Events
                            </Button>
                        }
                    />
                )}
            </DashboardSection>

            {/* Teams Section */}
            <DashboardSection
                id="teams"
                eyebrow="Teams"
                title="My Teams"
                description="Collaborate with your teammates and access team workspaces."
            >
                {teamPreview.length > 0 ? (
                    <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
                        {teamPreview.map((team) => (
                            <TeamCard
                                key={team.id}
                                team={team}
                                onOpenWorkspace={() => navigate("/student/teams")}
                            />
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        icon={<Users2 className="size-5" />}
                        title="No teams joined yet"
                        description="You are not currently part of any team workspace. Join an existing team or create one for an upcoming hackathon."
                        action={
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => navigate("/student/teams")}
                                className="rounded-xl border-slate-200 bg-white text-xs text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                            >
                                Manage Teams
                            </Button>
                        }
                    />
                )}
            </DashboardSection>

            {/* Activity & Notifications Grid */}
            <div className="grid gap-6 xl:grid-cols-2">
                <DashboardSection
                    id="activity"
                    eyebrow="Activity"
                    title="Recent Activity"
                    description="Timeline of your recent event registrations, team updates, and portfolio additions."
                >
                    <Card className="border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
                        <CardContent className="space-y-4 p-6">
                            {activityItems.length > 0 ? (
                                activityItems.map((item, idx) => (
                                    <TimelineItem
                                        key={`${item.title}-${idx}`}
                                        icon={item.icon}
                                        title={item.title}
                                        description={item.description}
                                        meta={item.meta}
                                        tone={item.tone}
                                    />
                                ))
                            ) : (
                                <EmptyState
                                    icon={<Activity className="size-5" />}
                                    title="No recent activity"
                                    description="Activity will appear here as you join hackathons, update your profile, or build teams."
                                />
                            )}
                        </CardContent>
                    </Card>
                </DashboardSection>

                <DashboardSection
                    id="notifications"
                    eyebrow="Notifications"
                    title="Needs Attention"
                    description="Actionable reminders regarding your profile, team invites, and deadlines."
                >
                    <Card className="border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
                        <CardContent className="space-y-4 p-6">
                            {notifications.length > 0 ? (
                                notifications.map((notification, index) => (
                                    <NotificationItem
                                        key={`${notification.title}-${index}`}
                                        tone={notification.tone}
                                        title={notification.title}
                                        description={notification.description}
                                        meta={notification.meta}
                                    />
                                ))
                            ) : (
                                <EmptyState
                                    icon={<Bell className="size-5" />}
                                    title="All caught up"
                                    description="You have no urgent notifications or pending actions right now."
                                />
                            )}
                        </CardContent>
                    </Card>
                </DashboardSection>
            </div>

            {/* Quick Actions */}
            <DashboardSection
                id="actions"
                eyebrow="Quick Actions"
                title="Shortcuts"
                description="Quick access to key areas of your student workspace."
            >
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <QuickActionCard
                        title="Update Profile"
                        description="Complete missing profile sections and showcase your skills."
                        icon={<BadgeCheck className="size-4" />}
                        tone="accent"
                        onClick={() => navigate("/student/profile")}
                    />
                    <QuickActionCard
                        title="Explore Hackathons"
                        description="Browse upcoming events and register your team."
                        icon={<CalendarDays className="size-4" />}
                        onClick={() => navigate("/student/events")}
                    />
                    <QuickActionCard
                        title="Team Workspaces"
                        description="Form a team, manage members, and collaborate."
                        icon={<Users2 className="size-4" />}
                        onClick={() => navigate("/student/teams")}
                    />
                    <QuickActionCard
                        title="Workspace & Settings"
                        description="Access your project workspace, files, and settings."
                        icon={<Activity className="size-4" />}
                        onClick={() => navigate("/student/workspace")}
                    />
                </div>
            </DashboardSection>
        </div>
    );
}

export default StudentDashboard;
