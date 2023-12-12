import ApplicationResources, {RoleMap} from "../types/applicationResources/ApplicationResources";
import {Reducer} from "react";
import {PayloadAction} from "@reduxjs/toolkit";
import {ApplicationResourcesAction} from "../actions/ApplicationResourcesAction";
import Role from "../../model/userIdentity/Role";
import CorsAnywhereProxyData from "../../service/api/nocorsproxy/CorsAnywhereProxyData";

type ApplicationResourcesReducible = ApplicationResources|undefined;

export const initialApplicationResources: ApplicationResources = {
    roles: null,
    corsAnywhereProxiesData: null
}

const applicationResourcesReducer: Reducer<ApplicationResourcesReducible, PayloadAction<unknown>> = (prevState=initialApplicationResources,
                                                                                                     action): ApplicationResources => {
    switch (action.type) {
        case (`${ApplicationResourcesAction.RETRIEVE_ROLES}/fulfilled`): {
            const roles: Role[] = action.payload as Role[];
            const roleMap: RoleMap = {};
            roles.forEach( role => {
                roleMap[role.name] = role;
            })
            return {...prevState, roles: roleMap}
        }

        case ((`${ApplicationResourcesAction.RETRIEVE_CORS_ANYWHERE_PROXIES}/fulfilled`)): {
            return {...prevState, corsAnywhereProxiesData: (action.payload as CorsAnywhereProxyData[])}
        }

        default: return prevState;
    }
}

export default applicationResourcesReducer;