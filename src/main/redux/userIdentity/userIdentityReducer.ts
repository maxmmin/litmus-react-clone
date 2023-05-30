import {UserIdentityReducible} from "./UserIdentity";
import {Reducer} from "react";
import UserIdentityActions from "./UserIdentityActions";
import AuthActions from "../auth/AuthActions";
import {PayloadAction} from "@reduxjs/toolkit";

const initialState = null;

const userIdentityReducer: Reducer<UserIdentityReducible, PayloadAction<UserIdentityReducible>> = (prevState=null, identityAction): UserIdentityReducible => {

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