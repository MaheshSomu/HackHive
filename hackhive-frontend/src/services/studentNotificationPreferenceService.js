import api from "../api/axios";

export const studentNotificationPreferenceService = {
    getPreferences: async () => {
        const response = await api.get("/student/notification-preferences");
        return response.data?.data ?? response.data;
    },

    updatePreferences: async (payload) => {
        const response = await api.put("/student/notification-preferences", payload);
        return response.data?.data ?? response.data;
    },
};

export default studentNotificationPreferenceService;
