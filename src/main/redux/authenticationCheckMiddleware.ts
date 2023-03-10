import {Action, Middleware} from "redux";
import AppState from "../types/AppState";
import AuthenticationType from "../types/AuthenticationType";
import {checkAndRefreshAuth} from "../data/pureFunctions";
import {AuthActions} from "./actions/AuthActions";


type AppStatePath = {
    appState: AppState,
    authentication: AuthenticationType
}

const authenticationCheckMiddleware: Middleware<{}, AppStatePath> = ({ getState, dispatch }) => (
    next
) => (action: Action) => {
    const auth = getState().authentication

    if (action.type===AuthActions.CHECK_AUTH||action.type.indexOf("AUTH")===-1) {
        checkAndRefreshAuth(auth, dispatch);
    }

    next(action)
};



export default authenticationCheckMiddleware;