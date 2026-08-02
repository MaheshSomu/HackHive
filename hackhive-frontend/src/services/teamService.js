import api from "../api/axios";

async function request(promise) {
    const response = await promise;
    return response.data?.data ?? response.data;
}

export const teamService = {
    // Teams CRUD
    createTeam: (data) => request(api.post("/teams", data)),
    updateTeam: (teamId, data) => request(api.put(`/teams/${teamId}`, data)),
    deleteTeam: (teamId) => request(api.delete(`/teams/${teamId}`)),
    getTeamById: (teamId) => request(api.get(`/teams/${teamId}`)),
    getAllTeams: () => request(api.get("/teams")),
    getMyTeams: () => request(api.get("/teams/my-teams")),
    getOpenTeams: () => request(api.get("/teams/open")),
    getTeamsByEvent: (eventId) => request(api.get(`/teams/event/${eventId}`)),
    getTeamMembers: (teamId) => request(api.get(`/teams/${teamId}/members`)),
    leaveTeam: (teamId) => request(api.delete(`/teams/${teamId}/leave`)),
    removeMember: (teamId, studentProfileId) => request(api.delete(`/teams/${teamId}/members/${studentProfileId}`)),

    // Team Join Requests
    sendJoinRequest: (teamId) => request(api.post(`/team-join-requests/teams/${teamId}`)),
    getMyJoinRequests: () => request(api.get("/team-join-requests/my-requests")),
    cancelJoinRequest: (requestId) => request(api.delete(`/team-join-requests/${requestId}`)),
    getTeamJoinRequests: (teamId) => request(api.get(`/team-join-requests/teams/${teamId}`)),
    approveJoinRequest: (requestId) => request(api.put(`/team-join-requests/${requestId}/approve`)),
    rejectJoinRequest: (requestId) => request(api.put(`/team-join-requests/${requestId}/reject`)),
};
