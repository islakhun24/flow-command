import {handleResponse} from "./handleResponse";
import {HttpStatusCode} from "./response.type";

export const ResponseHelper = {
    ok<T>(data?: T, message = "OK") {
        return handleResponse(HttpStatusCode.OK, message, { data })
    },

    created<T>(data?: T, message = "Created") {
        return handleResponse(HttpStatusCode.CREATED, message, { data })
    },

    badRequest(message = "Bad Request", error?: any) {
        return handleResponse(HttpStatusCode.BAD_REQUEST, message, { error })
    },

    unauthorized(message = "Unauthorized") {
        return handleResponse(HttpStatusCode.UNAUTHORIZED, message)
    },

    forbidden(message = "Forbidden") {
        return handleResponse(HttpStatusCode.FORBIDDEN, message)
    },

    notFound(message = "Not Found") {
        return handleResponse(HttpStatusCode.NOT_FOUND, message)
    },

    conflict(message = "Conflict", error?: any) {
        return handleResponse(HttpStatusCode.CONFLICT, message, { error })
    },

    unprocessable(message = "Unprocessable Entity", error?: any) {
        return handleResponse(HttpStatusCode.UNPROCESSABLE, message, { error })
    },

    error(message = "Internal Server Error", error?: any) {
        return handleResponse(HttpStatusCode.INTERNAL_SERVER_ERROR, message, { error })
    }
}
