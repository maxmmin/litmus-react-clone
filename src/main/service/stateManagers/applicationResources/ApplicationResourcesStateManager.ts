import {AsyncThunkAction} from "@reduxjs/toolkit";
import Role from "../../../model/userIdentity/Role";
import {LitmusAsyncThunkConfig} from "../../../redux/store";
import ApplicationResources from "../../../redux/types/applicationResources/ApplicationResources";
import CorsAnywhereProxyData from "../../api/nocorsproxy/CorsAnywhereProxyData";

export default interface ApplicationResourcesStateManager {
    retrieveRoles (thunk: AsyncThunkAction<Role[], unknown, LitmusAsyncThunkConfig>): Promise<Role[]>;
    retrieveCorsAnywhereProxiesData(thunk: AsyncThunkAction<CorsAnywhereProxyData[], unknown, LitmusAsyncThunkConfig>): Promise<CorsAnywhereProxyData[]>
    getAppResources(): ApplicationResources;
    getRoles(): ApplicationResources['roles']
    getCorsAnywhereProxiesData(): ApplicationResources['corsAnywhereProxiesData']
}