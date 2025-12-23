import {ApiResponse, HttpStatusCode} from "./response.type";

export function handleResponse<T>(
    statusCode: HttpStatusCode,
    message: string,
    options?: {
        data?: T
        error?: any
        meta?: Record<string, any>
    }
): ApiResponse<T> {
    const success = statusCode >= 200 && statusCode < 300

    return {
        success,
        statusCode,
        message,
        data: success ? options?.data : undefined,
        error: success ? undefined : options?.error,
        meta: options?.meta,
        timestamp: Date.now()
    }
}
