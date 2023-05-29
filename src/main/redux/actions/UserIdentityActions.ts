import UserIdentity, {UserIdentityReducible} from "../../types/UserIdentity";
import {createAsyncThunk, PayloadAction} from "@reduxjs/toolkit";
import apiLinks, {createAuthHeader} from "../../util/appConfig";
import {BasicHttpError, HttpStatus} from "../../util/HttpStatus";
import {roles} from "../../types/Role";
import {isValid} from "../../util/pureFunctions";
import {MetaArg} from "../../types/AppState";

enum UserIdentityActions {
    GET_IDENTITY="GET_IDENTITY",
    CLEAR_IDENTITY="CLEAR_IDENTITY"
}

export default UserIdentityActions;

const setIdentity = (identity: UserIdentity): PayloadAction<UserIdentityReducible> => {
    return {
        type: UserIdentityActions.GET_IDENTITY,
        payload: identity
    }
}

type SuccessfulResponseType = {role: string}&UserIdentity

type RefreshUserIdentityArg = MetaArg<{
    accessToken: string
}>

export const refreshUserIdentity = createAsyncThunk<UserIdentity,RefreshUserIdentityArg>(UserIdentityActions.GET_IDENTITY,
    async ({accessToken}, {rejectWithValue}) => {

    if (!isValid(accessToken)) {
        return rejectWithValue({...new BasicHttpError(401, {errorDetails: {
                message: "Помилка аутентифікації"
            }})
        })
    }

    const response = await fetch(apiLinks.getThisUser,{
        method: 'GET',
        headers: {
            ...createAuthHeader(accessToken)
        }
    })

    const jsonData = await response.json();

    if (response.ok) {
        const responseIdentity = jsonData as SuccessfulResponseType;
        const role = roles[responseIdentity.role]
        const identity: UserIdentity = {...responseIdentity, role: role.role, permissions: role.permissions}
        return identity;
    }

    return rejectWithValue({...new BasicHttpError(response.status,  jsonData)})

})