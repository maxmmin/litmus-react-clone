import AuthAction from "../actions/AuthAction";
import Authentication, {AuthenticationReducible} from "../types/auth/Authentication";
import {Reducer} from "react";
import {HttpErrorParser} from "../../error/BasicHttpError";
import {isRejected, PayloadAction} from "@reduxjs/toolkit";
import {HttpStatus} from "../../rest/HttpStatus";
import {ApplicationError} from "../../rest/ErrorResponse";

const defaultState: Authentication = {
    isAuthenticated: false
}

const authReducer: Reducer<AuthenticationReducible, PayloadAction<Authentication>> = (prevState=defaultState, action): AuthenticationReducible => {

    switch (action.type) {
        case AuthAction.LOGOUT: {
            return defaultState;
        }

        case `${AuthAction.AUTHENTICATE}/fulfilled`: {
            return {
                isAuthenticated: true
            };
        }

        case `${AuthAction.AUTHENTICATE}/rejected`: {
            const err: ApplicationError<unknown> = HttpErrorParser.parseError(action.payload);
            if (err.status===401) return defaultState
                else return prevState;
        }

        default: {
            if (isRejected(action)) {
                const err: ApplicationError<unknown> = HttpErrorParser.parseError(action.payload)
                return errorHandle(prevState, err)
            }
            else return prevState;
        }
    }
}

const errorHandle = (prevState: AuthenticationReducible, error: ApplicationError<any>): AuthenticationReducible => {
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
