import api from "../api/axios";

export const login = async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    return response.data;
};

export const register = async (payload) => {
    const response = await api.post("/auth/register", payload);
    return response.data;
};

export const getCurrentUser = async () => {
    const response = await api.get("/auth/me");
    return response.data;
};

export const forgotPassword = async (email) => {
    const response = await api.post("/auth/forgot-password", { email });
    return response.data;
};

export const resetPassword = async (payload) => {
    const response = await api.post("/auth/reset-password", payload);
    return response.data;
};

export const resendVerificationEmail = async (email) => {
    const response = await api.post("/auth/resend-verification", { email });
    return response.data;
};

export const verifyEmailToken = async (token) => {
    const response = await api.get("/auth/verify-email", { params: { token } });
    return response.data;
};

export const completeOAuthRegistration = async (payload) => {
    const response = await api.post("/auth/oauth/complete-registration", payload);
    return response.data;
};

export const requestPasswordChange = async () => {
    const response = await api.post("/auth/change-password-request");
    return response.data;
};

export const requestAccountReactivation = async (email) => {
    const response = await api.post("/auth/request-account-reactivation", { email });
    return response.data;
};

export const reactivateAccount = async (token) => {
    const response = await api.post(`/auth/reactivate-account?token=${encodeURIComponent(token)}`);
    return response.data;
};




