export const getImageUrl = (url) => {
    if (!url) return "";
    if (
        url.startsWith("http://") ||
        url.startsWith("https://") ||
        url.startsWith("blob:") ||
        url.startsWith("data:")
    ) {
        return url;
    }
    const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";
    const origin = baseUrl.replace(/\/api\/?$/, "");
    return url.startsWith("/") ? `${origin}${url}` : `${origin}/${url}`;
};
