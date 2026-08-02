export function getApiErrorMessage(error, fallback = "Something went wrong. Please try again.") {
    const responseMessage = error?.response?.data?.message;

    if (responseMessage) {
        return responseMessage;
    }

    if (error?.message) {
        return error.message;
    }

    return fallback;
}
