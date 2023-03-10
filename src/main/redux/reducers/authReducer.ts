import {AuthActions, refreshAccessToken} from "../actions/AuthActions";
import Authentication, {AuthenticationReducible} from "../../types/Authentication";
import {Reducer} from "react";
import {HttpError, HttpErrorsNames} from "../../data/httpErrors";
import jwtDecode, {JwtPayload} from "jwt-decode";
import {PayloadAction} from "@reduxjs/toolkit";
import store from "../store";
import {updateAuthentication} from "../../data/pureFunctions";

const authReducer: Reducer<AuthenticationReducible, PayloadAction<Authentication>> = (prevState=null, action): AuthenticationReducible => {

    // check and clear timer before this.
    // ! one more check is placed inside handleError function
    if (action.type.indexOf(AuthActions.REFRESH_AUTH)>-1||action.type===AuthActions.CLEAR_AUTH) {
        if (prevState?.refreshTimerId) {
            clearTimeout(prevState.refreshTimerId)
        }
    }

    switch (action.type) {
        case AuthActions.CLEAR_AUTH: {
            return null;
        }

        case AuthActions.CHECK_AUTH: {
            return prevState;
        }

        case AuthActions.REFRESH_AUTH: {
            return action.payload;
        }

        case `${AuthActions.REFRESH_AUTH}/fulfilled`: {

            const accessToken = action.payload.accessToken!;

            let timerId: NodeJS.Timeout | null = updateAuthentication(accessToken, action.payload.refreshToken!);

            return {...action.payload, refreshTimerId: timerId};
        }

        default: {
            if (action.type.endsWith("rejected")) {
                try {
                        return errorHandle(prevState, action.payload as unknown as HttpError)
                } catch (e) {
                    console.log(e)
                }
            }
            return prevState;
        }
    }
}

const errorHandle = (prevState: AuthenticationReducible, error: HttpError): AuthenticationReducible => {
    console.log(error)
    if (error&&Object.hasOwn(error,'type')) {
        switch (error.type) {
            case HttpErrorsNames.UNAUTHENTICATED: {
                if (prevState?.refreshTimerId) {
                    clearTimeout(prevState.refreshTimerId)
                }

                if (prevState?.accessToken) {
                    return {accessToken: null, refreshToken: prevState.refreshToken, refreshTimerId: null}
                }

                return  {
                    accessToken: null, refreshToken: null, refreshTimerId: null
                }
            }

            default: return prevState;
        }
    }

    return prevState
}


export default authReducer;
