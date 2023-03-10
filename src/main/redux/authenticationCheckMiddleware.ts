import {Action, Middleware} from "redux";
import AppState from "../types/AppState";
import {AuthenticationReducible} from "../types/Authentication";
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
    // check if there is auth check action or auth was applied
    // we should listen to auth check cause user can crash application by self auth state modifying
    if (action.type===AuthActions.CHECK_AUTH) {
        checkAndRefreshAuth(auth, dispatch);
    }

    next(action)
};



export default authenticationCheckMiddleware;