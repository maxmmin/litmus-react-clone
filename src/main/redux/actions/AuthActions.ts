import {AuthenticationReducible} from "../../types/Authentication";
import {createAsyncThunk, PayloadAction} from "@reduxjs/toolkit";
import JwtInfo from "../../types/JwtInfo";
import apiLinks from "../../util/appConfig";
import { BasicHttpError, HttpStatus} from "../../util/HttpStatus";
import {Action} from "redux";
import Authentication from "../../types/Authentication";
import {MetaArg} from "../../types/AppState";

enum AuthActions {
    REFRESH_AUTH="REFRESH_AUTH",
    CLEAR_AUTH="CLEAR_AUTH",
    CHECK_AUTH="CHECK_AUTH"
}

export default AuthActions;

type RefreshAccessTokenArg = MetaArg<{
    refreshToken: string
} >

export const refreshAccessToken = createAsyncThunk<JwtInfo, RefreshAccessTokenArg>(AuthActions.REFRESH_AUTH,
    async ({refreshToken}, {rejectWithValue}) => {
        const response =  await fetch(apiLinks.refreshAccessKey, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({refreshToken: refreshToken})
        });

        const data = await response.json()

        if (response.ok) {
            return data;
        }

        return rejectWithValue({...new BasicHttpError(response.status, data)})
    })


export const setAuthentication = (auth: Authentication) : PayloadAction<AuthenticationReducible> => {
    return {
        type: `${AuthActions.REFRESH_AUTH}`,
        payload: auth
    }
}

export function clearAuthentication (): Action {
    return {
        type: AuthActions.CLEAR_AUTH
    }
}

type SignInArg = MetaArg<{
    email: string,
    password: string
}>

export const signIn = createAsyncThunk<JwtInfo,SignInArg>(AuthActions.REFRESH_AUTH,
    async ({email, password},{rejectWithValue}) => {
        const response = await fetch(apiLinks.signIn, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email, password
            })
        });



        const errorResponse = await response.json();

        if (response.ok) {
            return errorResponse;
        }


        const error = new BasicHttpError(response.status, errorResponse);

        return rejectWithValue({...error});
    })
