import {ReactNode} from "react";
import PrivateComponent, {ForbiddenOutputMode} from "./PrivateComponent";
import {Permissions} from "../../redux/userIdentity/Role";

type Props = {
    children: ReactNode,
    requiredPermissions: Permissions[],
    mode: ForbiddenOutputMode
}

function PrivateComponentWrapper ({children, requiredPermissions,mode, ...props}: Props) {
    return <PrivateComponent mode={mode} component={children} requiredPermissions={requiredPermissions} {...props}/>
}

export default PrivateComponentWrapper;