import UserIdentity, {UserIdentityReducible} from "../../types/UserIdentity";
import {createAsyncThunk, PayloadAction} from "@reduxjs/toolkit";
import requestsUrls, {createAuthHeader} from "../../data/requestsUrls";
import {HttpError, httpErrors, HttpErrorsNames} from "../../data/httpErrors";
import {roles} from "../../types/Role";
import {isInvalid} from "../../data/pureFunctions";

enum UserIdentityActions {
    GET_IDENTITY="GET_IDENTITY",
    CLEAR_IDENTITY="CLEAR_IDENTITY"
}

export {UserIdentityActions}

const setIdentity = (identity: UserIdentity): PayloadAction<UserIdentityReducible> => {
    return {
        type: UserIdentityActions.GET_IDENTITY,
        payload: identity
    }
}

type successfulResponseType = {role: string}&UserIdentity

export const refreshUserIdentity = createAsyncThunk<UserIdentity,string|null|undefined,{}>(UserIdentityActions.GET_IDENTITY,
    async (accessToken, {rejectWithValue}) => {

    if (!accessToken||isInvalid(accessToken)) {
        return rejectWithValue({...new HttpError(401, HttpErrorsNames.UNAUTHENTICATED)})
    }

    const response = await fetch(requestsUrls.getThisUser,{
        method: 'GET',
        headers: {
            ...createAuthHeader(accessToken)
        }
    })

    const jsonData = await response.json();

    if (response.ok) {
        const responseIdentity = jsonData as successfulResponseType;
        const role = roles[responseIdentity.role]
        const identity: UserIdentity = {...responseIdentity, role: role.role, permissions: role.permissions}
        return identity;
    }

    return rejectWithValue({...new HttpError(response.status, httpErrors[response.status], jsonData)})

})