import AuthAction from "../actions/AuthAction";
import Authentication, {AuthenticationReducible} from "../types/auth/Authentication";
import {Reducer} from "react";
import {HttpErrorParser} from "../../error/BasicHttpError";
import {isRejected, PayloadAction} from "@reduxjs/toolkit";
import {HttpStatus} from "../../rest/HttpStatus";
import {ApplicationError} from "../../rest/ErrorResponse";
import {RejectedAction} from "@reduxjs/toolkit/dist/query/core/buildThunks";

export const defaultAuthState: Authentication = {
    isAuthenticated: false
}

const authReducer: Reducer<AuthenticationReducible, PayloadAction<Authentication>> = (prevState=defaultAuthState, action): AuthenticationReducible => {

    switch (action.type) {
        case AuthAction.LOGOUT: {
            return defaultAuthState;
        }

        case `${AuthAction.AUTHENTICATE}/fulfilled`: {
            return {
                isAuthenticated: true
            };
        }

        case `${AuthAction.AUTHENTICATE}/rejected`: {
            const errAction: RejectedAction<any, any> = action as RejectedAction<any, any>;
            const err: ApplicationError = HttpErrorParser.parseError(errAction.payload||errAction.error);
            if (err.status===401) return defaultAuthState
                else return prevState;
        }

        default: {
            if (isRejected(action)) {
                const errAction: RejectedAction<any, any> = action as RejectedAction<any, any>;
                const err: ApplicationError = HttpErrorParser.parseError(errAction.payload||errAction.error)
                return errorHandle(prevState, err)
            }
            else return prevState;
        }
    }
}

const errorHandle = (prevState: AuthenticationReducible, error: ApplicationError): AuthenticationReducible => {
    switch (error.status) {
        case HttpStatus.UNAUTHENTICATED: {
            if (prevState) {
                return {
                    isAuthenticated: false
                };
            } else return prevState;
        }

        default: return prevState;
    }
}


export default authReducer;
