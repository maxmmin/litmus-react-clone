import {BasicHttpError} from "../../util/HttpStatus";
import {PayloadAction} from "@reduxjs/toolkit";

export type LoginPageState = {
    email: string,
    password: string,
    error: BasicHttpError | null
}

export type LoginPageStateReducible = {
    email: string,
    password: string,
    error: BasicHttpError | null
} | null | undefined

enum LoginPageStateActions {
    SET_STATE="SET_STATE",
    UPDATE_STATE="UPDATE_STATE"
}

export default LoginPageStateActions;

export const updateLoginPageState = (valuesToBeUpdated: Partial<LoginPageState>): PayloadAction<Partial<LoginPageState>> => {
    return {
        type: LoginPageStateActions.UPDATE_STATE,
        payload: valuesToBeUpdated
    }
}

