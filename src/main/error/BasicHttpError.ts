import ErrorResponse from "../rest/ErrorResponse";
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

    static formErrorDescription(error: ErrorResponse<unknown>): string {
        return `Error ${error.status}: ${error.title}`
    }

    static async parseResponse(response: Response): Promise<ErrorResponse<unknown>> {
        try {
            const body = await response.json();

            return BasicHttpError.parseError(body);
        }
        catch (e) {
            return BasicHttpError.parseError(null);
        }

    }

    static parseError(err: any): ErrorResponse<unknown> {
        let status: number = -1;
        let title: string = 'Unknown error';
        let detail: any = null;

        if (err) {
            if ("status" in err) {
                status = err["status"];
            }

            if ("title" in err) {
                title = err["title"];
            } else if ("error" in err) {
                title = err["error"];
            }   else if ("message" in err) {
                title = err.message;
            }

            if ("detail" in err) {
                detail = err["detail"];
            }
        }
        return {status, title, detail};
    }
}

export {BasicHttpError};