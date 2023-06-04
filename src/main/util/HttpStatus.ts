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
    responseJson?: ErrorResponse;
}

export type ErrorResponse = {
    errorDetails: object
}

class BasicHttpError implements HttpError {
    responseJson?: ErrorResponse;
    status: HttpStatus;

    constructor(status: HttpStatus, response?: ErrorResponse) {
        this.responseJson = response;
        this.status = status;
    }

    static async getHttpErrorResponse(response: Response): Promise<ErrorResponse|undefined> {
        try {
            return await response.json() as ErrorResponse;
        }
        catch (e) {
            return undefined;
        }
    }
}

export {BasicHttpError};