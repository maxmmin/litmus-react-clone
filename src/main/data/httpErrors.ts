// names of this errors will be acting like actions //
enum HttpErrorsNames {
    UNAUTHENTICATED="UNAUTHENTICATED",
    BAD_CREDENTIALS="BAD_CREDENTIALS",
    UNKNOWN_ERROR="UNKNOWN_ERROR",
    NOT_FOUND="NOT_FOUND",
    FORBIDDEN="FORBIDDEN"
}

export const noInfoMessage = "Інформація відсутня"

type HttpErrors = Record<number,HttpErrorsNames>

const httpErrors: HttpErrors = {
    401: HttpErrorsNames.UNAUTHENTICATED,
    400: HttpErrorsNames.BAD_CREDENTIALS,
    403: HttpErrorsNames.FORBIDDEN,
    404: HttpErrorsNames.NOT_FOUND,
}

interface HttpErrorInterface {
    type: HttpErrorsNames;
    responseJson?: ErrJson;
    status: number;
}

export type ErrJson = {
    errorDetails: object
}

class HttpError implements HttpErrorInterface {
    type: HttpErrorsNames;
    responseJson?: ErrJson;
    status: number;

    constructor(status: number, error: HttpErrorsNames, response?: ErrJson) {
        this.type = error;
        this.responseJson = response;
        this.status = status;
    }
}

export {HttpError, httpErrors, HttpErrorsNames}