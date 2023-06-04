export enum HttpMethod {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE',
    PATCH = 'PATCH',
}

export default interface ApiRequestManager {
    url(url: string): ApiRequestManager;
    setQueryParam(key: string, value: string): ApiRequestManager;
    method(method: HttpMethod): ApiRequestManager;
    body(body: BodyInit): ApiRequestManager;
    token(token: string): ApiRequestManager;
    reset(): ApiRequestManager;
    fetch(): Promise<Response>
    fetchWithParams(url: string, params: RequestInit): Promise<Response>;
}


