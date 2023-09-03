import AuthAction from "../actions/AuthAction";
import Authentication, {AuthenticationReducible} from "../types/auth/Authentication";
import {Reducer} from "react";
import {BasicHttpError, HttpErrorParser} from "../../error/BasicHttpError";
import {isRejected, PayloadAction} from "@reduxjs/toolkit";
import {HttpStatus} from "../../rest/HttpStatus";
import ErrorResponse, {ApplicationError} from "../../rest/ErrorResponse";

const authReducer: Reducer<AuthenticationReducible, PayloadAction<Authentication>> = (prevState=null, action): AuthenticationReducible => {

    switch (action.type) {
        case AuthAction.LOGOUT: {
            return null;
        }

        case AuthAction.AUTHENTICATE: {
            return action.payload;
        }

        case `${AuthAction.AUTHENTICATE}/fulfilled`: {
            return {...action.payload};
        }

        case `${AuthAction.AUTHENTICATE}/rejected`: {
            const err: ApplicationError<unknown> = HttpErrorParser.parseError(action.payload);
            if (err.status===401) return null
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
