import AuthAction from "./AuthAction";
import Authentication, {AuthenticationReducible} from "./Authentication";
import {Reducer} from "react";
import {BasicHttpError} from "../../util/apiRequest/BasicHttpError";
import {isRejected, PayloadAction} from "@reduxjs/toolkit";
import {HttpStatus} from "../../util/apiRequest/HttpStatus";
import ErrorResponse from "../../util/apiRequest/ErrorResponse";

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
            return null;
        }

        default: {
            if (isRejected(action)) {
                const errorResponse: ErrorResponse<any> = BasicHttpError.parseError(action.payload)
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
