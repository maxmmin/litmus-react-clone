import UserIdentity, {UserIdentityStateReducible} from "../types/userIdentity/UserIdentity";
import {PayloadAction} from "@reduxjs/toolkit";
import {ThunkArg} from "../store";

enum UserIdentityActions {
    RETRIEVE_IDENTITY="RETRIEVE_IDENTITY",
    CLEAR_IDENTITY="CLEAR_IDENTITY"
}

export default UserIdentityActions;

const setIdentity = (identity: UserIdentity): PayloadAction<UserIdentityStateReducible> => {
    return {
        type: UserIdentityActions.RETRIEVE_IDENTITY,
        payload: identity
    }
}

export type UserIdentityResponseType = {role: string}&UserIdentity


