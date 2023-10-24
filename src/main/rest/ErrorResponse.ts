export type Properties = Record<string, unknown>

interface ErrorResponse {
    status: number;
    error: string|null;
    type: string|null;
    detail: string|null;
    properties: Properties|null
}

export type ValidationErrorResponseProperties<ServerValidationObject> = Properties&{
    validationErrors: ServerValidationObject
}

export type ValidationErrorResponse<ServerValidationObject> = Omit<ErrorResponse, "properties"> & {
    properties: ValidationErrorResponseProperties<ServerValidationObject>
}

export interface ApplicationError extends ErrorResponse {
    code: string|null
}

export default ErrorResponse;
