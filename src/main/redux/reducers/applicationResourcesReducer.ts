import ApplicationResources, {RoleMap} from "../types/applicationResources/ApplicationResources";
import {Reducer} from "react";
import {PayloadAction} from "@reduxjs/toolkit";
import {ApplicationResourcesAction} from "../actions/ApplicationResourcesAction";
import Role from "../../model/userIdentity/Role";

type ApplicationResourcesReducible = ApplicationResources|undefined;

export const initialApplicationResources: ApplicationResources = {
    roles: null
}

const applicationResourcesReducer: Reducer<ApplicationResourcesReducible, PayloadAction<unknown>> = (prevState=initialApplicationResources,
                                                                                                     action): ApplicationResources => {
    switch (action.type) {
        case (`${ApplicationResourcesAction.RETRIEVE_ROLES}/fulfilled`): {
            const roles: Role[] = <Role[]>action.payload;
            const roleMap: RoleMap = {};
            roles.forEach( role => {
                roleMap[role.name] = role;
            })
            return {...prevState, roles: roleMap}
        }
        default: return prevState;
    }
}

export default applicationResourcesReducer;