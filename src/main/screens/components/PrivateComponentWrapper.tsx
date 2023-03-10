import {ElementType, ReactNode} from "react";
import PrivateComponent, {ForbiddenOutputCallbackModesEnum} from "./PrivateComponent";
import {Permissions} from "../../types/Role";

type Props = {
    children: ReactNode,
    neededPermissions: Permissions[],
    mode: ForbiddenOutputCallbackModesEnum
}

function PrivateComponentWrapper ({children, neededPermissions,mode, ...props}: Props) {
    return <PrivateComponent mode={mode} Component={children} neededPermissions={neededPermissions} {...props}/>
}

export default PrivateComponentWrapper;