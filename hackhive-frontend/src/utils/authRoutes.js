export const DASHBOARD_ROUTES = {
    STUDENT: "/student/dashboard",
    ORGANIZER: "/organizer/dashboard",
    ADMIN: "/admin/dashboard",
};

export function getDashboardPath(role) {
    return DASHBOARD_ROUTES[role] || DASHBOARD_ROUTES.STUDENT;
}
