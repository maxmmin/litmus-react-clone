import ErrorResponse, {ApplicationError} from "../../rest/ErrorResponse";
import {BasicHttpError, HttpErrorParser} from "../../error/BasicHttpError";
import deepCopy from "../../util/deepCopy";
import {AxiosError} from "axios";

export default function handleRequestError (e: unknown): ApplicationError {
        console.error(e);
        if (e instanceof AxiosError) {
                return deepCopy(HttpErrorParser.parseAxiosError(e));
        } else return deepCopy(HttpErrorParser.parseError(e));
}