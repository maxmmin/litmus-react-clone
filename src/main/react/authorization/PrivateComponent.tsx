import React, {useMemo, ReactNode} from "react";
import {useAppSelector} from "../../redux/hooks";
import {Navigate} from 'react-router-dom'
import {Permission} from "../../model/userIdentity/Role";
import {checkAuthorization} from "../../util/pureFunctions";

type Props = {
    component: ReactNode,
    requiredPermissions: Permission[],
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

    const user = useAppSelector(state => state.userIdentity)

    const isAuthorized: boolean = useMemo(()=>{
            if (user) {
                return checkAuthorization(requiredPermissions, user.role.permissions)
            }
            return false;
    },[user, requiredPermissions]);

    if (!isAuthorized) {return <>{forbiddenOutputs[mode]()}</>}

    return (
        <>{component}</>
    )
}

export {forbiddenOutputs}

export default PrivateComponent