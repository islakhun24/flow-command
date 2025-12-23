export enum HttpStatusCode {
    OK = 200,
    CREATED = 201,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    CONFLICT = 409,
    UNPROCESSABLE = 422,
    INTERNAL_SERVER_ERROR = 500
}

export type ApiResponse<T = unknown> = {
    success: boolean
    statusCode: number
    message: string
    data?: T
    error?: any
    meta?: Record<string, any>
    timestamp: number
}
