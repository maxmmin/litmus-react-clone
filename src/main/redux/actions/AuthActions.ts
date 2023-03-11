import {AuthenticationReducible} from "../../types/Authentication";
import {createAsyncThunk, PayloadAction} from "@reduxjs/toolkit";
import JwtInfo from "../../types/JwtInfo";
import requestsUrls from "../../data/requestsUrls";
import { HttpError, httpErrors, HttpErrorsNames} from "../../data/httpErrors";
import {Action} from "redux";
import Authentication from "../../types/Authentication";

export enum AuthActions {
    REFRESH_AUTH="REFRESH_AUTH",
    CLEAR_AUTH="CLEAR_AUTH",
    CHECK_AUTH="CHECK_AUTH"
}


export const refreshAccessToken = createAsyncThunk(AuthActions.REFRESH_AUTH,
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


export const setAuthentication = (auth: Authentication) : PayloadAction<AuthenticationReducible> => {
    return {
        type: `${AuthActions.REFRESH_AUTH}/fulfilled`,
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

export const signIn = createAsyncThunk<JwtInfo,UserCredentialsType>(AuthActions.REFRESH_AUTH,
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
