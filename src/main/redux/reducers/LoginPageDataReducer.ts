import {Reducer} from "react";
import LoginPageDataActions, {LoginPageState, LoginPageStateReducible} from "../actions/LoginPageDataActions";
import {PayloadAction} from "@reduxjs/toolkit";
import AuthAction from "../actions/AuthAction";
import {BasicHttpError} from "../../error/BasicHttpError";

const initialState: LoginPageState = {
    email: "",
    password: "",
    error: null
}

const loginPageDataReducer: Reducer<LoginPageStateReducible, PayloadAction<LoginPageState>> = (prevState=initialState, action) => {
    switch (action.type) {
        case LoginPageDataActions.SET_STATE: {
            return action.payload;
        }

        case LoginPageDataActions.UPDATE_STATE: {
            return {...prevState, ...action.payload!}
        }

        case `${AuthAction.AUTHENTICATE}/fulfilled`: {
            return initialState;
        }

        default: {

            if (action.type.endsWith("/rejected")) {
                const prev = prevState?prevState:initialState;

                const actionType = action.type.slice(0,-9)

                const error = action.payload as unknown as BasicHttpError<any>|undefined;

                if (error?.status) {
                    switch (actionType) {
                        case AuthAction.AUTHENTICATE: {
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

export default loginPageDataReducer