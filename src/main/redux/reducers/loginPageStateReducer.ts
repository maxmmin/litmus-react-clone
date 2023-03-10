import {Reducer} from "react";
import LoginPageStateActions, {LoginPageState} from "../actions/LoginPageStateActions";
import {PayloadAction} from "@reduxjs/toolkit";
import {AuthActions} from "../actions/AuthActions";
import {HttpError} from "../../data/httpErrors";

const initialState: LoginPageState = {
    email: "",
    password: "",
    error: null
}

const loginPageStateReducer: Reducer<LoginPageState, PayloadAction<LoginPageState>> = (prevState=initialState, action): LoginPageState => {
    switch (action.type) {
        case LoginPageStateActions.SET_STATE: {
            return action.payload;
        }

        case LoginPageStateActions.UPDATE_STATE: {
            return {...prevState, ...action.payload!}
        }

        case `${AuthActions.REFRESH_AUTH}/fulfilled`: {
            return null;
        }

        default: {

            if (action.type.endsWith("/rejected")) {
                const prev = prevState?prevState:initialState;

                const actionType = action.type.slice(0,-9)

                const error: HttpError = action.payload as unknown as HttpError;
                switch (actionType) {
                    case AuthActions.REFRESH_AUTH: {
                        if (error.status===401) {
                            return {...prev, error: error}
                        }
                    }
                }
            }

            return prevState;
        }
    }
}

export default loginPageStateReducer