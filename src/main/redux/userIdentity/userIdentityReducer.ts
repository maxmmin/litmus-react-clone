import {UserIdentityReducible} from "./UserIdentity";
import {Reducer} from "react";
import UserIdentityActions from "./UserIdentityActions";
import AuthAction from "../auth/AuthAction";
import {PayloadAction} from "@reduxjs/toolkit";
import GeneralAction from "../../react/GeneralAction";

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