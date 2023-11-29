import {ReactNode} from "react";
import PrivateComponent, {ForbiddenOutputMode} from "./PrivateComponent";
import {Permission} from "../../model/userIdentity/Role";

type Props = {
    children: ReactNode,
    requiredPermissions: Permission[],
    mode: ForbiddenOutputMode
}

function PrivateComponentWrapper ({children, requiredPermissions,mode, ...props}: Props) {
    return <PrivateComponent mode={mode} component={children} requiredPermissions={requiredPermissions} {...props}/>
}

export default PrivateComponentWrapper;