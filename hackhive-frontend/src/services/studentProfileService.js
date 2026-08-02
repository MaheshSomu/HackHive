import api from "../api/axios";

// Helper to unpack API response
async function request(promise) {
    const response = await promise;
    return response.data?.data ?? response.data;
}

export const studentProfileService = {
    // 1. Personal Information
    getProfile: () => request(api.get("/student/profile")),
    updateProfile: (data) => request(api.put("/student/profile", data)),

    // 2. Skills
    getSkills: () => request(api.get("/student/skills")),
    addSkill: (data) => request(api.post("/student/skills", data)),
    updateSkill: (id, data) => request(api.put(`/student/skills/${id}`, data)),
    deleteSkill: (id) => request(api.delete(`/student/skills/${id}`)),

    // 3. Education
    getEducation: () => request(api.get("/student/education")),
    addEducation: (data) => request(api.post("/student/education", data)),
    updateEducation: (id, data) => request(api.put(`/student/education/${id}`, data)),
    deleteEducation: (id) => request(api.delete(`/student/education/${id}`)),

    // 4. Experience
    getExperiences: () => request(api.get("/student/experiences")),
    addExperience: (data) => request(api.post("/student/experiences", data)),
    updateExperience: (id, data) => request(api.put(`/student/experiences/${id}`, data)),
    deleteExperience: (id) => request(api.delete(`/student/experiences/${id}`)),

    // 5. Projects
    getProjects: () => request(api.get("/student/projects")),
    addProject: (data) => request(api.post("/student/projects", data)),
    updateProject: (id, data) => request(api.put(`/student/projects/${id}`, data)),
    deleteProject: (id) => request(api.delete(`/student/projects/${id}`)),

    // 6. Certifications
    getCertifications: () => request(api.get("/student/certifications")),
    addCertification: (data) => request(api.post("/student/certifications", data)),
    updateCertification: (id, data) => request(api.put(`/student/certifications/${id}`, data)),
    deleteCertification: (id) => request(api.delete(`/student/certifications/${id}`)),

    // 7. Social Links
    getSocialLinks: () => request(api.get("/student/social-links")),
    addSocialLink: (data) => request(api.post("/student/social-links", data)),
    updateSocialLink: (id, data) => request(api.put(`/student/social-links/${id}`, data)),
    deleteSocialLink: (id) => request(api.delete(`/student/social-links/${id}`)),

    // 8. Resume
    getResume: () => request(api.get("/student/resume")),
    uploadResume: (file) => {
        const formData = new FormData();
        formData.append("file", file);
        return request(
            api.post("/student/resume", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            })
        );
    },
    deleteResume: () => request(api.delete("/student/resume")),
};
