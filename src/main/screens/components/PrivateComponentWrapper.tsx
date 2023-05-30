import {ElementType, ReactNode} from "react";
import PrivateComponent, {ForbiddenOutputMode} from "./PrivateComponent";
import {Permissions} from "../../types/Role";

type Props = {
    children: ReactNode,
    neededPermissions: Permissions[],
    mode: ForbiddenOutputMode
}

function PrivateComponentWrapper ({children, neededPermissions,mode, ...props}: Props) {
    return <PrivateComponent mode={mode} component={children} requiredPermissions={neededPermissions} {...props}/>
}

export default PrivateComponentWrapper;