import { useCallback, useEffect, useMemo, useState } from "react";
import { getCurrentUser, login as loginApi, register as registerApi } from "../services/authService";
import AuthContext from "./authContextValue";
import { storage } from "../utils/storage";

function AuthProvider({ children }) {
    const [user, setUser] = useState(() => storage.getUser());
    const [token, setToken] = useState(() => storage.getToken());
    const [loading, setLoading] = useState(false);
    const [initializing, setInitializing] = useState(true);

    useEffect(() => {
        let isMounted = true;
        const storedToken = storage.getToken();

        const hydrateSession = async () => {
            if (!storedToken) {
                if (isMounted) {
                    storage.clear();
                    setUser(null);
                    setInitializing(false);
                }
                return;
            }

            try {
                const response = await getCurrentUser();

                if (!isMounted) {
                    return;
                }

                setUser(response.data);
            } catch {
                storage.clear();
                if (isMounted) {
                    setUser(null);
                    setToken(null);
                }
            } finally {
                if (isMounted) {
                    setInitializing(false);
                }
            }
        };

        hydrateSession();

        return () => {
            isMounted = false;
        };
    }, []);

    const persistAuth = useCallback((auth, remember = true) => {
        storage.setAuth(
            {
                token: auth.accessToken,
                user: auth,
            },
            remember
        );
        setToken(auth.accessToken);
        setUser(auth);
    }, []);

    const login = useCallback(async (credentials, options = {}) => {
        try {
            setLoading(true);

            const response = await loginApi(credentials);
            const auth = response.data;

            persistAuth(auth, options.remember ?? true);
            return auth;
        } finally {
            setLoading(false);
        }
    }, [persistAuth]);

    const register = useCallback(async (payload) => {
        try {
            setLoading(true);
            const response = await registerApi(payload);
            return response;
        } finally {
            setLoading(false);
        }
    }, []);

    const logout = useCallback(() => {
        storage.clear();
        setToken(null);
        setUser(null);
    }, []);

    const value = useMemo(() => ({
        user,
        token,
        loading,
        initializing,
        isAuthenticated: Boolean(user && token),
        login,
        register,
        logout,
        refreshSession: async () => {
            const response = await getCurrentUser();
            setUser(response.data);
            return response.data;
        }
    }), [user, token, loading, initializing, login, register, logout]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;