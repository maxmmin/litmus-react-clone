import {Action, Middleware} from "redux";
import AppState from "../types/AppState";
import Authentication, {AuthenticationReducible} from "../types/Authentication";
import {checkAndRefreshAuth} from "../data/pureFunctions";
import {AuthActions} from "./actions/AuthActions";


type PartedStoreType = {
    appState: AppState | undefined,
    authentication: AuthenticationReducible
}

const authenticationCheckMiddleware: Middleware<{}, PartedStoreType> = ({ getState, dispatch }) => (
    next
) => (action: Action) => {
    const auth = getState().authentication

    if (action.type===AuthActions.CHECK_AUTH||action.type.indexOf("AUTH")===-1) {
        checkAndRefreshAuth(auth, dispatch);
    }

    next(action)
};



export default authenticationCheckMiddleware;