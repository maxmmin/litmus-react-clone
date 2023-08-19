export enum HttpMethod {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE',
    PATCH = 'PATCH',
}

export enum ContentType {
    TEXT = 'text/plain',
    MULTIPART = 'multipart/form-data',
    JSON = 'application/json',
    XML = 'application/xml',
    HTML = 'text/html',
    CSS = 'text/css',
    CSV = 'text/csv',
    JS = 'application/javascript',
    PDF = 'application/pdf',
    IMAGE_JPEG = 'image/jpeg',
    IMAGE_PNG = 'image/png',
    UNSET='UNSET'
}

export default interface ApiRequestManager {
    url(url: string): ApiRequestManager;
    header(key: string, value?: string): ApiRequestManager;
    contentType(contentType: ContentType): ApiRequestManager;
    queryParam(key: string, value: string): ApiRequestManager;
    method(method: HttpMethod): ApiRequestManager;
    body(body: BodyInit): ApiRequestManager;
    authentication(token: string): ApiRequestManager;
    reset(): ApiRequestManager;
    fetch(): Promise<Response>
    fetchWithParams(url: string, params: RequestInit): Promise<Response>;
}


