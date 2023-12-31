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
            } else if ("message" in err) {
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

    static getErrorDescription(error: ApplicationError): string {
        let msg = "Помилка "+error.status;

        let desc = error.detail||error.error||error.code||'невідома помилка';

        msg += `: ${desc}`

        return msg;
    }

    private static isAxiosError(error: unknown): error is AxiosError {
        if (error instanceof AxiosError) {
            return true;
        } else return typeof error === "object" && error !== null && error.hasOwnProperty("name") && (error as AxiosError).name === "AxiosError";
    }

    static parseError(error: unknown): ApplicationError {
        let errResponse: ErrorResponse;
        if (this.isAxiosError(error)) {
            errResponse = HttpErrorParser.parseAxiosError(error);
        } else errResponse = this.getErrorResponse(error);

        let code: string|null = null;

        if (error&&typeof error === "object") {
            if ("code" in error) {
                code = error["code"] as string;
            }
        }

        return {
            ...errResponse,
            code: code
        }
    }

    private static parseAxiosError(error: AxiosError): ApplicationError {
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