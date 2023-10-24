import {BasicHttpError} from "../../error/BasicHttpError";
import {PayloadAction} from "@reduxjs/toolkit";
import ErrorResponse from "../../rest/ErrorResponse";

export type LoginPageState = {
    email: string,
    password: string,
    error: ErrorResponse | null
}

export type LoginPageStateReducible = LoginPageState | null | undefined

enum LoginPageDataActions {
    SET_STATE="SET_STATE",
    UPDATE_STATE="UPDATE_STATE"
}

export default LoginPageDataActions;

export const updateLoginPageState = (valuesToBeUpdated: Partial<LoginPageState>): PayloadAction<Partial<LoginPageState>> => {
    return {
        type: LoginPageDataActions.UPDATE_STATE,
        payload: valuesToBeUpdated
    }
}

