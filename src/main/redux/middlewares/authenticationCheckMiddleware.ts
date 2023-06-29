import {Action, Middleware} from "redux";
import AppState from "../types/applicationState/AppState";
import {AuthenticationReducible} from "../types/auth/Authentication";
import AuthAction from "../actions/AuthAction";
import {TimersReducible} from "../actions/TimersAction";
import GeneralAction from "../GeneralAction";
import BasicAuthenticationManager from "../../service/auth/BasicAuthenticationManager";



type PartedStoreType = {
    appState: AppState | undefined,
    authentication: AuthenticationReducible,
    timers: TimersReducible
}

const authenticationCheckMiddleware: Middleware<{}, PartedStoreType> = ({ getState, dispatch }) => (
    next
) => (action: Action) => {
    if (action.type===AuthAction.CHECK_AUTH) {
        BasicAuthenticationManager.getInstance().checkAndRefreshAuth();
    } else if (action.type===AuthAction.CLEAR_AUTH) {
        dispatch({type: GeneralAction.RESET_DATA})
    }

    next(action)
};



export default authenticationCheckMiddleware;