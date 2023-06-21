import {BasicHttpError} from "../../error/BasicHttpError";
import deepCopy from "../../util/deepCopy";

function handleExplorationError (e: unknown) {
    console.error(e);
    const error = BasicHttpError.parseError(e);
    return deepCopy(error);
}