import ErrorResponse from "./ErrorResponse";
import {types} from "sass";
import Error = types.Error;
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
        try {
            const body = await response.json();
            if ("title" in body && "status" in body) {
                return body as ErrorResponse<any>;
            } else return null;
        }

        catch (e) {
            return null;
        }
    }
}

export {BasicHttpError};