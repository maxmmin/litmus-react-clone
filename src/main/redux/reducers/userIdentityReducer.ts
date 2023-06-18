import {UserIdentityReducible} from "../types/userIdentity/UserIdentity";
import {Reducer} from "react";
import UserIdentityActions from "../actions/UserIdentityActions";
import AuthAction from "../actions/AuthAction";
import {PayloadAction} from "@reduxjs/toolkit";
import GeneralAction from "../GeneralAction";

const initialState = null;

const userIdentityReducer: Reducer<UserIdentityReducible, PayloadAction<UserIdentityReducible>> = (prevState=null, identityAction): UserIdentityReducible => {

    switch (identityAction.type) {
        case `${UserIdentityActions.RETRIEVE_IDENTITY}/fulfilled`: {
            return identityAction.payload;
        }

        case `${AuthAction.AUTHENTICATE}/rejected`:
        case UserIdentityActions.CLEAR_IDENTITY:
        case GeneralAction.RESET_DATA: {
            return initialState;
        }

        default: return prevState
    }
}

export default userIdentityReducer