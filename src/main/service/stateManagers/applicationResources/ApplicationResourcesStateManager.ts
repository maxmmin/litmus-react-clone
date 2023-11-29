import {AsyncThunkAction} from "@reduxjs/toolkit";
import Role from "../../../model/userIdentity/Role";
import {LitmusAsyncThunkConfig} from "../../../redux/store";
import ApplicationResources from "../../../redux/types/applicationResources/ApplicationResources";

export default interface ApplicationResourcesStateManager {
    retrieveRoles (thunk: AsyncThunkAction<Role[], unknown, LitmusAsyncThunkConfig>): Promise<Role[]>;
    getAppResources(): ApplicationResources;
    getRoles(): ApplicationResources['roles']
}