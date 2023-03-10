import {UserIdentityType} from "../../types/UserIdentity";
import {Reducer} from "react";
import {UserIdentityActions} from "../actions/UserIdentityActions";
import {AuthActions} from "../actions/AuthActions";
import {PayloadAction} from "@reduxjs/toolkit";

const initialState = null;

const userIdentityReducer: Reducer<UserIdentityType, PayloadAction<UserIdentityType>> = (prevState=null, identityAction): UserIdentityType => {

    switch (identityAction.type) {
        case `${UserIdentityActions.GET_IDENTITY}/fulfilled`: {
            return identityAction.payload;
        }

        case `${AuthActions.REFRESH_AUTH}/rejected`:
        case UserIdentityActions.CLEAR_IDENTITY:
        case AuthActions.CLEAR_AUTH: {
            return initialState;
        }

        default: return prevState
    }
}

export default userIdentityReducer