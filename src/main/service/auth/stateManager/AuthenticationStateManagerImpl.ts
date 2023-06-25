

import Authentication, {AuthenticationReducible} from "../../../redux/types/auth/Authentication";
import {AsyncThunkAction, PayloadAction} from "@reduxjs/toolkit";
import AuthAction, {clearAuthentication} from "../../../redux/actions/AuthAction";
import ErrorResponse from "../../../rest/ErrorResponse";
import LoginPageDataActions, {LoginPageState} from "../../../redux/actions/LoginPageDataActions";
import store, {AppDispatch} from "../../../redux/store";
import {Action} from "redux";
import deepCopy from "../../../util/deepCopy";
import AuthenticationStateManager from "./AuthenticationStateManager";

class AuthenticationStateManagerImpl implements AuthenticationStateManager{
    private readonly dispatch: AppDispatch = store.dispatch;
    private readonly getState:()=>AuthenticationReducible = ()=>store.getState().authentication;

    public retrieveAuthentication (authThunk:  AsyncThunkAction<Authentication, any, any>):  Promise<PayloadAction<Authentication, string, {arg: any, requestId: string, requestStatus: "fulfilled"}, never> | PayloadAction<unknown, string, unknown, unknown>> {
       return this.dispatch(authThunk);
    }

    public setExpired () {
        const action: Action<AuthAction> = {type: AuthAction.SET_EXPIRED}
        this.dispatch(action);
    }

    public getAuth(): AuthenticationReducible {
        return this.getState();
    }

    public setLoginError (error: ErrorResponse<any>) {
        const action: PayloadAction<Partial<LoginPageState>> = {type: LoginPageDataActions.UPDATE_STATE, payload: {error: deepCopy(error)}}
        this.dispatch(action)
    }

    public clearAuth (): void {
        this.dispatch(clearAuthentication());
    }
}

export default AuthenticationStateManagerImpl;