import ApplicationResources, {RoleMap} from "../types/applicationResources/ApplicationResources";
import {Reducer} from "react";
import {PayloadAction} from "@reduxjs/toolkit";
import {ApplicationResourcesAction} from "../actions/ApplicationResourcesAction";
import Role from "../../model/userIdentity/Role";
import CorsAnywhereProxyData from "../../service/api/nocorsproxy/CorsAnywhereProxyData";

type ApplicationResourcesReducible = ApplicationResources|undefined;

export const initialApplicationResources: ApplicationResources = {
    roles: null,
    corsAnywhereProxies: null
}

const applicationResourcesReducer: Reducer<ApplicationResourcesReducible, PayloadAction<unknown>> = (prevState=initialApplicationResources,
                                                                                                     action): ApplicationResources => {
    switch (action.type) {
        case (`${ApplicationResourcesAction.RETRIEVE_ROLES}/fulfilled`): {
            const roleMap: RoleMap = action.payload as RoleMap;
            return {...prevState, roles: roleMap}
        }

        case ((`${ApplicationResourcesAction.RETRIEVE_CORS_ANYWHERE_PROXIES}/fulfilled`)): {
            return {...prevState, corsAnywhereProxies: (action.payload as CorsAnywhereProxyData[])}
        }

        case ((`${ApplicationResourcesAction.RETRIEVE_CONTEXT}/fulfilled`)): {
            return action.payload as ApplicationResources
        }

        default: return prevState;
    }
}

export default applicationResourcesReducer;