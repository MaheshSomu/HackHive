import axios from "axios";
import { storage } from "../utils/storage";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use((config) => {
    const token = storage.getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Token expired or invalid
            const isAuthEndpoint = error.config?.url?.includes("/auth/");
            if (!isAuthEndpoint) {
                storage.clearAuthData();
                if (window.location.pathname !== "/") {
                    window.location.href = "/";
                }
            }
        }
        return Promise.reject(error);
    }
);

export default api;