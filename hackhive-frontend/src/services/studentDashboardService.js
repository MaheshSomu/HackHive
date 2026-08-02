import api from "../api/axios";

async function requestData(path) {
    const response = await api.get(path);
    return response.data.data;
}

export const studentDashboardService = {
    getProfile: () => requestData("/student/profile"),
    getEvents: () => requestData("/events"),
    getRegistrations: () => requestData("/event-registrations/my-registrations"),
    getTeams: () => requestData("/teams/my-teams"),
    getResume: () => requestData("/student/resume"),
    getSkills: () => requestData("/student/skills"),
    getProjects: () => requestData("/student/projects"),
    getCertifications: () => requestData("/student/certifications"),
    getEducation: () => requestData("/student/education"),
    getExperiences: () => requestData("/student/experiences"),
    getSocialLinks: () => requestData("/student/social-links"),
};
