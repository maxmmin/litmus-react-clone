import {BasicHttpError, HttpErrorParser} from "../../error/BasicHttpError";
import deepCopy from "../../util/deepCopy";

function handleExplorationError (e: unknown) {
    console.error(e);
    const error = HttpErrorParser.parseError(e);
    return deepCopy(error);
}