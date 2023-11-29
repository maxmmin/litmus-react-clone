import UserIdentity, {UserIdentityStateReducible} from "../../model/userIdentity/UserIdentity";
import {Reducer} from "react";
import UserIdentityActions from "../actions/UserIdentityActions";
import AuthAction from "../actions/AuthAction";
import {PayloadAction} from "@reduxjs/toolkit";

export type UserIdentityState = UserIdentity|null
export const initialUserIdentityState: UserIdentity|null = null;

const userIdentityReducer: Reducer<UserIdentityStateReducible, PayloadAction<UserIdentityStateReducible>> = (prevState=null, identityAction): UserIdentityStateReducible => {

    switch (identityAction.type) {
        case `${UserIdentityActions.RETRIEVE_IDENTITY}/fulfilled`: {
            return identityAction.payload;
        }

        case `${AuthAction.AUTHENTICATE}/rejected`:
        case UserIdentityActions.CLEAR_IDENTITY: {
            return initialUserIdentityState;
        }

        default: return prevState
    }
}

export default userIdentityReducer