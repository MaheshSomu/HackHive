import api from "../api/axios";

async function request(promise) {
    const response = await promise;
    return response.data?.data ?? response.data;
}

export const workspaceService = {
    // Kanban Tasks
    createTask: (data) => request(api.post("/kanban-tasks", data)),
    getTaskById: (taskId) => request(api.get(`/kanban-tasks/${taskId}`)),
    getTeamTasks: (teamId) => request(api.get(`/kanban-tasks/team/${teamId}`)),
    getTeamTasksByStatus: (teamId, status) => request(api.get(`/kanban-tasks/team/${teamId}/status?status=${encodeURIComponent(status)}`)),
    getMyTasks: () => request(api.get("/kanban-tasks/my-tasks")),
    updateTask: (taskId, data) => request(api.put(`/kanban-tasks/${taskId}`, data)),
    deleteTask: (taskId) => request(api.delete(`/kanban-tasks/${taskId}`)),

    // Team Resources
    createResource: (data) => request(api.post("/team-resources", data)),
    getResourceById: (resourceId) => request(api.get(`/team-resources/${resourceId}`)),
    getTeamResources: (teamId) => request(api.get(`/team-resources/team/${teamId}`)),
    getTeamResourcesByType: (teamId, type) => request(api.get(`/team-resources/team/${teamId}/type?resourceType=${encodeURIComponent(type)}`)),
    updateResource: (resourceId, data) => request(api.put(`/team-resources/${resourceId}`, data)),
    deleteResource: (resourceId) => request(api.delete(`/team-resources/${resourceId}`)),
};
