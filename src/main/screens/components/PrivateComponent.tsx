import React, {useMemo, ReactNode} from "react";
import {useAppDispatch, useAppSelector} from "../../redux/hooks";
import {Navigate} from 'react-router-dom'
import {Permissions} from "../../types/Role";
import Loader from "./Loader";
import {checkAndRefreshAuth, checkAuthorization, isValid} from "../../util/pureFunctions";

type Props = {
    component: ReactNode,
    requiredPermissions: Permissions[],
    mode: ForbiddenOutputMode
}

export type ForbiddenOutputMode = "NO_OUTPUT" | "ERROR_PAGE"

const forbiddenOutputs: Record<ForbiddenOutputMode, ()=>ReactNode> = {
    ERROR_PAGE: () => <h1>ERROR 403</h1>,
    NO_OUTPUT: () => null
}

const ERROR_PAGE: ForbiddenOutputMode = "ERROR_PAGE"
const NO_OUTPUT: ForbiddenOutputMode = "NO_OUTPUT"

export {ERROR_PAGE, NO_OUTPUT}

const PrivateComponent = ({component, mode, requiredPermissions}: Props) => {

    const authentication = useAppSelector(state => state.authentication)

    const user = useAppSelector(state => state.userIdentity)


    const isAuthorized: boolean = useMemo(()=>{
            if (user) {
                return checkAuthorization(requiredPermissions, user.permissions)
            }
            return false;
    },[user]);

    if (!authentication) return <Navigate to="/sign-in"/>

    if (!isAuthorized) {return <>{forbiddenOutputs[mode]()}</>}

    return (
        <>{component}</>
    )
}

export {forbiddenOutputs}

export default PrivateComponent