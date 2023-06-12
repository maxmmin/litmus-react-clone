import {AuthenticationReducible} from "./Authentication";
import {createAsyncThunk, PayloadAction} from "@reduxjs/toolkit";
import JwtInfo from "./JwtInfo";
import { BasicHttpError} from "../../util/apiRequest/BasicHttpError";
import {Action} from "redux";
import Authentication from "./Authentication";
import appConfig from "../../config/appConfig";
import {MetaArg} from "../store";

enum AuthActions {
    SET_AUTH="SET_AUTH",
    CLEAR_AUTH="CLEAR_AUTH",
    CHECK_AUTH="CHECK_AUTH",
    "SET_EXPIRED"="SET_EXPIRED"
}

export default AuthActions;

type RefreshAccessTokenArg = MetaArg<{
    refreshToken: string
} >

export const refreshAccessToken = createAsyncThunk<JwtInfo, RefreshAccessTokenArg>(AuthActions.SET_AUTH,
    async ({refreshToken}, {rejectWithValue}) => {
        const response =  await fetch(appConfig.serverMappings.refreshTokens, {
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
        type: `${AuthActions.SET_AUTH}`,
        payload: auth
    }
}

export function clearAuthentication (): Action<AuthActions> {
    return {
        type: AuthActions.CLEAR_AUTH
    }
}

type SignInArg = MetaArg<{
    email: string,
    password: string
}>

export const signIn = createAsyncThunk<JwtInfo,SignInArg>(AuthActions.SET_AUTH,
    async ({email, password},{rejectWithValue}) => {
        const response = await fetch(appConfig.serverMappings.signIn, {
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
