import ErrorResponse from "../../rest/ErrorResponse";
import {BasicHttpError} from "../../error/BasicHttpError";
import deepCopy from "../../util/deepCopy";

export default function handleCreationError (e: unknown): ErrorResponse<unknown> {
        console.error(e);
        const error = BasicHttpError.parseError(e);
        return deepCopy(error);
}