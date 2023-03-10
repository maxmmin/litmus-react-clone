import {HttpError} from "../../data/httpErrors";
import {PayloadAction} from "@reduxjs/toolkit";

export type LoginPageState = {
    email: string,
    password: string,
    error: HttpError | null
} | null | undefined

enum LoginPageStateActions {
    SET_STATE="SET_STATE",
    UPDATE_STATE="UPDATE_STATE"
}

export const updateLoginPageState = (valuesToBeUpdated: Partial<LoginPageState>): PayloadAction<Partial<LoginPageState>> => {
    return {
        type: LoginPageStateActions.UPDATE_STATE,
        payload: valuesToBeUpdated
    }
}

export default LoginPageStateActions

