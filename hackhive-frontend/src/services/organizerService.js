import api from "../api/axios";

async function request(promise) {
    const response = await promise;
    return response.data?.data ?? response.data;
}

export const organizerService = {
    // Profile
    getProfile: () => request(api.get("/organizer/profile")),
    updateProfile: (data) => request(api.put("/organizer/profile", data)),
    uploadLogo: (file) => {
        const formData = new FormData();
        formData.append("file", file);
        return request(
            api.post("/organizer/profile/logo", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
        );
    },
    removeLogo: () => request(api.delete("/organizer/profile/logo")),

    // Social Links
    getSocialLinks: () => request(api.get("/organizer/social-links")),
    saveSocialLink: (data) => request(api.post("/organizer/social-links", data)),
    deleteSocialLink: (id) => request(api.delete(`/organizer/social-links/${id}`)),
    deleteSocialLinkByPlatform: (platform) => request(api.delete(`/organizer/social-links/platform/${platform}`)),

    // Notification Preferences
    getNotificationPreferences: () => request(api.get("/organizer/notification-preferences")),
    updateNotificationPreferences: (data) => request(api.put("/organizer/notification-preferences", data)),

    // Events Management
    getMyEvents: () => request(api.get("/events/my-events")),
    createEvent: (data) => request(api.post("/events", data)),
    updateEvent: (id, data) => request(api.put(`/events/${id}`, data)),
    deleteEvent: (id) => request(api.delete(`/events/${id}`)),

    // Registrations
    getEventRegistrations: (eventId) => request(api.get(`/event-registrations/events/${eventId}/students`)),

    // Project Submissions
    getEventProjectSubmissions: (eventId) => request(api.get(`/project-submissions/events/${eventId}`)),

    // Security / Password
    requestPasswordChange: () => request(api.post("/auth/change-password-request")),
};
