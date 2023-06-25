import {Action, Middleware} from "redux";
import AppState from "../types/applicationState/AppState";
import {AuthenticationReducible} from "../types/auth/Authentication";
import AuthAction from "../actions/AuthAction";
import {TimersReducible} from "../actions/TimersAction";
import GeneralAction from "../GeneralAction";
import AuthenticationManager from "../../service/auth/AuthenticationManager";
import IOC_TYPES from "../../inversify/IOC_TYPES";
import BasicAuthenticationManager from "../../service/auth/BasicAuthenticationManager";
import {LitmusServiceContext} from "../../react/App";
import {useContext} from "react";
import serviceContext from "../../react/serviceContext";
import AuthenticationStateManagerImpl from "../../service/auth/stateManager/AuthenticationStateManagerImpl";


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