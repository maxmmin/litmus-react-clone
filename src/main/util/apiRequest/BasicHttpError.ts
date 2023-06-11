import ErrorResponse from "./ErrorResponse";
export const noInfoMessage = "Інформація відсутня"

class BasicHttpError<D> extends Error implements ErrorResponse<D> {
    public readonly detail: D | null;
    public readonly status: number;
    public readonly title: string;


    constructor(status: number, title: string, detail: D | null = null) {
        super("Error "+status+" "+title)
        this.detail = detail;
        this.status = status;
        this.title = title;
    }

    static async getHttpErrorFromResponse(response: Response): Promise<ErrorResponse<any>|null> {
        let status: number = -1;
        let title: string = 'Unknown error';
        let detail: any = null;

        try {
            const body = await response.json();
            console.log(body)
            if ("status" in body) {
                status = body["status"];
            }

            if ("title" in body) {
                title = body["title"];
            } else if ("error" in body) {
                title = body["error"];
            }

            if ("detail" in body) {
                detail = body["detail"];
            }

        }
        finally {
            return new BasicHttpError(status,title,detail)
        }
    }
}

export const getErrMessage = (e: any): string|null => {
    if (e instanceof BasicHttpError || ("title" in e && "status" in e)) {
        return `Error ${e.status}: ${e.title}`
    } else if (e instanceof Error) {
        return  e.message;
    }   else return null;
}

export {BasicHttpError};