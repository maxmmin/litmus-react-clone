import {AuthenticationReducible} from "../types/auth/Authentication";
import {createAsyncThunk, PayloadAction} from "@reduxjs/toolkit";
import JwtInfo from "../types/auth/JwtInfo";
import { BasicHttpError} from "../../util/apiRequest/BasicHttpError";
import {Action} from "redux";
import Authentication from "../types/auth/Authentication";
import appConfig from "../../config/appConfig";
import {ThunkArg} from "../store";

enum AuthAction {
    AUTHENTICATE="AUTHENTICATE",
    CLEAR_AUTH="CLEAR_AUTH",
    CHECK_AUTH="CHECK_AUTH",
    SET_EXPIRED="SET_EXPIRED"
}

export default AuthAction;

type RefreshAccessTokenArg = ThunkArg<{
    refreshToken: string
} >

// export const refreshAccessToken = createAsyncThunk<JwtInfo, RefreshAccessTokenArg>(AuthActions.AUTHENTICATE,
//     async ({refreshToken}, {rejectWithValue}) => {
//         const response =  await fetch(appConfig.serverMappings.refreshTokens, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({refreshToken: refreshToken})
//         });
//
//         const data = await response.json()
//
//         if (response.ok) {
//             return data;
//         }
//
//         return rejectWithValue({...new BasicHttpError(response.status, data)})
//     })


export const setAuthentication = (auth: Authentication) : PayloadAction<AuthenticationReducible> => {
    return {
        type: `${AuthAction.AUTHENTICATE}`,
        payload: auth
    }
}

export function clearAuthentication (): Action<AuthAction> {
    return {
        type: AuthAction.CLEAR_AUTH
    }
}

type SignInArg = ThunkArg<{
    email: string,
    password: string
}>

// export const signIn = createAsyncThunk<JwtInfo,SignInArg>(AuthActions.AUTHENTICATE,
//     async ({email, password},{rejectWithValue}) => {
//         const response = await fetch(appConfig.serverMappings.signIn, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({
//                 email, password
//             })
//         });
//
//
//
//         const errorResponse = await response.json();
//
//         if (response.ok) {
//             return errorResponse;
//         }
//
//
//         const error = new BasicHttpError(response.status, errorResponse);
//
//         return rejectWithValue({...error});
//     })
