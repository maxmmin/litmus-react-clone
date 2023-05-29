import React, {useMemo, ReactNode} from "react";
import {useAppDispatch, useAppSelector} from "../../redux/hooks";
import {Navigate} from 'react-router-dom'
import {Permissions} from "../../types/Role";
import Loader from "./Loader";
import {checkAndRefreshAuth, checkAuthorization, isValid} from "../../util/pureFunctions";

type Props = {
    Component: ReactNode,
    neededPermissions: Permissions[],
    mode: ForbiddenOutputCallbackModesEnum
}

const PrivateComponent = ({Component, mode, neededPermissions}: Props) => {

    const authentication = useAppSelector(state => state.authentication)

    const user = useAppSelector(state => state.userIdentity)


    const isAuthorized: boolean = useMemo(()=>{
            if (user) {
                return checkAuthorization(neededPermissions, user.permissions)
            }
            return false;
    },[user]);

    if (!authentication) return <Navigate to="/sign-in"/>

    if (!isAuthorized) {return <>{forbiddenOutputCallbackModes[mode]()}</>}

    return (
        <>{Component}</>
    )
}

export enum ForbiddenOutputCallbackModesEnum {
    NO_OUTPUT="NO_OUTPUT",
    ERROR_PAGE="ERROR_PAGE"
}

type ForbiddenOutputCallbackModesType = Record<ForbiddenOutputCallbackModesEnum, ()=>ReactNode>

const forbiddenOutputCallbackModes: ForbiddenOutputCallbackModesType = {
    ERROR_PAGE: () => <h1>ERROR 403</h1>,
    NO_OUTPUT: () => null
}

export {forbiddenOutputCallbackModes}

export default PrivateComponent