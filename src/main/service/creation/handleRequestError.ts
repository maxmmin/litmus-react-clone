import ErrorResponse, {ApplicationError} from "../../rest/ErrorResponse";
import {BasicHttpError, HttpErrorParser} from "../../error/BasicHttpError";
import deepCopy from "../../util/functional/deepCopy";
import {AxiosError} from "axios";

export default function handleRequestError (e: unknown): ApplicationError {
        console.error(e);
        return HttpErrorParser.parseError(e);
}