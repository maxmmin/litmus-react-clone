import {BasicHttpError} from "../../util/apiRequest/BasicHttpError";
import {PayloadAction} from "@reduxjs/toolkit";
import ErrorResponse from "../../util/apiRequest/ErrorResponse";

export type LoginPageState = {
    email: string,
    password: string,
    error: ErrorResponse<any> | null
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

