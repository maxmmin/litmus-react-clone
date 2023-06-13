interface ErrorResponse<T extends object> {
    status: number;
    title: string;
    detail: T|null;
};

export default ErrorResponse;