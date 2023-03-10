import {AuthActions, AuthAction} from "../actions/AuthActions";
import Authentication, {AuthenticationReducible} from "../../types/Authentication";
import {Reducer} from "react";
import {HttpError, HttpErrorsNames} from "../../data/httpErrors";

const authReducer: Reducer<AuthenticationReducible, AuthAction> = (prevState=null, action): AuthenticationReducible => {

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
            return action.payload;
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
        };
    }
}

const errorHandle = (prevState: AuthenticationReducible, error: HttpError): AuthenticationReducible => {
    if (error&&Object.hasOwn(error,'type')) {
        switch (error.type) {
            case HttpErrorsNames.UNAUTHENTICATED: {
                if (!prevState) return {accessToken: null, refreshToken: null};
                return {...prevState};
            }

            default: return prevState;
        }
    }

    return prevState
}


export default authReducer;
