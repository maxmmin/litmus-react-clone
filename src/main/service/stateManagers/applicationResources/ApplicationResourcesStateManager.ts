import {AsyncThunkAction} from "@reduxjs/toolkit";
import Role from "../../../model/userIdentity/Role";
import {LitmusAsyncThunkConfig} from "../../../redux/store";
import ApplicationResources, {RoleMap} from "../../../redux/types/applicationResources/ApplicationResources";
import CorsAnywhereProxyData from "../../api/nocorsproxy/CorsAnywhereProxyData";

export default interface ApplicationResourcesStateManager {
    retrieveRoles (thunk: AsyncThunkAction<RoleMap, unknown, LitmusAsyncThunkConfig>): Promise<RoleMap>;
    retrieveCorsAnywhereProxiesData(thunk: AsyncThunkAction<CorsAnywhereProxyData[], unknown, LitmusAsyncThunkConfig>):
        Promise<CorsAnywhereProxyData[]>;
    retrieveAppResources (thunk: AsyncThunkAction<ApplicationResources, unknown, LitmusAsyncThunkConfig>): Promise<ApplicationResources>;
    getAppResources(): ApplicationResources;
    getRoles(): ApplicationResources['roles'];
    getCorsAnywhereProxiesData(): ApplicationResources['corsAnywhereProxies'];
}