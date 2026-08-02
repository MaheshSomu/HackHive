import api from "../api/axios";

async function request(promise) {
    const response = await promise;
    return response.data?.data ?? response.data;
}

export const eventService = {
    // Get all events
    getAllEvents: () => request(api.get("/events")),

    // Get single event by ID
    getEventById: (id) => request(api.get(`/events/${id}`)),

    // Search events by title
    searchByTitle: (title) => request(api.get(`/events/search/title?title=${encodeURIComponent(title)}`)),

    // Search events by college name
    searchByCollege: (collegeName) => request(api.get(`/events/search/college?collegeName=${encodeURIComponent(collegeName)}`)),

    // Student Registrations
    getMyRegistrations: () => request(api.get("/event-registrations/my-registrations")),
    registerForEvent: (eventId) => request(api.post(`/event-registrations/events/${eventId}`)),
    cancelRegistration: (eventId) => request(api.delete(`/event-registrations/events/${eventId}`)),
};
