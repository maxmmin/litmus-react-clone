interface ErrorResponse<T> {
    status: number;
    title: string;
    detail: T|null;
};

export default ErrorResponse;