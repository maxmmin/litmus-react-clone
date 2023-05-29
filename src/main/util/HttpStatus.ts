// names of this errors will be acting like actions //
export enum HttpStatus {
    UNAUTHENTICATED=401,
    BAD_REQUEST=400,
    UNKNOWN_ERROR=-1,
    NOT_FOUND=404,
    FORBIDDEN=403
}

export const noInfoMessage = "Інформація відсутня"

export interface HttpError {
    status: HttpStatus;
    responseJson?: ErrJson;
}

export type ErrJson = {
    errorDetails: object
}

class BasicHttpError implements HttpError {
    responseJson?: ErrJson;
    status: HttpStatus;

    constructor(status: HttpStatus, response?: ErrJson) {
        this.responseJson = response;
        this.status = status;
    }
}

export {BasicHttpError};