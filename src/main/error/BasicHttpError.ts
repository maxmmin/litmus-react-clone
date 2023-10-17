import ErrorResponse, {ApplicationError} from "../rest/ErrorResponse";
import {AxiosError} from "axios";

export const noInfoMessage = "Інформація відсутня"

class BasicHttpError<D> extends Error implements ApplicationError<D> {
    public readonly detail: D | null;
    public readonly status: number;
    public readonly error: string;
    code: string | null;

    public getDescription () {
        let detail: string|null = null;

        if (this.detail && typeof this.detail === 'string') {
            detail = this.detail;
        }

        let msg = `Error ${this.status}: ${this.error}`;

        if (detail) msg+=` - ${detail.toLowerCase()}`;

        return msg;
    };


    constructor(error: ApplicationError<D>) {
        super("Error "+error.status+" "+error.error)
        this.detail = error.detail;
        this.status = error.status;
        this.error = error.error;
        this.code = error.code;
    }
}

class HttpErrorParser {
    private static getErrorResponse(err: unknown): ErrorResponse<unknown> {
        let status: number = -1;
        let error: string = 'Unknown error';
        let detail: unknown = null;

        if (err&&typeof err === "object") {
            if ("status" in err) {
                status = err["status"] as number;
            }

            if ("error" in err) {
                error = err["error"] as string;
            } else if ("message" in err) {
                error = err.message as string;
            }

            if ("detail" in err) {
                detail = err["detail"];
            }
        }

        return {status, error: error, detail};
    }

    static formErrorDescription(error: ErrorResponse<unknown>): string {
        return `Error ${error.status}: ${error.error}`
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

    static parseAxiosError(error: AxiosError): ApplicationError<unknown> {
        let errCode: string|null = error.code?error.code:null;
        let errStatus: number = -1;
        if (error.response?.status) errStatus = error.response.status;
        let errorResponse: ErrorResponse<unknown>|undefined = this.getErrorResponse(error.response?.data);

        return {
            ...errorResponse,
            code: errCode,
            status: errStatus
        }
    }
}

export {BasicHttpError, HttpErrorParser};