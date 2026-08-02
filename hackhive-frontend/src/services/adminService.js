import api from "../api/axios";

async function request(promise) {
    const response = await promise;
    return response.data?.data ?? response.data;
}

export const adminService = {
    // Dashboard Stats
    getDashboardStatistics: () => request(api.get("/admin/dashboard")),

    // User Management
    getAllUsers: () => request(api.get("/admin/users")),
    getUserById: (userId) => request(api.get(`/admin/users/${userId}`)),
    getUsersByRole: (role) => request(api.get(`/admin/users/role/${role}`)),
    enableUser: (userId) => request(api.patch(`/admin/users/${userId}/enable`)),
    disableUser: (userId) => request(api.patch(`/admin/users/${userId}/disable`)),

    // Organizer Management
    getAllOrganizers: () => request(api.get("/admin/organizers")),
    getOrganizerById: (organizerProfileId) => request(api.get(`/admin/organizers/${organizerProfileId}`)),

    // Hackathon Management
    getAllHackathons: () => request(api.get("/admin/hackathons")),
    getHackathonById: (hackathonId) => request(api.get(`/admin/hackathons/${hackathonId}`)),
    deleteHackathon: (hackathonId) => request(api.delete(`/admin/hackathons/${hackathonId}`)),

    // Team Oversight
    getAllTeams: () => request(api.get("/admin/teams")),
    getTeamById: (teamId) => request(api.get(`/admin/teams/${teamId}`)),

    // Registration Oversight
    getAllRegistrations: () => request(api.get("/admin/registrations")),
    getRegistrationById: (registrationId) => request(api.get(`/admin/registrations/${registrationId}`)),
};
