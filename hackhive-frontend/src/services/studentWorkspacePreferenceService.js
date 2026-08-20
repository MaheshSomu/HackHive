import api from "../api/axios";

export const studentWorkspacePreferenceService = {
    getPreferences: async () => {
        const response = await api.get("/student/workspace-preferences");
        return response.data?.data ?? response.data;
    },

    updatePreferences: async (payload) => {
        const response = await api.put("/student/workspace-preferences", payload);
        return response.data?.data ?? response.data;
    },
};

export default studentWorkspacePreferenceService;
