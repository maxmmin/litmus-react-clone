import AuthActions from "./AuthActions";
import Authentication, {AuthenticationReducible} from "../../types/Authentication";
import {Reducer} from "react";
import {BasicHttpError, HttpStatus} from "../../util/HttpStatus";
import {PayloadAction} from "@reduxjs/toolkit";

const authReducer: Reducer<AuthenticationReducible, PayloadAction<Authentication>> = (prevState=null, action): AuthenticationReducible => {

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

        case `${AuthActions.REFRESH_AUTH}`: {
            return action.payload;
        }

        case `${AuthActions.REFRESH_AUTH}/fulfilled`: {
            return {...action.payload};
        }

        default: {
            if (action.type.endsWith("/rejected")) {
                try {
                        return errorHandle(prevState, action.payload as unknown as BasicHttpError)
                } catch (e) {
                    console.log(e)
                }
            }
            return prevState;
        }
    }
}

const errorHandle = (prevState: AuthenticationReducible, error: BasicHttpError): AuthenticationReducible => {
    if (error&&Object.hasOwn(error,'type')) {
        switch (error.status) {
            case HttpStatus.UNAUTHENTICATED: {

                if (prevState?.accessToken) {
                    return {accessToken: null, refreshToken: prevState.refreshToken}
                }

                return  null
            }

            default: return prevState;
        }
    }

    return prevState
}


export default authReducer;
