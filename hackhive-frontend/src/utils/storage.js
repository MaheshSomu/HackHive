const TOKEN_KEY = "token";
const USER_KEY = "user";

const readStoredValue = (key) => {
    const localValue = localStorage.getItem(key);

    if (localValue !== null) {
        return localValue;
    }

    return sessionStorage.getItem(key);
};

const writeStoredValue = (key, value, remember) => {
    const preferredStorage = remember ? localStorage : sessionStorage;
    const fallbackStorage = remember ? sessionStorage : localStorage;

    preferredStorage.setItem(key, value);
    fallbackStorage.removeItem(key);
};

export const storage = {
    setToken(token, remember = true) {
        writeStoredValue(TOKEN_KEY, token, remember);
    },

    getToken() {
        return readStoredValue(TOKEN_KEY);
    },

    removeToken() {
        localStorage.removeItem(TOKEN_KEY);
        sessionStorage.removeItem(TOKEN_KEY);
    },

    setUser(user, remember = true) {
        writeStoredValue(USER_KEY, JSON.stringify(user), remember);
    },

    getUser() {
        const user = readStoredValue(USER_KEY);

        if (!user) {
            return null;
        }

        try {
            return JSON.parse(user);
        } catch {
            return null;
        }
    },

    setAuth({ token, user }, remember = true) {
        this.setToken(token, remember);
        this.setUser(user, remember);
    },

    clear() {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        sessionStorage.removeItem(TOKEN_KEY);
        sessionStorage.removeItem(USER_KEY);
    }
};