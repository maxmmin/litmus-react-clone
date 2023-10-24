

import {AuthenticationReducible} from "../../../redux/types/auth/Authentication";
import {AsyncThunkAction, PayloadAction} from "@reduxjs/toolkit";
import AuthAction from "../../../redux/actions/AuthAction";
import ErrorResponse from "../../../rest/ErrorResponse";
import LoginPageDataActions, {LoginPageState} from "../../../redux/actions/LoginPageDataActions";
import store, {AppDispatch} from "../../../redux/store";
import {Action} from "redux";
import deepCopy from "../../../util/deepCopy";
import AuthenticationStateManager from "./AuthenticationStateManager";

class AuthenticationStateManagerImpl implements AuthenticationStateManager{
    private readonly dispatch: AppDispatch = store.dispatch;
    private readonly getState:()=>AuthenticationReducible = ()=>store.getState().authentication;

    isAuthenticated(): boolean {
        return this.getState()!.isAuthenticated;
    }

    authenticate(authThunk:  AsyncThunkAction<void, any, any>): Promise<PayloadAction<void, string, {arg: any, requestId: string, requestStatus: "fulfilled"}, never> | PayloadAction<unknown, string, unknown, unknown>> {
        return this.dispatch(authThunk);
    }

    logout(): void {
        const action: Action = {type: AuthAction.LOGOUT};
        this.dispatch(action);
    }

    public getAuth(): AuthenticationReducible {
        return this.getState();
    }

    public setLoginError (error: ErrorResponse) {
        const action: PayloadAction<Partial<LoginPageState>> = {type: LoginPageDataActions.UPDATE_STATE, payload: {error: deepCopy(error)}}
        this.dispatch(action)
    }
}

export default AuthenticationStateManagerImpl;