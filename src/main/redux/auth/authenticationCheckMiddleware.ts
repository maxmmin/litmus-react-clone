import {Action, Middleware} from "redux";
import AppState from "../applicationState/AppState";
import {AuthenticationReducible} from "./Authentication";
import AuthActions from "./AuthActions";
import {TimersReducible} from "../timers/TimersActions";
import BasicAuthenticationManager from "../../service/auth/BasicAuthenticationManager";


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
        BasicAuthenticationManager.getBasicManager().checkAndRefreshAuth();}

    next(action)
};



export default authenticationCheckMiddleware;