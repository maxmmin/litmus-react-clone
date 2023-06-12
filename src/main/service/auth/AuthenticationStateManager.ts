import Authentication, {AuthenticationReducible} from "../../redux/auth/Authentication";
import {PayloadAction} from "@reduxjs/toolkit";
import AuthActions, {clearAuthentication} from "../../redux/auth/AuthActions";
import ErrorResponse from "../../util/apiRequest/ErrorResponse";
import LoginPageDataActions, {LoginPageState} from "../../redux/login/LoginPageDataActions";
import deepCopy from "../../util/pureFunctions";
import store from "../../redux/store";
import {Action} from "redux";

class AuthenticationStateManager {
    private readonly _store = store;

    public setAuth (auth: Authentication) {
        auth.expired = false;
        const action: PayloadAction<Authentication> = {
            type: AuthActions.SET_AUTH,
            payload: auth
        }
        this._store.dispatch(action)
    }

    public setExpired () {
        const action: Action<AuthActions> = {type: AuthActions.SET_EXPIRED}
        this._store.dispatch(action);
    }

    public getAuth(): AuthenticationReducible {
        return this._store.getState().authentication;
    }

    public setLoginError (error: ErrorResponse<any>) {
        const action: PayloadAction<Partial<LoginPageState>> = {type: LoginPageDataActions.UPDATE_STATE, payload: {error: deepCopy(error)}}
        this._store.dispatch(action)
    }

    public clearAuth (): void {
        this._store.dispatch(clearAuthentication());
    }
}

export default AuthenticationStateManager;