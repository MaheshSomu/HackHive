import api from "../api/axios";

async function request(promise) {
    const response = await promise;
    return response.data?.data ?? response.data;
}

export const projectSubmissionService = {
    createProjectSubmission: (data) => request(api.post("/project-submissions", data)),
    getProjectSubmission: (teamId) => request(api.get(`/project-submissions/team/${teamId}`)),
    updateProjectSubmission: (submissionId, data) => request(api.put(`/project-submissions/${submissionId}`, data)),
    submitProjectSubmission: (submissionId) => request(api.post(`/project-submissions/${submissionId}/submit`)),
    getEventProjectSubmissions: (eventId) => request(api.get(`/project-submissions/events/${eventId}`)),
};

export default projectSubmissionService;
