import UserIdentity, {UserIdentityReducible} from "./UserIdentity";
import {createAsyncThunk, PayloadAction} from "@reduxjs/toolkit";
import appConfig, {createAuthHeader} from "../../config/appConfig";
import {BasicHttpError} from "../../util/apiRequest/BasicHttpError";
import {isValid} from "../../util/pureFunctions";
import Role from "./Role";
import {ThunkArg} from "../store";
import ErrorResponse from "../../util/apiRequest/ErrorResponse";

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

type RefreshUserIdentityArg = ThunkArg<{
    accessToken: string
}>

export const refreshUserIdentity = createAsyncThunk<UserIdentity,RefreshUserIdentityArg>(UserIdentityActions.REFRESH_IDENTITY,
    async ({accessToken}, {rejectWithValue}) => {

    if (!isValid(accessToken)) {
        return rejectWithValue({...new BasicHttpError({status: 401, title: "Помилка аутентифікації. Невалідний accessToken", detail: null})});
    }

    const response = await fetch(appConfig.serverMappings.getCurrentUser,{
        method: 'GET',
        headers: {
            ...createAuthHeader(accessToken)
        }
    })

    if (response.ok) {
        const responseIdentity = await response.json() as SuccessfulResponseType;
        const role = Role[responseIdentity.role]
        const identity: UserIdentity = {...responseIdentity, role: role.role, permissions: role.permissions}
        return identity;
    } else {
        const errResponse: ErrorResponse<any> = await BasicHttpError.parseResponse(response);
        throw new BasicHttpError(errResponse);
    }

})