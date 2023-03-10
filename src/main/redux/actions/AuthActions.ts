import {Authentication} from "../../types/AuthenticationType";
import {createAsyncThunk} from "@reduxjs/toolkit";
import JwtInfoType from "../../types/JwtInfoType";
import requestsUrls from "../../data/requestsUrls";
import { HttpError, httpErrors, HttpErrorsNames} from "../../data/httpErrors";
import {Action} from "redux";
import AuthenticationType from "../../types/AuthenticationType";

export type AuthAction = Action<String> & {payload: AuthenticationType}

export enum AuthActions {
    REFRESH_AUTH="REFRESH_AUTH",
    CLEAR_AUTH="CLEAR_AUTH",
    CHECK_AUTH="CHECK_AUTH"
}


export const refreshAccessKey = createAsyncThunk(AuthActions.REFRESH_AUTH,
    async (refreshToken: string, {rejectWithValue}) => {
        const response =  await fetch(requestsUrls.refreshAccessKey, {
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

        return rejectWithValue({...new HttpError(response.status,httpErrors[response.status], data)})
    })


export const setAuthentication = (auth: Authentication) : AuthAction => {
    return {
        type: AuthActions.REFRESH_AUTH,
        payload: auth
    }
}

export function clearAuthentication (): Action {
    return {
        type: AuthActions.CLEAR_AUTH
    }
}

type UserCredentialsType = {
    email: string,
    password: string
}

export const signIn = createAsyncThunk<JwtInfoType,UserCredentialsType>(AuthActions.REFRESH_AUTH,
    async (credentials,{rejectWithValue}) => {
        const response = await fetch(requestsUrls.signIn, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        });

        const json = await response.json();

        if (response.ok) {
            return json;
        }

        let httpErrName: HttpErrorsNames = httpErrors[response.status];

        if (httpErrName===undefined) {
            httpErrName = HttpErrorsNames.UNKNOWN_ERROR;
        }

        const error = new HttpError(response.status,httpErrName, json);

        return rejectWithValue({...error});
    })
