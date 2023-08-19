import ErrorResponse from "../../rest/ErrorResponse";
import {BasicHttpError, HttpErrorParser} from "../../error/BasicHttpError";
import deepCopy from "../../util/deepCopy";

export default function handleCreationError (e: unknown): ErrorResponse<unknown> {
        console.error(e);
        const error = HttpErrorParser.parseError(e);
        return deepCopy(error);
}