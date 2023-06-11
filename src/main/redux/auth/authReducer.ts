import AuthActions from "./AuthActions";
import Authentication, {AuthenticationReducible} from "./Authentication";
import {Reducer} from "react";
import {BasicHttpError} from "../../util/apiRequest/BasicHttpError";
import {PayloadAction} from "@reduxjs/toolkit";
import {HttpStatus} from "../../util/apiRequest/HttpStatus";

const authReducer: Reducer<AuthenticationReducible, PayloadAction<Authentication>> = (prevState=null, action): AuthenticationReducible => {

    switch (action.type) {
        case AuthActions.CLEAR_AUTH: {
            return null;
        }

        case AuthActions.CHECK_AUTH: {
            return prevState;
        }

        case AuthActions.SET_AUTH: {
            return action.payload;
        }

        case `${AuthActions.SET_AUTH}`: {
            return action.payload;
        }

        case `${AuthActions.SET_AUTH}/fulfilled`: {
            return {...action.payload};
        }

        default: {
            if (action.type.endsWith("/rejected")) {
                try {
                    return errorHandle(prevState, action.payload as unknown as BasicHttpError<any>)
                } catch (e) {
                    console.log(e)
                }
            }
            return prevState;
        }
    }
}

const errorHandle = (prevState: AuthenticationReducible, error: BasicHttpError<any>): AuthenticationReducible => {
    if (error&&Object.hasOwn(error,'status')) {
        switch (error.status) {
            case HttpStatus.UNAUTHENTICATED: {

                if (prevState?.accessToken) {
                    return {accessToken: prevState.accessToken, refreshToken: prevState.refreshToken, expired: true}
                }

                return  null
            }

            default: return prevState;
        }
    }

    return prevState
}


export default authReducer;
