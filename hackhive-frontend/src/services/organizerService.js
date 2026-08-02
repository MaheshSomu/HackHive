import api from "../api/axios";

async function request(promise) {
    const response = await promise;
    return response.data?.data ?? response.data;
}

export const organizerService = {
    // Profile
    getProfile: () => request(api.get("/organizer/profile")),
    updateProfile: (data) => request(api.put("/organizer/profile", data)),

    // Events Management
    getMyEvents: () => request(api.get("/events/my-events")),
    createEvent: (data) => request(api.post("/events", data)),
    updateEvent: (id, data) => request(api.put(`/events/${id}`, data)),
    deleteEvent: (id) => request(api.delete(`/events/${id}`)),

    // Registrations
    getEventRegistrations: (eventId) => request(api.get(`/event-registrations/events/${eventId}/students`)),
};
