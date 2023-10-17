interface ErrorResponse<T> {
    status: number;
    error: string;
    detail: T|null;
}

export interface ApplicationError<T> extends ErrorResponse<T>{
    code: string|null
}

export default ErrorResponse;
