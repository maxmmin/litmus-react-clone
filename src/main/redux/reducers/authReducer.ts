import AuthAction from "../actions/AuthAction";
import Authentication, {AuthenticationReducible} from "../types/auth/Authentication";
import {Reducer} from "react";
import {BasicHttpError, HttpErrorParser} from "../../error/BasicHttpError";
import {isRejected, PayloadAction} from "@reduxjs/toolkit";
import {HttpStatus} from "../../rest/HttpStatus";
import ErrorResponse from "../../rest/ErrorResponse";

const authReducer: Reducer<AuthenticationReducible, PayloadAction<Authentication>> = (prevState=null, action): AuthenticationReducible => {

    switch (action.type) {
        case AuthAction.CLEAR_AUTH: {
            return null;
        }

        case AuthAction.CHECK_AUTH: {
            return prevState;
        }

        case AuthAction.AUTHENTICATE: {
            return action.payload;
        }

        case `${AuthAction.AUTHENTICATE}/fulfilled`: {
            return {...action.payload};
        }

        case `${AuthAction.AUTHENTICATE}/rejected`: {
            const err: ErrorResponse<unknown> = HttpErrorParser.parseError(action.payload);
            if (err.status===401) return null
                else return prevState;
        }

        default: {
            if (isRejected(action)) {
                const errorResponse: ErrorResponse<unknown> = HttpErrorParser.parseError(action.payload)
                return errorHandle(prevState, errorResponse)
            }
            else return prevState;
        }
    }
}

const errorHandle = (prevState: AuthenticationReducible, error: ErrorResponse<any>): AuthenticationReducible => {
    switch (error.status) {
        case HttpStatus.UNAUTHENTICATED: {
            if (prevState) {
                return {accessToken: prevState.accessToken, refreshToken: prevState.refreshToken, expired: true};
            } else return prevState;
        }

        default: return prevState;
    }
}


export default authReducer;
