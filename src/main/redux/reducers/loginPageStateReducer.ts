import {Reducer} from "react";
import LoginPageStateActions, {LoginPageState, LoginPageStateReducible} from "../actions/LoginPageStateActions";
import {PayloadAction} from "@reduxjs/toolkit";
import AuthActions from "../actions/AuthActions";
import {BasicHttpError} from "../../util/HttpStatus";

const initialState: LoginPageState = {
    email: "",
    password: "",
    error: null
}

const loginPageStateReducer: Reducer<LoginPageStateReducible, PayloadAction<LoginPageState>> = (prevState=initialState, action) => {
    switch (action.type) {
        case LoginPageStateActions.SET_STATE: {
            return action.payload;
        }

        case LoginPageStateActions.UPDATE_STATE: {
            return {...prevState, ...action.payload!}
        }

        case `${AuthActions.REFRESH_AUTH}/fulfilled`: {
            return initialState;
        }

        default: {

            if (action.type.endsWith("/rejected")) {
                const prev = prevState?prevState:initialState;

                const actionType = action.type.slice(0,-9)

                const error = action.payload as unknown as BasicHttpError|undefined;

                if (error?.status) {
                    switch (actionType) {
                        case AuthActions.REFRESH_AUTH: {
                            if (error.status===401) {
                                return {...prev, error: error}
                            }
                        }
                    }
                }
            }

            return prevState;
        }
    }
}

export default loginPageStateReducer