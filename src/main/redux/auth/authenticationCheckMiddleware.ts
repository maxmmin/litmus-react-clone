import {Action, Middleware} from "redux";
import AppState from "../applicationState/AppState";
import {AuthenticationReducible} from "./Authentication";
import AuthAction from "./AuthAction";
import {TimersReducible} from "../timers/TimersActions";
import BasicAuthenticationManager from "../../service/auth/BasicAuthenticationManager";
import GeneralAction from "../../react/GeneralAction";


type PartedStoreType = {
    appState: AppState | undefined,
    authentication: AuthenticationReducible,
    timers: TimersReducible
}

const authenticationCheckMiddleware: Middleware<{}, PartedStoreType> = ({ getState, dispatch }) => (
    next
) => (action: Action) => {
    if (action.type===AuthAction.CHECK_AUTH) {
        BasicAuthenticationManager.getBasicManager().checkAndRefreshAuth();
    } else if (action.type===AuthAction.CLEAR_AUTH) {
        dispatch({type: GeneralAction.RESET_DATA})
    }

    next(action)
};



export default authenticationCheckMiddleware;