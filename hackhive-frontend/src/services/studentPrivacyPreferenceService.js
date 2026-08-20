import api from "../api/axios";

export const studentPrivacyPreferenceService = {
    getPreferences: async () => {
        const response = await api.get("/student/privacy-preferences");
        return response.data?.data ?? response.data;
    },

    updatePreferences: async (payload) => {
        const response = await api.put("/student/privacy-preferences", payload);
        return response.data?.data ?? response.data;
    },
};

export default studentPrivacyPreferenceService;
