import api from "../api/axios";

async function request(promise) {
    const response = await promise;
    return response.data?.data ?? response.data;
}

export const projectResultService = {
    configureResult: (eventId, data) =>
        request(api.post(`/project-results/events/${eventId}`, data)),

    getEventLeaderboardForOrganizer: (eventId) =>
        request(api.get(`/project-results/events/${eventId}`)),

    updateResult: (resultId, data) =>
        request(api.put(`/project-results/${resultId}`, data)),

    publishResult: (resultId) =>
        request(api.post(`/project-results/${resultId}/publish`)),

    publishAllResultsForEvent: (eventId) =>
        request(api.post(`/project-results/events/${eventId}/publish-all`)),

    getPublishedResultsForEvent: (eventId) =>
        request(api.get(`/project-results/events/${eventId}/published`)),

    getPublishedResultForTeam: (teamId) =>
        request(api.get(`/project-results/team/${teamId}/published`)),
};

export default projectResultService;
