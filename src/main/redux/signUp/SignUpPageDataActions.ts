import {BasicHttpError} from "../../util/apiRequest/BasicHttpError";
import {PayloadAction} from "@reduxjs/toolkit";

export type LoginPageState = {
    email: string,
    password: string,
    error: BasicHttpError<any> | null
}

export type LoginPageStateReducible = {
    email: string,
    password: string,
    error: BasicHttpError<any> | null
} | null | undefined

enum SignUpPageDataActions {
    SET_STATE="SET_STATE",
    UPDATE_STATE="UPDATE_STATE"
}

export default SignUpPageDataActions;

export const updateLoginPageState = (valuesToBeUpdated: Partial<LoginPageState>): PayloadAction<Partial<LoginPageState>> => {
    return {
        type: SignUpPageDataActions.UPDATE_STATE,
        payload: valuesToBeUpdated
    }
}

