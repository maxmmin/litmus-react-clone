import UserIdentity, {UserIdentityReducible} from "./UserIdentity";
import {createAsyncThunk, PayloadAction} from "@reduxjs/toolkit";
import appConfig, {createAuthHeader} from "../../config/appConfig";
import {BasicHttpError} from "../../util/HttpStatus";
import {isValid} from "../../util/pureFunctions";
import {MetaArg} from "../applicationState/AppState";
import Role from "./Role";

enum UserIdentityActions {
    REFRESH_IDENTITY="REFRESH_IDENTITY",
    CLEAR_IDENTITY="CLEAR_IDENTITY"
}

export default UserIdentityActions;

const setIdentity = (identity: UserIdentity): PayloadAction<UserIdentityReducible> => {
    return {
        type: UserIdentityActions.REFRESH_IDENTITY,
        payload: identity
    }
}

type SuccessfulResponseType = {role: string}&UserIdentity

type RefreshUserIdentityArg = MetaArg<{
    accessToken: string
}>

export const refreshUserIdentity = createAsyncThunk<UserIdentity,RefreshUserIdentityArg>(UserIdentityActions.REFRESH_IDENTITY,
    async ({accessToken}, {rejectWithValue}) => {

    if (!isValid(accessToken)) {
        return rejectWithValue({...new BasicHttpError(401, {errorDetails: {
                message: "Помилка аутентифікації"
            }})
        })
    }

    const response = await fetch(appConfig.serverMappings.getCurrentUser,{
        method: 'GET',
        headers: {
            ...createAuthHeader(accessToken)
        }
    })

    const jsonData = await response.json();

    if (response.ok) {
        const responseIdentity = jsonData as SuccessfulResponseType;
        const role = Role[responseIdentity.role]
        const identity: UserIdentity = {...responseIdentity, role: role.role, permissions: role.permissions}
        return identity;
    }

    return rejectWithValue({...new BasicHttpError(response.status,  jsonData)})

})