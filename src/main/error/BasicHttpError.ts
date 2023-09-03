import ErrorResponse, {ApplicationError} from "../rest/ErrorResponse";
import {AxiosError} from "axios/index";
export const noInfoMessage = "Інформація відсутня"

class BasicHttpError<D> extends Error implements ErrorResponse<D> {
    public readonly detail: D | null;
    public readonly status: number;
    public readonly title: string;

    public getDescription () {
        let detail: string|null = null;

        if (this.detail && typeof this.detail === 'string') {
            detail = this.detail;
        }

        let msg = `Error ${this.status}: ${this.title}`;

        if (detail) msg+=` - ${detail.toLowerCase()}`;

        return msg;
    };


    constructor(errorResponse: ErrorResponse<D>) {
        super("Error "+errorResponse.status+" "+errorResponse.title)
        this.detail = errorResponse.detail;
        this.status = errorResponse.status;
        this.title = errorResponse.title;
    }
}

class HttpErrorParser {
    private static getErrorResponse(err: unknown): ErrorResponse<unknown> {
        let status: number = -1;
        let title: string = 'Unknown error';
        let detail: unknown = null;

        if (err&&typeof err === "object") {
            if ("status" in err) {
                status = err["status"] as number;
            }

            if ("title" in err) {
                title = err["title"] as string;
            } else if ("error" in err) {
                title = err["error"] as string;
            }   else if ("message" in err) {
                title = err.message as string;
            }

            if ("detail" in err) {
                detail = err["detail"];
            }
        }

        return {status, title, detail};
    }

    static formErrorDescription(error: ErrorResponse<unknown>): string {
        return `Error ${error.status}: ${error.title}`
    }

    static parseError(error: unknown): ApplicationError<unknown> {
        const errResponse: ErrorResponse<unknown> = this.getErrorResponse(error);
        let code: string|null = null;

        if (error&&typeof error === "object") {
            if ("code" in error) {
                code = ''+error;
            }
        }

        return {
            ...errResponse,
            code: code
        }
    }

    static parseAxiosError(error: AxiosError<ErrorResponse<unknown>>): ApplicationError<unknown> {
        let errCode: string|null = error.code?error.code:null;
        let errStatus: number = error.status?error.status:-1;
        let errorResponse: ErrorResponse<unknown>|undefined = this.getErrorResponse(error.response);

        return {
            ...errorResponse,
            code: errCode,
            status: errStatus
        }
    }
}

export {BasicHttpError, HttpErrorParser};