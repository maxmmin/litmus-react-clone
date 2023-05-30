import {Action, Middleware} from "redux";
import AppState from "../applicationState/AppState";
import {AuthenticationReducible} from "./Authentication";
import {
    checkAndRefreshAuth} from "../../util/pureFunctions";
import AuthActions from "./AuthActions";
import {TimersReducible} from "../timers/TimersActions";


type PartedStoreType = {
    appState: AppState | undefined,
    authentication: AuthenticationReducible,
    timers: TimersReducible
}

const authenticationCheckMiddleware: Middleware<{}, PartedStoreType> = ({ getState, dispatch }) => (
    next
) => (action: Action) => {
    const auth = getState().authentication
    // check if there is auth check action or auth was applied
    // we should listen to auth check cause user can crash application by self auth state modifying
    if (action.type===AuthActions.CHECK_AUTH) {
        checkAndRefreshAuth(auth, getState().timers, dispatch);
    }

    next(action)
};



export default authenticationCheckMiddleware;