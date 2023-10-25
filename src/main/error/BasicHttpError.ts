import ErrorResponse, {ApplicationError, Properties} from "../rest/ErrorResponse";
import {AxiosError} from "axios";

export const noInfoMessage = "Інформація відсутня"

class BasicHttpError extends Error implements ApplicationError {
    code: string | null;
    detail: string | null;
    error: string | null;
    properties: Properties | null;
    status: number;
    type: string | null;


    public getDescription () {
        let msg = "Помилка "+this.status;

        let desc = this.detail||this.error||'невідома помилка';

        msg += `: ${desc}`

        return msg;
    };


    constructor(error: ApplicationError) {
        super(`Помилка ${error.status}: ${error.detail||error.error}`)
        this.detail = error.detail;
        this.properties = error.properties;
        this.type = error.type;
        this.status = error.status;
        this.error = error.error;
        this.code = error.code;
    }
}

class HttpErrorParser {
    private static getErrorResponse(err: unknown): ErrorResponse {
        let status: number = -1;

        let error: ErrorResponse["error"] = null;
        let detail: ErrorResponse["detail"] = null;
        let properties: ErrorResponse['properties'] = null;
        let type: ErrorResponse['type'] = null;

        if (err&&typeof err === "object") {
            if ("status" in err) {
                status = err["status"] as ErrorResponse['status'];
            }

            if ("error" in err) {
                error = err["error"] as ErrorResponse['error'];
            }

            if ("detail" in err) {
                detail = err["detail"] as ErrorResponse['detail'];
            } if ("message" in err) {
                detail = err["message"] as ErrorResponse['detail']
            }

            if ("properties" in err) {
                properties = err["properties"] as ErrorResponse['properties'];
            }

            if ("type" in err) {
                type = err["type"] as ErrorResponse['type'];
            }
        }

        return {status, error: error, detail: detail, properties: properties, type: type};
    }

    static getErrorDescription(error: ErrorResponse): string {
        let msg = "Помилка "+error.status;

        let desc = error.detail||error.error||'невідома помилка';

        msg += `: ${desc}`

        return msg;
    }

    static parseError(error: unknown): ApplicationError {
        const errResponse: ErrorResponse = this.getErrorResponse(error);
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

    static parseAxiosError(error: AxiosError): ApplicationError {
        let errCode: string|null = error.code?error.code:null;
        let errStatus: number = -1;
        if (error.response?.status) errStatus = error.response.status;
        let errorResponse: ErrorResponse|undefined = this.getErrorResponse(error.response?.data);

        return {
            ...errorResponse,
            code: errCode,
            status: errStatus
        }

    }
}

export {BasicHttpError, HttpErrorParser};